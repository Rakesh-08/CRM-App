


import { Modal } from "react-bootstrap"
import { useState } from "react";
import { createTicketsApi,updateTicketApi } from "../../apiCalls/ticket";
import { useDispatch, useSelector } from "react-redux";



let postTicketApi = "/crm/api/v1/tickets"
let putTicketCall = "/crm/api/v1/tickets/";

export default function CreateUpdateTicket({ showModal, setShowModal, updateModal, setUpdateModal, title, btnAction, fetchTicketsData }) {
   

  let ModalInfo = useSelector((state) => state.ModalInfo);
    let dispatch = useDispatch();


    let createTicket = (e) => {
        e.preventDefault();

        let input = {
            title: ModalInfo.title,
            description: ModalInfo.description,
            ticketPriority: ModalInfo.priority
        }

        createTicketsApi(postTicketApi, input).then((res) => {

            fetchTicketsData();
            dispatch({type:"initial"})
            setShowModal(false)
            alert(`your ticket is created with id : ${res.data._id} `)


        }).catch((err) => {
            console.log(err)
            alert(err.response.data.message)
        })


    }

    let updateTicket = (e) => {
        e.preventDefault();
        let update = {
            title: ModalInfo.title,
            description: ModalInfo.description,
            ticketPriority: ModalInfo.priority,
            status:ModalInfo.status
        }


        updateTicketApi(putTicketCall+ ModalInfo._id, update)
            .then((res) => {
                fetchTicketsData();
                dispatch({ type: "initial" })
                setShowModal(false)
                alert(`your ticket with id : ${res.data._id}  has been updated`)
                
            }).catch(err => {
                console.log(err)
               
            })
    }

    return (
        <div>

            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false)
                    setUpdateModal(false)
                    dispatch({type:"initial"})
                }}
                centered
                backdrop="static"
            >
                <Modal.Header closeButton>{title}</Modal.Header>

                <Modal.Body>
                    <form onSubmit={updateModal == true ? updateTicket : createTicket}>

                        {updateModal && <p> ID : {ModalInfo._id }</p>}     

                        <div className="input-group m-2 row">
                            <label className="col-3" htmlFor="title"> Title</label>


                            <input disabled={updateModal} className={`form-control mx-2 $`} type="text" name="title" value={ModalInfo.title} onChange={(e) => {
                                dispatch({
                                    type: "onChange",
                                    payload: {
                                        key: e.target.name,
                                        value: e.target.value
                                    }
                                })
                            }} />    
                        </div>

                        <div className="input-group m-2 row">
                            <label className="col-3" htmlFor="description"> Description</label>
                            <input className="form-control mx-2" type="text" name="description" value={ModalInfo.description} onChange={(e) => {
                                dispatch({
                                    type: "onChange",
                                    payload: {
                                        key: e.target.name,
                                        value: e.target.value
                                    }
                                })
                            }} />
                        </div>
                        {updateModal && <div className="input-group m-2 row">
                            <label className="col-3" htmlFor="status"> Status</label>
                            <select className="form-control mx-2" name="status" value={ModalInfo.status} onChange={(e) => {
                                dispatch({
                                    type: "onChange",
                                    payload: {
                                        key: e.target.name,
                                        value: e.target.value
                                    }
                                })
                            }}>
                                <option value="OPEN">OPEN</option>
                                <option value="CLOSED">CLOSED</option>
                            </select>
                        </div>}

                        <div className="input-group m-2 row">
                            <label className="col-6" htmlFor="ticketPriority"> Ticket Priority</label>
                            <select className="form-control mx-2 " name="priority" value={ModalInfo.priority} onChange={(e) => { 
                                dispatch({
                                    type: "onChange",
                                    payload: {
                                        key: e.target.name,
                                        value:e.target.value
                                    }
                                })
                            }}>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                            </select>
                        </div>

                        <div className="d-flex justify-content-end m-2">
                            <button onClick={(e) => {
                                e.preventDefault()
                                setShowModal(false)
                                setUpdateModal(false)
                                dispatch({type:"initial"})
                            }
                            } className="btn btn-sm btn-danger m-1">
                                cancel
                            </button>
                            <button type="submit" className="btn btn-sm btn-secondary  m-1">
                                {btnAction}
                            </button>
                        </div>
                    </form>
                </Modal.Body>


            </Modal>
        </div>
    )
}







