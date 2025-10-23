import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const emailFromQuery = params.get("email") || "";
  const { login } = useAuth();

  const handleChange = (e) => {
    // Allow only numbers and max 6 digits (or desired length)
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      alert("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/user/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, email: emailFromQuery }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Verification failed");
      }

      // After verification, try to auto-login with pending credentials
      try {
        const pendingRaw = sessionStorage.getItem("pendingAuth");
        if (pendingRaw) {
          const pending = JSON.parse(pendingRaw);
          try {
            const loginRes = await fetch(`${backendUrl}/user/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ email: pending.email, password: pending.password }),
            });

            const loginData = await loginRes.json().catch(() => ({}));
            if (loginRes.ok) {
              // If backend didn't provide a name/fullname, but pending has it, merge it
              try {
                const pendingName = pending.name;
                if (pendingName && loginData && loginData.user && !(loginData.user.fullname || loginData.user.name)) {
                  loginData.user.fullname = pendingName;
                }
              } catch (e) { /* ignore */ }

              try { login && login(loginData.user); } catch (e) {}
              sessionStorage.removeItem("pendingAuth");
            } else {
              console.warn("Auto-login after verification failed:", loginData.message);
            }
          } catch (e) {
            console.warn("Auto-login network error", e);
          }
        }
      } catch (e) {
        console.warn("Error reading pendingAuth", e);
      }

      // success: navigate to home
      navigate("/", { replace: true });
    } catch (error) {
      alert(error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-coral-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Enter OTP</h1>
        <p className="text-gray-600 mb-8 text-center">
          Please enter the 6-digit code sent to your email or phone.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={6}
            value={otp}
            onChange={handleChange}
            className="w-full text-center text-3xl tracking-widest rounded-xl border border-gray-300 px-6 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="------"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coral-500 hover:bg-coral-600 text-black font-semibold py-3 rounded-lg transition-shadow shadow-md hover:shadow-lg"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
