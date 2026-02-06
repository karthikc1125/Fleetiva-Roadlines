import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AppContext);
  const role = localStorage.getItem("role");

  if (!user) return null;

  return (
    <nav style={{ padding: "10px 20px", background: "#111827", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to={role === "superadmin" ? "/superadmin" : role === "admin" ? "/admin" : role === "driver" ? "/driver" : "/"} style={{ color: "#fff", textDecoration: "none", fontWeight: "bold", fontSize: "1.2rem" }}>
          🚚 Logistics MS
        </Link>
        {role === "superadmin" && <Link to="/superadmin" style={{ color: "#fff", textDecoration: "none" }}>Company Management</Link>}
        {role === "superadmin" && <Link to="/superadmin/logs" style={{ color: "#fff", textDecoration: "none" }}>System Logs</Link>}
        {role === "customer" && <Link to="/post-load" style={{ color: "#fff", textDecoration: "none" }}>Post Load</Link>}
        {role === "driver" && <Link to="/post-truck" style={{ color: "#fff", textDecoration: "none" }}>Post Truck</Link>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Role: {role}</span>
        <button onClick={logout} style={{ background: "#ef4444", color: "#fff", border: "none", cursor: "pointer", padding: "5px 10px", borderRadius: "4px" }}>
          Logout
        </button>
      </div>
    </nav>
  );
}