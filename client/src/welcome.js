// src/welcome.js
import {RegistrationFn} from "./registration";
import {LoginFn} from "./login";
import {ResetPasswordFn} from "./resetPassword";
import { HashRouter, Route} from "react-router-dom";

export default function Welcome() {
    return (
        <div>
            <h1 className="mrgn-top">Welcome to TweetsRedux</h1>
            <h2>You may only tweet.... but in all reduxity</h2>
            <HashRouter>
                <div>
                    <Route exact path="/" component={RegistrationFn} />
                    <Route path="/login" component={LoginFn} />
                    <Route path="/reset-password" component={ResetPasswordFn} />
                </div>
            </HashRouter>
        </div>
    );
}
