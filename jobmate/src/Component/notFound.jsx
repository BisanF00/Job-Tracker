import { Link } from "react-router-dom";
import { BiError } from "react-icons/bi";
import { IoArrowBackSharp } from "react-icons/io5";
import { Box, Typography, Button, Paper } from "@mui/material";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "linear-gradient(135deg, #1e3c72, #2a5298)",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 6,
          textAlign: "center",
          borderRadius: 4,
          maxWidth: 500,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(6px)",
          color: "white",
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{ color: "#ff4d4d", fontWeight: "bold", mb: 2 }}
        >
          <BiError style={{ verticalAlign: "middle", marginRight: 10 }} />
          404
        </Typography>

        <Typography variant="h6" sx={{ mb: 4, color: "#e0e0e0" }}>
          Oops! The page you're looking for does not exist.
        </Typography>

        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          color="error"
          startIcon={<IoArrowBackSharp />}
          sx={{
            borderRadius: "30px",
            px: 3,
            py: 1.5,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Back To Home
        </Button>
      </Paper>
    </Box>
  );
}
