import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Spinner from "./shared/Spinner";

const Login = lazy(() => import("./components/login/Login.js"));
const ForgotPassword = lazy(() =>
  import("./components/login/sendResetLink.js")
);
const ResetPassword = lazy(() => import("./components/login/resetPassword.js"));
const ProtectedRoute = lazy(() => import("./protectedRoute/ProtectedRoute"));
const DealerDashboard = lazy(() => import("./components/Dashboard/DealerDashboard.js"));
const AdminDashboard = lazy(() => import("./components/Dashboard/AdminDashboard.js"));
const Master = lazy(() => import("./components/Masters/Masters.js"));
const Addstock = lazy(() => import("./components/Masters/AddStock.js"));
const Profile = lazy(() => import("./components/profile/profile.js"));
const UserManagement = lazy(() =>
  import("./components/user-creation/UserCreation1.js")
);
const Createscheme = lazy(() => import("./components/Masters/CreateScheme.js"));
const AddNewStock = lazy(() => import("./components/Masters/AddNewStock.js"));
const EmailConfig = lazy(() =>
  import("./components/EmailConfig/emailconfig.js")
);
// dealer
const StockAvailability = lazy(() => import("./components/Dealer/StockAvailability.js"));
const PlaceOrder = lazy(() => import("./components/Dealer/PlaceOrder.js"));
const ReturnOrder = lazy(() => import("./components/Dealer/ReturnOrder.js"));
const OrderStatus = lazy(() => import("./components/Dealer/OrderStatus.js"));
const DeliveryTracking = lazy(() => import("./components/Dealer/DeliveryTracking.js"));
const OrderHistory = lazy(() => import("./components/Dealer/OrderHistory.js"));
const Requisition = lazy(() => import("./components/Dealer/Requisition.js"));
const Support = lazy(() => import("./components/Dealer/Support.js"));
const Rewards = lazy(() => import("./components/Dealer/Rewards.js"));
const Reports = lazy(() => import("./components/Dealer/Reports.js"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route exact path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/sendResetLink" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute allowedRoles={["Admin","Dealer"]} />}>

       
        <Route path="/scheme" element={<Master />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles="Admin" />}>
      
        <Route path="/Admin-home" element={<AdminDashboard />} />
          <Route path="/user-management" element={<UserManagement />} />

         

          <Route path="/add-stock" element={<Addstock />} />
          <Route path="/manage-email-config" element={<EmailConfig />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/create-scheme" element={<Createscheme />} />
        <Route path="/Add-New-Sock" element={<AddNewStock />} />
        </Route>

        {/* Employee routes */}
        <Route element={<ProtectedRoute allowedRoles="Dealer" />}>
        <Route path="/home" element={<DealerDashboard />} />
          <Route path="/stock-availability" element={<StockAvailability />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/return-order" element={<ReturnOrder />} />
          <Route path="/order-status" element={<OrderStatus />} />
          <Route path="/delivery-tracking" element={<DeliveryTracking />} />
          <Route path="/order-history" element={<OrderHistory />} />
          
          <Route path="/scheme" element={<Master />} />
          <Route path="/requisition" element={<Requisition />} />
          <Route path="/support" element={<Support />} />
          <Route path="/rewards" element={<Rewards />} /> 
          <Route path="/reports" element={<Reports />} />
        </Route>

        {/* HR routes */}
        <Route element={<ProtectedRoute allowedRoles="HR" />}></Route>

        {/* Manager routes */}
        <Route element={<ProtectedRoute allowedRoles="Manager" />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Add a fallback for unauthorized access */}
        <Route path="/Login" element={<h1>Unauthorized Access</h1>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
