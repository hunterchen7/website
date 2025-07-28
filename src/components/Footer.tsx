import Link from "./Link";

export default function Footer() {
  return (
    <footer class="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-violet-600/30 py-4">
      <nav class="flex justify-center items-center gap-6 font-mono text-lg">
        <Link href="/">home</Link>
        <Link href="/about">about</Link>
        <Link href="https://github.com/hunterchen7" external>
          github
        </Link>
        <Link href="https://www.linkedin.com/in/hunterchen" external>
          linkedin
        </Link>
      </nav>
    </footer>
  );
}
