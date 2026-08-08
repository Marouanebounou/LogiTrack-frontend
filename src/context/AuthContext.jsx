import { Children, createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({Children}) => {
    const [user , setUser] = useState(null);
    const [token , setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if(token && savedUser){
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Failed to parse stored user data:', error);
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, [token]);

    const  login = async (email , password) => {
        const response = await api.post("/auth/login", {email , password});
        console.log(response);
        const {token : jwt , user: userData} = response.data;

        localStorage.setItem("token" , jwt);
        localStorage.setItem("user" , JSON.stringify(userData));

        setToken(jwt);
        setUser(userData);
        return userData;
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }

    return(
        <AuthContext.Provider value={{user, token ,login , logout , loading}}>
            {!loading && Children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context;
}
