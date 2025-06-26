import { FC, FormEvent, useState } from "react";
import Link from "next/link";
import s from "/styles/Login.module.scss";

const VendorForgotPassword: FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:3001/vendor/forgot-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send password reset email");
      }

      setSuccess("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      setError("Failed to send password reset email: " + error.message);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.formWrapper}>
        <h1 className={s.title}>Reset Vendor Password</h1>
        {error && <p className={s.error}>{error}</p>}
        {success && <p className={s.success}>{success}</p>}
        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.inputGroup}>
            <label htmlFor="identifier">Email or Username</label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or username"
              required
            />
          </div>
          <button type="submit" className={s.submitButton}>
            Send Reset Email
          </button>
        </form>
        <p className={s.linkText}>
          Back to{" "}
          <Link href="/vendor/login" className={s.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VendorForgotPassword;