
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "react-bootstrap"
import { getEmail, sendEmail } from "../apiCalls/ticket"

export default function EmailComponent() {

    let dispatch = useDispatch();

    let EmailUtils = useSelector((state) => state.EmailUtils);

    // send email function
    let sendEmailFn = async (e) => {
        e.preventDefault();
        let emails;

        if (EmailUtils.email) {
            emails = EmailUtils.email;
        } else {
            let response = await getEmail(EmailUtils.userId)
            emails = response.data;
        }

        let temp = {
            emails: emails,
            subject: EmailUtils.subject,
            content: EmailUtils.content
        }

        sendEmail(temp).then((response) => {
            alert(response.data.message)
        dispatch({
            type: "toggle",
            payload:false
        })
        }).catch(err => console.log(err))

       
    };

    return (
        <div>

            <div>
                {EmailUtils.toggle && (
                    <Modal
                        show={EmailUtils.toggle}
                        onHide={() => {
                            dispatch({
                                type: "toggle",
                                payload: false
                            })
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
                                        value={EmailUtils.subject}
                                        onChange={(e) =>
                                            dispatch({
                                                type: "setContent",
                                                payload:{subject: e.target.value,}
                                                
                                            })
                                        }
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Content</label>
                                    <textarea
                                        required
                                        className="form-control mx-3 p-1"
                                        value={EmailUtils.content}
                                        onChange={(e) =>
                                            dispatch({
                                                type: "setContent",
                                                payload: { content: e.target.value, }

                                            })
                                        }
                                    ></textarea>
                                </div>
                                <div className="d-flex justify-content-end m-2 ">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            dispatch({
                                                type: "toggle",
                                                payload: false
                                            })
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

        </div>
    )
}





