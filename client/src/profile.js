import { useSelector } from "react-redux";
import { ProfilePic } from "./profilePic";
import { Status } from "./status";
import { BioEditor } from "./bioEditor";
import { Uploader } from "./uploader";

export const Profile = () => {
    const userData = useSelector((state) => state.userData);
    const uploader = useSelector((state) => state.uploaderVisible);

    if (!userData) {
        return <div className="spin"></div>;
    }
    return (
        <div className="flex-col algn-center">
            <h3>
                {userData.firstname} {userData.lastname}
            </h3>
            <ProfilePic size="Big" />
            <div>
                <BioEditor />
                {uploader && <Uploader />}
                <Status />
            </div>
        </div>
    );
};
