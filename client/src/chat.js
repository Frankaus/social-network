import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export const Chat = () => {
    const elemRef = useRef();
    const [textMessage, setTextMessage] = useState("");

    const messages = useSelector((state) => state.messages);

    useEffect(
        function () {
            if (messages) {
                elemRef.current.scrollTop = elemRef.current.scrollHeight;
            }
        },
        [messages]
    );

    let sendMsg = (event) => {
        var date = new Date();
        if (event.key === "Enter") {
            socket.emit("sendMessageServer", textMessage, date);
            event.target.value = "";
        }
    };

    if (!messages) {
        return <div className="spin"></div>;
    }
    return (
        <div>
            <h1>Community Wide Announcements</h1>
            <div id="chat-message" ref={elemRef}>
                {messages.map((elem, index) => {
                    let date = new Date(elem.created_at);
                    return (
                        <div key={index}>
                            <img
                                className="profilePicSmall"
                                src={
                                    elem.profile_pic_url ||
                                    "/defaultProfilePic.png"
                                }
                                alt={elem.firstname}
                            />
                            <span>
                                {elem.firstname} {elem.lastname}: {elem.text} on
                                the {date.toLocaleDateString()} at:{" "}
                                {date.toLocaleTimeString()}
                            </span>
                        </div>
                    );
                })}
            </div>
            <textarea
                placeholder="type your message"
                name="message"
                onChange={(e) => setTextMessage(e.target.value)}
                onKeyPress={(e) => sendMsg(e)}
            ></textarea>
        </div>
    );
};
