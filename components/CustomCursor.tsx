"use client";

import { useEffect, useRef } from "react";

const MathUtils = {
  lerp: (a: number, b: number, n: number) => (1 - n) * a + n * b,
};

const NUM_POINTS = 20; // Number of segments for the snake/trail

export default function CustomCursor() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    // Initialize trail points
    const points = Array.from({ length: NUM_POINTS }, () => ({ x: mouse.x, y: mouse.y }));

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);

    let animationFrameId: number;

    const render = () => {
      // The head follows the mouse closely (Instant follow)
      points[0].x = MathUtils.lerp(points[0].x, mouse.x, 0.85);
      points[0].y = MathUtils.lerp(points[0].y, mouse.y, 0.85);

      // The rest of the points follow the point ahead of them
      for (let i = 1; i < NUM_POINTS; i++) {
        points[i].x = MathUtils.lerp(points[i].x, points[i - 1].x, 0.65);
        points[i].y = MathUtils.lerp(points[i].y, points[i - 1].y, 0.65);
      }

      // Construct a smooth SVG path
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < NUM_POINTS - 1; i++) {
        const x_mid = (points[i].x + points[i + 1].x) / 2;
        const y_mid = (points[i].y + points[i + 1].y) / 2;
        d += ` Q ${points[i].x} ${points[i].y} ${x_mid} ${y_mid}`;
      }
      d += ` L ${points[NUM_POINTS - 1].x} ${points[NUM_POINTS - 1].y}`;
      
      path.setAttribute("d", d);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 999999999,
        mixBlendMode: "difference", // Inverts color automatically
      }}
    >
      <path
        ref={pathRef}
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
