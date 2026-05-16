import "../register/page.scss";
import Link from "next/link";
import Image from "next/image";
import preview from "@/src/assets/preview.png";


export default function Register () {
    return (
        <div className="register-container">
            <div className="img-container">
                <Image src={preview} alt="preview" className="preview-pic" placeholder="blur"/>
            </div>
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