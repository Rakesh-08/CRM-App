import { combineReducers } from "redux";

let initialTicket = {
  title: "",
  description: "",
  priority: 4,
  status: "",
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
};

<<<<<<< HEAD
let rootReducer = combineReducers({
     ModalInfo:ModalReducer
})

export { rootReducer };
=======
        case "MODAL_DATA":
            return ;
        

    }
}

export {ModalReducer}
>>>>>>> 23e6b20515d54e2806c2222f639b7d7690ab2348
