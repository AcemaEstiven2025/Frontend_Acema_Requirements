import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const MaterialTailwind = React.createContext(null);
MaterialTailwind.displayName = "MaterialTailwindContext";

export function reducer(state, action) {
  switch (action.type) {
    case "OPEN_SIDENAV":
      return { ...state, openSidenav: action.value };

    case "SIDENAV_TYPE":
      return { ...state, sidenavType: action.value };

    case "SIDENAV_COLOR":
      return { ...state, sidenavColor: action.value };

    case "TRANSPARENT_NAVBAR":
      return { ...state, transparentNavbar: action.value };

    case "FIXED_NAVBAR":
      return { ...state, fixedNavbar: action.value };

    case "OPEN_CONFIGURATOR":
      return { ...state, openConfigurator: action.value };

    case "LOADING":
      return { ...state, loading: action.value };

    case "ERROR":
      return { ...state, error: action.value };

    case "CHANGUE_STATUS":
      return { ...state, changueStatusHistory: action.value };

    case "REQUIREMENTS":
      return { ...state, requirements: action.value };

    case "CREATE_REQUIREMENT":
      return { ...state, createRequirementData: action.value };

    case "LOGIN":
      return { ...state, loginData: action.value };
      
    case "PROFILE":
      return { ...state, profile : action.value };

    case "HISTORY_STATUS":
      return { ...state, historyStatus : action.value };
      
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function MaterialTailwindControllerProvider({ children }) {
  const initialState = {
    openSidenav: false,
    sidenavColor: "dark",
    sidenavType: "white",
    transparentNavbar: true,
    fixedNavbar: false,
    openConfigurator: false,
    selectedRequestType: null,
    loading: true,
    error: null,
    requirements:null,
    changueStatusHistory : null, //change status history
    createRequirementData: null, // NEW
    loginData : null,
    profile : null,
    historyStatus: null
  };

  const [controller, dispatch] = React.useReducer(reducer, initialState);


  /** -----------------------------
   *  FUNCIÓN PARA CAMBIO DE ESTADO EN EL HISTORIAL DE ESTADOS
   *  ----------------------------- */
  const doChangeStatus = async (data) => {
    // dispatch({ type: "LOADING", value: true });

    try {
    
      const response = await axios.post(
        `/form/historychangestatus`,
        data,
        { withCredentials: true } 
      );
      
      dispatch({ type: "CHANGUE_STATUS", value: response.data });
      // dispatch({ type: "LOADING", value: false });

       return response;
    } catch (error) {
      // dispatch({ type: "LOADING", value: false });
      dispatch({
        type: "ERROR",
        value: error.response?.data || "Error en la petición CHANGUE_STATUS",
      });

      throw error;
    }
  };

  /** -----------------------------
   *  FUNCIÓN PARA CREAR REQUERIMIENTO
   *  ----------------------------- */
  const doCreateRequirement = async (data) => {
    // dispatch({ type: "LOADING", value: true });

    try {
      const response = await axios.post(
        "/form/requirements",
        data,
      { withCredentials: true } 
      );
       
      dispatch({ type: "CREATE_REQUIREMENT", value: response.data });
      // dispatch({ type: "LOADING", value: false });

      return response;
    } catch (error) {
      // dispatch({ type: "LOADING", value: false });
      dispatch({
        type: "ERROR",
        value: error.response?.data || "Error en la petición CREATE_REQUIREMENT",
      });

      throw error;
    }
  };


  /** -----------------------------
   *  FUNCIÓN PARA REVISAR EL ESTADO DEL HISTORIAL
   *  ----------------------------- */
  const doHistoryStatus = async (requirementGroup, status = 1) => {
    dispatch({ type: "LOADING", value: true });
// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    try {
    //  await sleep(1000);
      const response = await axios.get(
        `/form/historystatus/${requirementGroup}/${status}`,
      { withCredentials: true } 
      );
     
      dispatch({ type: "HISTORY_STATUS", value: response.data });
      // dispatch({ type: "LOADING", value: false });

      return response;
    } catch (error) {
      dispatch({ type: "LOADING", value: false });
      dispatch({
        type: "ERROR",
        value: error.response?.data || "Error en la petición HISTORY_STATUS",
      });

      throw error;
    }finally {
    dispatch({ type: "LOADING", value: false });
  }
  };

   /** -----------------------------
   *  FUNCIÓN PARA CREAR INICIAR SECCION
   *  ----------------------------- */
  const doLogin = async(data) => {
    // dispatch({ type: "LOADING", value: true });
    try {
    const response = await axios.post(
  "/auth/login",
  data,
  { withCredentials: true } 
);
      
      dispatch({ type: "LOGIN", value: response.data})
      // dispatch({ type: "LOADING", value: false });
      return response
    } catch (error) {
      // dispatch({ type: "LOADING", value: true });
      dispatch({
        type: "ERROR",
        value: error.response?.data || "Error en la petición LOGIN",
      });

      throw error;
    }
  }

     /** -----------------------------
   *  FUNCIÓN PARA VALIDAR SECCION
   *  ----------------------------- */
  const doProfile = async() => {
 
    try {
      const response = await axios.get("/auth/profile", {
  withCredentials: true,  
});

      dispatch({ type: "PROFILE", value: response.data})
      
      return response.data
    } catch (error) {
   
      dispatch({
        type: "ERROR",
        value: error.response?.data || "Error en la petición PROFILE",
      });

      throw error;
    }
  }

  /** -----------------------------
   *  VALUE DEL CONTEXTO
   *  ----------------------------- */
  
  const value = React.useMemo(
    () => [controller, dispatch, { doCreateRequirement,doLogin,doProfile,doChangeStatus,doHistoryStatus }],
    [controller]
  );

  return (
    <MaterialTailwind.Provider value={value}>
      {children}
    </MaterialTailwind.Provider>
  );
}

export function useMaterialTailwindController() {
  const context = React.useContext(MaterialTailwind);

  if (!context) {
    throw new Error(
      "useMaterialTailwindController should be used inside the MaterialTailwindControllerProvider."
    );
  }

  return context;
}

MaterialTailwindControllerProvider.displayName = "/src/context/index.jsx";

MaterialTailwindControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/* ACTIONS */
export const setOpenSidenav = (dispatch, value) =>
  dispatch({ type: "OPEN_SIDENAV", value });

export const setSidenavType = (dispatch, value) =>
  dispatch({ type: "SIDENAV_TYPE", value });

export const setSidenavColor = (dispatch, value) =>
  dispatch({ type: "SIDENAV_COLOR", value });

export const setTransparentNavbar = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_NAVBAR", value });

export const setFixedNavbar = (dispatch, value) =>
  dispatch({ type: "FIXED_NAVBAR", value });

export const setOpenConfigurator = (dispatch, value) =>
  dispatch({ type: "OPEN_CONFIGURATOR", value });

export const setRequirements = (dispatch, value) =>
  dispatch({ type: "REQUIREMENTS", value });

export const setchangueStatusHistory = (dispatch, value) =>
  dispatch({ type: "CHANGUE_STATUS", value });

export const setCreateRequirement = (dispatch, value) =>
  dispatch({ type: "CREATE_REQUIREMENT", value });

export const setloginData = (dispatch, value) =>
  dispatch({ type: "LOGIN", value });

export const setloading = (dispatch, value) =>
  dispatch({ type: "LOADING", value });

export const setProfile = (dispatch, value) =>
  dispatch({ type: "PROFILE", value });

export const setHistoryStatus = (dispatch, value) =>
  dispatch({ type: "HISTORY_STATUS", value });
