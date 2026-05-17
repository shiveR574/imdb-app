import "../login/page.scss";
import Image from "next/image";
import preview from "@/src/assets/preview.png";
import Link from "next/link";


export default function Login () {
    return (
        <div className="page-wrapper">
        <div className="login-container">
            <div className="form-container">
                <h1 className="form-title">Login</h1>
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
                <div className="line-container">
                    <div className="line-left"></div>
                        <span>OR</span>
                    <div className="line-right"></div>
                </div>
                <div className="link-register">
                    Don't have an account?
                <Link href="/register">
                    <button className="btn-register">Register</button>
                </Link>
                </div>
            </div>
            {/*<div className="img-container">
                <Image src={preview} alt="preview" className="preview-pic" placeholder="blur"/>
            </div>*/}
        </div>
    </div>
    )
}