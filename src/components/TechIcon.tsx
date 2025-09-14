import type { Component } from "solid-js";

type Props = {
  src: string;
  label: string;
  size?: string; // tailwind width/height classes like 'w-5 h-5'
  alt?: string;
  class?: string;
};

const TechIcon: Component<Props> = (props) => {
  const sizeClass = props.size ?? "w-4 h-4 mt-1 md:mt-0.5 md:w-5 md:h-5 ml-0.5";
  return (
    <span class={`flex gap-1 ml-2 ${props.class ?? ""}`}>
      <span class="inline">{props.label}</span>
      <img src={props.src} alt={props.alt ?? props.label} class={sizeClass} />
    </span>
  );
};

export default TechIcon;
