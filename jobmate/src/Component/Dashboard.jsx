import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { setApplications } from "../Redux/jobApplicationsSlice";
import ChatBox from "./OpenAi/ChatBox";
import { FiMessageSquare } from "react-icons/fi";

export default function UserApplications() {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "applied",
  });

  const [showChatBox, setShowChatBox] = useState(false);
  const [editId, setEditId] = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const [stats, setStats] = useState({
    applied: 0,
    interview: 0,
    rejected: 0,
    hired: 0,
  });

  const applications = useSelector(
    (state) => state.jobApplications.applications
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "jobApplications"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || null,
        };
      });
      dispatch(setApplications(apps));

      const newStats = {
        applied: apps.filter((a) => a.status === "applied").length,
        interview: apps.filter((a) => a.status === "interview").length,
        rejected: apps.filter((a) => a.status === "rejected").length,
        hired: apps.filter((a) => a.status === "hired").length,
      };
      setStats(newStats);

      fetchAiSummary(newStats);
    });

    return () => unsubscribe();
  }, [dispatch]);

  async function fetchAiSummary(stats) {
    try {
      const res = await fetch("http://localhost:5001/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `
            Based on these job stats, create a short motivational summary:

            Applied: ${stats.applied}
            Interview: ${stats.interview}
            Rejected: ${stats.rejected}
            Hired: ${stats.hired}
          `,
        }),
      });

      if (!res.ok) throw new Error("AI service unavailable");

      const data = await res.json();
      setAiSummary(data.reply || "No motivational summary available.");
    } catch (err) {
      console.log("Error fetching AI insight:", err);
      setAiSummary("Unable to fetch AI summary at this time.");
    }
  }

  const cardColors = {
    applied: "#2196f3",
    interview: "#ff9800",
    rejected: "#f44336",
    hired: "#4caf50",
  };

  const cardStyle = (color) => ({
    textAlign: "center",
    minWidth: "120px",
    padding: "20px",
    color: "#fff",
    backgroundColor: color,
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : null;

    if (editId) {
      const appRef = doc(db, "jobApplications", editId);
      await updateDoc(appRef, {
        ...formData,
      });
      setEditId(null);
    } else {
      await addDoc(collection(db, "jobApplications"), {
        ...formData,
        userId: user.uid,
        username: userData ? userData.username : user.email || "Unknown",
        createdAt: serverTimestamp(),
      });
    }

    setFormData({ company: "", position: "", status: "applied" });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "jobApplications", id));
  };

  const handleEdit = (app) => {
    setFormData({
      company: app.company,
      position: app.position,
      status: app.status,
    });
    setEditId(app.id);
  };

  return (
    <>
      <Box sx={{ p: 4 }}>
        <Grid
          container
          spacing={2}
          sx={{ mb: 3, display: "flex", justifyContent: "center" }}
        >
          <Grid item>
            <Card sx={cardStyle(cardColors.applied)}>
              <Typography variant="h6">Applied</Typography>
              <Typography variant="h5">{stats.applied}</Typography>
            </Card>
          </Grid>
          <Grid item>
            <Card sx={cardStyle(cardColors.interview)}>
              <Typography variant="h6">Interview</Typography>
              <Typography variant="h5">{stats.interview}</Typography>
            </Card>
          </Grid>
          <Grid item>
            <Card sx={cardStyle(cardColors.rejected)}>
              <Typography variant="h6">Rejected</Typography>
              <Typography variant="h5">{stats.rejected}</Typography>
            </Card>
          </Grid>
          <Grid item>
            <Card sx={cardStyle(cardColors.hired)}>
              <Typography variant="h6">Hired</Typography>
              <Typography variant="h5">{stats.hired}</Typography>
            </Card>
          </Grid>
        </Grid>

        {aiSummary && (
          <Card sx={{ backgroundColor: "#e3f2fd", p: 2, mb: 5 }}>
            <CardContent>
              <Typography variant="h6">Motivational Summary</Typography>
              <Typography variant="body1">{aiSummary}</Typography>
            </CardContent>
          </Card>
        )}

        <Typography variant="h5" gutterBottom>
          My Job Applications
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mb: 3, display: "flex", gap: 2 }}
        >
          <TextField
            label="Company"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            required
          />
          <TextField
            label="Position"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            required
          />
          <TextField
            select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <MenuItem value="applied">Applied</MenuItem>
            <MenuItem value="interview">Interview</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="hired">Hired</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary">
            {editId ? "Update" : "Add"}
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Company</TableCell>
                <TableCell sx={{ color: "white" }}>Position</TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
                <TableCell sx={{ color: "white" }}>Created At</TableCell>
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.company}</TableCell>
                    <TableCell>{app.position}</TableCell>
                    <TableCell>{app.status}</TableCell>
                    <TableCell>
                      {app.createdAt?.toDate
                        ? app.createdAt.toDate().toLocaleString()
                        : ""}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleEdit(app)}
                        variant="outlined"
                        color="warning"
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(app.id)}
                        variant="outlined"
                        color="error"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No applications yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <button
        onClick={() => setShowChatBox(!showChatBox)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#1976d2",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          color: "white",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        <FiMessageSquare />
      </button>

      {showChatBox && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "350px",
            height: "500px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ChatBox />
        </div>
      )}
    </>
  );
}
