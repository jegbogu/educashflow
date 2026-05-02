// config/quizConfig.js

export const quizConfig = {
  categories:  [
  { name: "General Knowledge", subcategories: ["Everyday Facts"] },
  { name: "English", subcategories: ["Fundamentals of English Language"] },
  { name: "Math", subcategories: ["General Mathematics"] },
  { name: "Programming", subcategories: ["Software Development"] },
  { name: "Science", subcategories: ["Fundamentals of Science"] },
  { name: "Geography", subcategories: ["Fundamentals of Geography"] },
  { name: "GMAT", subcategories: ["Quantitative Reasoning"] },
  { name: "Commerce And Accounting", subcategories: ["Fundamentals of Commerce And Accounting"] },
  { name: "Sociology And Economics", subcategories: ["Fundamentals of Sociology And Economics"] },
  { name: "Astrology", subcategories: ["Fundamentals of Astrology"] }
],
  levels: ["Beginner", "Intermediate", "Advanced"],
  perQuestionTime: 12,
  perQuestionPoint:10,
  BronzePointPerQuestion: 10, //2x earning
  SilverPointPerQuestion: 20, //4x earning
  proPointPerQuestion: 40, //8x earning

  minimumAmount: 3.00, //Minimum Amount before you can ask for withdrawal
  minimumAmountNaira: 1500, //Minimum Amount before you can ask for withdrawal

  minUserCanWithdraw :1,
  minUserCanWithdrawNaira :1000,

  maxUserCanWithdraw: 10,
  maxUserCanWithdrawNaira: 5000,

  perPoint: 0.02, //Standard earning

  constantNumberofRandomQuestions:10,
  extraPointsBeginner:0, //Beginners get 0 extra points
  extraPointsIntermediate: 4, //Intermediate gets 4 extra points
  extraPointsAdvanced: 8 //Advanced get extra 8 points
};

 