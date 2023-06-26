import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import LoginComponent from './Components/loginPage/loginComponent';
import CustomerPage from "./Components/customerPage/CustomerPage";
import EngineerPage from "./Components/engineerPage/EngineerPage";
import AdminPage from "./Components/adminPage/AdminPage";
import AuthError from "./Components/ErrorPage/AuthError";


function App() {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginComponent />}></Route>
        <Route path="/CUSTOMER" element={<CustomerPage />}></Route>
        <Route path="/ENGINEER" element={<EngineerPage />}></Route>
          <Route path="/ADMIN" element={<AdminPage />}></Route>
          <Route path="/Error" element={<AuthError/>}></Route>
      </Routes>
    
        
      </BrowserRouter>
    </div>
  )
}

export default App;
