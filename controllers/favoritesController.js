
const getFavorites = (req,res,next) => {
    
    if(!req.isAuthenticated()) {
        //redirect to login page?
        //or just show the login button in front end
    }
    console.log(req.user)
    res.status(200).send({data: req.user})
}

const addToFavorites = (req,res,next) => {
    if(!req.isAuthenticated()) {
        //throw error?
    }
    res.status(200).send("successfully added to faves")
}

const removeFromFavorites = () => {
    if(!req.isAuthenticated()) {
        //throw error?
    }
    res.status(200).send("successfully removed from favorites")
}

module.exports = {
    getFavorites,
    addToFavorites,
    removeFromFavorites
}