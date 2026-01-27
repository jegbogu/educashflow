import connectDB from "@/utils/connectmongo";
import Quiz from "@/model/quizCreation";

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  try {
    // =========================
    // CREATE QUESTION
    // =========================
    if (method === "POST") {
      const { question, options, correctAnswer, ...rest } = req.body;

      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          message: "Options must be an array with at least 2 items",
        });
      }

      if (
        typeof correctAnswer !== "number" ||
        correctAnswer < 0 ||
        correctAnswer >= options.length
      ) {
        return res.status(400).json({
          message: "correctAnswer must be a valid option index",
        });
      }

      const quiz = await Quiz.create({
        question: question.trim(),
        options: options.map(o => o.trim()),
        correctAnswer,
        ...rest,
      });

      return res.status(201).json(quiz);
    }

    // =========================
    // UPDATE QUESTION
    // =========================
    if (method === "PUT") {
      const { _id, options, correctAnswer, ...rest } = req.body;

      if (!_id) {
        return res.status(400).json({ message: "_id is required" });
      }

      let normalizedOptions = options;

      // Handle object → array corruption from frontend
      if (!Array.isArray(options) && typeof options === "object") {
        normalizedOptions = Object.values(options).filter(
          v => typeof v === "string"
        );
      }

      if (!Array.isArray(normalizedOptions) || normalizedOptions.length < 2) {
        return res.status(400).json({
          message: "Options must be an array with at least 2 items",
        });
      }

      let normalizedCorrectAnswer = correctAnswer;

      // Handle "a" | "b" | "c" | "d"
      if (typeof correctAnswer === "string") {
        normalizedCorrectAnswer = ["a", "b", "c", "d"].indexOf(correctAnswer);
      }

      if (
        typeof normalizedCorrectAnswer !== "number" ||
        normalizedCorrectAnswer < 0 ||
        normalizedCorrectAnswer >= normalizedOptions.length
      ) {
        return res.status(400).json({
          message: "correctAnswer must be a valid option index",
        });
      }

      const updated = await Quiz.findOneAndUpdate(
        { _id },
        {
          ...rest,
          options: normalizedOptions.map(o => o.trim()),
          correctAnswer: normalizedCorrectAnswer,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updated) {
        return res.status(404).json({ message: "Question not found" });
      }

      return res.status(200).json(updated);
    }

    // =========================
    // GET ALL QUESTIONS
    // =========================
    if (method === "GET") {
      const questions = await Quiz.find().sort({ createdAt: -1 });
      return res.status(200).json(questions);
    }

    res.setHeader("Allow", ["GET", "POST", "PUT"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
}
