let { mockRequest,mockResponse } = require("../interceptor");
let ticketModel = require("../../models/ticketModel");
let userModel= require("../../models/userModel")
let {
    createTicket,
    updateTicket, getAllTickets,
    getTicketById,
    assignTicketToEngineer
} = require("../../controllers/ticketController");


let req, res;

beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
})

let ticketTestObject = {
    _id:"454",
    title: "fan not working",
    ticketPriority: 2,
    description: "fan is not working for the last threee days",
    status:"open"
}
let customer = {
    name: "Rakesh",
    userId: "123",
    password: "abc",
    email: "mandal@gmail.com",
    userType: "CUSTOMER",
    userStatus: "APPROVED",
    ticketsCreated: ["4tt", "2tt"],
    save:jest.fn().mockReturnValue(ticketTestObject)
} ;
let engineer = {
    name: "Rakesh",
    userId: "444",
    password: "abc",
    email: "mandal@gmail.com",
    userType: "ENGINEER",
    userStatus: "APPROVED",
    ticketsCreated: ["4tt", "2tt"],
    ticketsAssigned: ["4tt", "2tt"],
    save:jest.fn().mockReturnValue(Promise.resolve({}))
};



describe("create Ticket", () => {

    let sendEmail = jest.fn().mockReturnValue( Promise.resolve(ticketTestObject));
    let ticketSpy = jest.spyOn(ticketModel, "create").mockReturnValue(ticketTestObject)
    
 
 it("should pass and raise/create a ticket", async () => {
       
     let userSpy = jest.spyOn(userModel, "findOne").mockReturnValue(engineer); 
        req.userId = "123";

        req.body = ticketTestObject;

        await createTicket(req, res);

        expect(userSpy).toHaveBeenCalled();
        expect(ticketSpy).toHaveBeenCalled();
     expect(res.status).toHaveBeenCalledWith(200);
     expect(res.send).toHaveBeenCalledWith(
         expect.objectContaining({
             _id: "454",
             title: "fan not working",
             ticketPriority: 2,
             description: "fan is not working for the last threee days",
             status: "open"
         })
     )
    }
    )

    it("should fail due to promise rejection", async () => {
      
       req.userId = "123";

        req.body = ticketTestObject;
        let userSpy2 = jest.spyOn(userModel, "findOne").mockImplementation(() => { throw new Error("some error happend") });

        await createTicket(req,res);

        expect(userSpy2).toHaveBeenCalled();
        expect(ticketSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            message:"some internal server error occurred"
        })
  })
    
})


describe("update Ticket", () => {
  
    
    it("should fail as the ticketId is invalid",async () => {

        
        req.params = {
            _id:"453"
        }
        req.userId = "123";
        let sendEmail = jest.fn().mockReturnValue(Promise.resolve(ticketTestObject));
        let ticketSpy1 = jest.spyOn(ticketModel, "findOne").mockReturnValue(null)
        let userSpy = jest.spyOn(userModel, "findOne").mockReturnValue(engineer);

        await updateTicket(req,res)

        expect(ticketSpy1).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({
            message: "ticket does not exist"
        })
         
    })
    
    it("should pass and update the given ticket", async () => {

        req.params = {
            _id: "453"
        }
        req.userId = "123";
        let sendEmail = jest.fn().mockReturnValue(Promise.resolve(ticketTestObject));
        let ticketSpy1 = jest.spyOn(ticketModel, "findOne").mockReturnValue(ticketTestObject)
        let userSpy = jest.spyOn(userModel, "findOne").mockReturnValue(engineer);

        await updateTicket(req, res)

        expect(ticketSpy1).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({
            message: "ticket does not exist"
        })
        
    })

    it("should fail due to server error", async () => {
        
    })
})


xdescribe("get all the  Tickets", () => {

})


xdescribe("get Ticket by id", () => {

})


xdescribe("Assign tickets to engineer", () => {

})













