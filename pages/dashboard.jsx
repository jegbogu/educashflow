import Userheader from "@/components/UserDashboard/userheader";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/icons/spinner";
import Usernavbar from "@/components/UserDashboard/usernavbar";
import {
  TrendingUp,
  BookOpen,
  ChartLine,
  Wallet,
  Clock,
} from "lucide-react";
import { StatsCard } from "@/components/UserDashboard/statsCard";
import { ProgressBar } from "@/components/UserDashboard/progressBar";
import { QuizCard } from "@/components/UserDashboard/quizCard";
import { ActivityItem } from "@/components/UserDashboard/activityItem";

 import UserQuizzes from "@/components/UserDashboard/userquizzes";
import styles from "@/styles/userDashboard.module.css";
import { cn } from "@/lib/utils";
import Recent from "@/components/icons/recent";
import { quizConfig } from "@/config/quizConfig";
 
 
import connectDB from "@/utils/connectmongo";
import Quiz from "../model/quizCreation";

export default function Dashboard(props) {
  const { data: session, status } = useSession();
  const [disabled, setDisabled] = useState(true)

  const userData = session?.user;

  //Withdrawals
 const withdrawalNeededDollar = quizConfig.minimumAmount-userData?.amountMade

 const withdrawalNeededNaira = quizConfig.minimumAmountNaira-userData?.amountMade
  const PendingWithdrawal = (Math.abs(quizConfig.minimumAmount-userData?.amountMade)).toFixed(2)

//Hadling the amount of games played
const gamesStatus = amountOfGamesLeft(userData?.latestPurchase, userData?.latestPurchaseGames)

function amountOfGamesLeft(latestPurchase, latestPurchaseGames){
 if (!latestPurchase || latestPurchase.length === 0  ) {
    return "No purchase found";
  }
 

   const planGamesNumber = latestPurchase[latestPurchase.length-1].gameLimit
  const remainingAmountOfGames = planGamesNumber - latestPurchaseGames.length
  return `${remainingAmountOfGames} of ${planGamesNumber} left`

}
const gameStatusProgress = amountOfGamesProgress(userData?.latestPurchase, userData?.latestPurchaseGames)
 

function amountOfGamesProgress(latestPurchase, latestPurchaseGames){
 if (!latestPurchase || latestPurchase.length === 0  ) {
    return "No purchase found";
  }
 

   const planGamesNumber = latestPurchase[latestPurchase.length-1].gameLimit
  const remainingAmountOfGames = planGamesNumber - latestPurchaseGames.length
  return (remainingAmountOfGames/planGamesNumber)*100

}

   

  //handling days left to expire
  const statusPurchse = getExpiryStatus(userData?.latestPurchase);

 
  function getExpiryStatus(latestPurchase) {
  if (!latestPurchase || latestPurchase.length === 0) {
    return "No purchase found";
  }

  const today = new Date();
  const expiryDate = new Date(
    latestPurchase[latestPurchase.length - 1].expiryDate
  );

  const diffInMs = expiryDate - today;
  const daysLeft = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (daysLeft > 0) {
    return `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`;
  } 
  
  if (daysLeft === 0) {
    return "Expires today";
  }

  // For expired licenses
  return `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) > 1 ? "s" : ""} ago`;
}

function timeAgoFromTimestamp(timestamp) {
  const [day, month, yearAndTime] = timestamp.split("-");
  const [year, time] = yearAndTime.split(" ");
  const date = new Date(`${year}-${month}-${day} ${time}`);
  const now = new Date();
  const diffMs = now - date;

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hrs ago`;
  return `${days} days ago`;
}


//getting the amount in a month
const amountinThisMonth = getAmountMadeThisMonth(userData?.usergames)
function getAmountMadeThisMonth(records) {
 
  if(!records || records.length===0){
    return "No amount made"
  }
  const now = new Date();
  const currentMonth = now.getMonth(); // 0 = Jan
  const currentYear = now.getFullYear();

  let total = 0;

  records.forEach(record => {
    const [day, month, yearAndTime] = record.timestamp.split("-");
    const [year] = yearAndTime.split(" ");

    const dateObj = new Date(`${year}-${month}-${day}`);

    if (dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear) {
      total += record.amountMade;
    }
  });

  return total;
}

 // Usage:
const changesinAmount = getPercentageChange(userData?.usergames);

function parseDate(timestamp) {
  // Format: DD-MM-YYYY HH:mm:ss
  const [day, month, yearAndTime] = timestamp.split("-");
  const [year] = yearAndTime.split(" ");
  return new Date(`${year}-${month}-${day}`);
}

function getMonthlyTotals(data) {
   if(!data || data.length===0){
    return "No amount made"
  }
  const now = new Date();
  const currentMonth = now.getMonth();   // 0–11
  const currentYear = now.getFullYear();

  // Last month logic
  let lastMonth = currentMonth - 1;
  let lastMonthYear = currentYear;

  if (lastMonth < 0) {
    lastMonth = 11;
    lastMonthYear -= 1;
  }

  let thisMonthTotal = 0;
  let lastMonthTotal = 0;

  data.forEach(item => {
    const date = parseDate(item.timestamp);
    const month = date.getMonth();
    const year = date.getFullYear();

    if (month === currentMonth && year === currentYear) {
      thisMonthTotal += item.amountMade;
    } else if (month === lastMonth && year === lastMonthYear) {
      lastMonthTotal += item.amountMade;
    }
  });

  return { thisMonthTotal, lastMonthTotal };
}

function getPercentageChange(data) {
  const { thisMonthTotal, lastMonthTotal } = getMonthlyTotals(data);

  if (lastMonthTotal === 0) {
    return "No data for last month";
  }

  const change = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

  if (change > 0) {
    return `+${change.toFixed(1)}% from last month`;
  } else if (change < 0) {
    return `${change.toFixed(1)}% reduction from last month`;
  } else {
    return "No change from last month";
  }
}










  const router = useRouter();

  // Handle redirects in useEffect
  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "user") {
      router.replace("/login");
    } else if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, session, router]);

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
  let minimumInCurrency;
  if(userData?.spaceOne.includes("Naira")){
    minimumInCurrency = <div>
  {quizConfig.minimumAmountNaira> userData?.amountMade?<div className={styles.withdrawalNeeded}>{`₦${withdrawalNeededNaira} more needed`}</div>:`$${PendingWithdrawal} Available in your account for withdrawal`}
    </div>
  }else{
   minimumInCurrency = <div>
{quizConfig.minimumAmount> userData?.amountMade?<div className={styles.withdrawalNeeded}>{`$${withdrawalNeededDollar} more needed`}</div>:`$${PendingWithdrawal} Available in your account for withdrawal`} 
    </div>
  }

  // const quizzes = [
  //   {
  //     title: "World Geography Masters",
  //     difficulty: "Medium",
  //     subject: "Geography",
  //     duration: "15 mins",
  //     questions: "20 questions",
  //     points: "+250 pts",
  //     accuracy: "85%",
  //     completed: true,
  //     buttonText: "Retry",
  //   },
  //   {
  //     title: "Science Fundamentals",
  //     difficulty: "Easy",
  //     subject: "Science",
  //     duration: "10 mins",
  //     questions: "15 questions",
  //     points: "+100 pts",
  //     buttonText: "Start",
  //   },
  //   {
  //     title: "Advanced Mathematics",
  //     difficulty: "Hard",
  //     subject: "Math",
  //     duration: "30 mins",
  //     questions: "25 questions",
  //     points: "+500 pts",
  //     buttonText: "Start",
  //   },
  // ];
  const activities = [
    {
      title: "Daily Goal Bonus",
      timeAgo: "1 day ago",
      amount: "+$4.00",
      status: "completed",
    },
    {
      title: "Daily Goal Bonus",
      timeAgo: "1 day ago",
      amount: "+$4.00",
      status: "completed",
    },
    {
      title: "Advanced Math Quiz",
      timeAgo: "2 days ago",
      amount: "+$4.00",
      status: "completed",
    },
    {
      title: "Advanced Math Quiz",
      timeAgo: "2 days ago",
      amount: "+$4.00",
      status: "completed",
    },
  ];

  return (
    <div>
      <Userheader userData={userData} />
      <div className="p-5">
        <Usernavbar />
        <div className={styles.dashboard}>
          <div className={styles.dashboardContainer}>
            {/* Top Stats Row */}
            <div className={styles.statsGrid}>
              {/* Active Coupon */}
              <StatsCard
                title={userData?.membership==="Free Pack"?"No Active Plan":userData?.membership}
                badge={{ text: userData?.membership==="Free Pack"?"Inactive":"Active", variant: "active" }}
              >
                <div className={styles.timeRemaining}>
                  <Clock className={styles.timeIcon} />
                  <span>
                    Time Remaining: {userData?.membership==="Free plan"?<strong>Always Free</strong>:<strong>{statusPurchse}</strong>}
                  </span>
                </div>
                <div className={styles.progressSection}>
                  <div className={styles.progressLabel}>
                    
                    {userData?.membership==="Free plan"?<strong>Always Free</strong>:<strong>{gamesStatus}</strong>}
                  </div>

                  {userData?.membership==="Free plan"? <ProgressBar progress={100} />:<strong> <ProgressBar progress={gameStatusProgress} /></strong>}
                 
                </div>
              </StatsCard>

              {/* Today */}
              <StatsCard title="Total">
                <div className={styles.statNumber}>{userData?.playedGames.length}</div>
                <p className={styles.statDescription}>Quizzes completed </p>
              </StatsCard>

              {/* Earnings */}
              <StatsCard title="Earnings">
                <div className={styles.statNumber}>{userData?.spaceOne == "Null"? "No Currency":userData?.spaceOne.includes("Naira")? `₦${userData?.amountMade}`: `$${userData?.amountMade}`}</div>
                <p className={styles.statDescription}>Amount Made</p>
           
              </StatsCard>
            </div>

            {/* Main Content Grid */}
            <div className={styles.mainGrid}>
              {/* Left Column */}
              <div className={styles.leftColumn}>
                {/* Available Quizzes */}
                <div className={cn(styles.sectionCard, "border-none")}>
                  <div className={cn(styles.sectionHeader, "!p-0 !pb-2")}>
                    <BookOpen className={styles.sectionIcon} />
                    <h2 className={styles.sectionTitle}>Available Quizzes</h2>
                  </div>
                  <div>
                    {userData?.membership!=="Free plan"?" ":<div className={styles.couponNotice}>
                      <p className="">
                        Get more from every game. Purchase a coupon to increase
                        your earnings.
                      </p>
                      <button className={styles.btnPrimary}>Buy Coupon</button>
                    </div>}
                  </div>
                </div>

                {/* Daily Progress */}
                {/* <div className={cn("!bg-green-50", styles.sectionCard)}>
                  <div className={cn(styles.sectionHeader, "justify-between")}>
                    <div className="flex items-center gap-2">
                      <ChartLine className={styles.sectionIcon} />
                      <h2 className={styles.sectionTitle}>Daily Progress</h2>
                    </div>
                    <div className={styles.progressLabel}>
                      <span>3/5 completed</span>
                    </div>
                  </div>
                  <div className={styles.sectionContent}>
                    <ProgressBar progress={60} />
                  </div>
                </div> */}

                {/* Quiz Categories */}
                        <UserQuizzes quiz={props.quiz.slice(Math.floor(Math.random() * 10),Math.floor(Math.random() * 21))} />
              </div>

              {/* Right Column - Earnings & Withdrawals */}
              <div className={styles.rightColumn}>
                <div className={styles.sectionCard}>
                  <div className={styles.sectionHeader}>
                    <Wallet className={styles.sectionIcon} />
                    <h2 className={styles.sectionTitle}>
                      Earnings & Withdrawals
                    </h2>
                  </div>
                  <div className={styles.sectionContent}>
                    {/* Balance Row */}
                    <div className={styles.balanceRow}>
                      <div
                        className={cn(
                          styles.balanceItem,
                          styles.balanceAvailable
                        )}
                      >
                        <p className={styles.balanceLabel}>Available Balance</p>
                        
                        <p className={cn(styles.balanceAmount)}>{userData?.spaceOne == "Null"? "No Currency":userData?.spaceOne.includes("Naira")? `₦${userData?.amountMade}`: `$${userData?.amountMade}`}</p>
                        <p className={styles.balanceRate}>
                           Rate 100pts = {userData?.spaceOne == "Null"? "No Currency":userData?.spaceOne.includes("Naira")? `₦${quizConfig.perPoint*100}`: `$${quizConfig.perPoint*100}`}
                         
                        </p>
                      </div>
                      <div
                        className={cn(
                          styles.balanceItem,
                          styles.balanceMonthly
                        )}
                      >
                        <p className={styles.balanceLabel}>This Month</p>
                        <p className={cn(styles.balanceAmount)}>
                          {userData?.spaceOne == "Null"? "No Currency":userData?.spaceOne.includes("Naira")? `₦${amountinThisMonth?? amountinThisMonth.toFixed(2)}`: `$${amountinThisMonth?? amountinThisMonth.toFixed(2)}`}
                           </p>


                        <p className={styles.balanceGrowth}>
                          <TrendingUp className={styles.growthIcon} />
                           {changesinAmount}
                        </p>
                      </div>
                    </div>

                    {/* Withdrawal Progress */}
                      <div className={styles.withdrawalSection}>
                                 <div className={styles.withdrawalHeader}>
                                   <span className={styles.withdrawalTitle}>
                                     Withdrawal Progress
                                   </span>
                                   <span className={styles.withdrawalMin}>Min.


                                     {userData?.spaceOne == "Null"? "No Currency":userData?.spaceOne.includes("Naira")? ` ₦${quizConfig.minimumAmountNaira}`: ` $${quizConfig.minimumAmount}`}
                                    
                                   </span>
                                 </div>
                                  {minimumInCurrency}
                            <ProgressBar progress={90} />
                     
                                { quizConfig.minimumAmount>= userData?.amountMade?<button
                                   className={cn(disabled && styles.btnDisabled, styles.btn)}
                                   disabled={disabled}
                                 >
                                   <Clock className={styles.btnIcon} />
                                   Minimum Not Reached
                                 </button>
                                 :
                                 <button className="bg-blue-900 py-5 px-[30px] text-white w-full mt-5 rounded-md">
                                 
                                   Request For Withdrawal
                                 </button>}
                               </div>

                    

                    {/* Recent Activity */}
                    <div className={styles.activitySection}>
                      <div className={styles.activityHeader}>
                        <h3 className={styles.activityTitle}>
                          <Recent /> Recent Activity
                        </h3>
                        <button className={styles.btnGhost}>View All</button>
                      </div>

                       <div className={styles.activityList}>
  {userData?.usergames.slice(0,5).map((activity, index) => (
    <ActivityItem
      key={index}
      title={activity.subcategory}  // or activity.category or activity.timestamp
      timeAgo={timeAgoFromTimestamp(activity.timestamp)}
      amount={`₦${activity.amountMade}`} // or plain activity.amountMade
      status={activity.amountMade > 0 ? "completed" : "failed"}
    />
  ))}
</div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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