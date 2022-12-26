import { Router } from "express";
import ScoreCard from "../models/ScoreCard.js";
import mongoose from "mongoose";

const router = Router();

const db = mongoose.connection;
const deleteDB2 = async () => {
  await ScoreCard.deleteMany({});
};
db.on("open", async () => {
  await deleteDB2();
});

const saveScorecard = async (name, subject, score, res) => {
  const existing = await ScoreCard.findOne({ name, subject });

  try {
    if (existing) {
      res.json({
        message: "Updating (" + name + "," + subject + "," + score + ")",
        card: 1,
      });
      return ScoreCard.updateOne({ name, subject, score });
    } else {
      const newScorecard = new ScoreCard({ name, subject, score });
      res.json({
        message: "Adding (" + name + "," + subject + "," + score + ")",
        card: 1,
      });
      return newScorecard.save();
    }
  } catch (e) {
    res.json({ message: "error", card: 0 });
  }
};

const findScorecard = async (type, target, res) => {
  let existing;
  let result = [];
  try {
    if (type == "name") {
      existing = await ScoreCard.find({ name: target });

      {
        existing.map((x) =>
          result.push(
            "Found card with name: (" +
              x.name +
              "," +
              x.subject +
              "," +
              x.score +
              ")"
          )
        );
      }
    } else {
      existing = await ScoreCard.find({ subject: target });

      {
        existing.map((x) =>
          result.push(
            "Found card with subject: (" +
              x.name +
              "," +
              x.subject +
              "," +
              x.score +
              ")"
          )
        );
      }
    }

    if (result.length > 0) res.json({ messages: result, message: 1 });
    else {
      result.push(type + " " + target + " " + "not found!");
      res.json({ messages: result, message: 0 });
    }
  } catch (e) {
    res.json({ message: "error", card: 0 });
  }
};

const deleteDB = async () => {
  try {
    await ScoreCard.deleteMany({});
  } catch (e) {}
};

router.delete("/cards", (req, res) => {
  deleteDB();
  res.json({ message: "Database cleared" });
});

router.post("/card", (req, res) => {
  let name = req.body.name;
  let subject = req.body.subject;
  let score = req.body.score;

  saveScorecard(name, subject, score, res);
});

router.get("/cards", (req, res) => {
  findScorecard(req.query.type, req.query.queryString, res);
});

router.get("/health", (_, res) => {
  res.send("<h1>Terry is fucking handsome!</h1>");
});

export default router;
