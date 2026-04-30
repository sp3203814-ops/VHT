import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || null;

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup Successful. Please Login.");
        setIsSignupOpen(false);
        setIsLoginOpen(true);
      } else {
        alert(data.message || "Signup Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userInfo", JSON.stringify(data));

        alert("Login Successful");
        setIsLoginOpen(false);

        if (data.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          window.location.reload();
        }
      } else {
        alert(data.message || "Login Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <div className="navbar sticky top-0 z-50 px-4 md:px-10 py-3 bg-white/80 backdrop-blur-xl shadow-lg border-b border-base-200">

        {/* Left */}
        <div className="navbar-start">

          {/* Mobile Menu */}
          <div className="dropdown lg:hidden">
            <label tabIndex={0} className="btn btn-ghost text-2xl">
              ☰
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[100] p-3 shadow-xl bg-base-100 rounded-xl w-60"
            >
              <li><Link to="/">Home</Link></li>
              <li><Link to="/find-tutor">Find Tutor</Link></li>
              <li><Link to="/become-tutor">Become Tutor</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>

              {!userInfo ? (
                <>
                  <li>
                    <button onClick={() => setIsSignupOpen(true)}>
                      Signup
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setIsLoginOpen(true)}>
                      Login
                    </button>
                  </li>
                </>
              ) : (
                <>
                  {userInfo?.isAdmin && (
                    <li>
                      <button onClick={() => navigate("/admin/dashboard")}>
                        Dashboard
                      </button>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Logo */}
          <Link
            to="/"
            className="text-xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse"
          >
            VedantaHomeTutorial
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-3 font-medium">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/find-tutor">Find Tutor</Link></li>
            <li><Link to="/become-tutor">Become Tutor</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Right Side Desktop */}
        <div className="navbar-end hidden lg:flex gap-3">
          {!userInfo ? (
            <>
              <button
                onClick={() => setIsSignupOpen(true)}
                className="btn btn-outline"
              >
                Signup
              </button>

              <button
                onClick={() => setIsLoginOpen(true)}
                className="btn bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-none"
              >
                Login
              </button>
            </>
          ) : (
            <>
              {userInfo?.isAdmin && (
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="btn btn-primary"
                >
                  Dashboard
                </button>
              )}

              <button
                onClick={handleLogout}
                className="btn btn-outline"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Signup Modal */}
      {isSignupOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-xl mb-4">Signup</h3>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="input input-bordered w-full mb-3"
              onChange={handleSignupChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered w-full mb-3"
              onChange={handleSignupChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered w-full mb-4"
              onChange={handleSignupChange}
            />

            <button
              onClick={handleSignup}
              className="btn btn-primary w-full"
            >
              Signup
            </button>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setIsSignupOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-xl mb-4">Login</h3>

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered w-full mb-3"
              onChange={handleLoginChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered w-full mb-4"
              onChange={handleLoginChange}
            />

            <button
              onClick={handleLogin}
              className="btn btn-primary w-full"
            >
              Login
            </button>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setIsLoginOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}