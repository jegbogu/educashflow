import { useState } from "react";

export default function Playingquiz(){
    
   const dummydata = [
    {
        subcategory: "World Geography Masters",
        level: "Beginner",
        completed: true,
        category: "Geography",
        time: "15 mins",
        questions: 20,
    },
    {
        subcategory: "Physics Fundamentals",
        level: "Intermediate",
        completed: false,
        category: "Science",
        time: "20 mins",
        questions: 25,
    },
    {
        subcategory: "Ancient Civilizations",
        level: "Beginner",
        completed: true,
        category: "History",
        time: "10 mins",
        questions: 15,
    },
    {
        subcategory: "Algebra Basics",
        level: "Beginner",
        completed: false,
        category: "Mathematics",
        time: "12 mins",
        questions: 18,
    },
    {
        subcategory: "Human Anatomy",
        level: "Advanced",
        completed: false,
        category: "Biology",
        time: "25 mins",
        questions: 30,
    },
    {
        subcategory: "World War II Insights",
        level: "Intermediate",
        completed: true,
        category: "History",
        time: "18 mins",
        questions: 22,
    },
    {
        subcategory: "Computer Basics",
        level: "Beginner",
        completed: true,
        category: "Technology",
        time: "14 mins",
        questions: 16,
    }
];


    return(
        <div >
            <div >{dummydata.map((el,i)=>(
                <div key={i} className="border border-gray-300 shadow-sm rounded-md p-5 mt-5">
                <div  className="  flex gap-5 item-center">
                    <p className="text-[1.3em] font-bold">{el.subcategory}</p>
                     {el.level=="Beginner"?
                      <p className="bg-green-100 text-sm p-2 rounded-md text-green-800">{el.level}</p>: el.level=="Intermediate"?<p className="bg-yellow-100 text-sm text-sm p-2 rounded-md text-yellow-800">{el.level}</p>:<p className="bg-red-100 text-sm text-sm p-2 rounded-md text-red-800">{el.level}</p>}
                  {el.completed==true?
                  <div className="flex items-center text-sm p-2 bg-gray-100 rounded-md gap-2">
                    <img src="star-alt-3-svgrepo-com.svg" alt="star" className="w-4 h-4"/> Completed</div>:""}
                </div>
                <div className="flex gap-5 mt-5">

                      <div className="flex gap-3 items-center"><img src="brain-illustration-1-svgrepo-com.svg" className="w-4 h-4" alt="brain"/> <p className="text-gray-500">{el.category}</p></div>

                      <div className="flex gap-3 items-center"><img src=" time-past-svgrepo-com.svg" className="w-4 h-4" alt="clock"/> <p className="text-gray-500">{el.time}</p></div>

                    <p className="text-gray-500">{el.questions} Questions</p>
                      
                </div>
                </div>
            ))}</div>
        </div>
    )
}