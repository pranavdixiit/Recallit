// server/routes/stats.js
import express from "express";
import Card from "../models/Card.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to check JWT (simple version for demonstration)
const auth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.use(auth);

// Example: Get card statistics grouped by topic
router.get("/overview", async (req, res) => {
  const stats = await Card.aggregate([
    { $match: { owner: req.user.id } },
    {
      $group: {
        _id: "$topic",
        total: { $sum: 1 },
        due: {
          $sum: {
            $cond: [
              { $lte: ["$nextReview", new Date()] },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);
  res.json(stats);
});

export default router;
