import "../login/page.scss";
import Image from "next/image";
import preview from "@/src/assets/preview.png";

export default function Login () {
    return (
        <div className="login-container">
            <div className="img-container">
                <Image src={preview} alt="preview" className="preview-pic" placeholder="blur"/>
            </div>
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
            </div>
        </div>
    )
}