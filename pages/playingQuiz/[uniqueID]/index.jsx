import connectDB from "@/utils/connectmongo";
import Quiz from "@/model/quizCreation";
import Playingrealquiz from "@/components/realQuiz/playingrealquiz";

/**
 * URL shape produced earlier:
 *   /playingQuiz/{uuid}-{subcategory}-{category}-{level}-{userId}
 * 
 * We parse from the RIGHT so hyphens inside the uuid (or names) don't break parsing.
 * If your sub/category/level themselves can contain hyphens, encode them before building
 * the URL, and decode here with decodeURIComponent.
 */

export default function UniqueQuiz({ createdID, subcategory, category, level, userID, questions }) {
  return (
    <div>
      <Playingrealquiz 
        createdID={createdID}
        subcategory={subcategory}
        category={category}
        level={level}
        userID={userID}
        questions={questions}
      />
    </div>
  );
}


export async function getServerSideProps(ctx) {
  try {
    const { uniqueID } = ctx.params ?? {};
    if (!uniqueID) {
      return { notFound: true };
    }

    // Parse from the right to handle hyphens in UUID safely
    const parts = uniqueID.split("-");
    if (parts.length < 5) {
      // Bad URL format
      return { notFound: true };
    }

    const userID = parts.pop();                 // last piece
    const level = decodeURIComponent(parts.pop());
    const category = decodeURIComponent(parts.pop());
    const subcategory = decodeURIComponent(parts.pop());
    const createdID = parts.join("-");          // remaining (uuid or whatever)

    await connectDB();

    // Pull all questions for this subcategory/category/level
    const all = await Quiz.find(
      { subcategory, category, level },
      { question: 1, options: 1, correctAnswer: 1 } // only what you need
    ).lean();

    if (!all || all.length === 0) {
      return { notFound: true };
    }

    // Pick 5 pseudo-random, no-repeat
    const pickFiveRandom = (arr) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy.slice(0, Math.min(5, copy.length));
    };

    const randomFive = pickFiveRandom(all);
    

    return {
      props: {
        createdID,
        userID,
        subcategory,
        category,
        level,
        // serialize for Next
        questions: randomFive.map((q) => ({
          _id: String(q._id ?? ""),
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        })),
      },
    };
  } catch (err) {
    console.error("SSR error:", err);
    // Fail closed (don’t crash the build)
    return { props: { createdID: null, subcategory: "", category: "", level: "", userID: "", questions: [] } };
  }
}
