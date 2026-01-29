import { useState } from "react";

import { Menu } from "lucide-react";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Menu
        onClick={() => setOpen(true)}
        className="size-8 text-white rounded hover:cursor-pointer"
      />

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white z-50
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          onClick={() => setOpen(false)}
          className="p-4 font-bold hover:cursor-pointer"
        >
          ✕
        </button>

        <nav className="p-4 space-y-4">
          <a href="/" className="block">
            Home
          </a>
          <a href="/profile" className="block">
            Profile
          </a>
        </nav>
      </aside>
    </>
  );
}
