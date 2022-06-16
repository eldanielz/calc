import { ACTIONS } from "../reducer/reducer";
import "./styles.css";

const OperationButton = ({ dispatch, operation }) => {
  return (
    <button
      className="button-operation"
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
    >
      {operation === "*" ? "×" : operation === "-" ? "−" : operation}
    </button>
  );
};

export default OperationButton;
