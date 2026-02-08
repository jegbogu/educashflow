import mongoose from "mongoose";
import Register from "@/model/registerSchema";
import { quizConfig } from "@/config/quizConfig";
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
    console.log(user)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //updating playedGames array, to show the user completed the game
    //Search for the game using id
    const foundGame = user.playedGames.find((el)=>el.includes(quizId))
    //Add End to it
    const updatedFoundGame = `${foundGame}-End`
    //Replace it and save
    //delete it from the array called palyedGames
     
    await Register.updateOne(
  { _id: userId }, // match document
  { $pull: { playedGames: foundGame } } // remove from array
);

//add it to array
    await Register.updateOne(
  { _id: userId }, // match document
  { $push: { playedGames: updatedFoundGame } } // remove from array
);
  
 

  

    //updating levles

    const newUserlevel = user.level + correctCount;

    //updating points

    //check the user plan and level of game played
    let newUserPoints;
    let latestGamePoints;
    if (user.membership === "Free plan") {
      //checking the level of the game the user played
      if (level === "Beginner") {
        newUserPoints =
          user.points +
          (correctCount * quizConfig.perQuestionPoint) +
          quizConfig.extraPointsBeginner;


          latestGamePoints = (correctCount * quizConfig.perQuestionPoint) +
          quizConfig.extraPointsBeginner;
      } else if (level === "Intermidiate") {
        newUserPoints =
          user.points +
          (correctCount * quizConfig.perQuestionPoint) +
          quizConfig.extraPointsIntermediate;

          latestGamePoints = (correctCount * quizConfig.perQuestionPoint) +
          quizConfig.extraPointsIntermediate;
      } else {
        newUserPoints =
          user.points +
          (correctCount * quizConfig.perQuestionPoint) +
          quizConfig.extraPointsAdvanced;


          latestGamePoints = (correctCount * quizConfig.perQuestionPoint) +
          quizConfig.extraPointsAdvanced;
      }
    } else if (user.membership === "Bronze Pack") {
      //checking the level of the game the user played
      if (level === "Beginner") {
        newUserPoints =
          user.points +
          (correctCount * quizConfig.BronzePointPerQuestion) +
          quizConfig.extraPointsBeginner;

          latestGamePoints = (correctCount * quizConfig.BronzePointPerQuestion) +
          quizConfig.extraPointsBeginner;
      } else if (level === "Intermidiate") {
        newUserPoints =
          user.points +
          (correctCount * quizConfig.BronzePointPerQuestion) +
          quizConfig.extraPointsIntermediate;

          latestGamePoints = (correctCount * quizConfig.BronzePointPerQuestion) +
          quizConfig.extraPointsIntermediate;
      } else {
        newUserPoints =
          user.points +
          (correctCount * quizConfig.BronzePointPerQuestion) +
          quizConfig.extraPointsAdvanced;

          latestGamePoints = (correctCount * quizConfig.BronzePointPerQuestion) +
          quizConfig.extraPointsAdvanced;
      }
    } else if (user.membership === "Silver Pack") {
      //checking the level of the game the user played
      if (level === "Beginner") {
        newUserPoints =
          user.points +
          (correctCount * quizConfig.SilverPointPerQuestion) +
          quizConfig.extraPointsBeginner;


          latestGamePoints =  (correctCount * quizConfig.SilverPointPerQuestion) +
          quizConfig.extraPointsBeginner;
      } else if (level === "Intermidiate") {
        newUserPoints =
          user.points +
          (correctCount * quizConfig.SilverPointPerQuestion) +
          quizConfig.extraPointsIntermediate;

          latestGamePoints = (correctCount * quizConfig.SilverPointPerQuestion) +
          quizConfig.extraPointsIntermediate;
      } else {
        newUserPoints =
          user.points +
          (correctCount * quizConfig.SilverPointPerQuestion) +
          quizConfig.extraPointsAdvanced;

          latestGamePoints =  (correctCount * quizConfig.SilverPointPerQuestion) +
          quizConfig.extraPointsAdvanced
      }
    } else if (user.membership === "Gold Pack") {
      //checking the level of the game the user played
      if (level === "Beginner") {
        newUserPoints =
          user.points +
          (correctCount * quizConfig.proPointPerQuestion) +
          quizConfig.extraPointsBeginner;

          latestGamePoints =  (correctCount * quizConfig.proPointPerQuestion) +
          quizConfig.extraPointsBeginner;
      } else if (level === "Intermidiate") {
        newUserPoints =
          user.points +
          (correctCount * quizConfig.proPointPerQuestion) +
          quizConfig.extraPointsIntermediate;


          latestGamePoints = (correctCount * quizConfig.proPointPerQuestion) +
          quizConfig.extraPointsIntermediate;
      } else {
        newUserPoints =
          user.points +
          (correctCount * quizConfig.proPointPerQuestion) +
          quizConfig.extraPointsAdvanced;


          latestGamePoints = (correctCount * quizConfig.proPointPerQuestion) +
          quizConfig.extraPointsAdvanced;
      }
    }


     


    const newamountMade = (user.points + newUserPoints) * (quizConfig.perPoint);
     
if(user.membership !=="Free plan"){
  
}
 //updating usergames
 const ug = {
  timestamp: getFormattedDateTime(),
  quizId: quizId,
      subcategory:subcategory,
      category:category,
      level:level,
      correctCount: correctCount,
        pointsMade: latestGamePoints,
   amountMade:  latestGamePoints * quizConfig.perPoint ,
  membership: user.membership
 }
 //add it to array
    await Register.updateOne(
  { _id: userId }, // match document
  { $push: { usergames: ug } }  
);

    const updatedUser = await Register.findByIdAndUpdate(
      userId,
      {
        $set: {
          level: newUserlevel,
          points: newUserPoints,
          amountMade: newamountMade,
        },
      },
      { new: true }
    );


//this checks if the user plan so as to update the latestPurchasedGames
if(user.membership !=="Free plan"){
  //add it to array
    await Register.updateOne(
  { _id: userId }, // match document
  { $push: { latestPurchaseGames: ug } }  
);
}
 


 //saving activities for record sake
          const newActivity = new Activity({
                 _id: new mongoose.Types.ObjectId(),
                 activity:"A User Just Completed a Quiz",
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
