import axios from "./axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "./redux/actions";
import { Logo } from "./logo";
import { ProfilePic } from "./profilePic";
import { Profile } from "./profile";
import { Friends } from "./friends";
import { FindPeople } from "./findPeople";
import { OtherProfile } from "./otherProfile";
import { Chat } from "./chat";
import { HomeFeed } from "./homeFeed";
import { BrowserRouter, Route } from "react-router-dom";

export const App = () => {
    let dispatch = useDispatch();

    const userData = useSelector((state) => state.userData);

    useEffect(() => {
        dispatch(getUserData());
    }, []);

    if (!userData) {
        return <div className="spinner"></div>;
    }
    if (userData) {
        return (
            <BrowserRouter>
                <div className="flex jstf-btw">
                    <a href="/">
                        <Logo />
                    </a>
                    <div className="flex algn-center">
                        <a href="/logout">
                            <img
                                className="logout"
                                src="/logoutIcon.png"
                                alt="logout"
                            />
                        </a>
                        <ProfilePic size="Small" />
                    </div>
                </div>
                <Route
                    exact
                    path="/"
                    render={() => {
                        return (
                            <div className="container">
                                <div className="profile">
                                    <Profile />
                                </div>
                                <div className="homeFeed">
                                    <HomeFeed />
                                </div>
                                <div className="findPeople">
                                    <FindPeople />
                                </div>
                                <div className="chat">
                                    <Chat />
                                </div>
                                <div className="friends">
                                    <Friends />
                                </div>
                            </div>
                        );
                    }}
                />

                <Route
                    exact
                    path="/user/:id"
                    render={(props) => (
                        <OtherProfile
                            match={props.match}
                            history={props.history}
                            key={props.match.url}
                        />
                    )}
                />
            </BrowserRouter>
        );
    }
};
