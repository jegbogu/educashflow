import connectDB from "../../utils/connectmongo";
import Quiz from "../../model/quizCreation";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
 

    const update = await Quiz.updateMany(
  {
    subcategory: { $in: ["Everyday Facts"] } // ✅ target both
  },
  {
    $set: {
      category: "General Knowledge",
      subcategory: "Everyday Facts",
      level: "Beginner"
    }
  }
);

    // Verify result
    const updatedDocs = await Quiz.find({ category: "General Knowledge" }).limit(100);


//      const data =  await Quiz.aggregate([
//   {
//     $group: {
//       _id: {
//         category: "$category",
//         subcategory: "$subcategory"
//       },
//       questionCount: { $sum: 1 }
//     }
//   },
//   {
//     $group: {
//       _id: "$_id.category",
//       totalQuestions: { $sum: "$questionCount" },
//       subcategories: {
//         $push: {
//           name: "$_id.subcategory",
//           count: "$questionCount"
//         }
//       }
//     }
//   },
//   {
//     $project: {
//       _id: 0,
//       category: "$_id",
//       totalQuestions: 1,
//       subcategories: 1
//     }
//   }
// ]);


const data = await Quiz.aggregate([
  // Step 1: group by category + subcategory + level
  {
    $group: {
      _id: {
        category: "$category",
        subcategory: "$subcategory",
        level: "$level"
      },
      count: { $sum: 1 }
    }
  },

  // Step 2: group levels under each subcategory
  {
    $group: {
      _id: {
        category: "$_id.category",
        subcategory: "$_id.subcategory"
      },
      levels: {
        $push: {
          level: "$_id.level",
          count: "$count"
        }
      },
      subcategoryTotal: { $sum: "$count" }
    }
  },

  // Step 3: group subcategories under category
  {
    $group: {
      _id: "$_id.category",
      totalQuestions: { $sum: "$subcategoryTotal" },
      subcategories: {
        $push: {
          name: "$_id.subcategory",
          total: "$subcategoryTotal",
          levels: "$levels"
        }
      }
    }
  },

  // Step 4: clean output
  {
    $project: {
      _id: 0,
      category: "$_id",
      totalQuestions: 1,
      subcategories: 1
    }
  }
]);

    return res.status(200).json({
      message: "Update successful",
      data:data,
      updatedDocs:updatedDocs
      
    });
    // return res.status(200).json({
    //   message: "Update successful",
    //   modifiedCount: update.modifiedCount,
    //   sample: updatedDocs,
    // });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}