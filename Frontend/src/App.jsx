import React from 'react';
import './App.css';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import SignUp from './Pages/SignUp';
import Dashboard from './Pages/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/LoginPage' element={<LoginPage/>}/>
        <Route path='/SignUp' element={<SignUp/>}/>
        <Route path='/Dashboard' element={<Dashboard/>}/>
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
