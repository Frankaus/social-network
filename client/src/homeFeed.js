import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFriendsStatuses } from "./redux/actions";

export const HomeFeed = () => {
    const dispatch = useDispatch();

    const friendsIds = useSelector(
        (state) =>
            state.friendsList &&
            state.friendsList
                .filter((user) => user.accepted)
                .map((elem) => {
                    return elem.id;
                })
    );
    const friendsStatus = useSelector((state) => state.friendsStatusList);

    const [updateIds, setUpdateIds] = useState(true);

    useEffect(() => {
        if (friendsIds.length && updateIds) {
            dispatch(getFriendsStatuses(friendsIds));
            setUpdateIds(false);
        }
    }, [friendsIds]);

    if (!friendsStatus) {
        return (
            <div>
                <h1>There are no tweets available</h1>
            </div>
        );
    }

    return (
        <div className="tweets">
            <h2>Feed</h2>
            {friendsStatus &&
                friendsStatus.map((elem, index) => {
                    let date = new Date(elem.created_at);
                    return (
                        <div key={index}>
                            <span>{elem.status} &#8195;</span>
                            <span>
                                - {date.toLocaleDateString()} at{" "}
                                {date.toLocaleTimeString()}
                            </span>
                            <span>
                                &#8195;{elem.firstname} {elem.lastname}
                            </span>
                        </div>
                    );
                })}
        </div>
    );
};
