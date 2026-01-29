import Task from "./Task";

const NewTasks = () => {
  return (
    <div className="bg-white/85 shadow-xl rounded-lg h-[83vh] items-center justify-start text-center p-3 flex flex-col gap-2">
      <Task />
      <Task />
    </div>
  );
};

export default NewTasks;
