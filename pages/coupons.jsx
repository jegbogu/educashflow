import React from "react";
import { useEffect, useState } from "react";
import Spinner from "@/components/icons/spinner";
import { cn } from "@/lib/utils";
import styles from "@/styles/userDashboard.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ShoppingCart, Star } from "lucide-react";
import Userheader from "@/components/UserDashboard/userheader";
import Usernavbar from "@/components/UserDashboard/usernavbar";

export default function Coupons() {
  const { data: session, status } = useSession();
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

  const couponPlans = [
    {
      name: "Basic Pack",
      price: "$9.99",
      features: [
        "10 quiz attempt",
        "Valid for 7 days",
        "Standard earning rate",
        "Email support",
      ],
      buttonStyle: "planButtonBasic",
      popular: false,
    },
    {
      name: "Premium Pack",
      price: "$19.99",
      features: [
        "25 quiz attempt",
        "Valid for 14 days",
        "2x earning rate",
        "Priority Support",
        "Bonus Challenges",
      ],
      buttonStyle: "planButtonPremium",
      popular: true, // has badge "Most Popular"
      badgeText: "Most Popular",
    },
    {
      name: "Pro Pack",
      price: "$39.99",
      features: [
        "50 quiz attempt",
        "Valid for 30 days",
        "4x earning rate",
        "VIP Support",
        "Exclusive Quizzes",
        "Weekly Bonuses",
      ],
      buttonStyle: "planButtonBasic",
      popular: false,
    },
  ];

  return (
    <div>
      <Userheader userData={userData} />
      <div className="p-5">
        <Usernavbar />
        <div className={styles.couponsPage}>
          {/* Coupon Management */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <ShoppingCart className={styles.sectionIcon} />
              <h2 className="section-title">Coupon Management</h2>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.currentCoupon}>
                <h3 className={styles.currentCouponTitle}>Current Coupon:</h3>
                <div className={styles.couponStatus}>
                  <div className={styles.couponInfo}>
                    <span className={styles.couponText}>
                      You are on a free plan buy a coupon to earn faster!
                    </span>
                  </div>
                  <div className={styles.couponQuizzes}>
                    <span className={styles.quizzesLeft}>0 quizzes left</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Coupon Plans */}
          <div className={styles.couponPlans}>
            <h2 className={styles.plansTitle}>Available Coupon Plans</h2>
            <div className={styles.plansGrid}>
              {couponPlans.map((plan, index) => (
                <div
                  key={index}
                  className={cn(
                    styles.planCard,
                    plan.popular && styles.planCardPopular, 'flex flex-col justify-between'
                  )}
                >
                  {plan.popular && (
                    <div className={styles.planBadge}><Star className="w-4 h-4" />{plan.badgeText}</div>
                  )}
                  <div>
                    <div className={styles.planHeader}>
                      <h3 className={styles.planName}>{plan.name}</h3>
                      <div className={styles.planPrice}>{plan.price}</div>
                    </div>
                    <div className={styles.planFeatures}>
                      {plan.features.map((feature, i) => (
                        <div key={i} className={styles.featureItem}>
                          <span className={styles.featureText}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    className={cn(styles.planButton, styles[plan.buttonStyle])}
                  >
                    <ShoppingCart className={styles.buttonIcon} />
                    Purchase
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
