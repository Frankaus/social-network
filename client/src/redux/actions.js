import axios from "../axios";

export const getFriendsList = async () => {
    try {
        let { data } = await axios.get("/api/getFriendsList");
        return {
            type: "GET_FRIENDS_LIST",
            friendsList: data,
        };
    } catch (err) {
        console.log("error in getFriendList action: ", err);
    }
};

export const acceptFriendship = async (userId) => {
    try {
        let { data } = await axios.post("/api/friends", {
            buttonText: "Accept friendship",
            recipientId: userId,
        });
        console.log("data: ", data);
        return {
            type: "ACCEPT_FRIENDSHIP",
            friendId: data.friendId,
        };
    } catch (err) {
        console.log("error in acceptFriendship action: ", err);
    }
};

export const cancelFriendship = async (userId) => {
    try {
        let { data } = await axios.post("/api/friends", {
            buttonText: "Cancel friend request",
            recipientId: userId,
        });
        return {
            type: "CANCEL_FRIENDSHIP",
            friendId: data.friendId,
        };
    } catch (err) {
        console.log("error in CancelFriendship action: ", err);
    }
};

export const getUserStatuses = async (id) => {
    try {
        let { data } = await axios.get("/api/getStatuses/" + id);
        return {
            type: "GET_STATUSES",
            statusList: data,
        };
    } catch (err) {
        console.log("error in getStatuses action: ", err);
    }
};

export const postStatus = async (statusText) => {
    try {
        let { data } = await axios.post("/api/postStatus", {
            status: statusText,
        });
        return {
            type: "POST_STATUS",
            data: data,
        };
    } catch (err) {
        console.log("error in postStatus: ", err);
    }
};

export const getFriendsStatuses = async (friendsIds) => {
    try {
        let { data } = await axios.post("/api/getFriendsStatuses", friendsIds);
        return {
            type: "GET_FRIENDS_STATUSES",
            friendsStatusList: data,
        };
    } catch (err) {
        console.log("error in getAllStatuses action: ", err);
    }
};

export const getTenMessages = (msgs) => {
    try {
        return {
            type: "GET_TEN_MESSAGES",
            data: msgs,
        };
    } catch (err) {
        console.log("error in getTenMessages action: ", err);
    }
};

export const showMessage = async (msg) => {
    try {
        return {
            type: "SHOW_MESSAGE",
            data: msg,
        };
    } catch (err) {
        console.log("error in sendMessageClient action: ", err);
    }
};

export const getUserData = async () => {
    try {
        let { data } = await axios.get("/api/userData");
        return {
            type: "GET_USER_DATA",
            data: data,
        };
    } catch (err) {
        console.log("error in getUserData action: ", err);
    }
};

export const toggleUploader = () => {
    return {
        type: "TOGGLE_UPLOADER",
    };
};

export const postBio = async (bio) => {
    try {
        let { data } = await axios.post("/submitBio", bio);
        return {
            type: "UPDATE_BIO",
            data: data.bio,
        };
    } catch (err) {
        console.log("error in postBio action: ", err);
    }
};

export const uploadPic = async (file) => {
    const fd = new FormData();
    fd.append("file", file.file);
    try {
        const { data } = await axios.post("/uploadProfilePic", fd);
        return {
            type: "UPDATE_PROFILE_PIC",
            url: data.profile_pic_url,
        };
    } catch (err) {
        console.log("error in uploadPic action: ", err);
    }
};

export const getOtherProfile = async (id) => {
    try {
        const { data } = await axios.get("/api/otherUser/" + id);
        return {
            type: "GET_OTHER_PROFILE",
            data: data,
        };
    } catch (err) {
        console.log("error in getOtherProfile action: ", err);
    }
};

export const getButtonText = async (id) => {
    try {
        let { data } = await axios.get("/api/friends/" + id);
        return {
            type: "UPDATE_BUTTON_TEXT",
            text: data.buttonText,
        };
    } catch (err) {
        console.log("error in getButtonText action: ", err);
    }
};

export const getDiscoverFriends = async (input) => {
    try {
        let { data } = await axios.get("/api/findPeople/" + input);
        return {
            type: "GET_DISCOVER_FRIENDS",
            data: data,
        };
    } catch (err) {
        console.log("error in getDiscoverFriends action: ", err);
    }
};
