// config/quizConfig.js

export const quizConfig = {
  categories: [
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
    }
  ],
  levels: ["Beginner", "Intermediate", "Advanced"],
  perQuestionTime: 8,
  perQuestionPoint:5,
  basicPointPerQuestion: 10, //2x earning
  premiumPointPerQuestion: 20, //4x earning
  proPointPerQuestion: 40, //8x earning


  perPoint: 0.002,
  constantNumberofQuestions:20,
  extraPointsBeginner:0, //Beginners get 0 extra points
  extraPointsIntermediate: 4, //Intermediate gets 4 extra points
  extraPointsAdvanced: 8 //Advanced get extra 8 points
};

 