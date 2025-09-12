import { createSignal } from "solid-js";
import { Menu, X } from "lucide-solid";
import Link from "./Link";

export default function Drawer() {
  const [isOpen, setIsOpen] = createSignal(false);

  const toggleDrawer = () => setIsOpen(!isOpen());

  const closeDrawer = () => setIsOpen(false);

  return (
    <div class="sm:hidden">
      {/* Menu Button */}
      <button
        onClick={toggleDrawer}
        class="fixed bottom-4 right-4 z-50 p-2 bg-black/80 backdrop-blur-md border border-violet-600/30 rounded-lg text-white hover:bg-violet-600/20 transition-colors"
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
