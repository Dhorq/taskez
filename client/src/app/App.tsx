import { Menu } from "lucide-react";

import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white bg-black px-6 py-4 flex items-center gap-3">
        <Menu className="size-7 hover:cursor-pointer text-white" />
        <h1 className="text-3xl font-bold text-white">Taskez</h1>
      </header>

      <main className="p-6 text-white">
        <Outlet />
      </main>
    </div>
  );
}
