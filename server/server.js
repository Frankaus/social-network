const secrets = require("./secrets.json");
const express = require("express");
const app = express();
const server = require("http").Server(app);

const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(
            null,
            req.headers.referer.startsWith("http://localhost:3000") ||
                req.headers.referer.startsWith("http://mysite.herokuapp.com")
        ),
});
const compression = require("compression");
const path = require("path");
const db = require("./db");
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    secret: "coding is fun",
    maxAge: 1000 * 60 * 60 * 2,
});
const { hash, compare } = require("./bcrypt");
const csurf = require("csurf");
const { sendEmail, upload } = require("./aws");
const cryptoRandomString = require("crypto-random-string");
const { uploader } = require("./upload");

const {
    requireLoggedOutUser,
    requireLoggedInUser,
    logUrl,
} = require("./middleware");

//////////////////////////
////   MIDDLEWARES    ////
//////////////////////////

app.use(logUrl);

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    cookieSession({
        secret: secrets.sessionSecret,
        maxAge: 1000 * 60 * 60 * 2,
    })
);

app.use(cookieSessionMiddleware);

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.json());

//////////////////////////
////     WELCOME      ////
//////////////////////////

app.get("/welcome", requireLoggedOutUser, (req, res) => {
    console.log("req.session: ", req.session);
});

app.get("/logout", (req, res) => {
    req.session = null;
    console.log("cookies were deleted");
    res.redirect("/welcome");
});

//////////////////////////
////   REGISTRATION   ////
//////////////////////////

app.post("/registration", async (req, res) => {
    let { firstname, lastname, email, password } = req.body;

    try {
        let hashedPw = await hash(password);
        let result = await db.addUser(firstname, lastname, email, hashedPw);
        req.session.userId = result.rows[0].id;
        res.json(result);
    } catch (err) {
        console.log("error in addUser insert or hashPw: ", err);
        if (err.code == "23505") {
            return res.json({
                errorDuplicate: true,
            });
        }
        res.json({
            error: true,
        });
    }
});

//////////////////////////
////       LOGIN      ////
//////////////////////////

app.post("/login", async (req, res) => {
    try {
        let result = await db.verifyUserDataEmail(req.body.email);
        if (result.rowCount === 0) {
            return res.json({
                errorInvalidData: true,
            });
        }
        if (result.rows[0].email == req.body.email) {
            let match = await compare(
                req.body.password,
                result.rows[0].password
            );
            if (match) {
                req.session.userId = result.rows[0].id;
                return res.json({
                    userValid: true,
                });
            } else {
                return res.json({
                    errorInvalidData: true,
                });
            }
        }
    } catch (err) {
        console.log("error in verifyUserDataEmail: ", err);
        return res.json({
            errorInvalidData: true,
        });
    }
});

//////////////////////////
////    RESET PWD     ////
//////////////////////////

app.post("/password/reset/start", async (req, res) => {
    try {
        let result = await db.verifyUserDataEmail(req.body.email);
        if (result.rowCount === 0) {
            return res.json({
                errorInvalidData: true,
            });
        }
        let secretCode = cryptoRandomString({
            length: 6,
        });
        await db.insertResetCode(req.body.email, secretCode);
        await sendEmail(
            "road.dragonfruit@spicedling.email",
            `Here is your reset code: ${secretCode}
            Please, note that this code is valid for only 10 minutes.
            Enjoy!`,
            "Your reset code from TwitterRedux"
        );
        res.json({
            emailSent: true,
        });
    } catch (err) {
        console.log("error in verifyUserDataEmail", err);
        return res.json({
            errorServer: true,
        });
    }
});

app.post("/password/reset/verify", async (req, res) => {
    try {
        let { rows } = await db.verifyResetCode(req.body.email);
        if (!rows.length) {
            return res.json({ resetCodeExpired: true });
        }
        if (rows[0].code == req.body.code) {
            let hashedPw = await hash(req.body.password);
            await db.updatePassword(hashedPw, req.body.email);
            return res.json({ updatedPassword: true });
        }
    } catch (err) {
        console.log("error in verifyResetCode: ", err);
        return res.json({ errorServer: true });
    }
});

//////////////////////////
////     HOME/APP     ////
//////////////////////////

app.get("/api/userData", async (req, res) => {
    try {
        const { rows } = await db.getUserdata(req.session.userId);
        res.json(rows[0]);
    } catch (err) {
        console.log("error in userData server: ", err);
    }
});

//////////////////////////
////     PROFILE      ////
//////////////////////////

app.post(
    "/uploadProfilePic",
    uploader.single("file"),
    upload,
    async (req, res) => {
        try {
            const { rows } = await db.uploadProfilePic(
                req.file.filename,
                req.session.userId
            );
            res.json(rows[0]);
        } catch (err) {
            console.log("error in db uploadProfilePic: ", err);
        }
    }
);

app.post("/submitBio", async (req, res) => {
    try {
        let { rows } = await db.updateBio(req.body.bio, req.session.userId);
        res.json(rows[0]);
    } catch (err) {
        console.log("error in updateBio server: ", err);
        res.json({ errorServer: true });
    }
});

