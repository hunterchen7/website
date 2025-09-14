import { createSignal, onMount, onCleanup, For } from "solid-js";
import {
  separate,
  align,
  cohesion,
  avoidMouse,
  upwardBias,
  getRotation,
  getBoidStyle,
  createInitialBoids,
  Boid,
  MousePosition,
} from "../../utils/bird";
import { randomBoidCount } from "../../constants/bird";
import { BirdIcon } from "./Icon";

export default function Bird() {
  const [boids, setBoids] = createSignal<Boid[]>([]);
  const [mousePosition, setMousePosition] = createSignal<MousePosition>({
    x: 0,
    y: 0,
  });
  const [showBird, setShowBird] = createSignal(false);

  let animationId: number;

  // boid flock configuration
  const boidCount = randomBoidCount(); // 20-30 boids - random flock size
  // responsiveness >1 => snappier steering, <1 => smoother
  const responsiveness = 1.3;

  const animate = () => {
    if (typeof window === "undefined") return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    setBoids((currentBoids) =>
      currentBoids.map((boid) => {
        const neighbors = currentBoids.filter((other) => other.id !== boid.id);

        // Apply flocking rules
        const sep = separate(boid, neighbors);
        const ali = align(boid, neighbors);
        const coh = cohesion(boid, neighbors);
        const mouse = avoidMouse(boid, mousePosition());
        const upward = upwardBias();

        // Weight the forces (bird-like behavior)
        sep.x *= 2.5; // Strong separation - prevent birds from overlapping
        sep.y *= 2.5;
        ali.x *= 2; // Moderate alignment - birds fly in same direction
        ali.y *= 2;
        coh.x *= 1.0; // Moderate cohesion - stay together but not too tight
        coh.y *= 1.0;

        // Make overall steering more responsive (snappier) when desired
        sep.x *= responsiveness;
        sep.y *= responsiveness;
        ali.x *= responsiveness;
        ali.y *= responsiveness;
        coh.x *= responsiveness;
        coh.y *= responsiveness;

        // Apply forces
        let newVx = boid.vx + sep.x + ali.x + coh.x + mouse.x + upward.x;
        let newVy = boid.vy + sep.y + ali.y + coh.y + mouse.y + upward.y;

        // Limit speed
        const speed = Math.sqrt(newVx ** 2 + newVy ** 2);
        // maxSpeed is handled inside helper functions; keep a safety cap here if needed
        // Slightly higher safety cap for more energetic motion
        const MAX_SAFE_SPEED = 3.2;
        if (speed > MAX_SAFE_SPEED) {
          newVx = (newVx / speed) * MAX_SAFE_SPEED;
          newVy = (newVy / speed) * MAX_SAFE_SPEED;
        }

        // Update position
        let newX = boid.x + newVx;
        let newY = boid.y + newVy;

        // Wrap around edges smoothly
        if (newX > windowWidth + 50) newX = -50;
        if (newX < -50) newX = windowWidth + 50;
        if (newY > windowHeight + 50) newY = -50;
        if (newY < -50) newY = windowHeight + 50;

        return {
          ...boid,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      })
    );

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

    // Initialize boids in random locations across the screen
    const initialBoids = createInitialBoids(boidCount);
    setBoids(initialBoids);

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

  // getRotation and getBoidStyle are imported from utils; keep local aliases for JSX usage
  const localGetRotation = (boid: Boid) => getRotation(boid);
  const localGetBoidStyle = (boid: Boid) => getBoidStyle(boid);

  return (
    <>
      <button
        class="fixed hidden md:block top-3 right-4 z-50 text-violet-600 p-2 rounded-full shadow hover:text-violet-300 transition-colors flex items-center justify-center cursor-pointer"
        onClick={toggleShowBird}
        aria-label={showBird() ? "Hide birds" : "Show birds"}
      >
        <BirdIcon showBird={showBird} />
      </button>
      <div
        class="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300 ease-in-out"
        classList={{ "opacity-0": !showBird(), "opacity-100": showBird() }}
      >
        <For each={boids()}>
          {(boid) => (
            <div
              class="fixed pointer-events-none z-0"
              style={{
                left: `${boid.x}px`,
                top: `${boid.y}px`,
                transform: `rotate(${localGetRotation(boid)}deg) translateZ(0)`,
                "transform-origin": "center center",
              }}
            >
              <div
                class="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[24px] border-l-transparent border-r-transparent"
                style={localGetBoidStyle(boid)}
              />
            </div>
          )}
        </For>
      </div>
    </>
  );
}
