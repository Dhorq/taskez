import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, User } from "lucide-react";

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-white/20 bg-black px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Taskez</h1>

        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <User className="size-4" />
              <span>{user.name ?? user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="p-6 text-white">
        <Outlet />
      </main>
    </div>
  );
}
