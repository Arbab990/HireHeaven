"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from "framer-motion";
import { BookOpen, Loader2 } from "lucide-react";

const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const LearnSkillsPage = () => {
  const [skill, setSkill] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBooksFromOpenLibrary = async (title) => {
    const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
    const data = await res.json();
    if (data.docs.length === 0) return null;

    const book = data.docs[0];
    return `https://openlibrary.org${book.key}`;
  };

  const handleSubmit = async () => {
    if (!skill.trim()) return setError("Please enter a skill.");

    setLoading(true);
    setSuggestions([]);
    setError("");

    try {
      const prompt = `
        Suggest 5 essential books someone should read to learn the skill: "${skill}".
        Format:
        **Books:**
        1. Title of Book 1
        2. Title of Book 2
        ...
      `;

      const result = await model.generateContent(prompt);
      const text = await result.response.text();

      const match = text.match(/\*\*Books:\*\*(.*)/s);
      const bookLines = match ? match[1].split(/\d+\.\s+/).filter(b => b.trim()) : [];
      const cleanTitles = bookLines.map((line) => line.split("\n")[0].trim());

      const bookLinks = await Promise.all(
        cleanTitles.map(async (title) => ({
          title,
          link: await fetchBooksFromOpenLibrary(title),
        }))
      );

      setSuggestions(bookLinks);
    } catch (err) {
      console.error("Gemini Error:", err);
      setError("Failed to get suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-white rounded-lg shadow-md p-6 space-y-6"
      >
        <h1 className="text-3xl font-bold text-indigo-600 flex items-center gap-2">
          <BookOpen /> Learn a New Skill
        </h1>

        <input
          type="text"
          placeholder="e.g., Machine Learning"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Getting Suggestions...
            </span>
          ) : (
            "Get Book Suggestions"
          )}
        </motion.button>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {suggestions.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
            <h2 className="text-xl font-semibold text-indigo-600">Suggested Books</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-800">
              {suggestions.map((book, idx) => (
                <li key={idx}>
                  {book.link ? (
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {book.title}
                    </a>
                  ) : (
                    book.title + " (Not found on Open Library)"
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LearnSkillsPage;

