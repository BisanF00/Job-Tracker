import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Card, Typography, Button, Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function Profile() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));

        if (userDoc.exists()) {
          setUser({
            ...currentUser,
            username: userDoc.data().username,
            role: userDoc.data().role,
            // email: userDoc.data().email,
          });
        }
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!user) return <p className="text-center mt-20">Loading...</p>;

  const handleLogout = async () => {
    await signOut(auth); 
    navigate("/"); 
  };

  return (
    <div style={{display:"flex", justifyContent:"center", marginTop:50}}>
      <Card
        style={{ width: 400, textAlign:"center"}}
      >
        <Avatar
          size={150}
          icon={<UserOutlined />}
        />
        <Title level={3} style={{ fontSize:35}}>{user.username}</Title>
        <Text type="secondary" style={{ fontSize:20}}>
          {user.email}
        </Text>
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          block
          style={{ fontSize:15, marginTop:30}}
        >
          Logout
        </Button>
      </Card>
    </div>
  );
}
