import { createSignal, createEffect } from "solid-js";

interface AnimatedHamburgerProps {
  isOpen: boolean;
}

// animated transition between hamburger and X icon
export default function AnimatedHamburger(props: AnimatedHamburgerProps) {
  // track whether the top and bottom bars are currently swapped
  const [areBarsSwapped, setAreBarsSwapped] = createSignal(false);

  const [topTransform, setTopTransform] = createSignal("translateY(-5px)");
  const [bottomTransform, setBottomTransform] = createSignal("translateY(5px)");

  createEffect((prev) => {
    const current = props.isOpen;

    if (current && !prev) {
      // opening: randomly choose X rotation direction
      const random = Math.random() > 0.5;
      setTopTransform(random ? "rotate(45deg)" : "rotate(-45deg)");
      setBottomTransform(random ? "rotate(-45deg)" : "rotate(45deg)");
    } else if (!current && prev) {
      // closing: randomly decide whether to swap bar positions
      const shouldSwapNow = Math.random() > 0.5;

      if (shouldSwapNow) {
        setAreBarsSwapped((prev) => !prev);
      }

      // apply transforms based on current swapped state
      createEffect(() => {
        if (areBarsSwapped()) {
          setTopTransform("translateY(5px)");
          setBottomTransform("translateY(-5px)");
        } else {
          setTopTransform("translateY(-5px)");
          setBottomTransform("translateY(5px)");
        }
      });
    }

    return current;
  }, false);
  const barBase =
    "h-0.5 w-6 bg-white rounded-full transition-all duration-300 ease-in-out absolute";

  return (
    <div class="relative w-6 h-6 flex items-center justify-center">
      <div class={`${barBase}`} style={{ transform: topTransform() }} />
      <div class={`${barBase}`} style={{ opacity: props.isOpen ? 0 : 1 }} />
      <div class={`${barBase}`} style={{ transform: bottomTransform() }} />
    </div>
  );
}
