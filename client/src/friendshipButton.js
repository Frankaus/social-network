import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "./axios";
import { getButtonText } from "./redux/actions";

export const FriendshipButton = () => {
    const dispatch = useDispatch();

    const userData = useSelector((state) => state.otherProfile);
    const buttonText = useSelector((state) => state.buttonText);

    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        dispatch(getButtonText(userData.id));
    }, [clicked, userData]);

    let buttonFn = async () => {
        let { data } = await axios.post("/api/friends", {
            buttonText: buttonText,
            recipientId: userData.id,
        });
        setClicked(!clicked);
    };

    if (!buttonText) {
        return <div className="spin"></div>;
    }

    return (
        <div>
            <button className="buttonWelcome" onClick={() => buttonFn()}>
                {buttonText}
            </button>
        </div>
    );
};
