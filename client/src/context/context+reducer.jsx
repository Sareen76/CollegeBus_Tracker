import React, { createContext, useReducer, useEffect, useContext } from "react";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("authState", JSON.stringify({ isAuthenticated: true, user: action.payload }));
      return { ...state, isAuthenticated: true, user: action.payload };

    case "LOGOUT":
      localStorage.removeItem("authState");
      return { ...state, isAuthenticated: false, user: null };

    default:
      return state;
  }
};


const initialState = JSON.parse(localStorage.getItem("authState")) || {
  isAuthenticated: false,
  user: null,
};


export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      dispatch({ type: "LOGIN", payload: userData });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("authState", JSON.stringify(state));
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
