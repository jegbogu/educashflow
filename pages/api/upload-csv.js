import formidable from "formidable";
import fs from "fs/promises";
import { parse } from "csv-parse/sync";
import connectDB from "../../utils/connectmongo.js";
import Quiz from "../../model/quizCreation.js";

export const config = {
  api: { bodyParser: false }, // IMPORTANT: let formidable parse multipart
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, flds, fls) => (err ? reject(err) : resolve({ fields: flds, files: fls })));
    });

    // ---- Normalize file object across formidable versions ----
    let uploaded = files?.file;
    if (Array.isArray(uploaded)) uploaded = uploaded[0];

    // v3: .filepath ; v2: .path
    const filepath = uploaded?.filepath || uploaded?.path;

    if (!filepath) {
      // Return what we actually got to help debug
      return res.status(400).json({
        message: "No file uploaded",
        debug: {
          hasFiles: !!files,
          keys: files ? Object.keys(files) : [],
          fileRaw: uploaded || null,
        },
      });
    }

    const buf = await fs.readFile(filepath);
    const text = buf.toString("utf8");

    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (!records.length) {
      return res.status(400).json({ message: "Empty CSV" });
    }

    const docs = [];
    const errors = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNum = i + 1;

      const question = (row.question || "").trim();
      const category = (row.category || "Science").trim();
      const subcategory = (row.subcategory || "Biology").trim();
      const level = (row.level || "Advanced").trim();
      const caRaw = row.correctAnswer;

      // Build options (supports single "options" or optionA..D)
      let options = null;
      if (row.options && row.options.trim()) {
        const raw = row.options.trim();
        // JSON array first
        if ((raw.startsWith("[") && raw.endsWith("]")) || raw.includes('"')) {
          try {
            const parsedArr = JSON.parse(raw);
            if (Array.isArray(parsedArr)) options = parsedArr.map((x) => String(x).trim());
          } catch {}
        }
        if (!options) {
          options = raw.split(",").map((s) => s.trim()).filter(Boolean);
        }
      } else if (row.optionA || row.optionB || row.optionC || row.optionD) {
        options = [
          (row.optionA || "").trim(),
          (row.optionB || "").trim(),
          (row.optionC || "").trim(),
          (row.optionD || "").trim(),
        ];
      }

      if (!question) { errors.push({ row: rowNum, message: "Missing question" }); continue; }
      if (!options || options.length !== 4 || options.some((o) => !o)) {
        errors.push({ row: rowNum, message: "options must have exactly 4 non-empty values" }); continue;
      }

      const correctAnswer = Number(caRaw);
      if (!Number.isInteger(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
        errors.push({ row: rowNum, message: "correctAnswer must be an integer 0..3" }); continue;
      }

      docs.push({ question, category,subcategory, level, options, correctAnswer });
    }

    if (!docs.length) {
      return res.status(400).json({ message: "No valid rows in CSV", errors });
    }

    await connectDB();
    const result = await Quiz.insertMany(docs, { ordered: false });

    return res.status(200).json({
      message: "CSV uploaded successfully",
      rows_inserted: result.length,
      rows_failed: errors.length,
      errors,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err?.message || "Error uploading CSV" });
  }
}
