"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);

      const decoded: any = jwtDecode(data.token);

      const role =
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      localStorage.setItem("role", role);

      if (role?.toLowerCase() === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <h1>VELORA</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Login</button>
        </form>

        <div className="login-extra">
          <a href="#">Forgot password?</a>
          <span>
            Don't have account? <a href="/register">Register</a>
          </span>
        </div>

      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f8f8;
          font-family: Arial, Helvetica, sans-serif;
        }

        .login-card {
          width: 400px;
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .login-header h1 {
          font-size: 28px;
          letter-spacing: 3px;
          margin-bottom: 6px;
        }

        .login-header p {
          color: #777;
          font-size: 14px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .login-form input {
          padding: 12px 14px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: 0.2s;
        }

        .login-form input:focus {
          border-color: black;
          outline: none;
        }

        .login-form button {
          margin-top: 10px;
          padding: 12px;
          background: black;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        .login-form button:hover {
          background: #222;
        }

        .login-extra {
          margin-top: 20px;
          text-align: center;
          font-size: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .login-extra a {
          color: black;
          text-decoration: none;
          font-weight: 500;
        }

        .login-extra a:hover {
          text-decoration: underline;
        }

        .error {
          color: red;
          font-size: 13px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}