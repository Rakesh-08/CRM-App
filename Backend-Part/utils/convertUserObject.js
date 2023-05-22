
module.exports = (users) => {
    let userResult = [];

    users.forEach(user => {

        userResult.push({
            name: user.name,
            email: user.email,
            userId: user.userId,
            userStatus: user.userStatus,
            userType:user.userType
        })
        
    });
    return userResult;
}









