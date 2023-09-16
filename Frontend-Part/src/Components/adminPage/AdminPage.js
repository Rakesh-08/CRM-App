import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom"
import {useDispatch } from "react-redux";
import Dashboard from "../Dashboard/dashboard";
import { InfoBox } from "../Dashboard/dashboard";
import MaterialTable from "@material-table/core";
import { Modal } from "react-bootstrap"
import { getUsers, updateUser } from "../../apiCalls/users";
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import LeadsData from "../Dashboard/LeadsData";


export default function AdminPage() {
    let NavigateTo = useNavigate();
    let [userStatus, setUserStatus] = useState({
        users: {
            total: 0,
            approved: 0,
            pending: 0,
            blocked: 0
        },
        engineers: {
            total: 0,
            approved: 0,
            pending: 0,
            blocked: 0
        }, sales_rep: {
            total: 0,
            approved: 0,
            pending: 0,
            blocked: 0
        },
    });
    let [editUserStatus, setEditUserStatus] = useState({ show: false, status: "APPROVED", userId: "" });
    let [ticketStatus, setTicketStatus] = useState({
        OPEN: 0,
        IN_PROGRESS: 0,
        BLOCKED: 0,
        CLOSED: 0,
        Total: 0,
    });
    let [adminRoutes, setAdminRoutes] = useState("tickets")
    let [customers, setCustomers] = useState([]);
    let [engineers, setEngineers] = useState([]);
    let [salesRep, setSalesRep] = useState([])

    


    let dispatch = useDispatch();

    useEffect(() => {
        if (!(localStorage.getItem("accessToken") && localStorage.getItem("userType") === "ADMIN")) {
            
             NavigateTo("/")
        }   

        getAllUsers() 
       
    }, [])

    

   let userType =  localStorage.getItem("userType") 

    let getTicketStatus = (obj) => {
        setTicketStatus(obj)
    }

    // get all users function
    let dummyFn = (userType, users, setter) => {
         getUsers(userType)
            .then((response) => {
                let d = response.data.Data;

                let approvedCount = d.filter(
                    (obj) => obj.userStatus == "APPROVED"
                ).length;
                let pendingCount = d.filter((obj) => obj.userStatus == "PENDING").length


                setter(d);


                setUserStatus((prevState) => ({
                    ...prevState,
                    [users]: {
                        total: d.length,
                        approved: approvedCount,
                        pending: pendingCount,
                        blocked: d.length - (approvedCount + pendingCount)
                    },
                }));
            })
            .catch((err) => console.log(err));
    };

    let getAllUsers = () => {

        dummyFn("CUSTOMER", 'users', setCustomers)
        dummyFn("ENGINEER", "engineers", setEngineers);
        dummyFn("SALES_REP", "sales_rep", setSalesRep)

    }

    //columns of user details table
    let toggle = adminRoutes == "users"
        ? {
            title: "Tickets Created",
            field: "ticketsCreated",
            render: (rowData) => rowData.ticketsCreated.length,
        }
        : adminRoutes == "engineers" ? {
            title: "Tickets Assigned",
            field: "ticketsAssigned",
            render: (rowData) => rowData.ticketsAssigned.length,
        } : {
            title: "Leads Assigned",
            field: "leadsAssigned",
            render: (rowData) => rowData.leadsAssigned.length,
        };


    let usersColumns = [
        { title: "ID", field: "_id" },
        { title: "Name", field: "name" },
        { title: "User Id", field: "userId" },
        { title: "Email", field: "email" },
        { title: "User Status", field: "userStatus" },
        toggle
    ];


    // update User status
    let updateUserStatus = () => {
        let { userId, status } = editUserStatus;

        updateUser(userId, { userStatus: status }).then((res) => {

            let sts = res.data[0].userType;


            if (sts == "CUSTOMER") {
                dummyFn("CUSTOMER", "users", setCustomers);
            } else if (sts == "ENGINEER") {
                dummyFn("ENGINEER", "engineers", setEngineers);
            } else {
                dummyFn("SALES_REP", "sales_rep", setSalesRep);
            }

        }).catch(err => console.log(err))

        setEditUserStatus({ show: false, status: "APPROVED", userId: "" })
    }


    // send email action
    let sendEmailAction =
        userType !== "CUSTOMER" && adminRoutes !== "users"
            ? {
                icon: EmailIcon,
                tooltip: "Send Email",
                onClick: (event, rowData) => {
                    dispatch({
                        type: "setContent",
                        payload: {
                            userId: rowData.reporter,
                            email: rowData.email,
                            toggle: true
                        },
                    });
                },
            }
            : null;


   
    
   
    let title = `Welcome ${ localStorage.getItem("username")},
        you are currently seeing the admin page ` 
        
       
 
    return (
        <div className="bg-info">
            <div>
                <Dashboard
                    title={title}
                    userType={userType}
                    getTicketStatus={getTicketStatus}
                    adminRoutes={adminRoutes}
                    engineers={engineers} >
                    

                     <div  className="my-4  px-2  d-flex flex-wrap ">
                    <div
                        className={` ${adminRoutes == "users" &&
                            " border-bottom border-primary border-2 "
                            } bg-transparent  m-2`}
                    >
                        <button
                            onClick={() => {
                                setAdminRoutes("users");
                            }}
                            className=" bg-transparent  border-0 mx-2"
                        >
                            users
                        </button>
                    </div>

                    <div
                        className={` ${adminRoutes == "engineers" &&
                            " border-bottom border-primary border-2  "
                            } bg-transparent  m-2`}
                    >
                        <button
                            onClick={() => {
                                setAdminRoutes("engineers");
                            }}
                            className=" bg-transparent  border-0 mx-2"
                        >
                            engineers
                        </button>
                    </div>

                    <div
                        className={` ${adminRoutes == "sales_rep" &&
                            " border-bottom border-primary border-2 "
                            } bg-transparent  m-2`}
                    >
                        <button
                            onClick={() => {
                                setAdminRoutes("sales_rep");
                            }}
                            className=" bg-transparent  border-0 mx-2"
                        >
                            Sales Representatives
                        </button>
                    </div>

                    <div
                        className={` ${adminRoutes == "leads" &&
                            " border-bottom border-primary border-2 "
                            } bg-transparent  m-2`}
                    >
                        <button
                            onClick={() => {
                                setAdminRoutes("leads");
                            }}
                            className=" bg-transparent  border-0 mx-2"
                        >
                            Leads
                        </button>
                    </div>
                    <div
                        className={` ${adminRoutes == "tickets" &&
                            " border-bottom border-primary border-2 "
                            } bg-transparent  m-2`}
                    >
                        <button
                            onClick={() => setAdminRoutes("tickets")}
                            className=" bg-transparent  border-0 mx-2"
                        >
                            tickets
                        </button>
                    </div>
                    </div>
                    
                    <div className="d-flex justify-content-center">


                        {adminRoutes == "tickets" && (
                            <>
                                {" "}
                                <div className="d-flex mt-3 ">
                                    <div className="bg-success p-2 rounded-3 m-1  text-center">
                                        <h4 className="my-5 lead">
                                            user Id:{" "}
                                            <span className="text-warning">
                                                {localStorage.getItem("userId")}
                                            </span>
                                        </h4>
                                        <p className="fs-5">
                                            Total Tickets:
                                            <span className="m-1 ">{ticketStatus.Total}</span>
                                        </p>
                                    </div>

                                    <div className="bg-danger p-2 d-flex m-1 flex-column align-items-center rounded-3  p-1">
                                        <div>
                                            <p className="fs-5 text-info">
                                                OPEN :
                                                <span className="mx-2 text-light">
                                                    {ticketStatus.OPEN}
                                                </span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="fs-5">
                                                IN PROGRESS :
                                                <span className="mx-2 text-light">
                                                    {ticketStatus.IN_PROGRESS}
                                                </span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="fs-5 text-warning">
                                                BLOCKED:
                                                <span className="mx-2 text-light">
                                                    {ticketStatus.BLOCKED}
                                                </span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="fs-5 text-dark">
                                                CLOSED :
                                                <span className="mx-2 text-light">
                                                    {ticketStatus.CLOSED}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Dashboard>
                

                {adminRoutes == "leads" &&
                    <div className="p-4">
                        <LeadsData />
                    </div>}
            </div>
           

            <div>
                
                {adminRoutes !== "tickets" && adminRoutes !== "leads" &&
                    <> <div className="d-flex flex-wrap justify-content-around px-4 m-4">
                        <InfoBox
                            info={adminRoutes}
                            count={userStatus[adminRoutes].total}
                            color="blue"
                        />
                        <InfoBox
                            info="approved"
                            count={userStatus[adminRoutes].approved}
                            color="green"
                        />
                        <InfoBox
                            info="pending"
                            count={userStatus[adminRoutes].pending}
                            color="grey"
                        />
                        <InfoBox
                            info="blocked"
                            count={userStatus[adminRoutes].blocked}
                            color="purple"
                        />
                </div>
                    <div className="m-1 p-4">
                              
                    <MaterialTable
                        title={
                            adminRoutes == "users"
                                ? "Customer details"
                                : adminRoutes == "engineers"
                                    ? "Engineer details"
                                    : " Sales Representatives "
                        }
                        data={
                            adminRoutes == "users"
                                ? customers
                                : adminRoutes == "engineers"
                                    ? engineers
                                    : salesRep
                        }
                        columns={usersColumns}
                        actions={[
                            sendEmailAction,
                            {
                                icon: EditIcon,
                                tooltip: "edit",
                                onClick: (e, rowData) => {
                                    setEditUserStatus({
                                        ...editUserStatus,
                                        show: true,
                                        userId: rowData.userId,
                                    });
                                },
                            },
                            ]}
                            
                            options={{
                                headerStyle: {
                                    backgroundColor: "black",
                                    color: "white",
                                    padding:"1em"
                                }
                            }}
                    />
                    </div>
                   
                    </>} 
                    <div className="p-5">
                        <Modal
                            show={editUserStatus.show}
                            onHide={() =>
                                setEditUserStatus({ ...editUserStatus, show: false })
                            }
                            backdrop="static"
                            centered
                        >
                            <Modal.Header
                                className="bg-primary text-white fs-4"
                                closeButton
                            >
                                Change the User Status
                            </Modal.Header>
                            <Modal.Body>
                                <div className="input-group m-2">
                                    <label className="m-2">user Status</label>
                                    <select
                                        value={editUserStatus.status}
                                        onChange={(e) =>
                                            setEditUserStatus({
                                                ...editUserStatus,
                                                status: e.target.value,
                                            })
                                        }
                                        className="form-control m-2 p-2"
                                    >
                                        <option value="APPROVED">APPROVED</option>
                                        <option value="PENDING">PENDING</option>
                                        <option value="BLOCKED">BLOCKED</option>
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={updateUserStatus}
                                    className="mx-auto btn btn-success"
                                >
                                    Done
                                </button>
                            </Modal.Body>
                        </Modal>
                    </div>
                
            </div>
           
        </div>
    )
}