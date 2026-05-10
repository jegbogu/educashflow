import { TrendingUp, Clock, Wallet, ChartLine } from "lucide-react";
import { ProgressBar } from "@/components/UserDashboard/progressBar";
import { ActivityItem } from "@/components/UserDashboard/activityItem";
import styles from "@/styles/userDashboard.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Userheader from "@/components/UserDashboard/userheader";
import Usernavbar from "@/components/UserDashboard/usernavbar";
import { useEffect, useState } from "react";
import Spinner from "@/components/icons/spinner";
import { cn } from "@/lib/utils";
import connectDB from "@/utils/connectmongo";
import Register from "@/model/registerSchema";
import { quizConfig } from "@/config/quizConfig";
import UserWithdrawalForm from "@/components/home/userWithdrawalForm";
import Head from "next/head";
import GeneralHeadMeta from "@/components/home/generalheadmeta";

export default function EarningsPage() {
  const { data: session, status } = useSession();
  const[userWithdralForm, setuserWithdralForm] = useState(false)
  const userData = session?.user;
    //Withdrawals
   const withdrawalNeededDollar = (quizConfig.minimumAmount-userData?.amountMade).toFixed(2)
  
   
 

  const router = useRouter();
  const [disabled, setDisabled] = useState(true);

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
   if (status !== "authenticated" || session?.user.role !== "user" || session?.user.spaceOne== "Null") {
   router.replace("/login");
  }

   

 const withdrawalNeededNaira =(Math.abs(quizConfig.minimumAmountNaira-userData?.amountMade)).toFixed(2)
  const PendingWithdrawal = (Math.abs(quizConfig.minimumAmount-userData?.amountMade)).toFixed(2)
 

  let minimumInCurrency;
  if(userData?.spaceOne.includes("Naira")){
    minimumInCurrency = <div>
  {quizConfig.minimumAmountNaira>= userData?.amountMade?<div className={styles.withdrawalNeeded}>{`₦${withdrawalNeededNaira} more needed`}</div>:`₦${PendingWithdrawal} Available in your account for withdrawal`}
    </div>
  }else{
   minimumInCurrency = <div>
{quizConfig.minimumAmount> userData?.amountMade?<div className={styles.withdrawalNeeded}>{`$${withdrawalNeededDollar} more needed`}</div>:`$${PendingWithdrawal} Available in your account for withdrawal`} 
    </div>
  }
 
let configMinAmount
if (userData?.spaceOne.includes('Naira')){
  configMinAmount = quizConfig?.minimumAmountNaira
}else{
  configMinAmount = quizConfig.minimumAmount
}

let percentageScore 

if (userData?.spaceOne.includes('Naira')){
  percentageScore = (userData?.amountMade / quizConfig?.minimumAmountNaira)* 100
}else{
   percentageScore = (userData?.amountMade / quizConfig?.minimumAmount)* 100
}
function handleFormCloseFnc(){
  setuserWithdralForm(false)
}
  return (
    <div>
        <GeneralHeadMeta/>


      {userWithdralForm && <UserWithdrawalForm onClose={handleFormCloseFnc}/>}
      <Userheader userData={userData} />
      <div className="p-5">
        <Usernavbar />
        <div className={styles.earningsPage}>
          {/* Earnings & Withdrawals Header */}
          <div className={cn("!border-none", styles.sectionCard)}>
            <div className={styles.sectionHeader}>
              <Wallet className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Earnings & Withdrawals</h2>
            </div>
          </div>
          {/* Balance Cards */}
          <div className={styles.balanceCards}>
            <div className={cn(styles.balanceCard, styles.balanceAvailable)}>
              <div className={styles.balanceHeader}>
                <span className={styles.balanceLabel}>Available Balance</span>
                <span className={styles.balanceCurrency}>

                  {userData?.spaceOne == "Null"?
                   "No Currency":userData?.spaceOne.includes("Naira")? `₦`: `$`}
                </span>
              </div>
               
                <p className={cn(styles.balanceAmount)}>{userData?.spaceOne == "Null"? "No Currency":userData?.spaceOne.includes("Naira")? `₦${userData?.amountMade.toFixed(2)}`: `$${userData?.amountMade.toFixed(2)}`}</p>
                                       <p className={styles.balanceRate}>
                                          Rate 100pts = {userData?.spaceOne == "Null"? "No Currency":userData?.spaceOne.includes("Naira")? `₦${quizConfig.perPoint*100}`: `$${(quizConfig.perPointDollars*100).toFixed(4)}`}
                                        
                                       </p>




            </div>

            <div className={cn(styles.balanceCard, styles.balanceMonthly)}>
              <div className={styles.balanceHeader}>
                <span className={styles.balanceLabel}>Points</span>
                <ChartLine className={styles.balanceTrendIcon} />
              </div>
              <div className={styles.balanceAmount}>{userData?.points}</div>
              <div className={styles.balanceGrowth}>
                <TrendingUp className={styles.growthIcon} />
                
              </div>
            </div>
          </div>
          {/* Withdrawal Progress */}
          <div className={styles.withdrawalSection}>
            <div className={styles.withdrawalHeader}>
              <span className={styles.withdrawalTitle}>
                Withdrawal Progress
              </span>
              <span className={styles.withdrawalMin}>Min. {userData?.spaceOne == "Null"? "No Currency":userData?.spaceOne.includes("Naira")? `₦${quizConfig?.minimumAmountNaira}`: `$${quizConfig?.minimumAmount}`}</span>
            </div>

          

               {minimumInCurrency}
            <ProgressBar progress={100-percentageScore} />

            

           { userData?.spaceTwo === "Pending"?<button
                                   className={cn(disabled && styles.btnDisabled, styles.btn)}
                                   disabled={disabled}
                                 >
                                   <Clock className={styles.btnIcon} />
                                   You have a pending withdrawal
                                 </button>:
                                 configMinAmount > userData?.amountMade?<button
              className={cn(disabled && styles.btnDisabled, styles.btn)}
              disabled={disabled}
            >
              <Clock className={styles.btnIcon} />
              Minimum Not Reached
            </button>
            :
            <button className="bg-blue-900 py-5 px-[30px] text-white w-full mt-5 rounded-md" onClick={()=>setuserWithdralForm(true)}>
            
              Request For Withdrawal
            </button>}
          </div>
          {/* Recent Activity */}
          <div className={styles.activitySection}>
            {/* <div className={styles.activityHeader}>
              <h3 className={styles.activityTitle}>Recent Activity</h3>
              <button className={styles.btnGhost}>View All</button>
            </div> */}

             
          </div>
          {/* <div className={styles.couponSummary}>
            <div>
              <h3 className="py-2">$156.80</h3>
              <p>Total Earned</p>
            </div>
            <div>
              <h3 className="py-2">$12.00</h3>
              <p>Pending Withdrawal</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

// ========== SERVER SIDE PROPS ==========

export async function getServerSideProps() {
  await connectDB();

  const users = await Register.find({}).lean();
   

  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
     
    },
  };
}

