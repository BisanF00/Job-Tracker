import { useState } from "react";
import { chat } from "../AI/Api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function JobDescription() {
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [skills, setSkills] = useState([]);
  const [suitability, setSuitability] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!jobDescriptionText.trim()) return;

    setLoading(true);
    setSkills([]);
    setSuitability(null);
    setKeywords([]);

    const prompt = `
      Analyze the following job description and return ONLY a valid JSON object.
      Do not include explanations or code blocks.
      
      JSON format example:
      {
        "skills": ["skill1", "skill2"],
        "keywords": ["keyword1", "keyword2"],
        "suitability": 85
      }

      Job description:
      ${jobDescriptionText}
    `;

    try {
      const result = await chat([{ role: "user", content: prompt }]);

      console.log("Raw AI result:", result);

      const cleanResult = result.replace(/```json|```/g, "").trim();

      const parsed = JSON.parse(cleanResult);

      setSkills(parsed.skills || []);
      setKeywords(parsed.keywords || []);
      setSuitability(parsed.suitability || 0);
    } catch (err) {
      console.error("Parsing error:", err);
      setSkills(["Error analyzing job description."]);
    } finally {
      setLoading(false);
    }
  }

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#d0ed57",
    "#a4de6c",
  ];

  const skillsData = skills.map((s) => ({ name: s, value: 1 }));
  const keywordsData = keywords.map((k) => ({ name: k, value: 1 }));

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      <h2>Job Description Analyzer</h2>

      <textarea
        placeholder="Paste your job description here..."
        value={jobDescriptionText}
        onChange={(e) => setJobDescriptionText(e.target.value)}
        rows={10}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          padding: "10px 15px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Analyzing..." : "Analyze job description"}
      </button>

      <div style={{ marginTop: "30px" }}>
        {suitability !== null && (
          <div style={{ marginBottom: "40px" }}>
            <h3>Suitability Rating</h3>
            <div
              style={{
                backgroundColor: "#e0e0e0",
                borderRadius: "10px",
                overflow: "hidden",
                height: "25px",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: `${suitability}%`,
                  backgroundColor:
                    suitability > 70
                      ? "#28a745"
                      : suitability > 40
                      ? "#ffc107"
                      : "#dc3545",
                  height: "100%",
                  textAlign: "center",
                  color: "white",
                  lineHeight: "25px",
                }}
              >
                {suitability}%
              </div>
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div style={{ marginBottom: "50px" }}>
            <h3>Required Skills</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={skillsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {keywords.length > 0 && (
          <div>
            <h3>Suggested Keywords</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={keywordsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name }) => name}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {keywordsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
