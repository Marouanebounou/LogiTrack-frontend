import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export const RoleGuard = ({allowedRoles}) => {
    const { user } = useAuth()

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to={"/access-denied"} replace />
    }

    return <Outlet />

}