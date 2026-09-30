import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";
const API_URL = import.meta.env.VITE_API_URL

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
   

  const form = e.target;
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
  form.classList.add("was-validated");
 setError("");
    setLoading(true);
    try {
      // const res = await fetch("http://localhost:8080/api/login", {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Sign in</h2>
      <p className="auth-subtitle">Enter your email and password to sign in</p>

      <form className="needs-validation" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="invalid-feedback">
            Please enter a valid email address.
          </div>
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
           <div className="invalid-feedback">
            
            Password must be at least 5 characters.
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="auth-footer">Don't have an account? <a href="/signup">Sign up</a></p>
      </form>
    </div>
  );
}