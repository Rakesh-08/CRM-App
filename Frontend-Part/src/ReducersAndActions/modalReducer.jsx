import { combineReducers } from "redux";
import EmailIcon from '@mui/icons-material/Email';


let initialTicket = {
  title: "",
  description: "",
  priority: 4,
  status: "",
};

let initialEmailObject = {
  userId: "",
  email: "",
  subject: "",
  content: "",
  toggle:false
};
  

const ModalReducer = (state = initialTicket, action) => {
  switch (action.type) {
    case "onChange":
      const { key, value } = action.payload;
      return { ...state, [key]: value };
    case "initial":
      return initialTicket;
    case "currentRow":
      return action.payload;
    default:
      return state;
  }
}

let EmailReducer = (state=initialEmailObject, action) => {
  
  switch (action.type) {
     
    case "setContent":
      let passedObj = action.payload;
      return{ ...state,...passedObj}
    case "toggle":
      return {...state,toggle:action.payload}
    default:
      return state;
  }
}


let rootReducer = combineReducers({
  ModalInfo: ModalReducer,
  EmailUtils: EmailReducer
})

export {rootReducer}