//////////////////////////
////   OTHER PROFILE  ////
//////////////////////////

app.get("/api/otherUser/:id", async (req, res) => {
    try {
        let { rows } = await db.getUserdata(req.params.id);
        if (rows.length == 0) {
            return res.json({ userNotFound: true });
        }
        res.json(rows[0]);
    } catch (err) {
        console.log("error in getUserData server: ", err);
    }
});

app.get("/api/getStatuses/:id", async (req, res) => {
    let { rows } = await db.getUserStatuses(req.params.id);
    res.json(rows);
});

app.post("/api/postStatus", async (req, res) => {
    try {
        let { rows } = await db.postStatus(req.session.userId, req.body.status);
        res.json(rows[0]);
    } catch (err) {
        console.log("error in postStatus server: ", err);
    }
});

//////////////////////////
////      USERS       ////
//////////////////////////

app.get("/api/findPeople/:name", async (req, res) => {
    if (req.params.name == "undefined") {
        try {
            let { rows } = await db.findPeople();
            res.json(rows);
        } catch (err) {
            console.log("error in findPeople server: ", err);
        }
    } else {
        try {
            let { rows } = await db.getMatchingUsers(req.params.name);
            res.json(rows);
        } catch (err) {
            console.log("error in findPeopleUserInput server: ", err);
        }
    }
});

//////////////////////////
////      FRIENDS     ////
//////////////////////////

app.get("/api/friends/:id", async (req, res) => {
    let recipientId = req.params.id;
    let senderId = req.session.userId;

    try {
        let { rows } = await db.areFriends(recipientId, senderId);
        if (!rows.length) {
            return res.json({ buttonText: "Ask friendship" });
        }
        if (rows[0].accepted) {
            return res.json({ buttonText: "End friendship" });
        }
        if (!rows[0].accepted) {
            if (rows[0].sender_id == senderId) {
                return res.json({ buttonText: "Cancel friend request" });
            }
            if (rows[0].sender_id == recipientId) {
                return res.json({ buttonText: "Accept friendship" });
            }
        }
    } catch (err) {
        console.log("error in get friends server: ", err);
    }
});

app.post("/api/friends", async (req, res) => {
    let senderId = req.session.userId;
    let recipientId = req.body.recipientId;
    if (req.body.buttonText == "Ask friendship") {
        try {
            let result = await db.askFriendship(recipientId, senderId);
            // console.log("result askFriendship: ", result);
            return res.json({ askFriendship: true });
        } catch (err) {
            console.log("error in askFriendship server: ", err);
        }
    }
    if (
        req.body.buttonText == "End friendship" ||
        req.body.buttonText == "Cancel friend request"
    ) {
        try {
            let result = await db.cancelFriendship(senderId, recipientId);
            // console.log("result cancelFriend: ", result);
            return res.json({
                cancelFriendship: true,
                friendId: recipientId,
            });
        } catch (err) {
            console.log("error in cancelFriendship server: ", err);
        }
    }
    if (req.body.buttonText == "Accept friendship") {
        try {
            let result = await db.acceptFriendship(senderId, recipientId);
            // console.log("result acceptFriend: ", result);
            return res.json({
                acceptFriendship: true,
                friendId: recipientId,
            });
        } catch (err) {
            console.log("error in cancelFriendship server: ", err);
        }
    }
});

app.get("/api/getFriendsList", async (req, res) => {
    try {
        let { rows } = await db.getFriendsList(req.session.userId);
        // console.log("rows server: ", rows);
        res.json(rows);
    } catch (err) {
        console.log("error in getFriendsList server: ", err);
    }
});

//////////////////////////
////     HOME FEED    ////
//////////////////////////

app.post("/api/getFriendsStatuses", async (req, res) => {
    try {
        let { rows } = await db.getFriendsStatuses(req.body);
        res.json(rows);
    } catch (err) {
        console.log("error in getFriendsStatuses server: ", err);
    }
});

app.get("*", requireLoggedInUser, (req, res) => {});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

//////////////////////////
////     SOCKETS      ////
//////////////////////////

io.on("connection", async (socket) => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    let { rows } = await db.getTenMessages();
    socket.emit("getTenMessages", rows.reverse());

    socket.on("sendMessageServer", async (text, date) => {
        try {
            let insert = await db.insertMessage(userId, text);
            // console.log('result from insertMessage: ', insert);
            let { rows } = await db.getUserdata(userId);
            let msg = {
                created_at: date,
                firstname: rows[0].firstname,
                lastname: rows[0].lastname,
                profile_pic_url: rows[0].profile_pic_url,
                text: text,
            };
            io.emit("sendMessageClient", msg);
        } catch (err) {
            console.log("error in insertMessage server: ", err);
        }
    });

    console.log(`Connection: Socket with id: ${socket.id} has connected!`);
    console.log(`Connection: Socket USERID: ${userId}`);

    socket.on("disconnect", () => {
        console.log(
            `Disconnection: Socket with id: ${socket.id} just disconnected!`
        );
    });
});
