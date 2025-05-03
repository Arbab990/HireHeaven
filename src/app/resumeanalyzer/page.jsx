"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Tesseract from "tesseract.js";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const ResumeAnalyzerPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState({ summary: "", rating: "", keyPoints: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setError("");
    } else {
      setSelectedFile(null);
      setError("Invalid file type! Please upload a PNG or JPG image.");
    }
  };

  const parseGeminiResponse = (responseText) => {
    try {
      const summaryMatch = responseText.match(/\*\*Summary:\*\*(.*?)(?=\*\*Key Points:\*\*)/s);
      const summary = summaryMatch ? summaryMatch[1].trim().replace(/\n/g, " ") : "No summary available.";

      const keyPointsMatch = responseText.match(/\*\*Key Points:\*\*(.*?)(?=\*\*Rating:\*\*)/s);
      const keyPoints = keyPointsMatch ? keyPointsMatch[1].split(/\d\.\s*/).map(p => p.trim()).filter(p => p.length > 3) : ["No key points available."];

      const ratingMatch = responseText.match(/\*\*Rating:\*\*\s*(\w+)/);
      const rating = ratingMatch ? ratingMatch[1] : "Not Rated";

      return { summary, rating, keyPoints };
    } catch (err) {
      console.error("Parse Error:", err);
      return { summary: "Could not parse summary.", rating: "Not Rated", keyPoints: ["Parsing failed"] };
    }
  };

  const analyzeResume = async () => {
    if (!selectedFile) return setError("Please upload a resume image first!");

    setLoading(true);
    setError("");

    try {
      const ocrResult = await Tesseract.recognize(selectedFile, "eng");
      const extractedText = ocrResult.data.text;

      const prompt = `
        Resume Analysis:

        Summary: Provide a concise 2-3 sentence summary of the applicant's qualifications.

        Key Points: List 3 notable strengths or achievements from the resume.

        Rating: Evaluate the overall resume quality in one word (Excellent, Good, Average, Poor).

        Resume Text:
        ${extractedText}
      `;

      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();

      const parsedResult = parseGeminiResponse(responseText);
      setAnalysisResult(parsedResult);
    } catch (err) {
      console.error("Gemini error:", err);
      setError("Failed to analyze resume. Try again later.");
      setAnalysisResult({ summary: "", rating: "", keyPoints: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-xl shadow-lg"
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <h1 className="text-3xl text-white font-bold text-center flex items-center justify-center gap-2">
            <FileText className="w-6 h-6" /> Resume Analyzer
          </h1>
        </div>

        <div className="p-6 space-y-6">
          <label className={`block w-full h-48 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center text-center transition-all duration-300 ${selectedFile ? 'border-green-300 bg-green-50 hover:bg-green-100' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}>
            <div>
              <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{selectedFile ? `Selected: ${selectedFile.name}` : "Upload PNG or JPG resume"}</p>
              <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleFileUpload} />
            </div>
          </label>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={analyzeResume}
            disabled={loading || !selectedFile}
            className={`w-full py-3 rounded-lg text-white font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'} ${!selectedFile && 'opacity-50'}`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
              </div>
            ) : (
              "Analyze Resume"
            )}
          </motion.button>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg"
              >
                <AlertTriangle className="inline w-5 h-5 mr-2" /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {(analysisResult.summary || analysisResult.rating || analysisResult.keyPoints.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4"
            >
              <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                <CheckCircle2 className="text-green-500 w-6 h-6" /> Analysis Result
              </h2>
              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold text-gray-700">Summary</h3>
                  <p className="text-gray-600">{analysisResult.summary}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Rating</h3>
                  <p className="text-gray-600">{analysisResult.rating}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Key Points</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {analysisResult.keyPoints.map((point, idx) => (
                      <motion.li key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.1 }}>{point}</motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeAnalyzerPage;
