import { BrowserRouter as Router, Route , Routes } from "react-router-dom";
// import './App.css';

import Home from "./pages/home";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import Nopage from "./pages/Nopage";
import About from "./Components/About";
import ChatPage from "./pages/chatroom";
import ForgetPass from "./pages/ForgetPass";
import ResetPassword from "./Components/ResetPass";
import Navbar from "./Components/Navbar";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // For Bootstrap JS
import ContactPage from "./pages/Contact";




function App() {
  return (

    // Navbar 
    <Router>
      <Navbar/>
      <Routes>
        <Route  index element={<Home/>}/>
        <Route  path="/login"  element={<LoginPage/>}/>
        <Route  path="/register"  element={<RegisterPage/>}/>
        <Route  path="/chat"  element={<ChatPage/>}/>
        <Route  path="/About"  element={<About/>}/>
        <Route  path="/contact"  element={<ContactPage/>}/>
        <Route  path="/forget-password"  element={<ForgetPass/>}/>
        <Route  path="/reset-password/:id"  element={<ResetPassword/>}/>
        <Route  path="*"  element={<Nopage/>}/>

    </Routes>
  </Router>

  );
}

export default App;


