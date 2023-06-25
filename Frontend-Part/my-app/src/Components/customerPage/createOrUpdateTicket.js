
import { Modal } from "react-bootstrap"
import { useState } from "react";
import { createTickets } from "../../apiCalls/ticket";



let postTicketApi = "/crm/api/v1/tickets"

let initialTicket = {
    title: "",
    description: "",
    priority:4,
     status:""
}
export default function CreateUpdateTicket({ showModal, setShowModal, updateModal, setUpdateModal, title, btnAction,ticketDetails,setTicketDetails }) {
    let [ticketInfo, setTicketInfo] = useState(initialTicket)

    let createTicket = (e) => {
        e.preventDefault();

        let input = {
            title: ticketInfo.title,
            description: ticketInfo.description,
            ticketPriority:ticketInfo.priority}
        
        createTickets(postTicketApi, input).then((res) => {
            let temp = ticketDetails;
            temp.push(res.data);
            setTicketDetails(temp)
            alert(`your ticket is created with id : ${res.data._id} `)
            setShowModal(false)
        }).catch((err) => {
              alert(err.response.data.message)
        })

        
    }

    let updateTicket = (e) => {
        
    }
    
    return (
        <div>
            
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                    centered
                    backdrop="static"
                >
                <Modal.Header closeButton>{title}</Modal.Header>

                    <Modal.Body>
                    <form onSubmit={updateModal==true? updateTicket:createTicket}>
                        
                            <div className="input-group m-2 row">
                                <label className="col-3" htmlFor="title"> Title</label>
                                <input className="form-control mx-2 " type="text" name="title" value={ticketInfo.title} onChange={(e)=> setTicketInfo({...ticketInfo,title:e.target.value})}/>
                        </div>
                        
                            <div className="input-group m-2 row">
                                <label className="col-3" htmlFor="description"> Description</label>
                            <input className="form-control mx-2" type="text" name="description" value={ticketInfo.description} onChange={(e)=>setTicketInfo({...ticketInfo,description:e.target.value})} />
                        </div>
                        {updateModal && <div className="input-group m-2 row">
                            <label className="col-3" htmlFor="status"> Status</label>
                            <select className="form-control mx-2" name="status" value={ticketInfo.status} onChange={(e) => setTicketInfo({ ...ticketInfo, status: e.target.value })}>
                                <option value="OPEN">OPEN</option>
                                <option value="CLOSED">CLOSED</option>
                             </select>
                        </div>}
                        
                            <div className="input-group m-2 row">
                                <label className="col-6" htmlFor="ticketPriority"> Ticket Priority</label>
                                <select className="form-control mx-2 " name="ticketPriority" value={ticketInfo.priority} onChange={(e)=>setTicketInfo({...ticketInfo,priority:e.target.value})}>
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
                            }
                            } className="btn btn-sm btn-secondary m-1">
                                    cancel
                                </button>
                                <button type="submit" className="btn btn-sm btn-danger m-1">
                                    {btnAction}
                                </button>
                            </div>
                        </form>
                    </Modal.Body>


                </Modal>
        </div>
    )
}



