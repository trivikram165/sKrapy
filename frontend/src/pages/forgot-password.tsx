import { FC, FormEvent, useState } from "react";
import Link from "next/link";
import s from "/styles/ForgotPassword.module.scss";

const ForgotPassword: FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      console.log("Sending forgot password request:", { email });
      const response = await fetch("http://localhost:3001/forgot-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.details || data.message || `Request failed with status ${response.status}`);
      }

      setSuccess("Password reset email sent! Check your inbox.");
      setEmail("");
    } catch (error: any) {
      console.error("Fetch error:", error);
      setError(`Failed to send reset email: ${error.message}`);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.formWrapper}>
        <h1 className={s.title}>Forgot Password</h1>
        {error && <p className={s.error}>{error}</p>}
        {success && <p className={s.success}>{success}</p>}
        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className={s.submitButton}>
            Send Reset Link
          </button>
        </form>
        <p className={s.linkText}>
          Back to{" "}
          <Link href="/login" className={s.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;