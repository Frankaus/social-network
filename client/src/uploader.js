import { useDispatch } from "react-redux";
import { useState } from "react";
import { uploadPic, toggleUploader } from "./redux/actions";

export const Uploader = () => {
    const dispatch = useDispatch();

    const [file, setFile] = useState();

    return (
        <div>
            <input
                onChange={(e) => setFile({ file: e.target.files[0] })}
                type="file"
                name="profilePic"
            />
            <button
                onClick={() => {
                    dispatch(uploadPic(file));
                    dispatch(toggleUploader());
                }}
            >
                Upload
            </button>
        </div>
    );
};
