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
          path='/login'
          element={<Login />}
        />
        <Route
          path='/register'
          element={<Register />}
        />
        <Route
          path='/users'
          element={<UserManagement />}
        />
      </Routes>
    </Router>
  );
};

export default App;
