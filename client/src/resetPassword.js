import { useState } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export const ResetPasswordFn = () => {
    const [errorServer, setErrorServer] = useState(false);
    const [errorResetCode, setErrorResetCode] = useState(false);
    const [errorEmpty, setErrorEmpty] = useState(false);
    const [errorInvalidData, setErrorInvalidData] = useState(false);
    const [errorCodeExpired, setErrorCodeExpired] = useState(false);
    const [userData, setUserData] = useState();
    const [renderView, setRenderView] = useState(1);

    let handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    let verifyEmailSendCode = async () => {
        if (userData.email === "") {
            return setErrorEmpty(true);
        }
        try {
            let { data } = await axios.post("/password/reset/start", userData);
            if (data.errorInvalidData) {
                return setErrorInvalidData(true);
            }
            if (data.errorResetCode) {
                return setErrorResetCode(true);
            }
            if (data.emailSent) {
                return setRenderView(2);
            }
        } catch (err) {
            console.log("error in POST password reset start", err);
            return setErrorServer(true);
        }
    };

    let setNewPassword = async () => {
        if (userData.password == "" || userData.code == "") {
            return setErrorEmpty(true);
        }
        try {
            let { data } = await axios.post("/password/reset/verify", userData);
            if (data.resetCodeExpired) {
                return setErrorCodeExpired(true);
            }
            if (data.errorServer) {
                return setErrorServer(true);
            }
            if (data.updatedPassword) {
                return setRenderView(3);
            }
        } catch (err) {
            console.log("error in POST reset verify: ", err);
            return setErrorServer(true);
        }
    };

    let whichViewRender = () => {
        if (renderView === 1) {
            return (
                <div className="flex-col algn-center mrgn-top">
                    <h2>Please enter the Email associated to your account</h2>
                    {errorServer && (
                        <p>
                            Oooops something went wrong on the server, please
                            try again.
                        </p>
                    )}
                    {errorEmpty && <p>The field cannot be left empty.</p>}
                    {errorInvalidData && <p>Invalid email</p>}
                    {errorResetCode && (
                        <p>An error arised, please enter your email again</p>
                    )}
                    <input
                        onChange={(e) => handleChange(e)}
                        type="email"
                        name="email"
                        placeholder="Email"
                    />
                    <button
                        className="buttonWelcome"
                        onClick={() => verifyEmailSendCode()}
                    >
                        Submit
                    </button>
                </div>
            );
        } else if (renderView === 2) {
            return (
                <div className="flex-col algn-center mrgn-top">
                    <h2>
                        Please enter a new Password and the reset code you have
                        received by email
                    </h2>
                    {errorServer && (
                        <p>
                            Oooops something went wrong on the server, please
                            try again.
                        </p>
                    )}
                    {errorCodeExpired && <p>The code has expired</p>}
                    <input
                        onChange={(e) => handleChange(e)}
                        type="password"
                        name="password"
                        placeholder="New Password"
                    />
                    <input
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="code"
                        placeholder="Code"
                    />
                    <button
                        className="buttonWelcome"
                        onClick={() => setNewPassword()}
                    >
                        Submit
                    </button>
                </div>
            );
        } else if (renderView === 3) {
            return (
                <div className="mrgn-top">
                    <h1>Success</h1>
                    <Link to="/login">Log in!</Link>
                </div>
            );
        }
    };

    return (
        <div>
            <h1 className="mrgn-top">Reset your password</h1>
            {whichViewRender()}
        </div>
    );
};
