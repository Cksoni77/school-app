import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./Login.css";   // ✅ add this back

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/generate-token", form);

    const authHeader = res.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    let role = res.data.role;
    console.log("ROLE FROM BACKEND:", role);

    if (token) {
      sessionStorage.setItem("token", token);

      // 🔥 FIX: remove ROLE_
      role = role.replace("ROLE_", "");
      sessionStorage.setItem("role", role);

      console.log("CLEAN ROLE:", role);

      // ✅ redirect works now
      if (role === "STUDENT") {
        navigate("/student");
      } else if (role === "ADMIN") {
        navigate("/home");
      }

    } else {
      alert("Token not received");
    }

  } catch (err) {
    console.error(err);
    alert("Invalid credentials");
  }
};

  return (
    <div className="login-container">   {/* ✅ wrapper */}
      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            name="username"   // ✅ important
            placeholder="Username"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            className="input"
          />

          <input
            type="password"
            name="password"   // ✅ important
            placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="input"
          />

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;