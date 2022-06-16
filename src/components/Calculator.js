import axios from "../axios-instance";
import React, { useEffect, useReducer } from "react";

import { ACTIONS, reducer } from "../reducer/reducer";

import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import "./styles.css";

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
    {
      currentOperand = 0,
      previousOperand,
      operation,
      fetch = false,
      calculating,
    },
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
    <div className="calculator-wrapper">
      <div className="calculator">
        <div className="calculator-grid">
          <div className="output">
            <div className="previous-operand">
              {/* {formatOperand(previousOperand)} {operation} */}
              {previousOperand} {operation}
            </div>
            {/* <div className="current-operand">{formatOperand(currentOperand)}</div> */}
            <div className="current-operand">
              <p>{currentOperand}</p>
            </div>
          </div>
          <button
            className="button-clear"
            onClick={() => dispatch({ type: ACTIONS.CLEAR })}
          >
            AC
          </button>
          <button
            className="button-clear"
            onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
          >
            <div className="icon-delete">
              <FontAwesomeIcon icon={faDeleteLeft} />
            </div>
          </button>
          <button className="button-operation button-modulo">%</button>
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
          <button
            className="button-digit"
            onClick={() => dispatch({ type: ACTIONS.TOGGLE_DIGIT_OPPOSITE })}
          >
            ±
          </button>
          <DigitButton digit="0" dispatch={dispatch} />
          <DigitButton digit="." dispatch={dispatch} />
          <button
            className="button-operation"
            onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
          >
            {calculating ? (
              <div className="ui active inline loader"></div>
            ) : (
              "="
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
