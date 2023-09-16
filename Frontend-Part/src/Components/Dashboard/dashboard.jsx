import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import MaterialTable from "@material-table/core";
import CreateUpdateTicket from "./createOrUpdateTicket";
import { getTickets, deleteApiCall, assignEngineerToTicket } from "../../apiCalls/ticket";

import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from '@mui/icons-material/Email';
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { Modal } from "react-bootstrap";
import EmailComponent from "../EmailComponent";
import  ExportCsv from "@material-table/exporters/csv";
import  ExportPdf from "@material-table/exporters/pdf"



export default function Dashboard({ title, userType, bg,getTicketStatus,adminRoutes,engineers,titleColor,children }) {
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
  let [assignEngineer,setAssignEngineer]=useState({ticketId:"",engineerUserId:"",change:false,show:false})
  let [leadsData,setLeadsData]= useState([])
  


  useEffect(() => {
   userType!=="SALES_REP"&& fetchTicketsData();
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

    if (userType == "ADMIN") {
      getTicketStatus(temp)
    }
    
  };

  // wrapping an asynchronous funtion with async/await for inside useEffect
  let fetchTicketsData = async () => {
    await getTickets()
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
      setTicketDetails([]);
      NavigateTo("/");
    }
  };

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

  // deletet ticket function
  let deleteTicket = (id) => {
    let confirmation = window.confirm("Are you sure");

    if (confirmation) {
      deleteApiCall(id)
        .then((response) => {
          fetchTicketsData();
          alert(
            `the ticket generated with id ${response.data._id} has been removed`
          );
        })
        .catch((err) => console.log(err));
    }
  };

  
  // assign or change the engineer 
  let AssignEngineerFn = () => {
    
    let temp = {
      ticketId: assignEngineer.ticketId,
      engineerUserId: assignEngineer.engineerUserId,
      change:assignEngineer.change
    }
    
    assignEngineerToTicket( temp).then((response) => {
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

  return (
    <div className={` ${bg} text-white pb-2 `}>
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
        <button onClick={logoutFn} className="btn h-25 btn-warning mx-3 mt-2">
          Logout
        </button>
      </div>
      <div className="mx-4 p-3  text-center">
        <h2 className={`fs-4 ${titleColor}`}>{title}</h2>
        {userType !== "SALES_REP" && <p> Take a look at all tickets below !</p>}
      </div>

      {children}

      {userType !== "ADMIN" && userType !== "SALES_REP" && (
        <h4 className="m-4 lead fs-4">
          Total Tickets:
          <span className="text-danger fs-3 fw-bold mx-2">
            {ticketStatus.Total}
          </span>
        </h4>
      )}

      <div>
        {userType !== "SALES_REP" && userType !== "ADMIN" && (
          <div className="d-flex flex-wrap justify-content-around px-4 m-4">
            <InfoBox info="OPEN" count={ticketStatus.OPEN} color="blue" />
            <InfoBox
              info="IN PROGRESS"
              count={ticketStatus.IN_PROGRESS}
              color="green"
            />
            <InfoBox info="BLOCKED" count={ticketStatus.BLOCKED} color="grey" />
            <InfoBox info="CLOSED" count={ticketStatus.CLOSED} color="purple" />
          </div>
        )}
      </div>

      <div className=" mx-4  mt-3 h-100">
        {adminRoutes == "tickets" && userType !== "SALES_REP" ? (
          <>
            <MaterialTable
              title={ticketTableTitle}
              columns={columns}
              data={ticketDetails}
              actions={[sendEmailAction, deleteOrAssignAction]}
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
              options={{
                actionsColumnIndex: -1,
                exportMenu: [
                  {
                    label: "Export as PDF",
                    exportFunc: (cols, datas) =>
                      ExportPdf(cols, datas, "tickets Record"),
                  },
                  {
                    label: "Export as ExcelFile",
                    exportFunc: (cols, datas) =>
                      ExportCsv(cols, datas, "tickets Record"),
                  },
                ],
                headerStyle: {
                  backgroundColor: "#01579b",
                  color: "#FFF",
                },
              }}
            />
          </>
        ) : null}

        <div>
          {adminRoutes == "tickets" && userType == "ADMIN" &&(
         
            <Modal
              show={assignEngineer.show}
              onHide={() =>
                setAssignEngineer({ ...assignEngineer, show: false })
              }
              backdrop="static"
            >
              <Modal.Header
                className="bg-secondary text-white fs-4"
                closeButton
              >
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
                    {engineers?.filter((obj) => obj.userStatus == "APPROVED")
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
          
        )}</div>
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
        <EmailComponent />
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
      className=" d-flex align-items-center justify-content-center rounded-2 p-1 m-1 "
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
