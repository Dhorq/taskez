import CompletedTasks from "../components/CompletedTasks";
import Delivery from "../components/Delivery";
import NewTasks from "../components/NewTasks";
import ReviewTasks from "./../components/ReviewTasks";

const Home = () => {
  return (
    <div className="grid grid-cols-4 gap-10 max-h-screen">
      <NewTasks />
      <ReviewTasks />
      <Delivery />
      <CompletedTasks />
    </div>
  );
};

export default Home;
