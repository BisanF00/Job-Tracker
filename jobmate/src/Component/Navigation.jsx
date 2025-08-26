import { NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FileTextOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import "./styles/navigation.css"

export default function Navigation() {

  const items = [
    {
      label: <NavLink to="/dashboard">Job Application</NavLink>,
      key: "dashboard",
      icon: <FileTextOutlined />,
    },
    {
      label: <NavLink to="/profile"><CgProfile style={{marginTop:"15"}} size={30} /></NavLink>,
      key: "profile",
    },
  ];

  return (
    <Menu
      mode="horizontal"
      theme="dark"
      items={items}
      style={{
        display: "flex",
        justifyContent: "flex-end",
        flex: 1,
        border: "none",
      }}
    />
  );
}