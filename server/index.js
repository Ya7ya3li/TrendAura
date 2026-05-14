import express from "express";
import cors from "cors";
import aiRoute from "./routes/ai.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRoute);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});