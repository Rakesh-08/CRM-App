import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import MaterialTable from "@material-table/core";
import CreateUpdateTicket from "./createOrUpdateTicket";
import { getTickets,deleteTicketApi } from "../../apiCalls/ticket";


let getAllTickets = "/crm/api/v1/tickets";
let deleteApiCall = "/crm/api/v1/tickets/";

let temp = {
    OPEN: 0,
    IN_PROGRESS: 0,
    BLOCKED: 0,
    CLOSED: 0,
    Total: 0
}

export default function CustomerPage() {
    let NavigateTo = useNavigate();
    let [ticketDetails, setTicketDetails] = useState([]);
    let [message, setMessage] = useState("")
    let [showModal, setShowModal] = useState(false);
    let [updateModal, setUpdateModal] = useState(false)
    let [ticketStatus, setTicketStatus] = useState(temp)
  
    useEffect(() => {
        if (!(localStorage.getItem("accessToken") && localStorage.getItem("userType") === "CUSTOMER")) {

            NavigateTo("/")
        }

        fetchTicketsData();
   

    }, [])
    
    let dispatch = useDispatch();

    let ticketDistribution = (data) => {
        
        
        for (let i = 0; i < data.length; i++){

            if (temp[data[i].status] == undefined) {
                 temp[data[i].status]=1
            } else {
                 temp[data[i].status] += 1
            }     
        }
        temp.Total = data.length;
        setTicketStatus(temp)
    }

      // wrapping an asynchronous funtion with async/await for inside useEffect
    let fetchTicketsData = async () => {
        await getTickets(getAllTickets).then((response) => {
            setTicketDetails(response.data)
            ticketDistribution(response.data);
            setMessage("")

        }).catch((err) => {
            console.log(err);
            setMessage(err.response.data.message)
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

    let deleteTicket = (id) => {

        let confirmation = window.confirm("Are you sure");

        if (confirmation) {

            deleteTicketApi(deleteApiCall + id)
                .then((response) => {
                    fetchTicketsData()
                    alert(`the ticket generated with id ${response.data._id} has been removed`)
                  
                }).catch(err => console.log(err))
            
        }
        
        
    }
    

    return (
        <div className=" bg-dark text-white pb-5 ">
            <div className="d-flex justify-content-end">
                <button onClick={logoutFn} className="btn btn-primary mx-3 mt-2">Logout</button>
            </div>
            <div className="mx-4  text-center">
                <h2 className="text-info fs-4" >{`welcome ${localStorage.getItem("username") } , how can we help you today`} </h2>
                <p> Take a look at all your tickets below !</p>
            </div>
            <h4 className="m-4 lead fs-4">Total Tickets:<span className="text-danger fs-3 fw-bold mx-2">{ticketStatus.Total }</span></h4>

            <div className="d-flex justify-content-around px-4 m-4">
                
                <InfoBox info="OPEN" count={ticketStatus.OPEN} />
                <InfoBox info="IN PROGRESS" count={ticketStatus.IN_PROGRESS} />
                <InfoBox info="BLOCKED" count={ticketStatus.BLOCKED} />
                <InfoBox info="CLOSED" count={ticketStatus.CLOSED} />
            
            </div>

            <div className=" mx-4 p-2 h-100">
               
                <MaterialTable
                    title="Tickets raised by you "
                    columns={columns}
                    data={ticketDetails}
                    actions={[
                       
                        {
                            icon:"D",
                            tooltip: 'Delete Ticket',
                            onClick: (event, rowData) => {deleteTicket(rowData._id)}
                            
                        }
                    ]}
                    options={{
                        actionsColumnIndex: -1
                    }}
                    onRowClick={(e, rowData) => {

                        dispatch({
                            type: "currentRow",
                            payload: {
                                title: rowData.title,
                                description: rowData.description,
                                priority: rowData.priority,
                                status: rowData.status,
                                _id:rowData._id
                            }
                        })
                        
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
                    <CreateUpdateTicket showModal={showModal} setShowModal={setShowModal} updateModal={updateModal} setUpdateModal={setUpdateModal} title="update ticket" btnAction="update" fetchTicketsData={fetchTicketsData}  /> :

                    <CreateUpdateTicket showModal={showModal} setShowModal={setShowModal} updateModal={updateModal} setUpdateModal={setUpdateModal} title="create a new ticket" btnAction="create" fetchTicketsData={fetchTicketsData}  />
                   }
                
                
            </div>
           
        </div>
    )
}



let InfoBox = ({info,count}) => {

    return (
        <div className=" d-flex align-items-center justify-content-center rounded-2 p-1 m-2 " style={{ backgroundColor: "purple",minWidth:"15vw" }}>
            <div className="text-center p-2 ">
                <h3 className=" text-warning fst-italic" style={{fontSize:"100%"}}>{info}</h3>
            <p className="fs-5 ">{count}</p>
            </div>
           
        </div>
    )
     
 }