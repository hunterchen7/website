import { createSignal } from "solid-js";

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

export function BirdIcon(props: { size?: number; showBird: () => boolean }) {
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
