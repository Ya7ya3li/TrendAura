import express from "express";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email } = req.body;
  res.json({ userId: email, token: "demo-token" });
});

export default router;