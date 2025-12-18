import { createContext, useContext, useState } from "react";

// creating the context object
export const AuthContext = createContext()

// custom hook to call authContext
export const useAuthContext = ()=>{
    return useContext(AuthContext)
}

// authProvider component
export const AuthProvider = ({children})=>{
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("NutriScan")) || null);

    return <AuthContext.Provider value={{authUser, setAuthUser}}>{children}</AuthContext.Provider>
}