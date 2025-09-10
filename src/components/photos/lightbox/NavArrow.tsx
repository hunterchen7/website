import { ArrowLeft, ArrowRight } from "lucide-solid";

export const NavArrow = (props: {
  side: "left" | "right";
  visible: boolean;
  onClick?: (e: MouseEvent) => void;
}) => {
  const posClass = props.side === "left" ? "left-4" : "right-4";
  return (
    <button
      type="button"
      aria-label={props.side === "left" ? "previous" : "next"}
      class={`fixed ${posClass} top-1/2 -translate-y-1/2 z-[60] transition-opacity duration-150 ease-in-out hidden sm:flex items-center justify-center cursor-pointer ${
        props.visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick?.(e as unknown as MouseEvent);
      }}
    >
      {props.side === "left" ? (
        <ArrowLeft class="h-6 w-6 text-white" />
      ) : (
        <ArrowRight class="h-6 w-6 text-white" />
      )}
    </button>
  );
};
