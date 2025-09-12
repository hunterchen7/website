import { createSignal, onCleanup, onMount } from "solid-js";
import { Menu, X } from "lucide-solid";
import Link from "./Link";

export default function Drawer() {
  const [isOpen, setIsOpen] = createSignal(false);
  const [position, setPosition] = createSignal({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = createSignal(false);
  let dragStart = { x: 0, y: 0 };
  let velocity = { x: 0, y: 0 };
  let lastMove = { x: 0, y: 0, time: 0 };
  let animationFrameId: number;

  onMount(() => {
    // Initialize position at bottom-right
    setPosition({ x: window.innerWidth - 68, y: window.innerHeight - 68 });
  });

  const toggleDrawer = () => {
    if (!isDragging()) {
      setIsOpen(!isOpen());
    }
  };

  const closeDrawer = () => setIsOpen(false);

  const handleStart = (clientX: number, clientY: number) => {
    cancelAnimationFrame(animationFrameId);
    setIsDragging(false);
    dragStart = { x: clientX - position().x, y: clientY - position().y };
    velocity = { x: 0, y: 0 };
    lastMove = { x: clientX, y: clientY, time: Date.now() };

    const handleMove = (moveClientX: number, moveClientY: number) => {
      const now = Date.now();
      const deltaTime = now - lastMove.time;

      if (deltaTime > 0) {
        velocity = {
          x: (moveClientX - lastMove.x) / deltaTime,
          y: (moveClientY - lastMove.y) / deltaTime,
        };
      }
      lastMove = { x: moveClientX, y: moveClientY, time: now };

      const deltaX = Math.abs(moveClientX - (dragStart.x + position().x));
      const deltaY = Math.abs(moveClientY - (dragStart.y + position().y));

      if (deltaX > 5 || deltaY > 5) {
        setIsDragging(true);
      }

      if (isDragging()) {
        const newX = moveClientX - dragStart.x;
        const newY = moveClientY - dragStart.y;

        setPosition({ x: newX, y: newY });
      }
    };

    const handleEnd = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);

      setTimeout(() => setIsDragging(false), 0);

      if (isDragging()) {
        animateThrow();
      }
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  };

  const animateThrow = () => {
    const friction = 0.95;
    const minVelocity = 0.1;
    const padding = 16;
    const buttonSize = 50;

    const step = () => {
      let currentPos = position();
      let newPos = {
        x: currentPos.x + velocity.x * 16, // 16ms per frame
        y: currentPos.y + velocity.y * 16,
      };

      // Edge collision detection
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      if (newPos.x <= padding) {
        newPos.x = padding;
        velocity.x = 0;
      } else if (newPos.x >= screenWidth - buttonSize - padding) {
        newPos.x = screenWidth - buttonSize - padding;
        velocity.x = 0;
      }

      if (newPos.y <= padding) {
        newPos.y = padding;
        velocity.y = 0;
      } else if (newPos.y >= screenHeight - buttonSize - padding) {
        newPos.y = screenHeight - buttonSize - padding;
        velocity.y = 0;
      }

      velocity.x *= friction;
      velocity.y *= friction;

      setPosition(newPos);

      if (Math.abs(velocity.x) > minVelocity || Math.abs(velocity.y) > minVelocity) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        // Snap to edge
        const finalPos = position();
        const targetX = finalPos.x + buttonSize / 2 < screenWidth / 2
            ? padding
            : screenWidth - buttonSize - padding;

        // Clamp Y position
        const targetY = Math.max(
          padding,
          Math.min(finalPos.y, window.innerHeight - buttonSize - padding)
        );

        // Simple spring animation to snap
        animateSnap(targetX, targetY);
      }
    };
    animationFrameId = requestAnimationFrame(step);
  };

  const animateSnap = (targetX: number, targetY: number) => {
    const stiffness = 0.05; // Reduced for less aggression
    const damping = 0.75;   // Increased for smoother stop
    let snapVelocity = { x: 0, y: 0 };

    const step = () => {
      const currentPos = position();
      const dx = targetX - currentPos.x;
      const dy = targetY - currentPos.y;

      const ax = dx * stiffness;
      const ay = dy * stiffness;

      snapVelocity.x += ax;
      snapVelocity.y += ay;
      snapVelocity.x *= damping;
      snapVelocity.y *= damping;

      const newPos = {
        x: currentPos.x + snapVelocity.x,
        y: currentPos.y + snapVelocity.y,
      };

      setPosition(newPos);

      if (Math.abs(snapVelocity.x) > 0.1 || Math.abs(snapVelocity.y) > 0.1 || Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setPosition({ x: targetX, y: targetY });
      }
    };
    animationFrameId = requestAnimationFrame(step);
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: TouchEvent) => {
    // e.preventDefault(); // This can prevent click events on touch
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  onCleanup(() => {
    cancelAnimationFrame(animationFrameId);
  });  return (
    <div class="sm:hidden">
      {/* Menu Button */}
      <button
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={toggleDrawer}
        class="fixed z-50 p-2 bg-black/80 backdrop-blur-md border border-violet-600/30 rounded-lg text-white hover:bg-violet-600/20 transition-colors cursor-move select-none touch-none"
        style={{
          left: `${position().x}px`,
          top: `${position().y}px`,
          transform: isDragging() ? 'scale(1.1)' : 'scale(1)',
          transition: isDragging() ? 'none' : 'transform 0.2s ease',
          "touch-action": "none"
        }}
        aria-label="Toggle menu"
      >
        {isOpen() ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      {isOpen() && (
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        class={`fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-violet-600/30 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen() ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <nav class="flex flex-wrap justify-center items-center gap-6 font-mono text-lg py-6 px-6">
          <div onClick={closeDrawer}>
            <Link href="/">home</Link>
          </div>
          <div onClick={closeDrawer}>
            <Link href="/about">about</Link>
          </div>
          <div onClick={closeDrawer}>
            <Link href="/projects">projects</Link>
          </div>
          <div onClick={closeDrawer}>
            <Link href="/gallery">gallery</Link>
          </div>
          <div onClick={closeDrawer}>
            <Link href="/contact">contact</Link>
          </div>
          <div onClick={closeDrawer}>
            <Link href="/resume.pdf" class="underline" external>
              resume
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
