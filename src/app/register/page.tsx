import "../register/page.scss";
import Link from "next/link";


export default function Register () {
    return (
        <div className="register-container">
            <div className="form-container">
                <h1 className="form-title">Register</h1>
                <form>
                    <input type="text" 
                    className="email-input" 
                    placeholder="Email" 
                    required
                    />
                    <input type="password" 
                    className="password-input" 
                    placeholder="Password" 
                    required
                    />
                    <button type="submit" className="btn">Submit</button>
                </form>
                <div className="line">- OR -</div>
                <Link href="/login" className="link-login">
                    Login with an existing account
                </Link>
            </div>
        </div>
    )
}