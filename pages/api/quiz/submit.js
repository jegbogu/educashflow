import mongoose from "mongoose";
import Register from "@/model/registerSchema";
import { quizConfig } from "@/config/quizConfig";
import { couponPlans } from "@/config/couponConfig";
 
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



  if(user.membership =="Free plan"){
      console.log('free play')
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
 //add it to array of general games played
    await Register.updateOne(
  { _id: userId }, // match document
  { $push: { usergames: ug } }  
);
//update the amount and points and change the user membership to free
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


 

/////record that a user has completed his purchased game limit
//saving activities for record sake
          const newActivity = new Activity({
                 _id: new mongoose.Types.ObjectId(),
                 activity:"A User Just Completed a Quiz",
                 description:`${user.username} || ${category} || ${subcategory} || ${user.membership}` ,
                 createdAt: getFormattedDateTime()
                
               });
         
               await newActivity.save();
 
  
}










//this is to catch the exact time the user completed his package limit
let foundPackage
if(user.membership !="Free plan"){
   foundPackage =  couponPlans.find((el)=>el.name == user.membership)
   console.log("foundPackage", foundPackage)
}


  if(user.membership !="Free plan" && user.latestPurchase.length==1 && user.latestPurchaseGames.length < foundPackage.gameLimit && user.latestPurchaseGames.length +1 != foundPackage.gameLimit ){
  //updating usergames
  console.log("not free plan" , user.latestPurchaseGames.length, user.latestPurchaseGames.length+1)
  
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
 //add it to array of general games played
    await Register.updateOne(
  { _id: userId }, // match document
  { $push: { usergames: ug } }  
);
//update the amount and points and change the user membership to free
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


  //add it to array to latestpurchasedgames played
    await Register.updateOne(
  { _id: userId }, // match document
  { $push: { latestPurchaseGames: ug } }  
);

/////record that a user has completed his purchased game limit
//saving activities for record sake
          const newActivity = new Activity({
                 _id: new mongoose.Types.ObjectId(),
                 activity:"A User Just Completed a Quiz",
                 description:`${user.username} || ${category} || ${subcategory} || ${user.membership}` ,
                 createdAt: getFormattedDateTime()
                
               });
         
               await newActivity.save();
 
  
}







//this is to get the length of games the user is to play from his package, so as to prevent the user from playing more than the stated number of games
 
 

   //This to capture the  first time the user completes his first game circle, the logic captures it and places the user back to free plan
if(user.membership !=="Free plan" && user.latestPurchase.length == 1 && user.latestPurchaseGames.length + 1 == foundPackage.gameLimit){
  //updating usergames
  
 const ug = {
  completedRound: getFormattedDateTime(),
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
 //add it to array of general games played
    await Register.updateOne(
  { _id: userId }, // match document
  { $push: { usergames: ug } }  
);
//update the amount and points and change the user membership to free
    const updatedUser = await Register.findByIdAndUpdate(
      userId,
      {
        $set: {
          level: newUserlevel,
          points: newUserPoints,
          amountMade: newamountMade,
          membership: "Free plan"
           
        },
      },
      { new: true }
    );


 
 
  //add it to array to latestpurchasedgames played
    await Register.updateOne(
  { _id: userId }, // match document
  { $push: { latestPurchaseGames: ug } }  
);

 

/////record that a user has completed his purchased game limit
//saving activities for record sake
          const newActivity = new Activity({
                 _id: new mongoose.Types.ObjectId(),
                 activity:"A User Just Completed a Quiz- and has completed package circle",
                 description:`${user.username} || ${category} || ${subcategory} || ${user.membership}` ,
                 createdAt: getFormattedDateTime()
                
               });
         
               await newActivity.save();
 
  
}
//Index number of the last limit which shows completed round
 

function parseDate(dateStr) {
  const [datePart, timePart] = dateStr.split(" ");
  const [day, month, year] = datePart.split("-");
  return new Date(`${year}-${month}-${day}T${timePart}`);
}

const foundIndex = user.latestPurchaseGames.reduce((latestIndex, obj, currentIndex) => {
  if (!obj.completedRound) return latestIndex;

  const currentDate = parseDate(obj.completedRound);

  if (latestIndex === -1) return currentIndex;

  const latestDate = parseDate(user.latestPurchaseGames[latestIndex].completedRound);

  return currentDate > latestDate ? currentIndex : latestIndex;
}, -1);





if(foundIndex!=-1 && user.membership !="Free plan"){
//Add the foundIndex number to the current user game limit purchase
const addUp = Number(foundIndex) + foundPackage.gameLimit
 

// this is when the user has already gone other a first circle
if(user.membership !=="Free plan" && user. latestPurchase.length > 1 && user.latestPurchaseGames.length  != addUp ){
   
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
 //add it to array of general games played
    await Register.updateOne(
  { _id: userId }, // match document
  { $push: { usergames: ug } }  
);
//update the amount and points and change the user membership to free
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


 
 
  //add it to array to latestpurchasedgames played
    await Register.updateOne(
  { _id: userId }, // match document
  { $push: { latestPurchaseGames: ug } }  
);

 

/////record that a user has completed his purchased game limit
//saving activities for record sake
          const newActivity = new Activity({
                 _id: new mongoose.Types.ObjectId(),
                 activity:"A User Just Completed a Quiz- and has completed package circle",
                 description:`${user.username} || ${category} || ${subcategory} || ${user.membership}` ,
                 createdAt: getFormattedDateTime()
                
               });
         
               await newActivity.save();
 
  
}
}


 



if(foundIndex!=-1 && user.membership !="Free plan"){
//Add the foundIndex number to the current user game limit purchase
const addUp = Number(foundIndex) + foundPackage.gameLimit

 

 
// this is when the user has already gone other a first circle
if(user.membership !=="Free plan" && user. latestPurchase.length > 1 && user.latestPurchaseGames.length  == addUp){
  
  //updating usergames
 const ug = {
  completedRound: getFormattedDateTime(),
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
 //add it to array of general games played
    await Register.updateOne(
  { _id: userId }, // match document
  { $push: { usergames: ug } }  
);
//update the amount and points and change the user membership to free
    const updatedUser = await Register.findByIdAndUpdate(
      userId,
      {
        $set: {
          level: newUserlevel,
          points: newUserPoints,
          amountMade: newamountMade,
          membership: "Free plan"
           
        },
      },
      { new: true }
    );


 
 
  //add it to array to latestpurchasedgames played
    await Register.updateOne(
  { _id: userId }, // match document
  { $push: { latestPurchaseGames: ug } }  
);

 

/////record that a user has completed his purchased game limit
//saving activities for record sake
          const newActivity = new Activity({
                 _id: new mongoose.Types.ObjectId(),
                 activity:"A User Just Completed a Quiz- and has completed package circle",
                 description:`${user.username} || ${category} || ${subcategory} || ${user.membership}` ,
                 createdAt: getFormattedDateTime()
                
               });
         
               await newActivity.save();
 
  
}
}

 
 
 


 
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
