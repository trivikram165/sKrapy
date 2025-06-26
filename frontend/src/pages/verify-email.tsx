import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import s from "/styles/VerifyEmail.module.scss";

const VerifyEmail: FC = () => {
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:3001/verify-email?token=${token}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Email verified successfully") {
            setMessage("Email verified! Redirecting to login...");
            setTimeout(() => router.push("/login"), 2000);
          } else {
            setError(data.message || "Verification failed");
          }
        })
        .catch(() => setError("Verification failed: Unable to connect to server"));
    } else {
      setError("No verification token provided");
    }
  }, [token, router]);

  return (
    <div className={s.container}>
      <div className={s.formWrapper}>
        <h1 className={s.title}>Email Verification</h1>
        {error ? (
          <p className={s.error}>{error}</p>
        ) : (
          <p className={s.message}>{message}</p>
        )}
        {error && (
          <p className={s.linkText}>
            Back to{" "}
          <Link href="/login" className={s.link}>
            Login
          </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;