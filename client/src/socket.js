import { getTenMessages, showMessage } from "./redux/actions";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("getTenMessages", (msgs) => {
            store.dispatch(getTenMessages(msgs));
        });

        socket.on("sendMessageClient", (msg) => {
            store.dispatch(showMessage(msg));
        });
    }
};
