const spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:francesco:password@localhost:5432/socialnetwork"
);

exports.addUser = (firstName, lastName, email, password) => {
    return db.query(
        `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id`,
        [firstName, lastName, email, password]
    );
};

exports.verifyUserDataEmail = (email) => {
    return db.query(`SELECT * FROM users WHERE email=$1`, [email]);
};

exports.insertResetCode = (email, code) => {
    return db.query(`INSERT INTO reset_codes (email, code) VALUES ($1, $2)`, [
        email,
        code,
    ]);
};

exports.verifyResetCode = (email) => {
    return db.query(`SELECT code FROM reset_codes WHERE (CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes' AND email=$1) ORDER BY id DESC LIMIT 1`, [email]);
};

exports.updatePassword = (password, email) => {
    return db.query(`UPDATE users SET password=$1 WHERE email=$2`, [
        password,
        email,
    ]);
};

exports.getUserdata = (id) => {
    return db.query(`SELECT * FROM users WHERE id=$1`, [id]);
};

exports.uploadProfilePic = (filename, id) => {
    return db.query(
        `UPDATE users SET profile_pic_url=$1 WHERE id=$2 RETURNING profile_pic_url`,
        ["https://s3.amazonaws.com/spicedling/" + filename, id]
    );
};

exports.updateBio = (bio, id) => {
    return db.query(`UPDATE users SET bio=$1 WHERE id=$2 RETURNING bio`, [
        bio,
        id,
    ]);
};

exports.findPeople = () => {
    return db.query(`SELECT * FROM users ORDER BY id DESC LIMIT 3`);
};

exports.getMatchingUsers = (val) => {
    return db.query(
        `SELECT * FROM users WHERE firstname ILIKE $1 ORDER BY firstname ASC`,
        [val + "%"]
    );
};

exports.areFriends = (recipientId, senderId) => {
    return db.query(
        `SELECT * FROM friendships WHERE (recipient_id = $1 AND sender_id =$2) OR (recipient_id = $2 AND sender_id = $1) ORDER BY id DESC`,
        [recipientId, senderId]
    );
};

exports.askFriendship = (recipientId, senderId) => {
    return db.query(
        `INSERT INTO friendships (recipient_id, sender_id) VALUES ($1,$2)`,
        [recipientId, senderId]
    );
};

exports.cancelFriendship = (recipientId, senderId) => {
    return db.query(
        `DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id =$2) OR (recipient_id = $2 AND sender_id = $1)`,
        [recipientId, senderId]
    );
};

exports.acceptFriendship = (recipientId, senderId) => {
    return db.query(
        `UPDATE friendships SET accepted = true WHERE (recipient_id = $1 AND sender_id = $2)`, [recipientId, senderId]
    );
};

exports.getFriendsList = (id) => {
    return db.query(`
    SELECT users.id, firstname, lastname, profile_pic_url, accepted, sender_id
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = false AND recipient_id = users.id AND sender_id = $1)
    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
    `, [id]);
};

exports.getUserStatuses = (id) => {
    return db.query(`SELECT * FROM statuses WHERE userid=$1`, [id]);
};

exports.postStatus = (id, status) => {
    return db.query(`INSERT INTO statuses (userid, status) VALUES ($1, $2) RETURNING id, userid, status, created_at`, [id, status]);
};

exports.getFriendsStatuses = (ids) => {
    return db.query(`
    SELECT users.id, users.firstname, users.lastname, users.profile_pic_url, statuses.created_at, statuses.status
    FROM statuses
    JOIN users
    ON statuses.userid = users.id
    WHERE users.id = ANY($1)
    ORDER BY statuses.id DESC
    `, [ids]);
};

exports.getTenMessages = () => {
    return db.query(`SELECT users.firstname, users.lastname, users.profile_pic_url, messages.userid, messages.created_at, messages.text
    FROM messages
    JOIN users
    ON messages.userid = users.id
    ORDER BY messages.id DESC
    LIMIT 10`);
};

exports.insertMessage = (id, text) => {
    return db.query(`INSERT INTO messages (userid, text) VALUES ($1, $2)`, [id, text]);
};