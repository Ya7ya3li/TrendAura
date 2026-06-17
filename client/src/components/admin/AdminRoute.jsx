import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import { ROUTES } from '../../constants/routes.js'

export default function AdminRoute() {
    const { profile, loading } = useContext(AuthContext)

    if (loading) return null



    if (!profile || profile.role !== 'super_owner') {
        return <Navigate to={ROUTES.DASHBOARD || '/dashboard'} replace />
    }


    return <Outlet />
}