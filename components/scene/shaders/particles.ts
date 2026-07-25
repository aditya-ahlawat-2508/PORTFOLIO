/**
 * Particle morph shaders (GLSL3 / WebGL2).
 *
 * Note on attributes: `position` does NOT hold a position here. Every particle's
 * real position is fetched from the formation texture atlas by `gl_VertexID`, so
 * `position` is reused to carry the three per-particle uniform randoms — Points
 * requires a `position` attribute for its draw count, and this avoids allocating
 * a second buffer of the same size to hold the same kind of data.
 */

export const particlesVertexShader = /* glsl */ `
precision highp float;
precision highp sampler2DArray;

uniform sampler2DArray uFormations;
uniform int   uTexW;
uniform int   uSlotA;
uniform int   uSlotB;
uniform float uBlend;       // 0 = pure A, 1 = pure B
uniform float uTime;
uniform float uPulse;       // 0..1 looping position of the travelling signal
uniform float uPulseActive; // 1 only for pipeline formations
uniform float uMotion;      // 0 under prefers-reduced-motion, else 1
uniform float uArc;
uniform float uPointScale;

// three declares the position attribute for us. It carries the three
// per-particle randoms here, not an actual position -- see the note above.
in float aStagger;   // 0..1, per-particle morph delay

out float vAux;
out float vHeat;
out float vPulse;

const float TAU = 6.2831853;

vec4 fetchSlot(int slot) {
  int i = gl_VertexID;
  ivec3 uv = ivec3(i % uTexW, i / uTexW, slot);
  return texelFetch(uFormations, uv, 0);
}

void main() {
  vec4 A = fetchSlot(uSlotA);
  vec4 B = fetchSlot(uSlotB);

  // Staggered per-particle easing. Without this the whole field moves as one
  // slab and the morph reads as a slide rather than a swarm reforming.
  float w    = 0.35;
  float lo   = aStagger * (1.0 - w);
  float t    = smoothstep(lo, lo + w, uBlend);
  float ease = t * t * (3.0 - 2.0 * t);

  vec3 pos = mix(A.xyz, B.xyz, ease);
  vAux = mix(A.w, B.w, ease);

  // Bow the travel path so particles fly rather than slide in straight lines.
  vec3 delta = B.xyz - A.xyz;
  float dist = length(delta);
  float transit = sin(ease * 3.14159265);
  if (dist > 0.0001) {
    vec3 axis = normalize(cross(delta / dist, vec3(0.0, 1.0, 0.0)) + vec3(0.0001));
    pos += axis * transit * uArc * (position.x - 0.5) * dist * 0.35 * uMotion;
  }

  // Ambient breathing so the field is never completely inert.
  pos += 0.07 * uMotion * vec3(
    sin(uTime * 0.30 + position.x * TAU),
    sin(uTime * 0.37 + position.y * TAU),
    sin(uTime * 0.23 + position.z * TAU)
  );

  vHeat = transit;

  // Travelling pulse: a soft window sliding along the aux/pathT channel, with
  // wraparound so it loops seamlessly.
  float d = abs(vAux - uPulse);
  d = min(d, 1.0 - d);
  vPulse = uPulseActive * smoothstep(0.09, 0.0, d);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uPointScale * (1.0 + vPulse * 2.4) / max(-mv.z, 0.001);
}
`;

export const particlesFragmentShader = /* glsl */ `
precision highp float;

uniform vec3  uColRest;
uniform vec3  uColTransit;
uniform vec3  uColPulse;
uniform float uOpacity;
uniform float uSoftness;
uniform float uTint;

in float vAux;
in float vHeat;
in float vPulse;

out vec4 fragColor;

void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r2 = dot(d, d);
  if (r2 > 0.25) discard;

  float alpha = smoothstep(0.25, uSoftness, r2);

  // Base colour runs signal -> pulse along the aux channel, which for the site
  // graph is traversal order and for the pipeline is position along the chain.
  // That gives the field colour that means something instead of a flat tint.
  vec3 base = mix(uColTransit, uColPulse, clamp(vAux, 0.0, 1.0));
  vec3 c = mix(uColRest, base, uTint);

  // Particles in flight brighten toward the signal colour; the pulse crest wins.
  c = mix(c, uColTransit, vHeat * 0.5);
  c = mix(c, uColPulse, vPulse);

  fragColor = vec4(c, alpha * uOpacity * (0.4 + 0.6 * vHeat + vPulse));
}
`;
