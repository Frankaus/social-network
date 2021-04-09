import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { postBio } from "./redux/actions";

export const BioEditor = () => {
    const dispatch = useDispatch();

    const [bio, setBio] = useState();
    const [editor, setEditor] = useState(false);

    const userData = useSelector((state) => state.userData);

    let addBioBtn = !editor && (
        <div>
            <p>
                Hey there, you don't have any Bio, write something about
                yourself
            </p>
            <button onClick={() => setEditor(!editor)}>Add bio</button>
        </div>
    );

    let editBioBtn = !editor && (
        <button className="btnText" onClick={() => setEditor(!editor)}>
            Edit
        </button>
    );

    let writeBio = (
        <div>
            <textarea
                name="bio"
                defaultValue={userData.bio}
                onChange={(e) => setBio(e.target.value)}
            />
            <button
                className="save"
                onClick={() => {
                    dispatch(postBio({ bio: bio }));
                    setEditor(!editor);
                }}
            >
                Save
            </button>
        </div>
    );

    return (
        <div>
            {!editor && <p>{userData.bio}</p>}
            {!userData.bio && addBioBtn}
            {userData.bio && editBioBtn}
            {editor && writeBio}
        </div>
    );
};
