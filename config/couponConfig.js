 export const couponPlans = [
    {
      name: "Basic Pack",
      price: "$9.99",
      features: [
        "10 quiz attempt",
        "Valid for 7 days", 
        "2x earning rate",
        "Standard earning rate",
        "Email support",
      ],
      buttonStyle: "planButtonBasic",
      popular: false,
      gameLimit:10,
      validDays: 7,
      earningRate:2

    },
    {
      name: "Premium Pack",
      price: "$19.99",
      features: [
        "25 quiz attempt",
        "Valid for 14 days",
        "4x earning rate",
        "Priority Support",
        "Bonus Challenges",
      ],
      buttonStyle: "planButtonPremium",
      popular: true, // has badge "Most Popular"
      badgeText: "Most Popular",
       gameLimit:25,
      validDays: 14,
      earningRate:4
    },
    {
      name: "Pro Pack",
      price: "$39.99",
      features: [
        "50 quiz attempt",
        "Valid for 30 days",
        "6x earning rate",
        "VIP Support",
        "Exclusive Quizzes",
        "Weekly Bonuses",
      ],
      buttonStyle: "planButtonBasic",
      popular: false, 
      gameLimit:50,
      validDays: 30,
      earningRate:6
      
      
    },
  ];