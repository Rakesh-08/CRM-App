const db = require("../db");
let { mockRequest, mockResponse }= require("../interceptor")
let User= require("../../models/userModel")
let { signup, signin }= require("../../controllers/authController")



let testPayload = {
    userId: "1",
    name: "test",
    password: "235",
    userType: "CUSTOMER",
    email: "test@gmail.com",
    userStatus: "PENDING",
    ticketsCreated: [],
    ticketsAssigned:[]
    
}

describe("signup", () => {
    
beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase())

    it("User is created successfully", async () => {
         
        const req = mockRequest();
        const res = mockResponse();
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

        const req = mockRequest();
        const res = mockResponse();

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

    it("should fail due to password mismatch", () => {
        
    })

    it("should fail as userStatus is PENDING", () => {
        
    })

    it("should fail as userId doesn't exist", () => {
        
    })

    it("should pass and signin the user", () => {
        

    })
    
});







