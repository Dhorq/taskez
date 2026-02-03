import { UserPen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/login");
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const button = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;

    const action = button.value;

    if (action === "login") handleLogin();
    else handleRegister();
  };
  return (
    <div className="bg-linear-to-r from-gray-500 to-gray-100 flex min-h-screen justify-center items-center w-full">
      <form
        onSubmit={handleRegisterSubmit}
        className="h-125 w-100 rounded-3xl flex flex-col justify-evenly items-center gap-3 p-5 bg-transparent shadow-2xl border-gray-300 border"
      >
        <UserPen className="bg-gray-100 size-12 rounded-lg p-2 shadow-md" />
        <h1 className="text-2xl font-bold text-center">
          Sign up for your account
        </h1>
        <p className="text-gray-500">Manage your task. For free.</p>
        <input
          type="email"
          placeholder="Email"
          className="bg-gray-100/80 rounded-xl w-75 h-8 p-2 shadow-sm focus:shadow-md text-xs text-gray-500 outline-none"
        />
        <input
          type="text"
          placeholder="Name"
          className="bg-gray-100/80 rounded-xl w-75 h-8 p-2 shadow-sm focus:shadow-md text-xs text-gray-500 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-gray-100/80 rounded-xl w-75 h-8 p-2 shadow-sm focus:shadow-md text-xs text-gray-500 outline-none"
        />
        <a
          href=""
          className="text-gray-700 relative left-25 text-xs hover:opacity-50 transition-all duration-200"
        >
          Forgot password?
        </a>
        <button
          name="action"
          value="register"
          type="submit"
          className="w-75 h-12 bg-black/80 hover:bg-black/25 rounded-xl text-white transition-all duration-200 hover:cursor-pointer hover:shadow-md"
        >
          Register
        </button>
        <button
          name="action"
          value="register"
          type="submit"
          className="w-75 h-12 rounded-xl border border-gray-500 text-white hover:cursor-pointer  hover:bg-gray-500"
        >
          Login
        </button>

        <p className="text-xs text-gray-500">Or sign up with</p>
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

export default Register;
