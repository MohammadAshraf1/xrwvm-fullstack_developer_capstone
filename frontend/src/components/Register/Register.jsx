// src/components/Register.jsx
//here?
import React, { useState } from "react";
import "./Register.css";
import userIcon from "../assets/person.png";
import emailIcon from "../assets/email.png";
import passwordIcon from "../assets/password.png";
import closeIcon from "../assets/close.png";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const goHome = () => {
    window.location.href = window.location.origin;
  };

  const register = async (e) => {
    e.preventDefault();
    const res = await fetch(`${window.location.origin}/djangoapp/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password, firstName, lastName, email }),
    });
    const json = await res.json();
    if (json.status) {
      sessionStorage.setItem("username", json.userName);
      window.location.href = window.location.origin;
    } else if (json.error === "Already Registered") {
      alert("A user with that username already exists.");
      goHome();
    }
  };

  return (
    <div className="register-container">
      <header className="register-header">
        <h2 className="register-title">Create Account</h2>
        <button className="close-btn" onClick={goHome}>
          <img src={closeIcon} alt="Close" />
        </button>
      </header>

      <form className="register-form" onSubmit={register}>
        <div className="input-group">
          <img src={userIcon} className="icon" alt="Username" />
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <img src={userIcon} className="icon" alt="First Name" />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <img src={userIcon} className="icon" alt="Last Name" />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <img src={emailIcon} className="icon" alt="Email" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <img src={passwordIcon} className="icon" alt="Password" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          SIGN UP
        </button>
      </form>
    </div>
  );
};

export default Register;
