"use client";

import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from "framer-motion";

const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const gnewsApiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY;

const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://gnews.io/api/v4/search?q=technology&token=${gnewsApiKey}`
        );
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const filterNews = async () => {
      if (articles.length === 0) return;

      const prompt = `
        Filter the following news articles and return only those related to technology or jobs. Provide the titles and links.

        ${articles
          .map((article, index) => `${index + 1}. ${article.title} - ${article.url}`)
          .join("\n")}
      `;

      try {
        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();

        const filtered = articles.filter((article) =>
          responseText.includes(article.title)
        );

        setFilteredArticles(filtered);
      } catch (error) {
        console.error("Error filtering news with Gemini:", error);
      }
    };

    filterNews();
  }, [articles]);

  if (loading) {
    return <div className="p-6">Loading news...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Latest Tech & Job News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((article, index) => (
          <motion.a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            className="block p-4 border rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p className="text-gray-600">{article.description}</p>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
