import mongoose from "mongoose";
import Register from "@/model/registerSchema";
import { quizConfig } from "@/config/quizConfig ";
import Activity from "@/model/recentactivities";


//this is for date and time
function getFormattedDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}


async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      userId,
      quizId,
      subcategory,
      category,
      level,
      totalQuestions,
      correctCount,

      answers,
      finishedAt,
    } = req.body;

    // Make sure userId exists
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Find user by MongoDB _id
    const user = await Register.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //updating levles

    const newUserlevel = user.level + correctCount;

    //updating points

    //check the user plan and level of game played
    let newUserPoints;
    if (user.membership === "Free plan") {
      //checking the level of the game the user played
      if (level === "Beginner") {
        newUserPoints =
          user.points +
          correctCount * quizConfig.perQuestionPoint +
          quizConfig.extraPointsBeginner;
      } else if (level === "Intermidiate") {
        newUserPoints =
          user.points +
          correctCount * quizConfig.perQuestionPoint +
          quizConfig.extraPointsIntermediate;
      } else {
        newUserPoints =
          user.points +
          correctCount * quizConfig.perQuestionPoint +
          quizConfig.extraPointsAdvanced;
      }
    } else if (user.membership === "Basic Pack") {
      //checking the level of the game the user played
      if (level === "Beginner") {
        newUserPoints =
          user.points +
          correctCount * quizConfig.basicPointPerQuestion +
          quizConfig.extraPointsBeginner;
      } else if (level === "Intermidiate") {
        newUserPoints =
          user.points +
          correctCount * quizConfig.basicPointPerQuestion +
          quizConfig.extraPointsIntermediate;
      } else {
        newUserPoints =
          user.points +
          correctCount * quizConfig.basicPointPerQuestion +
          quizConfig.extraPointsAdvanced;
      }
    } else if (user.membership === "Premium Pack") {
      //checking the level of the game the user played
      if (level === "Beginner") {
        newUserPoints =
          user.points +
          correctCount * quizConfig.premiumPointPerQuestion +
          quizConfig.extraPointsBeginner;
      } else if (level === "Intermidiate") {
        newUserPoints =
          user.points +
          correctCount * quizConfig.premiumPointPerQuestion +
          quizConfig.extraPointsIntermediate;
      } else {
        newUserPoints =
          user.points +
          correctCount * quizConfig.premiumPointPerQuestion +
          quizConfig.extraPointsAdvanced;
      }
    } else if (user.membership === "Pro Pack") {
      //checking the level of the game the user played
      if (level === "Beginner") {
        newUserPoints =
          user.points +
          correctCount * quizConfig.proPointPerQuestion +
          quizConfig.extraPointsBeginner;
      } else if (level === "Intermidiate") {
        newUserPoints =
          user.points +
          correctCount * quizConfig.proPointPerQuestion +
          quizConfig.extraPointsIntermediate;
      } else {
        newUserPoints =
          user.points +
          correctCount * quizConfig.proPointPerQuestion +
          quizConfig.extraPointsAdvanced;
      }
    }

    //updating amountMade
    const newamountMade = user.points * quizConfig.perPoint;

 const updatedUser = await Register.findByIdAndUpdate(
  userId, 
  { 
    $set: { 
      level: newUserlevel, 
      points: newUserPoints,
       amountMade: newamountMade
    } 
  }, 
  { new: true }
);


 //saving activities for record sake
          const newActivity = new Activity({
                 _id: new mongoose.Types.ObjectId(),
                 activity:"A User just completed a quiz",
                 description:`${user.username} || ${category} || ${subcategory}`,
                 createdAt: getFormattedDateTime()
                
               });
         
               await newActivity.save();
 
    // Example: you could now save quiz results, etc.
    return res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    console.error("Handler error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

export default handler;
