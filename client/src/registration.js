import { useState } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export const RegistrationFn = () => {
    const [error, setError] = useState(false);
    const [errorEmpty, setErrorEmpty] = useState(false);
    const [errorDuplicate, setErrorDuplicate] = useState(false);
    const [userData, setUserData] = useState();

    let handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    let handleClick = async () => {
        let { firstname, lastname, email, password } = userData;
        if (
            firstname === "" ||
            lastname === "" ||
            email === "" ||
            password === ""
        ) {
            return setErrorEmpty(true);
        }

        try {
            let { data } = await axios.post("/registration", userData);
            if (data.errorDuplicate) {
                return setErrorDuplicate(true);
            } else if (data.error) {
                return setError(true);
            }
            return location.replace("/");
        } catch (err) {
            console.log("error in Post Registration from client: ", err);
            return setError(true);
        }
    };

    return (
        <>
            <div className="flex-col algn-center mrgn-top">
                <h2>Join 1000's of Reactive people</h2>
                {errorEmpty && <p>All these fields are compulsory.</p>}
                {errorDuplicate && (
                    <p>Something went wrong: this email already exists.</p>
                )}
                {error && (
                    <p>
                        Oooops, something went wrong on the server. Please try
                        again.
                    </p>
                )}
                <label>
                    <input
                        onChange={(e) => handleChange(e)}
                        name="firstname"
                        type="text"
                        placeholder="First Name"
                    ></input>
                </label>
                <label>
                    <input
                        onChange={(e) => handleChange(e)}
                        name="lastname"
                        type="text"
                        placeholder="Last Name"
                    ></input>
                </label>
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
                <button className="buttonWelcome" onClick={() => handleClick()}>
                    Submit
                </button>
                <Link to="/login">Click here to Log in!</Link>
            </div>
        </>
    );
};
