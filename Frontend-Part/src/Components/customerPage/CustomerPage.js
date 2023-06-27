import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialTable from "@material-table/core";
import CreateUpdateTicket from "./createOrUpdateTicket";
import { getTickets } from "../../apiCalls/ticket";


let getAllTickets = "/crm/api/v1/tickets";
let getTicketById = "/crm/api/v1/tickets/:_id";
let updateTicket = "/crm/api/v1/tickets/:_id";


export default function CustomerPage() {
    let NavigateTo = useNavigate();
    let [ticketDetails, setTicketDetails] = useState([]);
    let [message, setMessage] = useState("")
    let [showModal, setShowModal] = useState(false);
    let [updateModal, setUpdateModal] = useState(false);
    let[rowData,setRowData]=useState({})
   

    useEffect(() => {
        if (!(localStorage.getItem("accessToken") && localStorage.getItem("userType") === "CUSTOMER")) {

            NavigateTo("/")
        }

        fetchTicketsData();
   

    },[])

      // wrapping an asynchronous funtion with async/await for inside useEffect
    let fetchTicketsData = async () => {
        await getTickets(getAllTickets).then((response) => {
            setTicketDetails(response.data)
            setMessage("")

        }).catch((err) => {
            console.log(err);
            setMessage(err.message)
        })

    }

    let logoutFn = () => {
        
        let ans = window.confirm("Are you sure ?");
        
        if (ans) {
            localStorage.clear();
            NavigateTo("/")
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
            <div className="d-flex justify-content-end">
                <button onClick={logoutFn} className="btn btn-primary mx-1">Logout</button>
            </div>
            <div className="mx-4 p-2 text-center">
                <h2 className="text-info" >{`welcome ${localStorage.getItem("username") } , how can we help you today`} </h2>
                <p> Take a look at all your tickets below !</p>
            </div>

            <div className=" mx-4 p-1">
               
                <MaterialTable
                    title="Tickets raised by you "
                    columns={columns}
                    data={ticketDetails}
                    onRowClick={(e, rowData) => {
                        setRowData(rowData)
                        setShowModal(true)
                    setUpdateModal(true)}}
                     />
            </div>
            <div className="text-center">
                <hr className=" bg-light" />
                <p className=" text-warning">
                    {message}
                </p>
                <p>Facing any issue ? Raise a ticket</p>
                <button onClick={() => setShowModal(true)} className="btn btn-lg btn-success ">Raise Ticket</button>
                
                
            </div>
            
            <div>
                 { updateModal === true ?
                    <CreateUpdateTicket showModal={showModal} setShowModal={setShowModal} updateModal={updateModal} setUpdateModal={setUpdateModal} title="update ticket" btnAction="update" fetchTicketsData={fetchTicketsData} rowData={rowData} /> :

                    <CreateUpdateTicket showModal={showModal} setShowModal={setShowModal} updateModal={updateModal} setUpdateModal={setUpdateModal} title="create a new ticket" btnAction="create" fetchTicketsData={fetchTicketsData} rowData={rowData} />
                   }
                
                
            </div>
           
        </div>
    )
}