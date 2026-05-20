"use client";
import "../login/page.scss";
import Image from "next/image";
import preview from "@/src/assets/preview.png";
import Link from "next/link";
import { useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";


export default function Login () {
    const [error, setError] = useState("");
    const router = useRouter();
    const session = useSession();

    useEffect(() => {
        if(session?.status === "authenticated") {
            router.replace("/");
        }
    }, [session, router]);
    
    
    const isValidEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;


        if (!isValidEmail(email)) {
            setError("Email is invalid");
            return;
        }

        if (!password || password.length < 8){
            setError("Password is invalid");
            return;
        }

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false
        })
        
        if (res?.error) {
            setError("Invalid email or password");
            if(res?.url) router.push("/");
        } else {
            setError("");
        }
    };


    return (
        <div className="page-wrapper">
            <div className="login-container">
                <div className="form-container">
                    <h1 className="form-title">Login</h1>
                    <form onSubmit={handleSubmit}>
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
                        <p className="error">{error && error}</p>
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