import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDiscoverFriends } from "./redux/actions";
import { Link } from "react-router-dom";

export const FindPeople = () => {
    const dispatch = useDispatch();

    const [userInput, setUserInput] = useState("");
    const [dataLength, setDataLength] = useState();

    const discoverFriends = useSelector((state) => state.discoverFriendsList);

    dataLength == 0 && setDataLength("no");

    useEffect(() => {
        if (!userInput.length) {
            dispatch(getDiscoverFriends("undefined"));
        } else if (userInput.length) {
            dispatch(getDiscoverFriends(userInput));
        }
    }, [userInput]);

    if (!discoverFriends) {
        return <div className="spin"></div>;
    }

    return (
        <div className="findPeople">
            <h1>Find People</h1>
            <input
                type="text"
                name="searchPeople"
                placeholder="Search by name"
                onChange={(e) => {
                    setUserInput(e.target.value);
                }}
            />
            {!userInput && <h2>Checkout who just joined!</h2>}
            {userInput && (
                <h3>
                    There are {dataLength} matching results for &#171;
                    {userInput}
                    &#187;
                </h3>
            )}
            {discoverFriends.map((elem, index) => {
                return (
                    <div key={index}>
                        <Link to={`/user/${elem.id}`}>
                            <img
                                className="friendPics"
                                src={
                                    elem.profile_pic_url ||
                                    "/defaultProfilePic.png"
                                }
                            />
                        </Link>
                        <span>
                            {elem.firstname} {elem.lastname}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
