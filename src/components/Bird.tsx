import { createSignal, onMount, onCleanup } from "solid-js";

export default function Bird() {
  const [position, setPosition] = createSignal({ x: 100, y: 100 });
  const [velocity, setVelocity] = createSignal({ x: 2, y: 0 });
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });

  let animationId: number;
  let time = 0;

  const birdSize = 10;
  const flightSpeed = 1.5;
  const turnStrength = 0.05;
  const verticalVariation = 2;
  const mouseAvoidDistance = 600;
  const mouseAvoidStrength = 10;

  const animate = () => {
    if (typeof window === "undefined") return;
    time += 0.016; // 60 fps
    const pos = position();
    const vel = velocity();

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const meanderAngle =
      Math.sin(time * 0.13) * Math.PI * 0.7 +
      Math.sin(time * 0.07) * Math.PI * 0.3;
    const meanderStrength = 1.2;

    const forwardX = Math.cos(meanderAngle) * meanderStrength;
    const forwardY = Math.sin(meanderAngle) * meanderStrength;

    const flightNoise = Math.sin(time * 0.7) * 0.5 + Math.sin(time * 1.3) * 0.3;
    const verticalNoise = Math.sin(time * 0.4) * verticalVariation;

    let targetVelX = flightSpeed * forwardX + flightNoise * 0.5;
    let targetVelY = flightSpeed * forwardY + verticalNoise;

    const margin = 100;

    if (pos.x < margin) {
      targetVelX += (margin - pos.x) * 0.01;
      targetVelY += Math.sin(time * 2) * 0.5;
    }

    if (pos.x > windowWidth - margin) {
      targetVelX -= (pos.x - (windowWidth - margin)) * 0.01;
      targetVelY += Math.sin(time * 2) * 0.5;
    }

    if (pos.y < margin) {
      targetVelY += (margin - pos.y) * 0.01;
    }

    if (pos.y > windowHeight - margin) {
      targetVelY -= (pos.y - (windowHeight - margin)) * 0.01;
    }

    const mouse = mousePosition();
    const distanceToMouse = Math.sqrt(
      Math.pow(pos.x - mouse.x, 2) + Math.pow(pos.y - mouse.y, 2)
    );

    let currentTurnStrength = turnStrength;
    if (distanceToMouse < mouseAvoidDistance && distanceToMouse > 0) {
      const avoidanceX = (pos.x - mouse.x) / distanceToMouse;
      const avoidanceY = (pos.y - mouse.y) / distanceToMouse;
      const rawIntensity =
        (mouseAvoidDistance - distanceToMouse) / mouseAvoidDistance;
      const avoidanceIntensity = Math.min(rawIntensity, 0.8);
      targetVelX += avoidanceX * mouseAvoidStrength * avoidanceIntensity;
      targetVelY += avoidanceY * mouseAvoidStrength * avoidanceIntensity;
      currentTurnStrength = Math.min(turnStrength * 3, 0.1);
    }

    const newVel = {
      x: vel.x + (targetVelX - vel.x) * currentTurnStrength,
      y: vel.y + (targetVelY - vel.y) * currentTurnStrength,
    };
    const newPos = {
      x: pos.x + newVel.x,
      y: pos.y + newVel.y,
    };

    if (newPos.x > windowWidth + birdSize) {
      newPos.x = -birdSize;
      newPos.y = Math.random() * windowHeight * 0.6 + windowHeight * 0.2;
    }

    if (newPos.x < -birdSize) {
      newPos.x = windowWidth + birdSize;
      newPos.y = Math.random() * windowHeight * 0.6 + windowHeight * 0.2;
    }

    if (newPos.y > windowHeight + birdSize) {
      newPos.y = -birdSize;
    }

    if (newPos.y < -birdSize) {
      newPos.y = windowHeight + birdSize;
    }

    setPosition(newPos);
    setVelocity(newVel);
    animationId = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  onMount(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("mousemove", handleMouseMove);
    setPosition({
      x: Math.random() * window.innerWidth,
      y: Math.random() * (window.innerHeight * 0.6) + window.innerHeight * 0.2,
    });
    setVelocity({
      x: flightSpeed,
      y: 0,
    });
    animate();
  });

  onCleanup(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (typeof window !== "undefined") {
      window.removeEventListener("mousemove", handleMouseMove);
    }
  });

  const rotation = () => {
    const vel = velocity();
    return Math.atan2(vel.y, vel.x) * (180 / Math.PI);
  };

  return (
    <div
      class="fixed pointer-events-none z-10 hidden md:block"
      style={{
        left: `${position().x}px`,
        top: `${position().y}px`,
        transform: `rotate(${rotation()}deg) translateZ(0)`,
        "transform-origin": "center center",
      }}
    >
      <div
        class="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[24px] border-l-transparent border-r-transparent border-b-violet-700"
        style={{
          transform: "translateX(-50%) translateY(-50%) rotate(90deg)",
        }}
      />
    </div>
  );
}
