import { useState } from "react";
import { chat } from "../AI/Api";
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Typography,
  Container
} from "@mui/material";

export default function ResumeHelper() {
  const [resumeText, setResumeText] = useState("");
  const [grammar, setGrammar] = useState([]);
  const [points, setPoints] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!resumeText.trim()) return;

    setLoading(true);
    setGrammar([]);
    setPoints([]);
    setKeywords([]);

    const prompt = `
      Analyze the following resume and provide your response in JSON format:
      {
        "grammar": ["fix 1", "fix 2", ...],
        "points": ["strong/weak point 1", "strong/weak point 2", ...],
        "keywords": ["keyword1", "keyword2", ...]
      }

      Resume text:
      ${resumeText}
    `;

    try {
      const result = await chat([{ role: "user", content: prompt }]);
      const cleaned = result.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      setGrammar(parsed.grammar || []);
      setPoints(parsed.points || []);
      setKeywords(parsed.keywords || []);
    } catch (err) {
      console.log(err);
      setGrammar(["Error analyzing resume."]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Resume Helper
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={8}
        label="Paste your resume here..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleAnalyze}
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </Button>

      {grammar.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardHeader title="Grammar Improvements" />
          <CardContent>
            <List>
              {grammar.map((item, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {points.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardHeader title="Strong / Weak Points" />
          <CardContent>
            <List>
              {points.map((item, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {keywords.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardHeader title="Suggested Keywords" />
          <CardContent>
            <List>
              {keywords.map((item, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}


