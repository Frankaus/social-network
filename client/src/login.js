import { useState } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export const LoginFn = () => {
    const [error, setError] = useState(false);
    const [errorEmpty, setErrorEmpty] = useState(false);
    const [errorInvalidData, setErrorInvalidData] = useState(false);
    const [userData, setUserData] = useState(false);

    let handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    let verifyUser = async () => {
        let { email, password } = userData;
        if (email === "" || password === "") {
            return setErrorEmpty(true);
        }
        try {
            let { data } = await axios.post("/login", userData);
            if (data.errorInvalidData) {
                return setErrorInvalidData(true);
            }
            return location.replace("/");
        } catch (err) {
            console.log("error in Post login from server: ", err);
            return setError(true);
        }
    };

    return (
        <div>
            <div className="flex-col algn-center mrgn-top">
                <h2>Welcome back</h2>
                {errorEmpty && <p>All these fields are compulsory.</p>}
                {error && <p>Ooops something went wrong with the server.</p>}
                {errorInvalidData && <p>Wrong email or password.</p>}
                <label>
                    <input
                        onChange={(e) => handleChange(e)}
                        name="email"
                        type="email"
                        placeholder="Email"
                    ></input>
                </label>
                <label>
                    <input
                        onChange={(e) => handleChange(e)}
                        name="password"
                        type="password"
                        placeholder="Password"
                    ></input>
                </label>
                <button className="buttonWelcome" onClick={() => verifyUser()}>
                    Submit
                </button>
                <Link to="/reset-password">Forgot your password?</Link>
                <Link to="/">Click here to Sign Up!</Link>
            </div>
        </div>
    );
};
