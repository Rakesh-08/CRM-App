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

let rootReducer = combineReducers({
     ModalInfo:ModalReducer
})

export { rootReducer };
