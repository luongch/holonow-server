const logout = (req,res,next) => {
    console.log("logging out")
    req.logout(function(err) {
        if (err) { return next(err); }
        console.log("successfully logged out")
        res.send("successfully logged out")
    });
}

const getSession = (req,res,next) => {
    res.status(200).send({
        user: req.user
    })
}

module.exports = {
    logout,
    getSession
}