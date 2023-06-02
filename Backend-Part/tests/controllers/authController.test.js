const db = require("../db");
let { mockRequest, mockResponse }= require("../interceptor")
let User = require("../../models/userModel");
let bcrypt=require("bcryptjs")
let { signup, signin }= require("../../controllers/authController")



let testPayload = {
    userId: "1",
    name: "test",
    password: "235",
    userType: "CUSTOMER",
    email: "test@gmail.com",
    userStatus: "APPROVED",
    ticketsCreated: [],
    ticketsAssigned:[]
    
}
let req, res;

beforeAll(async () => await db.connect());
beforeEach(() => {
     req = mockRequest();
     res = mockResponse();
})
    
afterEach(async () => await db.clearDatabase());
 afterAll(async () => await db.closeDatabase());



describe("signup", () => {
 
    it("User is created successfully", async () => {
         
       
        req.body = testPayload;

        
        await signup(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                userId: "1",
                name: "test",
                userType: "CUSTOMER",
                email: "test@gmail.com",
                userStatus: "APPROVED"
            }))

    })

    it("Error in user creation", async () => {
        
        const spy = jest.spyOn(User, "create").mockImplementation(cb => cb(new Error("Error occurred while creating the User")));

        testPayload.userType = "ENGINEER";
        req.body = testPayload;

        await signup(req, res)
        
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({
            message: "some internal error occurred while creating the user"
        })
    })
});

describe("signIn", () => {

    let spy1 = jest.spyOn(User, "findOne").mockImplementation(() =>
        new Promise((resolve, reject) => {
            if (req.body.userId == testPayload.userId) {
                return resolve(testPayload)
            } else {
                return resolve(undefined);
            }
            
        }))
    

   

    it("should fail due to password mismatch", async () => {

        let spy2 = jest.spyOn(bcrypt, "compareSync").mockReturnValue(false);
        req.body = {
            userId: testPayload.userId,
            password:"535",
        }

       

        await signin(req, res)

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({
            message: "Invalid Password"
        })
        
    })

    it("should fail as userStatus is PENDING",async () => {

        testPayload.userStatus = "PENDING"
        
        req.body = {
            userId: testPayload.userId,
            password: testPayload.password
        }
        
        await signin(req, res);

        expect(spy1).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({
            message: "Can't allow user to login as the userstatus is " + testPayload.userStatus
        })
        
    })

    it("should fail as userId doesn't exist", async () => {
       
        req.body = {
            userId: "3",
            password:testPayload.password
        }

        await signin(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Failed! userid doesn't exist"
        })
        
    })

    it("should pass and signin the user", async () => {

        let passwordChecking = jest.spyOn(bcrypt,"compareSync").mockReturnValue(true)
        testPayload.userStatus = "APPROVED";
        testPayload.userType="CUSTOMER"
        req.body = {
            userId: testPayload.userId,
            password:testPayload.password
        }

        await signin(req, res)
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                userId: "1",
                name: "test",
                email: "test@gmail.com",
                userStatus: "APPROVED",
                userType:"CUSTOMER"
            })
        )
        

    })
    
});







