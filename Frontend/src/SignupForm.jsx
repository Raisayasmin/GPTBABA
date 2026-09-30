import { useState } from "react";
import "./Form.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

 const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    

    const form = e.target;
    if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return; // stop here — don't call the API if fields are invalid
    }
    form.classList.add("was-validated");
    setError("");
    setLoading(true);
    try{
      const response = await axios({
        method : "POST",
        url :"http://localhost:8080/api/signup",
        data : {
           name : name,
        email : email,
        password : password
        },
        header : {
          "Content-Type": "application/json",
        }
       
      })
      console.log(response.data);

      navigate("/login");
      
      
    } catch(err){
      console.log("Err created : ",err);
      setError(err.response?.data?.message || "Something went wrong Please try again")
    } finally{
      setLoading(false);
    }
    
  };

  return (
    <div className="auth-card">
      <h2>Create an account</h2>
      <p className="auth-subtitle">Enter your information below to create your account</p>

      <form className="needs-validation" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Full Name</label>
          <input id="name" type="text" placeholder="Write your Full Name here" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="invalid-feedback">
        Please choose a username.
      </div>
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Write your email here" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="invalid-feedback">
            Please enter a valid email address.
          </div>
        </div>


        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" placeholder="write your password here" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required  minLength={5}/>
          
          <div className="invalid-feedback">
            
            Password must be at least 5 characters.
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="btn-primary" type="submit" disabled={loading}>{(loading ? "Creating Account" : "Create Account")}</button>

        <p className="auth-footer">Already have an account? <a href="/login">Sign in</a></p>
      </form>
    </div>
  );
}