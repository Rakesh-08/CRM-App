import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import MaterialTable from "@material-table/core";
import CreateUpdateTicket from "./createOrUpdateTicket";
import { getTickets, deleteApiCall, getEmail, sendEmail,assignEngineerToTicket } from "../../apiCalls/ticket";
import { getUsers,updateUser } from "../../apiCalls/users";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { Modal } from "react-bootstrap";




let getAllTickets = "/crm/api/v1/tickets";
let deleteTicketApi = "/crm/api/v1/tickets/";
let getEmailApi = "/crm/api/v1/getEmail/";
let getUsersApi = "/crm/api/v1/users";
let updateUserStatusApi = "/crm/api/v1/users/";
let assignEngineerApi = "/crm/api/v1/assignTickets";


let initialEmailObject = {
  userId: "",
  email:"",
  subject: "",
  content:""
}


export default function Dashboard({ title, userType, bg }) {
  let NavigateTo = useNavigate();
  let [ticketDetails, setTicketDetails] = useState([]);
  let [message, setMessage] = useState("");
  let [showModal, setShowModal] = useState(false);
  let [updateModal, setUpdateModal] = useState(false);
  let [ticketStatus, setTicketStatus] = useState({
    OPEN: 0,
    IN_PROGRESS: 0,
    BLOCKED: 0,
    CLOSED: 0,
    Total: 0,
  });
  let [userStatus, setUserStatus] = useState({
    users: {
      total: 0,
      approved: 0,
      pending: 0,
      blocked:0
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
      blocked:0
    },
  });
  let [showEmailModal, setShowEmailModal] = useState(false);
  let [editUserStatus,setEditUserStatus]=useState({show:false,status:"APPROVED",userId:""})
  let [emailObject, setEmailObject] = useState(initialEmailObject);

  let [assignEngineer,setAssignEngineer]=useState({ticketId:"",engineerUserId:"",change:false,show:false})
  let [adminRoutes, setAdminRoutes] = useState("tickets")
  let [leadsData,setLeadsData]= useState([])
  let [customers, setCustomers] = useState([]);
  let [engineers, setEngineers] = useState([]);
  let [salesRep,setSalesRep] =useState([])
  


  useEffect(() => {
    fetchTicketsData();
   userType == 'ADMIN' && getAllUsers() 
  }, []);

  let dispatch = useDispatch();

  // set different status of tickets
  let ticketDistribution = (data) => {
    let temp = {
      OPEN: 0,
      IN_PROGRESS: 0,
      BLOCKED: 0,
      CLOSED: 0,
      Total: 0,
    };

    for (let i = 0; i < data.length; i++) {
      temp[data[i].status] += 1;
    }
    temp.Total = data.length;
    setTicketStatus(temp);
  };

  // wrapping an asynchronous funtion with async/await for inside useEffect
  let fetchTicketsData = async () => {
    await getTickets(getAllTickets)
      .then((response) => {
        setTicketDetails(response.data);
        ticketDistribution(response.data);
        setMessage("");
      })
      .catch((err) => {
        console.log(err);
        setMessage(err.response.data.message);
      });
  };

  // logout function
  let logoutFn = () => {
    let ans = window.confirm("Are you sure ?");

    if (ans) {
      localStorage.clear();
      NavigateTo("/");
    }
  };
  
  // get all users function
  
    let dummyFn = (userType, users, setter) => {
      return getUsers(getUsersApi, userType)
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
              blocked:d.length -(approvedCount + pendingCount)
            },
          }));
        })
        .catch((err) => console.log(err));
    };
  

  let getAllUsers =  () => {
     dummyFn("CUSTOMER", 'users', setCustomers) 
    dummyFn("ENGINEER", "engineers", setEngineers); 
    dummyFn("SALES_REP","sales_rep",setSalesRep)
    
  }


  // columns of ticket table with its label
  let columns = [
    { title: "ID", field: "_id" },
    { title: "TITLE", field: "title" },
    { title: "DESCRIPTION", field: "description" },
    { title: "PRIORITY", field: "ticketPriority" },
    { title: "STATUS", field: "status" },
    { title: "COMMENTS", field: "comments" },
  ];

  // columns of leads table

  let leadsColumns = [
    { title: "Id", field: "_id" },
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Mobile", field: "mobile" },
    { title: "Age", field: "age" },
    { title: "Address", field: "address" },
    { title: "Sales Representative", field: "assignedTo" },
  ];

  //columns of user details table
  let toggle = adminRoutes == "users"
      ? {
          title: "Tickets Created",
          field: "ticketsCreated",
          render: (rowData) => rowData.ticketsCreated.length,
        }
      :adminRoutes == "engineers"? {
          title: "Tickets Assigned",
          field: "ticketsAssigned",
          render: (rowData) => rowData.ticketsAssigned.length,
        }:{
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

  

  // toggle between reporter or assignee on same table
  let ticketTableTitle;
  let deleteOrAssignAction

 

  if (userType == "CUSTOMER") {
    ticketTableTitle = "Tickets raised by you";
    columns = [...columns, { title: "ASSIGNEE", field: "assigneeName" }];
   deleteOrAssignAction= {
                  icon: DeleteIcon,
                  tooltip: "Delete Ticket",
                  onClick: (event, rowData) => {
                    deleteTicket(rowData._id);
                  },
                }
    
  } else if (userType == "ENGINEER") {
    ticketTableTitle="Tickets assigned to you"
    columns = [...columns, { title: "REPORTER", field: "reporterName" }];
  } else {
    ticketTableTitle = "tickets created by all customers";
    deleteOrAssignAction = {
      icon:AssignmentIndIcon,
      tooltip: "change engineer",
      onClick: (e, rowData) => {
           setAssignEngineer({...assignEngineer,ticketId:rowData._id,engineerUserId:rowData.assignee,show:true})
      }
    }
     columns = [
       ...columns,
       { title: "REPORTER", field: "reporterName" },
       { title: "ASSIGNEE", field: "assigneeName" },
     ];
  }

  // send email action
  let sendEmailAction =
    userType !== "CUSTOMER" && adminRoutes!=="users"
      ? {
          icon: EmailIcon,
          tooltip: "Send Email",
          onClick: (event, rowData) => {
            setShowEmailModal(true);
            setEmailObject({  userId: rowData.reporter ,email:rowData.email });
          },
        }
      : null;

  // deletet ticket function
  let deleteTicket = (id) => {
    let confirmation = window.confirm("Are you sure");

    if (confirmation) {
      deleteApiCall(deleteTicketApi + id)
        .then((response) => {
          fetchTicketsData();
          alert(
            `the ticket generated with id ${response.data._id} has been removed`
          );
        })
        .catch((err) => console.log(err));
    }
  };

  // update User status
  let updateUserStatus = () => {
    let { userId, status } = editUserStatus;
  
    updateUser(updateUserStatusApi + userId, { userStatus: status }).then((res) => {
        
      let sts = res.data[0].userType;
  

      if (sts == "CUSTOMER") {
        dummyFn("CUSTOMER", "users", setCustomers);
      } else if(sts=="ENGINEER"){
        dummyFn("ENGINEER", "engineers", setEngineers);
      } else {
        dummyFn("SALES_REP", "sales_rep", setSalesRep);
    }

    }).catch(err => console.log(err))

    setEditUserStatus({ show: false, status: "APPROVED", userId: "" })
  }
 
  
  // assign or change the engineer 
  let AssignEngineerFn = () => {
    
    let temp = {
      ticketId: assignEngineer.ticketId,
      engineerUserId: assignEngineer.engineerUserId,
      change:assignEngineer.change
    }
    
    assignEngineerToTicket(assignEngineerApi, temp).then((response) => {
      fetchTicketsData();
      alert(response.data.message)
       setAssignEngineer({
         ticketId: "",
         engineerUserId: "",
         change: false,
         show: false,
       });
    }).catch((err) => {
      alert(err.response.data.message)
      console.log(err)
    })
   
  }

  // send email function
  let sendEmailFn = async(e) => {
    e.preventDefault();
    let emails;

    if (emailObject.email) {
      emails = emailObject.email;
    } else {
        let resonse = await getEmail(getEmailApi, emailObject.userId)
       emails = resonse.data;
    }

    let temp = {
      emails: emails,
      subject: emailObject.subject,
      content:emailObject.content
    }
   
    sendEmail(temp).then((response) => {
      setMessage(response.data.message)
      setTimeout(() => {
         setMessage("")
      },10000)
    }).catch(err=>console.log(err))
    
    setShowEmailModal(false);
  };

  return (
    <div className={` ${bg} text-white pb-5 `}>
      <div className="d-flex justify-content-between  bg-dark sticky-top p-2 mb-3">
        <div className="my-1">
          <p>
            CUSTOMER
            <span className="mx-1 text-success fst-italic fw-bold">
              {" "}
              SUPPORT SERVICE
            </span>
          </p>
        </div>
        <button onClick={logoutFn} className="btn btn-warning mx-3 mt-2">
          Logout
        </button>
      </div>
      <div className="mx-4 p-3  text-center">
        <h2 className=" fs-4">{title}</h2>
        {userType !== "SALES_REP" && <p> Take a look at all tickets below !</p>}
      </div>

      {userType !== "ADMIN" ||
        (userType !== "SALES_REP" && (
          <h4 className="m-4 lead fs-4">
            Total Tickets:
            <span className="text-danger fs-3 fw-bold mx-2">
              {ticketStatus.Total}
            </span>
          </h4>
        ))}

      {userType == "ADMIN" ? (
        <div>
          <div style={{ height: "2.2em" }} className="my-4 mx-2 px-2  d-flex ">
            <div
              className={` ${
                adminRoutes == "users" &&
                " border-bottom border-primary border-2 "
              } bg-transparent  mx-2`}
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
              className={` ${
                adminRoutes == "engineers" &&
                " border-bottom border-primary border-2  "
              } bg-transparent  mx-2`}
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
              className={` ${
                adminRoutes == "sales_rep" &&
                " border-bottom border-primary border-2 "
              } bg-transparent  mx-2`}
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
              className={` ${
                adminRoutes == "leads" &&
                " border-bottom border-primary border-2 "
              } bg-transparent  mx-2`}
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
              className={` ${
                adminRoutes == "tickets" &&
                " border-bottom border-primary border-2 "
              } bg-transparent  mx-2`}
            >
              <button
                onClick={() => setAdminRoutes("tickets")}
                className=" bg-transparent  border-0 mx-2"
              >
                tickets
              </button>
            </div>
          </div>
          {adminRoutes == "tickets" && (
            <>
              {" "}
              <div className="d-flex justify-content-around mt-3">
                <div className="bg-success rounded-3 w-25 text-center">
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

                <div className="bg-danger d-flex flex-column align-items-center rounded-3 w-25 p-1">
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
      ) : (
        <div>
          {userType !== "SALES_REP" && (
            <div className="d-flex flex-wrap justify-content-around px-4 m-4">
              <InfoBox info="OPEN" count={ticketStatus.OPEN} color="blue" />
              <InfoBox
                info="IN PROGRESS"
                count={ticketStatus.IN_PROGRESS}
                color="green"
              />
              <InfoBox
                info="BLOCKED"
                count={ticketStatus.BLOCKED}
                color="grey"
              />
              <InfoBox
                info="CLOSED"
                count={ticketStatus.CLOSED}
                color="purple"
              />
            </div>
          )}
        </div>
      )}

      <div className=" mx-4 px-5 mt-3 h-100">
        {adminRoutes == "tickets" && userType !== "SALES_REP" ? (
          <>
            <MaterialTable
              title={ticketTableTitle}
              columns={columns}
              data={ticketDetails}
              actions={[sendEmailAction, deleteOrAssignAction]}
              options={{
                actionsColumnIndex: -1,
              }}
              onRowClick={(e, rowData) => {
                dispatch({
                  type: "currentRow",
                  payload: {
                    title: rowData.title,
                    description: rowData.description,
                    priority: rowData.ticketPriority,
                    status: rowData.status,
                    _id: rowData._id,
                    comments: rowData.comments,
                    engineerUserId: rowData.assignee,
                  },
                });

                setShowModal(true);
                setUpdateModal(true);
              }}
            />
          </>
        ) : adminRoutes == "leads" || userType == "SALES_REP" ? (
          <>
            <div>
              <MaterialTable
                title="Leads Data"
                columns={leadsColumns}
                data={leadsData}
                actions={[sendEmailAction]}
                options={{
                  actionsColumnIndex: -1,
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="d-flex flex-wrap justify-content-around px-4 m-4">
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
            />
            <div>
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
          </>
        )}

        <div>
          <Modal
            show={assignEngineer.show}
            onHide={() => setAssignEngineer({ ...assignEngineer, show: false })}
            backdrop="static"
          >
            <Modal.Header className="bg-secondary text-white fs-4" closeButton>
              Change the Assigned Engineer
            </Modal.Header>
            <Modal.Body>
              <h4 className="my-3 p-1 lead fs-5">
                Ticket : {assignEngineer.ticketId}
              </h4>
              <div className="input-group m-2">
                <label className="m-2">Assign Engineeer</label>
                <select
                  value={assignEngineer.engineerUserId}
                  onChange={(e) =>
                    setAssignEngineer({
                      ...assignEngineer,
                      engineerUserId: e.target.value,
                    })
                  }
                  className="form-control mx-2 "
                >
                  {engineers
                    .filter((obj) => obj.userStatus == "APPROVED")
                    .map((eng) => (
                      <option key={eng._id} value={eng.userId}>
                        {eng.userId}
                      </option>
                    ))}
                </select>
              </div>
              <div className="input-group row m-2">
                <label className="mx-2 col-md-3">Confirm</label>
                <select
                  className="form-control  mx-2 "
                  value={assignEngineer.change}
                  onChange={(e) =>
                    setAssignEngineer({
                      ...assignEngineer,
                      change: e.target.value,
                    })
                  }
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              <button
                type="button"
                onClick={AssignEngineerFn}
                className="mx-auto btn btn-primary"
              >
                Done
              </button>
            </Modal.Body>
          </Modal>
        </div>
      </div>
      <div className="text-center">
        <hr className=" bg-light" />
        {userType !== "SALES_REP" && <p className=" text-warning">{message}</p>}
        {userType == "CUSTOMER" && (
          <>
            <p>Facing any issue ? Raise a ticket</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-lg btn-success "
            >
              Raise Ticket
            </button>{" "}
          </>
        )}
      </div>

      <div>
        {showEmailModal && (
          <Modal
            show={showEmailModal}
            onHide={() => {
              setShowEmailModal(false);
            }}
            centered
            backdrop="static"
          >
            <Modal.Header className="bg-danger fs-3 text-light" closeButton>
              Send Email
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={sendEmailFn}>
                <div className="input-group m-2">
                  <label>Subject</label>
                  <input
                    required
                    className="form-control mx-2 p-1"
                    type="text"
                    value={emailObject.subject}
                    onChange={(e) =>
                      setEmailObject({
                        ...emailObject,
                        subject: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="input-group">
                  <label>Content</label>
                  <textarea
                    required
                    className="form-control mx-3 p-1"
                    value={emailObject.content}
                    onChange={(e) =>
                      setEmailObject({
                        ...emailObject,
                        content: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="d-flex justify-content-end m-2 ">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailModal(false);
                    }}
                    className="m-1 btn btn-secondary"
                  >
                    Back
                  </button>
                  <button type="submit" className="m-1 btn btn-success">
                    send Email
                  </button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        )}
      </div>

      <div>
        {updateModal === true ? (
          <CreateUpdateTicket
            showModal={showModal}
            setShowModal={setShowModal}
            updateModal={updateModal}
            setUpdateModal={setUpdateModal}
            title="Update ticket"
            btnAction="update"
            fetchTicketsData={fetchTicketsData}
            userType={userType}
          />
        ) : (
          <CreateUpdateTicket
            showModal={showModal}
            setShowModal={setShowModal}
            updateModal={updateModal}
            setUpdateModal={setUpdateModal}
            title="Create new ticket"
            btnAction="create"
            fetchTicketsData={fetchTicketsData}
          />
        )}
      </div>
    </div>
  );
}

let InfoBox = ({ info, count, color }) => {
  
  return (
    <div
      className=" d-flex align-items-center justify-content-center rounded-2 p-1 m-2 "
      style={{ backgroundColor:[color], minWidth: "15vw" }}
    >
      <div className="text-center p-2 ">
        <h3 className=" text-warning fst-italic" style={{ fontSize: "100%" }}>
          {info}
        </h3>
        <p className="fs-5 ">{count}</p>
      </div>
    </div>
  );
};

export { InfoBox };
