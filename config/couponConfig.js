 export const couponPlans = [
    {
      name: "Bronze Pack",
      priceDollar: "$5",
      priceNaira: "₦500",
      features: [
        "3 quiz attempt",
        "Valid for 7 days", 
        "2x earning rate",
        "Standard earning rate",
        "Email support",
      ],
      buttonStyle: "planButtonBronze",
      popular: false,
      gameLimit:3,
      validDays: 7,
      earningRate:2

    },
    {
      name: "Silver Pack",
      priceDollar: "$10",
      priceNaira: "₦1000",
      features: [
        "5 quiz attempt",
        "Valid for 14 days",
        "4x earning rate",
        "Priority Support",
        "Bonus Challenges",
      ],
      buttonStyle: "planButtonSilver",
      popular: true, // has badge "Most Popular"
      badgeText: "Most Popular",
       gameLimit:5,
      validDays: 14,
      earningRate:4
    },
    {
      name: "Gold Pack",
      priceNaira: "₦2000",
      priceDollar: "$20",
      features: [
        "50 quiz attempt",
        "Valid for 30 days",
        "6x earning rate",
        "VIP Support",
        "Exclusive Quizzes",
        "Weekly Bonuses",
      ],
      buttonStyle: "planButtonBronze",
      popular: false, 
      gameLimit:50,
      validDays: 30,
      earningRate:6
      
      
    },
  ];