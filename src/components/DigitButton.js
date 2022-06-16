import { ACTIONS } from "../reducer/reducer";

const DigitButton = ({ dispatch, digit }) => {
  return (
    <button
      className="button-digit"
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
    >
      {digit}
    </button>
  );
};

export default DigitButton;
