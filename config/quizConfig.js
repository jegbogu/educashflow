// config/quizConfig.js

export const quizConfig = {
  categories: [
     {
    name: "Commerce",
    subcategories: ["Trade"]
  },
  {
    name: "Accounting",
    subcategories: ["Financial Statements"]
  },
  {
    name: "Astrology",
    subcategories: ["Zodiac Signs"]
  },
  {
    name: "Sociology",
    subcategories: ["Social Institutions"]
  },
  {
    name: "GMAT",
    subcategories: ["Quantitative Reasoning"]
  },
  {
      name: "Math",
      subcategories: ["Algebra", "Geometry", "Calculus", "Statistics"]
    },
  {
      name: "Science",
      subcategories: ["Physics", "Chemistry", "Biology", "Astronomy"]
    },
    {
      name: "History",
      subcategories: ["Ancient", "Medieval", "Modern", "World Wars"]
    },
    {
      name: "Programming",
      subcategories: ["JavaScript", "Python", "Java", "C++"]
    },
    {
      name: "English",
      subcategories: ["Grammar", "Vocabulary", "Literature", "Comprehension"]
    },
    {
      name: "Bible",
      subcategories: ["Old Testament", "New Testament", "Parables", "Prophets"]
    },
    {
      name: "Current Affairs",
      subcategories: ["Politics", "Economy", "Sports", "Technology"]
    },
    {
    name: "Geography",
    subcategories: ["Map Reading"]
  },
  {
    name: "Government",
    subcategories: ["Constitution"]
  },
  {
    name: "Civic Education",
    subcategories: ["Citizenship"]
  },
  {
    name: "Agricultural Science",
    subcategories: ["Crop Production"]
  },
  {
    name: "Fisheries",
    subcategories: ["Aquaculture"]
  },
  {
    name: "Economics",
    subcategories: ["Demand and Supply"]
  },
  {
    name: "Data Processing",
    subcategories: ["Data Storage"]
  },
  {
    name: "General Knowledge",
    subcategories: ["Everyday Facts"]
  },
  {
    name: "Sports",
    subcategories: ["Olympics"]
  }
 

  ],
  levels: ["Beginner", "Intermediate", "Advanced"],
  perQuestionTime: 12,
  perQuestionPoint:5,
  BronzePointPerQuestion: 10, //2x earning
  SilverPointPerQuestion: 20, //4x earning
  proPointPerQuestion: 40, //8x earning

  minimumAmount: 3.00, //Minimum Amount before you can ask for withdrawal
  minUserCanWithdraw :1,
  maxUserCanWithdraw: 10,
  perPoint: 0.002, //Standard earning

  constantNumberofQuestions:20,
  extraPointsBeginner:0, //Beginners get 0 extra points
  extraPointsIntermediate: 4, //Intermediate gets 4 extra points
  extraPointsAdvanced: 8 //Advanced get extra 8 points
};

 