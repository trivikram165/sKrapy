import { FC, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import s from "/styles/ResetPassword.module.scss";

const PasswordReset: FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { token } = router.query;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("No reset token provided");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      console.log("Sending password reset request:", { token, password });
      const response = await fetch("http://localhost:3001/forgot-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.message || `Password reset failed with status ${response.status}`);
      }

      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      console.error("Fetch error:", error);
      setError(`Failed to reset password: ${error.message}`);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.formWrapper}>
        <h1 className={s.title}>Reset Password</h1>
        {error && <p className={s.error}>{error}</p>}
        {success && <p className={s.success}>{success}</p>}
        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.inputGroup}>
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <div className={s.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          <button type="submit" className={s.submitButton}>
            Reset Password
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

export default PasswordReset;