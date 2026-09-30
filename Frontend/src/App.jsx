import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatLayout from "./ChatLayout.jsx";
import SignupForm from "./SignupForm.jsx";
import LoginPage from "./LoginForm.jsx";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatLayout />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginPage />} />
       
      </Routes>
    </BrowserRouter>
  )
}

export default App;
