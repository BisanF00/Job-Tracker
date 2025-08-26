import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setUserRole(null);
      } else {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        setUserRole(docSnap.exists() ? docSnap.data().role : "user");
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!userRole) return <Navigate to="/login" />;

  if (adminOnly && userRole !== "admin") return <Navigate to="/dashboard" />;

  return children;
}

