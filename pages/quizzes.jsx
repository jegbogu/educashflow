import Userheader from "@/components/UserDashboard/userheader";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/icons/spinner";
import Usernavbar from "@/components/UserDashboard/usernavbar";
import UserQuizzes from "@/components/UserDashboard/userquizzes";
import connectDB from "@/utils/connectmongo";
import Quiz from "../model/quizCreation";
import CurrencyAndPhone from "@/components/currencyandphone";

export default function Quizzes(props) {
  const { data: session, status } = useSession();
  const [currencyandphone, setCurrencyandPhone] = useState(true)
  const userData = session?.user;

  const router = useRouter();

  // Handle redirects in useEffect
  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "user") {
      router.replace("/login");
    } else if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, session, router]);

 useEffect(()=>{
  console.log("userdata", userData)
 if(userData?.spaceOne =="Null" ){
    setCurrencyandPhone(true)
  }else if(userData?.spaceOne.includes("Naira") || userData?.spaceOne.includes("Dollar")  ) {
    setCurrencyandPhone(false)
  }
  },[currencyandphone, session])

  // Show loading state while session is being checked
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-3xl font-bold">
          <Spinner className="w-12 h-12" />
        </div>
      </div>
    );
  }

  // If user is not allowed, return null to prevent flashing content
  if (status !== "authenticated" || session?.user.role !== "user") {
    return null;
  }

 
 
  return (
    <div>
      <Userheader userData={userData} />
      <div className="p-5">
        <Usernavbar />
        {currencyandphone && <CurrencyAndPhone userData={userData}/>}
        <UserQuizzes quiz={props.quiz} />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  await connectDB();
  const quizList = await Quiz.find({}).lean();

  const subcategories = [...new Set(quizList.map((el) => el.subcategory))];
  const levels = [...new Set(quizList.map((el) => el.level))];

  const quizBeginner = subcategories.map((sub) => {
    const found = quizList.filter(
      (el) => el.subcategory === sub && el.level == levels[0]
    );
    return {
      subcategory: sub,

      quizzes: found.map((el) => ({
        id: el._id,
        category: el.category,
        question: el.question,
        options: el.options,
        correctAnswer: el.correctAnswer,
        level: el.level,
        createdAt: el.createdAt,
      })),
    };
  });
  const quizIntermediate = subcategories.map((sub) => {
    const found = quizList.filter(
      (el) => el.subcategory === sub && el.level == levels[1]
    );
    return {
      subcategory: sub,

      quizzes: found.map((el) => ({
        id: el._id,
        category: el.category,
        question: el.question,
        options: el.options,
        correctAnswer: el.correctAnswer,
        level: el.level,
        createdAt: el.createdAt,
      })),
    };
  });
  const quizAdvanced = subcategories.map((sub) => {
    const found = quizList.filter(
      (el) => el.subcategory === sub && el.level == levels[2]
    );
    return {
      subcategory: sub,

      quizzes: found.map((el) => ({
        id: el._id,
        category: el.category,
        question: el.question,
        options: el.options,
        correctAnswer: el.correctAnswer,
        level: el.level,
        createdAt: el.createdAt,
      })),
    };
  });

  const quiz = quizBeginner.concat(quizIntermediate, quizAdvanced);

  return {
    props: {
      quiz: JSON.parse(JSON.stringify(quiz)),
    },
  };
}
