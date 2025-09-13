import { createSignal, onMount, onCleanup, For } from "solid-js";

interface Boid {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function Bird() {
  const [boids, setBoids] = createSignal<Boid[]>([]);
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  const [showBird, setShowBird] = createSignal(false);

  let animationId: number;

  // boid flock configuration
  const boidCount = Math.floor(Math.random() * 10) + 20; // 20-30 boids - random flock size
  const maxSpeed = 3; // how fast birds fly (pixels per frame)
  const maxForce = 0.05; // how quickly birds can turn (higher = more jittery)
  const separationRadius = 20; // personal space before avoiding each other
  const alignmentRadius = 100; // how far birds look to match direction
  const cohesionRadius = 150; // how far birds sense the flock center
  const mouseAvoidRadius = 200; // distance birds start fleeing from cursor
  const mouseAvoidForce = 0.2; // how strongly birds flee from cursor

  // Boids flocking rules
  const separate = (boid: Boid, neighbors: Boid[]) => {
    let steer = { x: 0, y: 0 };
    let count = 0;

    neighbors.forEach((other) => {
      const distance = Math.sqrt(
        (boid.x - other.x) ** 2 + (boid.y - other.y) ** 2
      );
      if (distance > 0 && distance < separationRadius) {
        const diff = {
          x: boid.x - other.x,
          y: boid.y - other.y,
        };
        const length = Math.sqrt(diff.x ** 2 + diff.y ** 2);
        if (length > 0) {
          diff.x /= length;
          diff.y /= length;
          diff.x /= distance; // Weight by distance
          diff.y /= distance;
          steer.x += diff.x;
          steer.y += diff.y;
          count++;
        }
      }
    });

    if (count > 0) {
      steer.x /= count;
      steer.y /= count;
      const length = Math.sqrt(steer.x ** 2 + steer.y ** 2);
      if (length > 0) {
        steer.x = (steer.x / length) * maxSpeed;
        steer.y = (steer.y / length) * maxSpeed;
        steer.x -= boid.vx;
        steer.y -= boid.vy;
        // Limit force
        const forceLength = Math.sqrt(steer.x ** 2 + steer.y ** 2);
        if (forceLength > maxForce) {
          steer.x = (steer.x / forceLength) * maxForce;
          steer.y = (steer.y / forceLength) * maxForce;
        }
      }
    }

    return steer;
  };

  const align = (boid: Boid, neighbors: Boid[]) => {
    let sum = { x: 0, y: 0 };
    let count = 0;

    neighbors.forEach((other) => {
      const distance = Math.sqrt(
        (boid.x - other.x) ** 2 + (boid.y - other.y) ** 2
      );
      if (distance > 0 && distance < alignmentRadius) {
        sum.x += other.vx;
        sum.y += other.vy;
        count++;
      }
    });

    if (count > 0) {
      sum.x /= count;
      sum.y /= count;
      const length = Math.sqrt(sum.x ** 2 + sum.y ** 2);
      if (length > 0) {
        sum.x = (sum.x / length) * maxSpeed;
        sum.y = (sum.y / length) * maxSpeed;
        sum.x -= boid.vx;
        sum.y -= boid.vy;
        // Limit force
        const forceLength = Math.sqrt(sum.x ** 2 + sum.y ** 2);
        if (forceLength > maxForce) {
          sum.x = (sum.x / forceLength) * maxForce;
          sum.y = (sum.y / forceLength) * maxForce;
        }
      }
    }

    return sum;
  };

  const cohesion = (boid: Boid, neighbors: Boid[]) => {
    let sum = { x: 0, y: 0 };
    let count = 0;

    neighbors.forEach((other) => {
      const distance = Math.sqrt(
        (boid.x - other.x) ** 2 + (boid.y - other.y) ** 2
      );
      if (distance > 0 && distance < cohesionRadius) {
        sum.x += other.x;
        sum.y += other.y;
        count++;
      }
    });

    if (count > 0) {
      sum.x /= count;
      sum.y /= count;
      const steer = {
        x: sum.x - boid.x,
        y: sum.y - boid.y,
      };
      const length = Math.sqrt(steer.x ** 2 + steer.y ** 2);
      if (length > 0) {
        steer.x = (steer.x / length) * maxSpeed;
        steer.y = (steer.y / length) * maxSpeed;
        steer.x -= boid.vx;
        steer.y -= boid.vy;
        // Limit force
        const forceLength = Math.sqrt(steer.x ** 2 + steer.y ** 2);
        if (forceLength > maxForce) {
          steer.x = (steer.x / forceLength) * maxForce;
          steer.y = (steer.y / forceLength) * maxForce;
        }
      }
      return steer;
    }

    return { x: 0, y: 0 };
  };

