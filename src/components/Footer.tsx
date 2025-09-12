import Link from "./Link";

export default function Footer() {
  return (
    <footer class="hidden sm:block fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-violet-600/30 py-4">
      <nav class="flex md:justify-center items-center gap-6 font-mono text-lg overflow-x-auto whitespace-nowrap px-2 scrollbar-hide overflow-y-hidden select-none">
        <Link href="/">home</Link>
        <Link href="/about">about</Link>
        <Link href="/projects">projects</Link>
        <Link href="/gallery">gallery</Link>
        <Link href="/contact">contact</Link>
        <Link href="/resume.pdf" class="underline" external>
          resume
        </Link>
      </nav>
    </footer>
  );
}
