import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialTable from "@material-table/core";
import getTickets from "../../apiCalls/ticket";

let getAllTickets = "/crm/api/v1/tickets";
let getTicketById = "/crm/api/v1/tickets/:_id";
let updateTicket ="/crm/api/v1/tickets/:_id"

export default function CustomerPage() {
    let NavigateTo = useNavigate();
   let [ticketDetails,setTicketDetails]= useState([])
   
    useEffect(() => {
        if (!(localStorage.getItem("accessToken") && localStorage.getItem("userType") === "CUSTOMER")) {

            NavigateTo("/")
        }
          
        getTickets(getAllTickets).then((response) => {
                setTicketDetails(response.data)

        }).catch((err) =>
            console.log(err))


    },[])


    let logoutFn = () => {
        
        let ans = window.confirm("Are you sure ?");
        
        if (ans) {
            localStorage.removeItem("accessToken")
            localStorage.removeItem('username');
            localStorage.removeItem("userType");

            window.location.reload();
        }
    }

    let columns = [
        { title: "ID", field: "_id" },
        { title: "TITLE", field: "title" },
        { title: "DESCRIPTION", field: "description" },
        { title: "ASSIGNEE", field: "assignee" },
        { title: "PRIORITY", field: "ticketPriority" },
        {title:"STATUS",field:"status"}
    ]
    

    return (
        <div className="vh-100 bg-dark text-white p-2">
            <div className="mx-4 p-5 text-center">
                <h2 className="text-info" >{`welcome ${localStorage.getItem("username") } , how can we help you`} </h2>
                <p> Take a look at all your tickets below !</p>
            </div>

            <div className=" mx-4 p-2">
               
                <MaterialTable
                    title="Tickets raised by you "
                    columns={columns}
                    data={ticketDetails}
                
                />
            </div>
           
        </div>
    )
}