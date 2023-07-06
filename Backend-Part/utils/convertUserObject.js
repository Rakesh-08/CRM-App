
module.exports = (users) => {
    let userResult = [];

    users.forEach(user => {
        let resObj = {
            _id:user._id
            name: user.name,
            email: user.email,
            userId: user.userId,
            userStatus: user.userStatus,
            userType: user.userType
        }

        userResult.push(resObj)
        if (user.userType == "CUSTOMER") {
             resObj.ticketsCreated= user.ticketsCreated
             
        } else if (user.userType == "ENGINEER") {
            resObj.ticketsAssigned= user.ticketsAssigned
        } 
        
    });
    return userResult;
}









