import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import { Layout as AntLayout } from "antd";

const { Header, Content, Footer } = AntLayout;

export default function Layout() {
  return (
    <AntLayout
      style={{
        minHeight: "100vh",
        backgroundImage:
          'url("https://media.istockphoto.com/id/475352876/photo/man-applying-for-a-job-on-the-internet.jpg?s=612x612&w=0&k=20&c=SQeciz8vqdGWu_KJoGC7yK8xmpBl69UewPtZSyWSrOI=")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header
        theme="dark"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 30px",
        }}
      >
        <h1 style={{ color: "#fff", margin: 0 }}>Job Mate</h1>
        <Navigation />
      </Header>

      <Content
        style={{
          padding: "30px",
          minHeight: "calc(100vh - 120px)",
          background: "rgba(255,255,255,0.9)",
        }}
      >
        <Outlet />
      </Content>

      <Footer style={{ textAlign: "center", padding: "0 30px" }}>
        © 2025 Job Mate
      </Footer>
    </AntLayout>
  );
}
