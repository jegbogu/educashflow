"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import CountdownTimer from "../UserQuiz/countdownTimer";
import { quizConfig } from "@/config/quizConfig";
import { signOut } from "next-auth/react";
/**
 * Props:
 *  - createdID, subcategory, category, level, userID
 *  - questions: Array<{ _id?: string, question: string, options: string[], correctAnswer: number }>
 */
export default function Playingrealquiz({
  createdID,
  subcategory,
  category,
  level,
  userID,
  questions = [],
}) {
  const router = useRouter();

  // ---- quiz config (fallbacks) ----
  const perQSeconds = Number(quizConfig?.perQuestionTime ?? 15);
  const pointsPerQuestion = Number(quizConfig?.perQuestionPoint ?? 5);

  // ---- lifecycle gates / fullscreen ----
  const [started, setStarted] = useState(false);
  const [terminated, setTerminated] = useState(false);
  const [completed, setCompleted] = useState(false);

  // keep reactive flags available inside event listeners
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const terminatedRef = useRef(false);
  useEffect(() => {
    startedRef.current = started;
  }, [started]);
  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);
  useEffect(() => {
    terminatedRef.current = terminated;
  }, [terminated]);

  // ---- per-question state ----
  const [timerKey, setTimerKey] = useState(0);
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

  // stable shuffled order for this run
  const order = useMemo(() => {
    const arr = [...Array(questions.length).keys()];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [questions]);

  const currentQ = questions[order[index]];

  // store answers for review
  const answersRef = useRef([]);
  useEffect(() => {
    answersRef.current = [];
  }, [questions]);

  // -------------- Fullscreen + Focus Guard --------------
  useEffect(() => {
    if (!started) return;

    const onVisibility = () => {
      // Only terminate if user leaves BEFORE completion
      if (
        document.visibilityState !== "visible" &&
        !completedRef.current &&
        !terminatedRef.current
      ) {
        terminateQuiz();
      }
    };

    const onBlur = () => {
      if (!completedRef.current && !terminatedRef.current) {
        terminateQuiz();
      }
    };

    const onFsChange = () => {
      // Exiting fullscreen is only terminal when not completed
      if (
        !document.fullscreenElement &&
        !completedRef.current &&
        !terminatedRef.current
      ) {
        terminateQuiz();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFsChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFsChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  async function requestFullscreen() {
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
    } catch {}
  }

  function terminateQuiz() {
    if (terminatedRef.current || completedRef.current) return;
    setTerminated(true);
    // do NOT setCompleted(false); we haven't completed anyway
    answersRef.current = []; // wipe results
    // Try to exit fullscreen quietly
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    // Kick back to quizzes
    router.replace("/quizzes");
  }

  // -------------- Start --------------
  async function handleStart() {



//here is to capture the game ifo, as well as the fact that the user has clicked start
    //The variable startQuiz helps to capture that the user started the quiz, and when the user has completed the quiz there will be a variable that captures that the user has compl
    const startQuiz = `Start-${createdID}-${subcategory}-${category}-${level}-${userID}`
    //store info in the DB

    const data ={
      uniqueID: createdID,
      userID: userID,
      startQuiz:startQuiz
    }

     const response = await fetch(
      "/api/playingquiz",
      {
        body: JSON.stringify(data),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );







    await requestFullscreen();
    setStarted(true);
    setTimerKey((k) => k + 1);
  }
  //---------------- When user is done with the quiz, it log him out so that he can login again, this would help the user to have a new points
  async function userLogOut(){
  await signOut({ redirect: false });
    router.push("/login");
  }

  // -------------- Per question handlers --------------
  function onTimeUp() {
    setLocked(true);
    persistAnswer(null);
  }

  function pickOption(i) {
    if (locked) return;
    setSelectedIdx(i);
    setLocked(true);
    persistAnswer(i);
  }

  function persistAnswer(userAnswerIdx) {
    const q = currentQ;
    if (!q) return;
    const id = String(q?._id ?? `idx-${order[index]}`);
    // Avoid double insert on races
    if (answersRef.current.some((a) => a.id === id)) return;

    answersRef.current.push({
      id,
      question: q.question ?? "",
      options: q.options ?? [],
      correctAnswer: Number(q.correctAnswer ?? -1),
      userAnswer: userAnswerIdx,
    });
  }

  async function nextOrFinish() {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setSelectedIdx(null);
      setLocked(false);
      setTimerKey((k) => k + 1);
    } else {
      await finishQuiz();
    }
  }

  // -------------- Finish + Post --------------
  function computeScore(payload) {
    const correctCount = payload.reduce(
      (acc, a) => (a.userAnswer === a.correctAnswer ? acc + 1 : acc),
      0
    );
    return {
      correctCount,
      total: payload.length,
      score: correctCount * pointsPerQuestion,
    };
  }

  async function finishQuiz() {
    // mark completed FIRST so event listeners ignore the fullscreen exit
    setCompleted(true);

    // Exit fullscreen after completion (review must remain visible)
    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch {}
    }

    const payload = answersRef.current;
    const { correctCount, total } = computeScore(payload);

    try {
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userID || null,
          quizId: createdID,
          subcategory,
          category,
          level,
          totalQuestions: total,
          correctCount,

          answers: payload.map((a) => ({
            id: a.id,
            userAnswer: a.userAnswer,
            correctAnswer: a.correctAnswer,
          })),
          finishedAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("submit failed", err);
      // You could show a toast; we still show the local review.
    }
  }

  // -------------- UI --------------
  if (terminated) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">Quiz terminated</h2>
        <p className="text-gray-500 mt-2">You left the screen. Returning…</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-black/90 text-white">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Ready to start?</h1>
          <p className="max-w-md text-sm opacity-80">
            The quiz will use fullscreen and will end if you leave the page,
            switch tabs, or exit fullscreen early.
          </p>
          <button
            onClick={handleStart}
            className="px-6 py-3 rounded-md bg-white text-black font-semibold hover:opacity-90"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // review screen after completion — persists now
  if (completed) {
    const results = answersRef.current;
    const { correctCount, total, score } = computeScore(results);

    return (
      <div className="p-5 max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Quiz Summary</h2>
          <div className="text-sm text-gray-600 mt-1">
            <span className="mr-2">
              Category: <b>{category}</b>
            </span>
            <span className="mr-2">
              Subcategory: <b>{subcategory}</b>
            </span>
            <span>
              Level: <b>{level}</b>
            </span>
          </div>
        </div>

        <div className="mb-5 p-4 rounded-md bg-gray-50">
          <p className="text-lg font-semibold">
            Score: {score} ({correctCount}/{total} correct)
          </p>
        </div>

        <div className="space-y-4">
          {results.map((a, i) => {
            const correctIdx = a.correctAnswer;
            const userIdx = a.userAnswer;
            return (
              <div key={a.id} className="border rounded-md p-4">
                <p className="font-medium mb-2">
                  {i + 1}. {a.question}
                </p>
                <ul className="space-y-1">
                  {a.options.map((opt, j) => {
                    const isCorrect = j === correctIdx;
                    const isUser = j === userIdx;
                    const cls = isCorrect
                      ? "bg-green-50 border-green-400"
                      : isUser
                      ? "bg-red-50 border-red-400"
                      : "bg-white border-gray-200";
                    return (
                      <li key={j} className={`border rounded p-2 ${cls}`}>
                        <span className="mr-2 font-semibold">
                          {String.fromCharCode(65 + j)}.
                        </span>
                        {opt}
                        {isCorrect && (
                          <span className="ml-2 text-green-700 font-semibold">
                            Correct
                          </span>
                        )}
                        {isUser && !isCorrect && (
                          <span className="ml-2 text-red-700">Your choice</span>
                        )}
                        {isUser && isCorrect && (
                          <span className="ml-2 text-green-700">
                            Your choice ✓
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <button
            onClick={userLogOut}
            className="px-5 py-2 rounded-md bg-black text-white hover:opacity-90"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // live question UI
  if (!currentQ) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">Loading question…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] w-[100vw] bg-white p-4 mt-[170px] md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <p className="font-bold text-[1.25rem]">{subcategory}</p>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              {category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                level === "Beginner"
                  ? "bg-green-100 text-green-700"
                  : level === "Intermediate"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {level}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <img
              src="/stopwatch-svgrepo-com.svg"
              className="w-6 h-6"
              alt="timer"
            />
            <CountdownTimer
              key={timerKey}
              start={perQSeconds}
              onComplete={onTimeUp}
            />
          </div>
        </div>

        {/* question */}
        <div className="mt-6">
          <p className="text-lg font-medium">
            {index + 1}. {currentQ.question}
          </p>

          <div className="mt-4 space-y-3">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => pickOption(i)}
                disabled={locked}
                className={`w-full text-left border rounded-md p-3 transition ${
                  locked ? "cursor-not-allowed opacity-60" : "hover:bg-gray-50"
                } ${selectedIdx === i ? "border-black" : "border-gray-200"}`}
              >
                <span className="mr-2 font-semibold">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={nextOrFinish}
              className="px-5 py-2 rounded-md bg-black text-white hover:opacity-90"
            >
              {index < questions.length - 1
                ? locked
                  ? "Next"
                  : "Skip"
                : "Finish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
