export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  TOGGLE_DIGIT_OPPOSITE: "toggle-digit-opposite",
  EVALUATE: "evaluate",
  FETCH_SUCCESS: "fetch-success",
  FETCH_IN_PROGRESS: "fetch-in-progress",
  FETCH_ERROR: "fetch-error",
};

export const reducer = (state, { type, payload }) => {
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

      if (
        state.currentOperand.length === 2 &&
        state.currentOperand[0] === "-"
      ) {
        return { ...state, currentOperand: null };
      }

      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.TOGGLE_DIGIT_OPPOSITE:
      if (state.currentOperand) {
        return {
          ...state,
          currentOperand: `${-parseFloat(state.currentOperand) || ""}`,
        };
      }

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
