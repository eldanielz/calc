import axios from "../axios-instance";
import React, { useEffect, useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
  FETCH_SUCCESS: "fetch-success",
  FETCH_IN_PROGRESS: "fetch-in-progress",
  FETCH_ERROR: "fetch-error",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }

      if (payload.digit === "." && state.currentOperand?.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        fetch: !state.fetch,
        overwrite: true,
        newOperation: payload.operation,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }

      if (state.currentOperand == null) {
        return state;
      }

      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        fetch: !state.fetch,
        overwrite: true,
      };

    case ACTIONS.FETCH_SUCCESS:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      if (state.newOperation) {
        return {
          ...state,
          calculating: false,
          overwrite: true,
          operation: state.newOperation,
          newOperation: null,
          previousOperand: payload,
          currentOperand: null,
        };
      }

      return {
        ...state,
        calculating: false,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: payload,
      };

    case ACTIONS.FETCH_IN_PROGRESS:
      return {
        ...state,
        calculating: true,
      };

    case ACTIONS.FETCH_ERROR:
      return state;
    default:
  }
};

const INTEGER_FORMATTER = new Intl.NumberFormat("pl-pl", {
  maximumFractionDigits: 0,
});

const formatOperand = (operand) => {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
};

const Calculator = () => {
  const [
    { currentOperand, previousOperand, operation, fetch = false, calculating },
    dispatch,
  ] = useReducer(reducer, {});

  useEffect(() => {
    if (currentOperand && previousOperand) {
      dispatch({ type: ACTIONS.FETCH_IN_PROGRESS });
      axios
        .post("/calculation", {
          a: parseFloat(previousOperand),
          b: parseFloat(currentOperand),
          operator: operation,
        })
        .then((response) =>
          dispatch({
            type: ACTIONS.FETCH_SUCCESS,
            payload: response.data.result,
          })
        )
        .catch((error) => dispatch({ type: ACTIONS.FETCH_ERROR }));
    }
  }, [fetch]);

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {/* {formatOperand(previousOperand)} {operation} */}
          {previousOperand} {operation}
        </div>
        {/* <div className="current-operand">{formatOperand(currentOperand)}</div> */}
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        {calculating ? <div className="ui active inline loader"></div> : "="}
      </button>
    </div>
  );
};

export default Calculator;
