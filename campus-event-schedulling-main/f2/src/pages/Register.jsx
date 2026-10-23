import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    sessionStorage.setItem("demoName", name);
    sessionStorage.setItem("demoEmail", email);
    sessionStorage.setItem("demoRole", "student");
    navigate("/");
  }

  return (
    <section className="form-card">
      <h1>Create Account</h1>
      <form onSubmit={submit}>
        <label>Full Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength="6" required />
        <button className="button">Register</button>
      </form>
      <p>Already registered? <Link to="/login">Login</Link></p>
    </section>
  );
}