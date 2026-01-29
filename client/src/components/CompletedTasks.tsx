import Task from "./Task";

const CompletedTasks = () => {
  return (
    <div className="bg-white/85 shadow-xl h-[83vh] rounded-lg justify-start text-center p-3 flex flex-col gap-2">
      <div className="flex justify-between w-full px-2 font-bold text-black">
        <p className="underline">New Tasks</p>
        <p>+</p>
      </div>
      <Task />
    </div>
  );
};

export default CompletedTasks;
