import { UsersIcon } from "../icons/navBarIcon";
import CreateQuizModal from "./creqteNewQuiz";
import { useState } from "react";

export default function QuickActions() {
  const [modalQuiz, setModalQuiz] = useState(false);

  return (
    <div className="mt-5 rounded-md">
      <h3 className="font-bold ml-[65px] mb-5 text-lg">Quick Actions</h3>

      {/* Conditionally show modal */}
      {modalQuiz && <CreateQuizModal onClose={() => setModalQuiz(false)} />}

      <div>
        <div className="flex justify-center gap-5">
          <div
            className="border rounded-md p-5 border-gray-200 shadow-md cursor-pointer hover:bg-gray-300"
            onClick={() => setModalQuiz(true)}
          >
            <span>
              <img
                src="book-album-svgrepo-com.svg"
                className="w-6 h-6"
              />
            </span>
            <p className="font-bold pt-5">Create Quiz</p>
            <p className="font-light">Build a new Quiz</p>
          </div>

          <div className="border rounded-md p-5 border-gray-200 shadow-md">
            <span>
              <UsersIcon className="w-6 h-6" />
            </span>
            <p className="font-bold pt-5">Manage Users</p>
            <p className="font-light">View all users</p>
          </div>
        </div>

        <div className="flex justify-center gap-5 mt-5 border-gray-200 shadow-md">
          <div className="border rounded-md p-5">
            <span>
              <img
                src="line-chart-up-02-svgrepo-com.svg"
                className="w-6 h-6"
              />
            </span>
            <p className="font-bold pt-5">Payment Analytics</p>
            <p className="font-light">Check performance </p>
          </div>
          <div className="border rounded-md p-5 border-gray-200 shadow-md">
            <span>
              <img
                src="line-chart-up-svgrepo-com.svg"
                className="w-6 h-6"
              />
            </span>
            <p className="font-bold pt-5">Activity Log</p>
            <p className="font-light">Recent activities</p>
          </div>
        </div>
      </div>
    </div>
  );
}
