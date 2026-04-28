import { useEffect, useRef } from "react";

export function useStarField(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // 星の初期化
    const STAR_COUNT = 200;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random() * window.innerWidth,
      pz: 0,
    }));

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (const star of stars) {
        star.pz = star.z;
        star.z -= 4;
        if (star.z <= 0) {
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
          star.z = canvas.width;
          star.pz = star.z;
        }

        const sx = (star.x - cx) * (canvas.width / star.z) + cx;
        const sy = (star.y - cy) * (canvas.width / star.z) + cy;
        const px = (star.x - cx) * (canvas.width / star.pz) + cx;
        const py = (star.y - cy) * (canvas.width / star.pz) + cy;

        const size = Math.max(0.5, (1 - star.z / canvas.width) * 2.5);
        const brightness = Math.floor((1 - star.z / canvas.width) * 255);

        ctx.strokeStyle = `rgb(${brightness},${brightness},${brightness})`;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
}