 export const couponPlans = [
    {
      name: "Bronze Pack",
      price: "$0.37 || N500",
      features: [
        "10 quiz attempt",
        "Valid for 7 days", 
        "2x earning rate",
        "Standard earning rate",
        "Email support",
      ],
      buttonStyle: "planButtonBronze",
      popular: false,
      gameLimit:10,
      validDays: 7,
      earningRate:2

    },
    {
      name: "Silver Pack",
      price: "$10 || 1000",
      features: [
        "25 quiz attempt",
        "Valid for 14 days",
        "4x earning rate",
        "Priority Support",
        "Bonus Challenges",
      ],
      buttonStyle: "planButtonSilver",
      popular: true, // has badge "Most Popular"
      badgeText: "Most Popular",
       gameLimit:25,
      validDays: 14,
      earningRate:4
    },
    {
      name: "Gold Pack",
      price: "$20 || 2000",
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