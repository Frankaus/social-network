import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getOtherProfile, getUserStatuses } from "./redux/actions";
import { FriendshipButton } from "./friendshipButton";

export const OtherProfile = (props) => {
    const dispatch = useDispatch();

    const userData = useSelector((state) => state.otherProfile);
    const statuses = useSelector((state) => state.statusList);

    useEffect(() => {
        dispatch(getOtherProfile(props.match.params.id));
    }, [props.match.params.id]);

    useEffect(() => {
        dispatch(getUserStatuses(userData.id));
    }, [userData]);

    let imgUrl = userData.profile_pic_url || "/defaultProfilePic.png";

    if (userData.userNotFound) {
        props.history.push("/");
    }

    if (!userData) {
        return <div className="spin"></div>;
    }
    return (
        <div className="flex-col algn-center">
            <h2>
                {userData.firstname} {userData.lastname}
            </h2>
            <h2>{userData.bio}</h2>
            <img className="profilePicBig" src={imgUrl} />
            <h3>Email: {userData.email}</h3>
            {statuses &&
                statuses.map((elem, index) => {
                    let date = new Date(elem.created_at);
                    return (
                        <div key={index}>
                            <span>{elem.status} &#8195;</span>
                            <span>
                                - {date.toLocaleDateString()} at{" "}
                                {date.toLocaleTimeString()}
                            </span>
                        </div>
                    );
                })}
            <FriendshipButton />
        </div>
    );
};
