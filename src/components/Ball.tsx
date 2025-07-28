import { createSignal, onMount, onCleanup } from "solid-js";

export default function Ball() {
  const [position, setPosition] = createSignal({ x: 100, y: 100 });
  const [velocity, setVelocity] = createSignal({ x: 100, y: 100 });

  let animationId: number;
  let ballRef: HTMLDivElement;

  const ballSize = 40;
  const gravity = 0;
  const friction = 0.98;
  const bounce = 1;

  const animate = () => {
    const pos = position();
    const vel = velocity();

    // Get window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Apply gravity
    const newVel = {
      x: vel.x * friction,
      y: vel.y + gravity,
    };

    // Calculate new position
    let newPos = {
      x: pos.x + newVel.x,
      y: pos.y + newVel.y,
    };

    // Bounce off walls
    if (newPos.x <= 0 || newPos.x >= windowWidth - ballSize) {
      newVel.x = -newVel.x * bounce;
      newPos.x = newPos.x <= 0 ? 0 : windowWidth - ballSize;
    }

    if (newPos.y <= 0 || newPos.y >= windowHeight - ballSize) {
      newVel.y = -newVel.y * bounce;
      newPos.y = newPos.y <= 0 ? 0 : windowHeight - ballSize;

      // Add some randomness when bouncing off the ground
      if (newPos.y >= windowHeight - ballSize) {
        newVel.x += (Math.random() - 0.5) * 2;
      }
    }

    setPosition(newPos);
    setVelocity(newVel);

    animationId = requestAnimationFrame(animate);
  };

  onMount(() => {
    // Start with random position and velocity
    setPosition({
      x: Math.random() * (window.innerWidth - ballSize),
      y: Math.random() * (window.innerHeight - ballSize),
    });
    setVelocity({
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8,
    });

    animate();
  });

  onCleanup(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });

  return (
    <div
      ref={ballRef!}
      class="fixed w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full shadow-lg pointer-events-none z-10 transition-transform duration-75"
      style={{
        left: `${position().x}px`,
        top: `${position().y}px`,
        transform: "translateZ(0)", // Enable hardware acceleration
      }}
    />
  );
}
