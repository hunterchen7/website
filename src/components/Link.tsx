import { JSX } from "solid-js";
import { A } from "@solidjs/router";

interface LinkProps {
  href: string;
  children: JSX.Element;
  external?: boolean;
  class?: string;
}
export default function Link(props: LinkProps) {
  const baseClasses =
    "hover:scale-105 transition-all text-violet-700 hover:text-violet-300";
  const classes = props.class ? `${baseClasses} ${props.class}` : baseClasses;

  if (props.external) {
    return (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        class={classes}
      >
        {props.children}
      </a>
    );
  }

  return (
    <A href={props.href} class={classes}>
      {props.children}
    </A>
  );
}
