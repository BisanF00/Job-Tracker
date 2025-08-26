import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { getDoc, doc } from "firebase/firestore";

const { Title, Text } = Typography;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const firebaseErrorMessages = {
    "auth/email-already-in-use": "This email is already registered",
    "auth/invalid-email": "Please enter a valid email address",
    "auth/weak-password": "Password must be at least 6 characters",
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/too-many-requests": "Too many attempts. Try again later",
    "auth/user-disabled": "This account has been disabled",
  };

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;

      if (!userData) throw new Error("User data not found");

      const role = userData.role || "user";

      Swal.fire("Welcome!", "Login successful", "success");
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const erroMsg = firebaseErrorMessages[error.code];
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: erroMsg,
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card
        style={{
          width: "30%",
          maxWidth: "28rem",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          borderRadius: "1rem",
        }}
      >
        <Title level={3} style={{ textAlign: "center" }}>
          Login
        </Title>
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                borderRadius: "0.5rem",
                width: "50%",
                display: "flex",
                justifySelf: "center",
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Text style={{ textAlign: "center", display: "block" }}>
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Sign Up
          </Link>
        </Text>
      </Card>
    </div>
  );
}
