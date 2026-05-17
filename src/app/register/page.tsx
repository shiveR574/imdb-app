import "../register/page.scss";
import Link from "next/link";
import Image from "next/image";
import preview from "@/src/assets/preview.png";


export default function Register () {
    return (
        <div className="page-wrapper">
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
                    <div className="line-container">
                        <div className="line-left"></div>
                            <span>OR</span>
                        <div className="line-right"></div>
                    </div>
                    <div className="link-login">
                        Already have an account?
                    <Link href="/login">
                        <button className="btn-login">Login</button>
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