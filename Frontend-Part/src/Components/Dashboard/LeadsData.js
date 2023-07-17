import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import  MaterialTable  from "@material-table/core";
import { getLeads } from "../../apiCalls/leads";
import EmailIcon from '@mui/icons-material/Email';



export default function LeadsData({userType,createLead}) {
    let [leadsData, setLeadsData] = useState([])
    let dispatch=useDispatch()
 
    useEffect(() => {
        fetchLeads();
    }, [createLead])


    // send email action
    let sendEmailAction ={
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
            
    let fetchLeads = () => {
        
        getLeads().then((response) => {
             setLeadsData(response.data)
        }).catch(err => {
            console.log(err)
            alert(err.response.data.message)
        })

    }

    let conditionalColumn = userType!=="SALES_REP" ? {
        title: "Sales Representative", field: "assignedTo"
    } : {}

    // columns of leads table
    let leadsColumns = [
        { title: "Id", field: "_id" },
        { title: "Name", field: "name" },
        { title: "Email", field: "email" },
        { title: "Mobile", field: "mobile" },
        { title: "Age", field: "age" },
        { title: "Address", field: "address" },
       conditionalColumn
    ];

  
    return (
        <div>
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
        </div>
    )
}