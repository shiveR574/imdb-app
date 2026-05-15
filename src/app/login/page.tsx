import "../login/page.scss";

export default function Login () {
    return (
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
            </div>
        </div>
    )
}