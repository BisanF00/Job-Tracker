import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Component/Register";
import Login from "./Component/Login";
import Layout from "./Component/Layout";
import Profile from "./Component/Profile";
import ProtectedRoute from "./Component/ProtectedRoute";
import AdminApplications from "./Component/Admin";
import UserApplications from "./Component/Dashboard";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Navigate } from "react-router-dom";
import NotFound from "./Component/notFound";
import ChatBox from "./Component/OpenAi/ChatBox";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        return <Navigate to="/" />;
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {/* <ChatBox /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserApplications />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminApplications />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
