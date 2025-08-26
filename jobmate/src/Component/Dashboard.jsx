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
} from "@mui/material";
import { setApplications } from "../Redux/jobApplicationsSlice";

export default function UserApplications() {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    status: "applied",
  });

  const [editId, setEditId] = useState(null); // لتحديد الـ id اللي بنعدله

  const applications = useSelector(
    (state) => state.jobApplications.applications
  );
  const dispatch = useDispatch();

  // READ
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "jobApplications"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setApplications(apps));
    });

    return () => unsubscribe();
  }, [dispatch]);

  // CREATE + UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : null;

    if (editId) {
      // UPDATE
      const appRef = doc(db, "jobApplications", editId);
      await updateDoc(appRef, {
        ...formData,
      });
      setEditId(null);
    } else {
      // CREATE
      await addDoc(collection(db, "jobApplications"), {
        ...formData,
        userId: user.uid,
        username: userData ? userData.username : user.email || "Unknown",
        createdAt: serverTimestamp(),
      });
    }

    setFormData({ company: "", position: "", status: "applied" });
  };

  // DELETE
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "jobApplications", id));
  };

  // FILL FORM FOR EDIT
  const handleEdit = (app) => {
    setFormData({
      company: app.company,
      position: app.position,
      status: app.status,
    });
    setEditId(app.id);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Job Applications
      </Typography>

      {/* FORM */}
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
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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

      {/* TABLE */}
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
  );
}
