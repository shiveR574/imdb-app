"use client";
import "../register/page.scss";
import Link from "next/link";
import Image from "next/image";
import preview from "@/src/assets/preview.png";
import { useState} from "react";
import { useRouter } from "next/navigation";


export default function Register () {
    const [error, setError] = useState("");
    const router = useRouter();
    
    const isValidEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const firstName = e.target[0].value;        
        const lastName = e.target[1].value;
        const email = e.target[2].value;
        const password = e.target[3].value;

        if (!firstName || !lastName) {
            setError("First name and last name are required");
            return;
        }

        if (!isValidEmail(email)) {
            setError("Email is invalid");
            return;
        }

        if (!password || password.length < 8){
            setError("Password is invalid, must be at least 8 characters long");
            return;
        }

         try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName
                })
         })
         
         if (res.status === 400) {
            setError("This email is already registered");
         } if (res.status === 200) {
            setError("");
            router.push("/login");
         }
         } catch(error) {
            setError("Something went wrong");
            console.log(error);
         }
    }

    return (
        <div className="page-wrapper">
            <div className="register-container">
                <div className="form-container">
                    <h1 className="form-title">Register</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="name-container">
                            <input type="text" 
                            className="first-name-input" 
                            placeholder="First Name" 
                            required
                            />
                            <input type="text" 
                            className="last-name-input" 
                            placeholder="Last Name" 
                            required
                            />
                        </div>
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