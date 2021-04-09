import axios from "./axios";
import { Component, useState, useEffect } from "react";
import { Logo } from "./logo";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherProfile";
import { BrowserRouter, Route } from "react-router-dom";
import { FindPeople } from "./findPeople";
import { Friends } from "./friends";
import Status from "./status";
import HomeFeed from "./homeFeed";
import { Chat } from "./chat";
import { AppFn } from "./app";
import { OtherProfileRed } from "./otherProfileFn";

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderVisible: false,
        };

        this.toggleUploader = this.toggleUploader.bind(this);
        this.setProfilePic = this.setProfilePic.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    // DONE
    async componentDidMount() {
        try {
            const { data } = await axios.get("/api/userData");
            this.setState({
                id: data.id,
                firstName: data.firstname,
                lastName: data.lastname,
                profilePicUrl: data.profile_pic_url,
                bio: data.bio,
            });
        } catch (err) {
            console.log("error in get userData client: ", err);
        }
    }

    toggleUploader() {
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    setProfilePic(profilePic) {
        this.setState({
            profilePicUrl: profilePic,
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    setBio(bio) {
        this.setState({ bio: bio });
    }

    render() {
        if (!this.state.id) {
            return <div className="spin"></div>;
        }

        return (
            <BrowserRouter>
                <div className="border-yellow">
                    <div className="flex jstf-btw">
                        <Logo />
                        <div>
                            <a href="/">Profile</a>
                            <a href="/feed">Feed</a>
                            <a href="/friends">Friends</a>
                            <a href="/users">Find People</a>
                            <a href="/chat">Chat</a>
                            <a href="/appFn">AppFn</a>
                            <a href="/logout">Logout</a>
                            <ProfilePic
                                profilePicUrl={this.state.profilePicUrl}
                                toggleUploader={this.toggleUploader}
                                size="Small"
                            />
                        </div>
                    </div>

                    <Route path="/feed" render={() => <HomeFeed />} />
                    <Route path="/appFn" render={() => <App />} />

                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                firstName={this.state.firstName}
                                lastName={this.state.lastName}
                                profilePicUrl={this.state.profilePicUrl}
                                bio={this.state.bio}
                                setBio={this.setBio}
                                toggleUploader={this.toggleUploader}
                                userId={this.state.id}
                            />
                        )}
                    />

                    {this.state.uploaderVisible && (
                        <Uploader setProfilePic={this.setProfilePic} />
                    )}

                    <Route exact path="/users" render={() => <FindPeople />} />

                    <Route
                        path="/friends"
                        render={() => <Friends userId={this.state.id} />}
                    />

                    <Route path="/chat" render={() => <Chat />} />
                </div>
            </BrowserRouter>
        );
    }
}