  const avoidMouse = (boid: Boid) => {
    const mouse = mousePosition();
    const distance = Math.sqrt(
      (boid.x - mouse.x) ** 2 + (boid.y - mouse.y) ** 2
    );

    if (distance > 0 && distance < mouseAvoidRadius) {
      const steer = {
        x: boid.x - mouse.x,
        y: boid.y - mouse.y,
      };
      const length = Math.sqrt(steer.x ** 2 + steer.y ** 2);
      if (length > 0) {
        steer.x = (steer.x / length) * maxSpeed;
        steer.y = (steer.y / length) * maxSpeed;
        steer.x -= boid.vx;
        steer.y -= boid.vy;
        // Stronger force for mouse avoidance
        const forceLength = Math.sqrt(steer.x ** 2 + steer.y ** 2);
        if (forceLength > mouseAvoidForce) {
          steer.x = (steer.x / forceLength) * mouseAvoidForce;
          steer.y = (steer.y / forceLength) * mouseAvoidForce;
        }
        // Increase force based on proximity
        const intensity = (mouseAvoidRadius - distance) / mouseAvoidRadius;
        steer.x *= intensity * 4; // Increased panic response
        steer.y *= intensity * 4;
      }
      return steer;
    }

    return { x: 0, y: 0 };
  };

  // Slight upward bias (birds prefer to fly higher)
  const upwardBias = () => {
    return { x: 0, y: -0.02 };
  };

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
        const mouse = avoidMouse(boid);
        const upward = upwardBias();

        // Weight the forces (bird-like behavior)
        sep.x *= 2.5; // Strong separation - prevent birds from overlapping
        sep.y *= 2.5;
        ali.x *= 1.8; // Moderate alignment - birds fly in same direction
        ali.y *= 1.8;
        coh.x *= 1.0; // Moderate cohesion - stay together but not too tight
        coh.y *= 1.0;

        // Apply forces
        let newVx = boid.vx + sep.x + ali.x + coh.x + mouse.x + upward.x;
        let newVy = boid.vy + sep.y + ali.y + coh.y + mouse.y + upward.y;

        // Limit speed
        const speed = Math.sqrt(newVx ** 2 + newVy ** 2);
        if (speed > maxSpeed) {
          newVx = (newVx / speed) * maxSpeed;
          newVy = (newVy / speed) * maxSpeed;
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
    const initialBoids: Boid[] = [];

    for (let i = 0; i < boidCount; i++) {
      initialBoids.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
    }
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

  const getRotation = (boid: Boid) => {
    return Math.atan2(boid.vy, boid.vx) * (180 / Math.PI);
  };

  const getBoidStyle = (boid: Boid) => {
    const violetShades = [
      [124, 58, 237], // violet-600
      [109, 40, 217], // violet-700
      [91, 33, 182], // violet-800
      [76, 29, 149], // violet-900
    ];

    const colorIndex = (boid.id * 3) % 4;
    const [r, g, b] = violetShades[colorIndex];
    const opacity = (60 + ((boid.id * 7) % 31)) / 100;

    return {
      "border-bottom-color": `rgba(${r}, ${g}, ${b}, ${opacity})`,
      transform: "translateX(-50%) translateY(-50%) rotate(90deg)",
    };
  };

  return (
    <>
      <button
        class="fixed hidden md:block top-3 right-4 z-0 text-violet-600 p-2 rounded-full shadow hover:text-violet-300 transition-colors flex items-center justify-center cursor-pointer"
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
                transform: `rotate(${getRotation(boid)}deg) translateZ(0)`,
                "transform-origin": "center center",
              }}
            >
              <div
                class="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[24px] border-l-transparent border-r-transparent"
                style={getBoidStyle(boid)}
              />
            </div>
          )}
        </For>
      </div>
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

function BirdIcon(props: { size?: number; showBird: () => boolean }) {
  const s = props.size ?? 24;
  const [mounted, setMounted] = createSignal(false);

  // Load crossed state from localStorage on mount - inverted from showBird
  if (typeof window !== "undefined") {
    // Trigger fade-in after 1 second
    setTimeout(() => setMounted(true), 1000);
  }

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{
        cursor: "pointer",
        opacity: mounted() ? "1" : "0",
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      {birdPaths}
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        style={{
          transform: "scale(0)",
          "transform-origin": "center",
          animation: !props.showBird()
            ? "growCross 0.3s ease-out forwards"
            : "shrinkCross 0.3s ease-out forwards",
        }}
      />
      <style>{`
        @keyframes growCross {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        @keyframes shrinkCross {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(0);
          }
        }
      `}</style>
    </svg>
  );
}
