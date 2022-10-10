const logout = (req,res,next) => {
    console.log("logging out")
    req.logout(function(err) {
        if (err) { return next(err); }
        console.log("successfully logged out")
        res.redirect("/api/v1/videos/archived")
    });
}

module.exports = {
    logout
}