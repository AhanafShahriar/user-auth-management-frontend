import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./UserManagement.css";
import "bootstrap/dist/css/bootstrap.min.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loggedInUserName, setLoggedInUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://user-auth-management-backend.onrender.com/api/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.length === 0) {
          navigate("/register");
          return;
        }

        const user = jwtDecode(token);
        console.log("Decoded user:", user);

        if (user && user.blocked) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const currentUser = response.data.find((u) => u.id === user.id);
        if (currentUser) {
          setLoggedInUserName(currentUser.name || "User");
        } else {
          setLoggedInUserName("User");
        }

        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        navigate("/register");
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBlock = async () => {
    const token = localStorage.getItem("token");
    const userId = jwtDecode(token).id;

    if (selectedUsers.length === 0) {
      alert("No users selected");
      return;
    }

    try {
      await axios.post(
        "https://user-auth-management-backend.onrender.com/api/block",
        { userIds: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const isSelfBlocked = selectedUsers.includes(userId);

      if (isSelfBlocked) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedUsers.includes(user.id)
            ? { ...user, status: "blocked" }
            : user
        )
      );
      setSelectedUsers([]);
    } catch (err) {
      console.error("Error blocking users:", err);
      alert("Error blocking users. Please try again.");
    }
  };

  const handleUnblock = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not authorized. Please log in.");
      return;
    }

    const userId = jwtDecode(token).id;

    if (selectedUsers.length === 0) {
      alert("No users selected");
      return;
    }

    try {
      await axios.post(
        "https://user-auth-management-backend.onrender.com/api/unblock",
        { userIds: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedUsers.includes(user.id) ? { ...user, status: "active" } : user
        )
      );

      setSelectedUsers([]);

      const isSelfUnblocked = selectedUsers.includes(userId);
      if (isSelfUnblocked) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error unblocking users:", err);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const userId = jwtDecode(token).id;

    if (selectedUsers.length === 0) {
      alert("No users selected");
      return;
    }

    try {
      await axios.post(
        "https://user-auth-management-backend.onrender.com/api/delete",
        { userIds: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const isSelfDeleted = selectedUsers.includes(userId);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectedUsers.includes(user.id))
      );
      setSelectedUsers([]);

      if (isSelfDeleted) {
        localStorage.removeItem("token");
        navigate("/login");
      } else if (users.length === 1) {
        navigate("/register");
      }
    } catch (err) {
      console.error("Error deleting users:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className='user-management-container'>
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        Hello, <strong className='logged-user-name'>{loggedInUserName}!</strong>
        <a
          href='/login'
          className='logout-link'
          onClick={handleLogout}>
          Logout
        </a>
      </div>

      <h2>User Registry</h2>
      <div className='toolbar'>
        <button
          onClick={handleBlock}
          className='btn btn-danger'>
          <span
            role='img'
            aria-label='lock'>
            🔒
          </span>{" "}
          Block
        </button>
        <button
          onClick={handleUnblock}
          className='btn btn-secondary'>
          <span
            role='img'
            aria-label='unlock'>
            🔓
          </span>{" "}
          Unblock
        </button>
        <button
          onClick={handleDelete}
          className='btn btn-danger'>
          <span className='icon'>&#x1F5D1;</span> {/* Trash icon */}
          Delete
        </button>
      </div>

      <table className='table table-striped table-dark table-hover'>
        <thead>
          <tr>
            <th style={{ width: "100px" }}></th>
            <th style={{ width: "200px" }}>Name</th>
            <th style={{ width: "200px" }}>Email</th>
            <th style={{ width: "200px" }}>Last Login</th>
            <th style={{ width: "150px" }}>Status</th>
          </tr>
        </thead>
        <tbody className='table-hover'>
          {users.length === 0 ? (
            <tr>
              <td
                colSpan='5'
                style={{ textAlign: "center" }}>
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type='checkbox'
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                </td>
                <td>
                  <strong>{user.name}</strong> {/* Showing user's name */}
                </td>
                <td>{user.email}</td>
                <td>{formatDate(user.last_login)}</td>
                <td>
                  <span
                    className={`badge ${
                      user.status === "active"
                        ? "badge-success"
                        : "badge-danger"
                    }`}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