// import { Modal } from "react-bootstrap"
// import { useState } from "react";
// import { createTickets } from "../../apiCalls/ticket";
// import { useDispatch, useSelector } from "react-redux";



// let postTicketApi = "/crm/api/v1/tickets"

// let initialTicket = {
//     title: "",
//     description: "",
//     priority:4,
//      status:""
// }
// export default function CreateUpdateTicket({ showModal, setShowModal, updateModal, setUpdateModal, title, btnAction,fetchTicketsData,rowData }) {
//     let [ticketInfo, setTicketInfo] = useState(initialTicket)

//     let ModalInfo = useSelector((state) => state);
//     let dispatch = useDispatch();
//     console.log(ModalInfo)

//     let createTicket = (e) => {
//         e.preventDefault();

//         let input = {
//             title: ticketInfo.title,
//             description: ticketInfo.description,
//             ticketPriority:ticketInfo.priority}
        
//         createTickets(postTicketApi, input).then((res) => {

//             fetchTicketsData();
//             setTicketInfo(initialTicket)
//             setShowModal(false)
//             alert(`your ticket is created with id : ${res.data._id} `)
           

//         }).catch((err) => {
//               alert(err.response.data.message)
//         })

        
//     }
 
    
//     let updateTicket = (e) => {
        
//     }
    
//     return (
//         <div>
            
//             <Modal
//                 show={showModal}
//                 onHide={() => {
//                     setShowModal(false)
//                     setUpdateModal(false)
//                     setTicketInfo(initialTicket)
// }}
//                     centered
//                     backdrop="static"
//                 >
//                 <Modal.Header closeButton>{title}</Modal.Header>

//                     <Modal.Body>
//                     <form onSubmit={updateModal==true? updateTicket:createTicket}>
                        
//                             <div className="input-group m-2 row">
//                                 <label className="col-3" htmlFor="title"> Title</label>
                          
                            
//                             <input className="form-control mx-2 " type="text" name="title" value={ticketInfo.title} onChange={(e) => setTicketInfo({ ...ticketInfo, title: e.target.value })} />
//                         </div>
                        
//                             <div className="input-group m-2 row">
//                                 <label className="col-3" htmlFor="description"> Description</label>
//                             <input className="form-control mx-2" type="text" name="description" value={ticketInfo.description} onChange={(e)=>setTicketInfo({...ticketInfo,description:e.target.value})} />
//                         </div>
//                         {updateModal && <div className="input-group m-2 row">
//                             <label className="col-3" htmlFor="status"> Status</label>
//                             <select className="form-control mx-2" name="status" value={ticketInfo.status} onChange={(e) => setTicketInfo({ ...ticketInfo, status: e.target.value })}>
//                                 <option value="OPEN">OPEN</option>
//                                 <option value="CLOSED">CLOSED</option>
//                              </select>
//                         </div>}
                        
//                             <div className="input-group m-2 row">
//                                 <label className="col-6" htmlFor="ticketPriority"> Ticket Priority</label>
//                                 <select className="form-control mx-2 " name="ticketPriority" value={ticketInfo.priority} onChange={(e)=>setTicketInfo({...ticketInfo,priority:e.target.value})}>
//                                     <option value={1}>1</option>
//                                     <option value={2}>2</option>
//                                     <option value={3}>3</option>
//                                     <option value={4}>4</option>
//                                 </select>
//                             </div>

//                             <div className="d-flex justify-content-end m-2">
//                             <button onClick={(e) => {
//                                 e.preventDefault()
//                                 setShowModal(false)
//                                 setUpdateModal(false)
//                                 setTicketInfo(initialTicket)
//                             }
//                             } className="btn btn-sm btn-secondary m-1">
//                                     cancel
//                                 </button>
//                                 <button type="submit" className="btn btn-sm btn-danger m-1">
//                                     {btnAction}
//                                 </button>
//                             </div>
//                         </form>
//                     </Modal.Body>


//                 </Modal>
//         </div>
//     )
// }



