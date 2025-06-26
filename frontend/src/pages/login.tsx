import { FC, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { authAtom } from "src/_state/auth";
import { useFetchWrapper } from "src/_helpers";
import s from "/styles/Login.module.scss";
import { notification } from "antd";

interface LoginResponse {
  token: string;
  id: string;
  username: string;
  type: 'user' | 'vendor';
}

const Login: FC = () => {
    const [accountType, setAccountType] = useState<'user' | 'vendor'>("user");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const setAuth = useSetRecoilState(authAtom);
    const fetchWrapper = useFetchWrapper();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await fetchWrapper.post<LoginResponse>('/login', { identifier, password });
            setAuth({
                token: data.token,
                id: data.id,
                username: data.username,
                type: data.type,
                campaignWhitelist: [],
                nftsOwned: [],
            });
            notification.success({ message: "Login successful! Redirecting..." });
            if (data.type === 'vendor') {
                router.push("/vendor/dashboard");
            } else {
                router.push("/sell-scrap");
            }
        } catch (error: any) {
            notification.error({ message: error.message || 'Login failed. Please try again.' });
            setLoading(false);
        }
    };

    return (
        <div className={s.container}>
            <div className={s.formWrapper}>
                <h1 className={s.title}>Login to sKrapy</h1>
                <form onSubmit={handleSubmit} className={s.form}>
                    <div className={s.inputGroup}>
                        <label>I am a:</label>
                        <div className={s.radioGroup}>
                            <label><input type="radio" value="user" checked={accountType === "user"} onChange={() => setAccountType("user")} disabled={loading} /> User</label>
                            <label><input type="radio" value="vendor" checked={accountType === "vendor"} onChange={() => setAccountType("vendor")} disabled={loading} /> Vendor</label>
                        </div>
                    </div>
                    <div className={s.inputGroup}>
                        <label htmlFor="identifier">Email or Username</label>
                        <input type="text" id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required disabled={loading} />
                    </div>
                    <div className={s.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
                    </div>
                    <button type="submit" className={s.submitButton} disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                </form>
                <p className={s.linkText}>
                    Don’t have an account?{" "}
                    <Link href="/signup" className={s.link}>Sign Up</Link>
                </p>
                 <p className={s.linkText}>
                    Forgot your password?{" "}
                    <Link href={accountType === "user" ? "/forgot-password" : "/vendor/forgot-password"} className={s.link}>
                      Reset Password
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;