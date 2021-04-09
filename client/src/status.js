import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserStatuses, postStatus } from "./redux/actions";

export const Status = () => {
    const dispatch = useDispatch();

    const [statusText, setStatusText] = useState("");
    const [emptyStatus, setEmptyStatus] = useState(false);

    const userData = useSelector((state) => state.userData);
    const statuses = useSelector((state) => state.statusList);

    useEffect(() => {
        dispatch(getUserStatuses(userData.id));
    }, [userData]);

    let onClick = (statusText) => {
        if (statusText) {
            setEmptyStatus(false);
            return dispatch(postStatus(statusText));
        }
        return setEmptyStatus(true);
    };

    return (
        <div>
            <div className="flex-col algn-center mrgn-btm">
                <h3>What&#8217;s on your mind?</h3>
                <input
                    className="inputHome"
                    type="text"
                    name="status"
                    onChange={(e) => setStatusText(e.target.value)}
                />
                {emptyStatus && <p>Error: status is empty</p>}
                <button onClick={() => onClick(statusText)}>Post</button>
            </div>
            {statuses &&
                statuses.map((elem, index) => {
                    let date = new Date(elem.created_at);
                    return (
                        <div key={index} className="tweetsUser">
                            <p>{elem.status} &#8195;</p>
                            <p>
                                - {date.toLocaleDateString()} at{" "}
                                {date.toLocaleTimeString()}
                            </p>
                        </div>
                    );
                })}
        </div>
    );
};
