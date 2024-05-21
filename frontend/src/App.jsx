import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Login from './pages/login/Login';
import Home from "./pages/home/Home";
import SignUp from './pages/signup/SignUp';

function App() {
  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} /> 
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
