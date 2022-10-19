const logout = (req,res,next) => {    
    if(req.user) {
        console.log("logging out user:", req.user)
        req.logout(function(err) {
            if (err) { return next(err); }
            console.log("successfully logged out")
            res.send("successfully logged out")
        });
    }
    
}

const getSession = (req,res,next) => {
    // res.send(req.user)
    res.status(200).send({
        user: req.user
    })
}

module.exports = {
    logout,
    getSession
}