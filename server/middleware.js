const path = require("path");

exports.requireLoggedOutUser = (req, res, next) => {
    req.session.userId
        ? res.redirect("/")
        : res.sendFile(path.join(__dirname, "..", "client", "index.html"));

    next();
};

exports.requireLoggedInUser = (req, res, next) => {
    !req.session.userId
        ? res.redirect("/welcome")
        : res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    next();
};

exports.logUrl = (req, res, next) => {
    console.log(req.method, " on the path: ", req.url);
    next();
};
