// src/context/AppContext.jsx
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = 'https://task-manager-8gob.onrender.com';
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  


  
  

  
  

  

  const value = {
    backendUrl,
    token,
    setToken,
    
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
