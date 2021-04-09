import { useDispatch, useSelector } from "react-redux";
import {toggleUploader} from "./redux/actions";


export const ProfilePic = ({size}) => {
    const dispatch = useDispatch();

    const userData = useSelector((state) => state.userData);
    
    const imgurl = userData.profile_pic_url || "/defaultProfilePic.png";

    if (size == "Big") {
        return (
            <div className="inline">
                <img
                    onClick={() => dispatch(toggleUploader())}
                    src={imgurl}
                    className={`profilePic${size}`}
                />
            </div>
        );
    } else if (size == "Small") {
        return (
            <div className="inline">
                <img src={imgurl} className={`profilePic${size}`} />
            </div>
        );
    }
};
