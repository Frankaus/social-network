const DEFAULT_STATE = {
    userData: {},
    friendsList: [],
    statusList: [],
    messages: [],
    otherProfile: {},
    uploaderVisible: false,
    buttonText: "",
    discoverFriendsList: [],
};

export function reducer(state = DEFAULT_STATE, action) {
    if (action.type === "GET_USER_DATA") {
        state = {
            ...state,
            userData: action.data,
        };
    }

    if (action.type === "GET_FRIENDS_LIST") {
        state = {
            ...state,
            friendsList: action.friendsList,
        };
    }

    if (action.type === "ACCEPT_FRIENDSHIP") {
        state = {
            ...state,
            friendsList: state.friendsList.map((user) => {
                if (user.id === action.friendId) {
                    return {
                        ...user,
                        accepted: true,
                    };
                } else {
                    return user;
                }
            }),
        };
    }

    if (action.type === "CANCEL_FRIENDSHIP") {
        state = {
            ...state,
            friendsList: state.friendsList.filter(
                (user) => user.id !== action.friendId
            ),
        };
    }

    if (action.type === "GET_STATUSES") {
        state = {
            ...state,
            statusList: action.statusList,
        };
    }

    if (action.type === "POST_STATUS") {
        state = {
            ...state,
            statusList: [...state.statusList, action.data],
        };
    }

    if (action.type === "GET_FRIENDS_STATUSES") {
        state = {
            ...state,
            friendsStatusList: action.friendsStatusList,
        };
    }

    if (action.type === "GET_TEN_MESSAGES") {
        state = {
            ...state,
            messages: action.data,
        };
    }

    if (action.type === "SHOW_MESSAGE") {
        state = {
            ...state,
            messages: [...state.messages, action.data],
        };
    }

    if (action.type === "TOGGLE_UPLOADER") {
        state = {
            ...state,
            uploaderVisible: !state.uploaderVisible,
        };
    }

    if (action.type === "UPDATE_BIO") {
        state = {
            ...state,
            userData: {
                ...state.userData,
                bio: action.data,
            },
        };
    }

    if (action.type === "UPDATE_PROFILE_PIC") {
        state = {
            ...state,
            userData: {
                ...state.userData,
                profile_pic_url: action.url,
            },
        };
    }

    if (action.type === "GET_OTHER_PROFILE") {
        state = {
            ...state,
            otherProfile: action.data,
        };
    }

    if (action.type === "UPDATE_BUTTON_TEXT") {
        state = {
            ...state,
            buttonText: action.text,
        };
    }

    if (action.type === "GET_DISCOVER_FRIENDS") {
        state = {
            ...state,
            discoverFriendsList: action.data,
        };
    }

    return state;
}
