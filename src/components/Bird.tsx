import { createSignal, onMount, onCleanup } from "solid-js";

export default function Bird() {
  const [position, setPosition] = createSignal({ x: 100, y: 100 });
  const [velocity, setVelocity] = createSignal({ x: 2, y: 0 });
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  // SSR-safe: initialize with default, update from localStorage in onMount
  const [showBird, setShowBird] = createSignal(false);

  let animationId: number;
  let time = 0;

  const birdSize = 10;
  const flightSpeed = 2;
  const turnStrength = 0.05;
  const verticalVariation = 2;
  const mouseAvoidDistance = 400;
  const mouseAvoidStrength = 10;

  const animate = () => {
    if (typeof window === "undefined") return;
    time += 0.008;
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
    // Read showBird from localStorage on mount
    const stored = window.localStorage.getItem("showBird");
    if (stored !== null) setShowBird(stored === "true");
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

  // Update localStorage whenever showBird changes
  const toggleShowBird = () => {
    setShowBird((v) => {
      window.localStorage.setItem("showBird", (!v).toString());
      return !v;
    });
  };

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
    <>
      <button
        class="fixed hidden md:block top-3 right-4 z-10 text-violet-600 p-2 rounded-full shadow hover:text-violet-300 transition-colors flex items-center justify-center cursor-pointer"
        onClick={toggleShowBird}
        aria-label={showBird() ? "Hide bird" : "Show bird"}
      >
        {showBird() ? <BirdIcon /> : <CrossedBirdIcon />}
      </button>
      {showBird() && (
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
      )}
    </>
  );
}

const birdPaths = (
  <>
    <path
      d="M16 7h.01"
      stroke="currentColor"
      {...{
        "stroke-width": 2,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }}
    />
    <path
      d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"
      stroke="currentColor"
      {...{
        "stroke-width": 2,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }}
    />
    <path
      d="m20 7 2 .5-2 .5"
      stroke="currentColor"
      {...{
        "stroke-width": 2,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }}
    />
    <path
      d="M10 18v3"
      stroke="currentColor"
      {...{
        "stroke-width": 2,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }}
    />
    <path
      d="M14 17.75V21"
      stroke="currentColor"
      {...{
        "stroke-width": 2,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }}
    />
    <path
      d="M7 18a6 6 0 0 0 3.84-10.61"
      stroke="currentColor"
      {...{
        "stroke-width": 2,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }}
    />
  </>
);

function BirdIcon(props: { size?: number }) {
  const s = props.size ?? 24;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {birdPaths}
    </svg>
  );
}

function CrossedBirdIcon(props: { size?: number }) {
  const s = props.size ?? 24;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {birdPaths}
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        {...{ "stroke-width": 2, "stroke-linecap": "round" }}
      />
    </svg>
  );
}
