import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/explain", async (req, res) => {
  const { gen, best, avg } = req.body;

  const prompt = `
Explain these evolution stats in simple human language.

Generation: ${gen}
Best fitness: ${best}
Average fitness: ${avg}

Give insight like a scientist.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  res.json({ text: response.choices[0].message.content });
});

app.listen(3001, () => console.log("AI server running on 3001"));
