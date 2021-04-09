import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getFriendsList,
    acceptFriendship,
    cancelFriendship,
} from "./redux/actions";
import { Link } from "react-router-dom";

export const Friends = () => {
    const dispatch = useDispatch();

    const userData = useSelector((state) => state.userData);
    const usersRequest = useSelector(
        (state) =>
            state.friendsList &&
            state.friendsList.filter(
                (user) => !user.accepted && user.sender_id != userData.id
            )
    );
    const usersFriends = useSelector(
        (state) =>
            state.friendsList &&
            state.friendsList.filter((user) => user.accepted)
    );
    const usersSent = useSelector(
        (state) =>
            state.friendsList &&
            state.friendsList.filter(
                (user) => !user.accepted && user.sender_id == userData.id
            )
    );

    useEffect(() => {
        dispatch(getFriendsList());
    }, []);

    if (!usersRequest && !usersFriends) {
        return <div className="spin"></div>;
    }

    return (
        <div>
            <h1>Friends</h1>
            <h2 className="border-btm">Friends requests</h2>
            {usersRequest.map((elem, index) => {
                return (
                    <div key={index}>
                        <Link to={`/user/${elem.id}`}>
                            <img
                                className="friendPics"
                                src={
                                    elem.profile_pic_url ||
                                    "/defaultProfilePic.png"
                                }
                                alt={elem.firstname}
                            />
                        </Link>
                        <span>
                            {elem.firstname} {elem.lastname}
                        </span>
                        <button
                            onClick={() => dispatch(acceptFriendship(elem.id))}
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => dispatch(cancelFriendship(elem.id))}
                        >
                            Reject
                        </button>
                    </div>
                );
            })}
            <h2 className="border-btm">Pending requests</h2>
            {usersSent.map((elem, index) => {
                return (
                    <div key={index}>
                        <Link to={`/user/${elem.id}`}>
                            <img
                                className="friendPics"
                                src={
                                    elem.profile_pic_url ||
                                    "/defaultProfilePic.png"
                                }
                                alt={elem.firstname}
                            />
                        </Link>
                        <span>
                            {elem.firstname} {elem.lastname}
                        </span>
                        <button
                            onClick={() => dispatch(cancelFriendship(elem.id))}
                        >
                            Cancel request
                        </button>
                    </div>
                );
            })}
            <h2 className="border-btm">Your friends</h2>
            {usersFriends.map((elem, index) => {
                return (
                    <div key={index}>
                        <Link to={`/user/${elem.id}`}>
                            <img
                                className="friendPics"
                                src={
                                    elem.profile_pic_url ||
                                    "/defaultProfilePic.png"
                                }
                                alt={elem.firstname}
                            />
                        </Link>
                        <span>
                            {elem.firstname} {elem.lastname}
                        </span>
                        <button
                            onClick={() => dispatch(cancelFriendship(elem.id))}
                        >
                            Unfriend
                        </button>
                    </div>
                );
            })}
        </div>
    );
};
