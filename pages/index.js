import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Navbar from "@/components/layout/navbar";
import Banner from "@/components/home/banner";
import HowItWorks from "@/components/home/how-it-works";
import Testimonials from "@/components/home/testimonials";
import Faqs from "@/components/home/faq";
import Reward from "@/components/home/reward";
import CssParticles from "@/components/particles";
import BgSvg from "@/components/layout/bg";

import connectDB from "@/utils/connectmongo";
import Quiz from "../model/quizCreation";
import UsersQuiz from "@/components/UserQuiz/quiz";
import { useState } from "react";
import RootLayout from "@/components/layout";

export default function Home(props) {
  const [modal, setModal] = useState(true);
  //this for user quiz
  const allQuestions = props.quiz;

  return (
    <>
      <Head>
        
        <title>Educash Flow | Answer Questions, Earn Rewards & Win Cash</title>

<meta name="description" content="Educash Flow lets you answer quiz questions, earn rewards, and win real points. Register today, activate your coupon, and start playing quizzes to earn money in your wallet." />

<meta name="keywords" content="Educash Flow, earn rewards online, quiz and earn money, answer questions for rewards, online quiz platform, earn points online, reward quizzes, Eduquizz Global" />

<meta name="author" content="Eduquizz Global Limited" />

<meta name="robots" content="index, follow" />

<meta name="viewport" content="width=device-width, initial-scale=1" />

<link rel="shortcut icon" href="https://eduquizzglobal.com/logo.jpg" type="image/x-icon" />

{/* <!-- Open Graph for Social Sharing --> */}
<meta property="og:title" content="Educash Flow | Answer Questions and Earn Rewards" />
<meta property="og:description" content="Register on Educash Flow, activate your coupon, answer quiz questions and start earning reward points instantly." />
<meta property="og:image" content="https://eduquizzglobal.com/logo.jpg" />
<meta property="og:url" content="https://educashflow.com" />
<meta property="og:type" content="website" />

{/* <!-- Twitter Card --> */}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Educash Flow | Earn Rewards by Answering Questions" />
<meta name="twitter:description" content="Play quizzes, answer questions, and earn rewards instantly on Educash Flow." />
<meta name="twitter:image" content="https://eduquizzglobal.com/logo.jpg" />
       
      
      </Head>
      <div className="relative bg-gradient-to-r from-[#0b1220] via-[#1a1f3c] to-primary-dark">
        <Navbar />
        <CssParticles />
        <Banner allQuestions={allQuestions} />
        {modal && (
          <UsersQuiz
            allQuestions={allQuestions}
            onClose={() => {
              setModal(false);
            }}
          />
        )}
      </div>
      <div className="relative">
        <HowItWorks />

        <div className="w-full absolute top-24 -z-10">
          <BgSvg />
        </div>
        <Testimonials />
        <Reward />
        <Faqs />
      </div>
    </>
  );
}
export async function getServerSideProps() {
  await connectDB();
  const quiz = await Quiz.find({}).lean();

  return {
    props: {
      quiz: JSON.parse(JSON.stringify(quiz)),
    },
  };
}


Home.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};