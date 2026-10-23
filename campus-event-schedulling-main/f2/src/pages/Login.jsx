import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    if (email === "admin@campusconnect.com" && password === "Admin@123") {
      sessionStorage.setItem("demoRole", "admin");
      navigate("/admin");
    } else {
      sessionStorage.setItem("demoEmail", email);
      sessionStorage.setItem("demoRole", "student");
      navigate("/");
    }
  }

  return (
    <section className="form-card">
      <h1>Login</h1>
      <form onSubmit={submit}>
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="button">Login</button>
      </form>
      <p>New student? <Link to="/register">Create an account</Link></p>
      <p className="muted">Demo admin: admin@campusconnect.com / Admin@123</p>
     
    
    </section>
  );
}