import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const firebaseErrorMessages = {
    "auth/email-already-in-use": "This email is already registered",
    "auth/invalid-email": "Please enter a valid email address",
    "auth/weak-password": "Password must be at least 6 characters",
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/too-many-requests": "Too many attempts. Try again later",
    "auth/user-disabled": "This account has been disabled",
  };

  const handleRegister = async (e) => {
    setLoading(true);

    try {
      const userCredtianls = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredtianls.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username,
        email,
        role: "user",
        createdAt: new Date(),
      });

      Swal.fire("Success!", "Registration Successful", "success");
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
    navigate("/");
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
          Create Account
        </Title>
        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>

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
            rules={[
              {
                required: true,
                min: 6,
                message: "Password must be at least 6 characters",
              },
            ]}
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
              Register
            </Button>
          </Form.Item>
        </Form>

        <Text style={{ textAlign: "center", display: "block" }}>
          Already have an account?{" "}
          <Link to="/" className="text-blue-600">
            Login
          </Link>
        </Text>
      </Card>
    </div>
  );
}
