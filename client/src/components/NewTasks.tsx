import Task from "./Task";

const NewTasks = () => {
  return (
    <div className="bg-white/85 shadow-xl rounded-lg h-[83vh] items-center justify-start p-3 flex flex-col gap-2  overflow-y-auto scrollbar-hidden">
      <div className="flex justify-between w-full px-2 font-bold text-black">
        <p className="underline">New Tasks</p>
        <p>+</p>
      </div>
      <Task />
      <Task />
      <Task />
      <Task />
    </div>
  );
};

export default NewTasks;
