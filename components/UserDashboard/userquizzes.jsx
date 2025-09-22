import { Brain } from "lucide-react";
import Playingquiz from "./playingquiz";
import { ProgressBar } from "./progressBar";

export default function UserQuizzes(props) {
  return (
    <div className="max-w-7xl mx-auto border-gray-300 border rounded-md mt-5 p-5">
      <div className="flex gap-4">
        <Brain />
        <p>Available Quizzes</p>
      </div>

      <div className=" rounded-md mt-5 p-5 bg-green-50">
        <div className="flex justify-between">
          <div className="flex gap-5">
            <span>
              <img src="line-chart-up-02-svgrepo-com.svg" className="w-6 h-6" />
            </span>
            <p>Daily Progress</p>
          </div>

          <p className="text-gray-500">3/5 Completed</p>
        </div>

        <div className="mt-5">
          <ProgressBar progress={70} />
        </div>
      </div>
      <div>
        <Playingquiz quiz={props.quiz} />
      </div>
    </div>
  );
}
