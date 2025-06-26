import { FC, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useFetchWrapper } from "src/_helpers";
import s from "/styles/Signup.module.scss";
import { notification } from "antd";

const Signup: FC = () => {
    const [accountType, setAccountType] = useState<'user' | 'vendor'>("user");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [loading, setLoading] = useState(false);
    const fetchWrapper = useFetchWrapper();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            notification.error({ message: "Passwords do not match!" });
            return;
        }
        setLoading(true);
        const payload = {
            role: accountType,
            email, username, password, confirmPassword,
            streetAddress, city, state, zipCode,
            firstName: accountType === 'user' ? firstName : undefined,
            lastName: accountType === 'user' ? lastName : undefined,
            businessName: accountType === 'vendor' ? businessName : undefined,
        };
        try {
            const data = await fetchWrapper.post<{ message: string }>('/signup', payload);
            notification.success({ message: data.message, duration: 5 });
            router.push('/login');
        } catch (error: any) {
            notification.error({ message: error.message || 'Signup failed.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={s.container}>
            <div className={s.formWrapper}>
                <h1 className={s.title}>Sign Up for sKrapy</h1>
                <form onSubmit={handleSubmit} className={s.form}>
                    <div className={s.inputGroup}>
                        <label>Account Type</label>
                        <div className={s.radioGroup}>
                            <label><input type="radio" value="user" checked={accountType === "user"} onChange={() => setAccountType("user")} /> User</label>
                            <label><input type="radio" value="vendor" checked={accountType === "vendor"} onChange={() => setAccountType("vendor")} /> Vendor</label>
                        </div>
                    </div>
                    {accountType === 'user' ? (
                        <>
                            <div className={s.inputGroup}><label>First Name</label><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required /></div>
                            <div className={s.inputGroup}><label>Last Name</label><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required /></div>
                        </>
                    ) : (
                        <div className={s.inputGroup}><label>Business Name</label><input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} required /></div>
                    )}
                    <div className={s.inputGroup}><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                    <div className={s.inputGroup}><label>Username</label><input type="text" value={username} onChange={e => setUsername(e.target.value)} required /></div>
                    <div className={s.inputGroup}><label>Street Address</label><input type="text" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} required /></div>
                    <div className={s.inputGroup}><label>City</label><input type="text" value={city} onChange={e => setCity(e.target.value)} required /></div>
                    <div className={s.inputGroup}><label>State</label><input type="text" value={state} onChange={e => setState(e.target.value)} required /></div>
                    <div className={s.inputGroup}><label>ZIP Code</label><input type="text" value={zipCode} onChange={e => setZipCode(e.target.value)} required /></div>
                    <div className={s.inputGroup}><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
                    <div className={s.inputGroup}><label>Confirm Password</label><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /></div>
                    <button type="submit" className={s.submitButton} disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
                </form>
                 <p className={s.linkText}>
                    Already have an account?{" "}
                    <Link href="/login" className={s.link}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;