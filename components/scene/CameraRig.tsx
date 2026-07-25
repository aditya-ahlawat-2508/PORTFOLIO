"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Vector3 } from "three";
import { sampleCamera } from "@/lib/scene/camera-path";
import { frame } from "@/lib/scene/scroll-store";

const targetPos = new Vector3();
const targetLook = new Vector3();

export function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree();
  const smoothedLook = useRef(new Vector3(0, 0, 0));
  const pointer = useRef({ x: 0, y: 0 });
  const settled = useRef(false);

  /* A touch of pointer parallax is the cheapest way to keep the scene alive
     while the user is reading rather than scrolling. Off for touch + reduced. */
  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  useFrame((_, delta) => {
    const fov = sampleCamera(frame.s, targetPos, targetLook);

    // Frame-rate independent critical damping. Snap on the very first frame so
    // a deep-linked load doesn't visibly fly in from station 0.
    const k = settled.current ? 1 - Math.exp(-6 * delta) : 1;
    settled.current = true;

    if (reducedMotion) {
      camera.position.copy(targetPos);
      smoothedLook.current.copy(targetLook);
    } else {
      camera.position.lerp(targetPos, k);
      smoothedLook.current.lerp(targetLook, k);
      camera.position.x += pointer.current.x * 0.9;
      camera.position.y += -pointer.current.y * 0.6;
    }

    camera.lookAt(smoothedLook.current);

    if (camera instanceof PerspectiveCamera && Math.abs(camera.fov - fov) > 0.01) {
      camera.fov += (fov - camera.fov) * k;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
