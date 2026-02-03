import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const button = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;

    const action = button.value;

    if (action === "login") handleLogin();
    else handleRegister();
  };

  return (
    <div className="bg-linear-to-r from-gray-100 to-gray-500 flex min-h-screen justify-center items-center w-full transition-all duration-400">
      <form
        onSubmit={handleLoginSubmit}
        className="h-125 w-100 rounded-3xl flex flex-col justify-evenly items-center gap-3 p-5 bg-transparent shadow-2xl border-gray-300 transition-all duration-200"
      >
        <LogIn className="bg-white/50 size-12 rounded-lg p-2 shadow-md" />
        <h1 className="text-2xl font-bold text-center">Sign in with email</h1>
        <p className="text-gray-500">Manage your task. For free.</p>
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-gray-100/80 rounded-xl w-75 h-8 p-2 shadow-sm focus:shadow-md text-xs text-gray-500 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-gray-100/80 rounded-xl w-75 h-8 p-2 shadow-sm focus:shadow-md text-xs text-gray-500 outline-none"
        />
        <a
          href=""
          className="text-gray-700 relative left-25 text-xs hover:opacity-50"
        >
          Forgot password?
        </a>
        <button
          name="action"
          value="login"
          type="submit"
          className="w-75 h-12 bg-black/80 rounded-xl text-white hover:cursor-pointer hover:shadow-md hover:bg-black/25"
        >
          Login
        </button>
        <button
          name="action"
          value="register"
          type="submit"
          className="w-75 h-12 rounded-xl text-white hover:cursor-pointer hover:shadow-md hover:bg-gray-500 border border-gray-500"
        >
          Register
        </button>
        <p className="text-xs text-gray-500">Or sign in with</p>
        <div className="flex gap-5 justify-between">
          <div className="flex justify-center items-center text-center p-2 h-8 w-22 rounded-xl bg-white shadow-sm">
            A
          </div>
          <div className="flex justify-center items-center text-center p-2 h-8 w-22 rounded-xl bg-white shadow-sm">
            A
          </div>
          <div className="flex justify-center items-center text-center p-2 h-8 w-22 rounded-xl bg-white shadow-sm">
            A
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
