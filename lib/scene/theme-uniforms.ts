import { Color } from "three";

/**
 * The scene reads *computed* CSS custom properties rather than a "light"/"dark"
 * string. That way it stays correct for the `prefers-color-scheme` fallback
 * branch in globals.css, where no `data-theme` attribute is set at all.
 */

export interface ScenePalette {
  muted: Color;
  signal: Color;
  pulse: Color;
  vellum: Color;
  /** True when the page background is light, which changes blending mode. */
  isLight: boolean;
}

function readVar(styles: CSSStyleDeclaration, name: string, fallback: string): Color {
  const raw = styles.getPropertyValue(name).trim();
  const c = new Color();
  try {
    c.setStyle(raw || fallback);
  } catch {
    c.setStyle(fallback);
  }
  return c;
}

export function readPalette(): ScenePalette {
  const styles = getComputedStyle(document.documentElement);
  const ground = readVar(styles, "--void", "#0E1116");
  // Perceptual lightness of the page ground decides additive vs normal blending.
  const luma = 0.2126 * ground.r + 0.7152 * ground.g + 0.0722 * ground.b;

  return {
    muted: readVar(styles, "--muted", "#79859A"),
    signal: readVar(styles, "--signal", "#5A6CFF"),
    pulse: readVar(styles, "--pulse", "#00C2A8"),
    vellum: readVar(styles, "--vellum", "#DDE3EC"),
    isLight: luma > 0.5,
  };
}
