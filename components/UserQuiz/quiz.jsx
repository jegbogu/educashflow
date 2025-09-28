"use client";

import { useEffect, useMemo, useState } from "react";
import CountdownTimer from "./countdownTimer";
import CheckAnswer from "./checkAnswer";
import UsernameModal from "./usernameModal";

export default function UsersQuiz(props) {
  // --- STATE ---
  const [answer, setAnswer] = useState(null);          // selected option index (0..3) or null
  const [quizLocked, setQuizLocked] = useState(false); // when true, options are disabled
  const [showRetry, setShowRetry] = useState(false);   // shows the Retry button when time is up
  const [timerKey, setTimerKey] = useState(0);         // bump to remount timer (restarts countdown)
  const [usernamemodal, setUsernameModal] = useState(false);

  // All questions (from parent/page)
  const allQuestions = props.allQuestions || [];

  // Filter once when allQuestions changes
  const landingPageQuestions = useMemo(
    () => allQuestions.filter((el) => el.category !== "Bible" && el.level === "Beginner"),
    [allQuestions]
  );

  // The question displayed
  const [questionToDisplay, setQuestionToDisplay] = useState(null);

  // Helper: choose a random question
  function pickRandomQuestion() {
    const len = landingPageQuestions.length;
    if (len === 0) return;
    const randomIndex = Math.floor(Math.random() * len);
    setQuestionToDisplay(landingPageQuestions[randomIndex]);
  }

  // On first load (or when the filtered list changes), pick a question
  useEffect(() => {
    if (landingPageQuestions.length > 0) {
      pickRandomQuestion();
    }
  }, [landingPageQuestions]);

  // Called when the countdown hits 0 → lock quiz & show retry
  function handleTimeUp() {
    setQuizLocked(true);
    setShowRetry(true);
  }

  // When user clicks an option:
  // - set selected answer
  // - immediately lock the quiz so they can't change answers while time is running
  function handleOptionClick(index) {
    if (quizLocked) return;   // ignore if already locked
    setAnswer(index);
    setQuizLocked(true);      // 🚫 lock immediately after first selection
  }

  // Retry flow:
  // - new question, unlock, clear answer, hide retry, restart timer
  function handleRetry() {
    pickRandomQuestion();
    setAnswer(null);
    setQuizLocked(false);
    setShowRetry(false);
    setTimerKey((k) => k + 1); // remount timer to reset countdown
  }

  // For quick styling on selected option
  function optionClasses(isSelected) {
    if (quizLocked) {
      // Disabled style (still highlight the selected one clearly)
      return `flex items-center space-x-2 border border-gray-500 rounded-md p-4 mt-3 cursor-not-allowed ${
        isSelected ? "bg-blue-50 border-blue-400 text-blue-700" : "opacity-50"
      }`;
    }
    // Interactive / hover style
    return `flex items-center space-x-2 border rounded-md p-4 mt-3 cursor-pointer hover:bg-gray-500 hover:text-white hover:font-bold ${
      isSelected ? "ring-2 ring-blue-400" : ""
    }`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3 items-center">
            <img src="stopwatch-svgrepo-com.svg" className="w-6 h-6" alt="timer" />
            <h2 className="text-xl font-semibold">Quick Quiz</h2>

            {/* Retry appears when time is up */}
            {showRetry && (
              <button
                type="button"
                className="ml-3 rounded-full bg-green-200 px-3 py-1 text-sm font-semibold text-green-800 hover:bg-green-300"
                onClick={handleRetry}
              >
                Retry
              </button>
            )}
          </div>

          <div>
            {/* Remounting the timer (key changes) restarts countdown */}
            <CountdownTimer key={timerKey} start={8} onComplete={handleTimeUp} />
          </div>
        </div>

        {/* Question + Options */}
        <div className="space-y-4">
          <div>
            <p className="text-lg">{questionToDisplay?.question}</p>

            <div>
              {questionToDisplay?.options.map((el, index) => {
                const isSelected = answer === index;
                return (
                  <div
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    className={optionClasses(isSelected)}
                  >
                    <p className="text-base">
                      {String.fromCharCode(65 + index)}. {el}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Show correctness only when an answer has been picked */}
          {answer !== null && (
            <CheckAnswer
              selectedAnswer={answer}
              correctAnswer={questionToDisplay?.correctAnswer}
            />
          )}

          {/* CTA to open username modal */}
          <div>
            <button
              type="button"
              className="rounded-md bg-blue-900 w-full px-5 py-2 text-md font-medium text-white hover:opacity-90"
              onClick={() => setUsernameModal(true)}
            >
              Access the real quiz and start winning real points and cash
            </button>
          </div>

          <div>
            <p
              className="cursor-pointer px-5 py-2 text-lg text-center text-gray-500 hover:text-red-900"
              onClick={props.onClose}
            >
              Maybe later
            </p>

            {/* Optional username modal */}
            {usernamemodal && (
              <UsernameModal onClose={() => setUsernameModal(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
