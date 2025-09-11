export default function CheckAnswer({ selectedAnswer, correctAnswer }) {
  if (selectedAnswer === null || selectedAnswer === undefined) return null;

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div
      className={`mt-4 p-3 rounded-md text-center font-semibold ${
        isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isCorrect ? "✅ Correct! 4 Points" : "❌ Wrong 0 Point!"}
    </div>
  );
}
