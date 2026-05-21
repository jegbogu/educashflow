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
import GeneralHeadMeta from "@/components/home/generalheadmeta";

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
  
 if(userData?.spaceOne ==null ){
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
      <GeneralHeadMeta/>
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

  // Count questions per subcategory + level
  const grouped = Object.values(
    quizList.reduce((acc, curr) => {
      const key = `${curr.subcategory}_${curr.level}`;

      if (!acc[key]) {
        acc[key] = {
          subcategory: curr.subcategory,
          level: curr.level,
          numberofquestions: 0,
        };
      }

      acc[key].numberofquestions += 1;

      return acc;
    }, {})
  );

  // Keep only groups with 300+ questions
  const validGroups = grouped.filter(
    (el) => el.numberofquestions >= 300
  );

  // Build final quiz array
  const quiz = validGroups.map((group) => {
    const found = quizList.filter(
      (el) =>
        el.subcategory === group.subcategory &&
        el.level === group.level
    );

    return {
      subcategory: group.subcategory,
      level: group.level,
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

  return {
    props: {
      quiz: JSON.parse(JSON.stringify(quiz)),
    },
  };
}
