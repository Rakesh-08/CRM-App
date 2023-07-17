import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard/dashboard"
import LeadsData from "../Dashboard/LeadsData";
import { Modal } from "react-bootstrap";
import { postLead } from "../../apiCalls/leads";

let emptyLeadForm = {
    name: "",
    email: "",
    age: 8,
    mobile: "",
    address:""
}

export default function SalesRep() {
    let NavigateTo = useNavigate();
    let [showLeadForm, setShowLeadForm] = useState(false)
    let [createLead,setCreateLead]=useState(emptyLeadForm)

    useEffect(() => {
        if (!(
            localStorage.getItem("accessToken") &&
            localStorage.getItem("userType") === "SALES_REP"
        )
        ) { NavigateTo("/"); }
        
    }, []);

    let createLeadFn = (e) => {
        e.preventDefault();

        postLead(createLead).then((resp) => {
            setCreateLead(emptyLeadForm)
            setShowLeadForm(false)
        }).catch(err => {
            console.log(err)
            alert(err.response.data.message)
        })
    }


    return (
        <div >
            <Dashboard
                userType={localStorage.getItem("userType")}
                title={`Hello Mr. ${localStorage.getItem("username")} , lets convert these leads into customers`}
                titleColor="text-dark"
            />
            <div className="d-flex p-2 bg-info shadow-lg   justify-content-around">
                <h5 className="lead">Got new Leads !</h5>
                <h6>{ "----------->>>>>>>>>>"}</h6>
                <button onClick={()=>setShowLeadForm(true)} className="btn btn-outline-success fw-bold">Create Leads</button>
               
            </div>


            <div className="m-2 p-2">
                <LeadsData userType={localStorage.getItem("userType")} createLead={createLead} />
            </div>
            <div>
                <Modal
                    show={showLeadForm}
                    onHide={() => { setShowLeadForm(false) }}
                    backdrop="static"
                    centered
                >
                    <Modal.Header className="fs-4 text-uppercase" closeButton>Create Lead</Modal.Header>
                    <Modal.Body className="bg-success text-white">

                        <div >
                            <form onSubmit={createLeadFn}>

                                <div className="m-1 p-1">
                                    <label>Name</label>
                                    <input className="form-control m-1" type="text" value={createLead.name} onChange={(e) => setCreateLead({ ...createLead, name: e.target.value }) } />
                                </div>
                                <div className="m-1 p-1">
                                    <label>Email</label>
                                    <input className="form-control m-1" type="text" value={createLead.email} onChange={(e) => setCreateLead({ ...createLead, email: e.target.value })} />
                                </div>
                                <div className="m-1 p-1">
                                    <label>Mobile</label>
                                    <input className="form-control m-1" type="text" value={createLead.mobile} onChange={(e) => setCreateLead({ ...createLead, mobile: e.target.value })} />
                                </div>
                                <div className="m-1 p-1">
                                    <label>Age</label>
                                    <input className="form-control m-1" type="number" min="8"  value={createLead.age} onChange={(e) => setCreateLead({ ...createLead, age: e.target.value })} />
                                </div>
                                <div className="m-1 p-1">
                                    <label>Address</label>
                                    <textarea className="form-control m-1" value={createLead.address} onChange={(e) => setCreateLead({ ...createLead, address: e.target.value })} />
                                </div>

                                <div className="text-center m-3">
                                    <button className="btn w-50 btn-primary text-warning">Create</button>
                                </div>

                            </form>
                        </div>

                    </Modal.Body>

                </Modal>
            </div>
        </div>
    )
}