import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import UserManagement from "./UserManagement";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={<Register />}
        />
        <Route
          path='https://user-auth-management-backend.onrender.com/api/login'
          element={<Login />}
        />
        <Route
          path='https://user-auth-management-backend.onrender.com/api/register'
          element={<Register />}
        />
        <Route
          path='https://user-auth-management-backend.onrender.com/api/users'
          element={<UserManagement />}
        />
      </Routes>
    </Router>
  );
};

export default App;
