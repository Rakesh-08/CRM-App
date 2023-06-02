let { connect, clearDatabase, closeDatabase } = require("../db");
let { mockRequest, mockResponse } = require("../interceptor")
let User = require("../../models/userModel");
let { getAllUsers, getUserById, updateUserById } = require("../../controllers/userController.js")
let convertUserObject = require("../../utils/convertUserObject");

let req, res;

beforeAll(async()=>await connect())
beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
})
afterEach(async () => await clearDatabase());
 afterAll(async () => await closeDatabase());

let ResponseArray = [{
    name: "Rakesh",
    userId: "123",
    password: "abc",
    email: "mandal@gmail.com",
    userType: "CUSTOMER",
    userStatus: "APPROVED",
    ticketsCreated:["4tt","2tt"]
}, {
        name: "Rakesh",
        userId: "444",
        password: "abc",
        email: "mandal@gmail.com",
        userType: "ENGINEER",
        userStatus: "PENDING",
        ticketsAssigned: ["4tt", "2tt"]
    }, {
        name: "Rakesh",
        userId: "555",
        password: "abc",
        email: "mandal@gmail.com",
        userType: "ADMIN",
        userStatus: "APPROVED",
       
    }]



describe("FindAll", () => {

    it("should get me all the users", async () => {

        let spy1 = jest.spyOn(User, "find").mockReturnValue(ResponseArray)
       
        
        await getAllUsers(req, res)
        
        expect(spy1).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            Data: convertUserObject(ResponseArray),
            message: "sucessfully fetched all the users"
        })
        
    })

    it("should fails", async () => {

        let spy2 = jest.spyOn(User, "find").mockReturnValue(new Promise ((resolve,reject)=> reject( Error("some error happened"))))
    
    await getAllUsers(req, res);

    expect(spy2).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({
        message:"some internal server error occurred"
    })

    })
    
});

describe("FindById", () => {
    

    it("should get me the user by id", async () => {

        req.params={userId:"444"}

        let spy3 = jest.spyOn(User, "findOne").mockReturnValue(ResponseArray[0]);

        await getUserById(req, res)
        
        expect(spy3).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(convertUserObject([ResponseArray[0]]))

    })
    it("should get me all the users", async () => {

        req.params = { userId: "444" }

        let spy4 = jest.spyOn(User, "findOne").mockReturnValue(null);

        await getUserById(req, res)
        
        expect(spy4).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({
            message: "user doesn't exist"
        })

    })

})

describe("updateUserById", () => {

    let objectPassed = {
        name: "Mandal",
        userType: "Engineer",
        userStatus: "APPROVED"

    }

    it("should get me all the users", async () => {
       
        
        req.body = objectPassed;
        req.params = { userId: "444" }

     let spy5 = jest.spyOn(User, "findOneAndUpdate").mockReturnValue(ResponseArray[1])
        await updateUserById(req, res)
        
        expect(spy5).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(convertUserObject([ResponseArray[1]]))

    })

    it("should get me all the users", async () => {

        req.body = objectPassed;
        req.params = { userId: "444" }

        let spy5 = jest.spyOn(User, "findOneAndUpdate").mockReturnValue(null)
        await updateUserById(req, res)

        expect(spy5).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({
            message:"user with 444 doesn't exist"
        })
    })

})