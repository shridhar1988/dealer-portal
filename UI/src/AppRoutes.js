import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Spinner from "./shared/Spinner";
 
const Login = lazy(() => import('./components/login/Login.js'));
const ForgotPassword = lazy(() => import('./components/login/sendResetLink.js'));
const ResetPassword = lazy(() => import('./components/login/resetPassword.js'));
const ProtectedRoute = lazy(() => import('./protectedRoute/ProtectedRoute'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard.js'));
const Master = lazy(() => import('./components/Masters/Masters.js'));
const Profile = lazy(() => import('./components/profile/profile.js'));
const UserManagement = lazy(() => import('./components/user-creation/UserCreation.js'));
const Createscheme = lazy(() => import('./components/Masters/CreateScheme.js'));
const AppRoutes = () => {
    return (
        <Suspense fallback={<Spinner />}>
            <Routes>
                <Route exact path="/" element={<Navigate to="/Login" />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/resetPassword" element={<ResetPassword />} />
                <Route path="/sendResetLink" element={<ForgotPassword />} />
                <Route path="/create-scheme" element={<Createscheme />} />
               
                {/* Admin routes */}
                <Route element={<ProtectedRoute requiredRole="Admin" />}>
                <Route path="/home" element={<Dashboard />} />
                  
                    <Route path="/user-management" element={<UserManagement />} />
                  
                    <Route path="/scheme" element={<Master />} />
                
                    <Route path="/add-stock" element={<Master />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
 
                {/* Employee routes */}
                <Route element={<ProtectedRoute requiredRole="Employee" />}>
                    
                </Route>
 
                {/* HR routes */}
                <Route element={<ProtectedRoute requiredRole="HR" />}>
                   
                </Route>
 
 
                {/* Manager routes */}
                <Route element={<ProtectedRoute requiredRole="Manager" />}>
                    <Route path="/profile" element={<Profile />} />
                </Route>
 
                {/* Add a fallback for unauthorized access */}
                <Route path="/Login" element={<h1>Unauthorized Access</h1>} />
            </Routes>
        </Suspense>
    );
}
 
export default AppRoutes;