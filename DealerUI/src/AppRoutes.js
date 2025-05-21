import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Spinner from "./shared/Spinner";

const Login = lazy(() => import('./components/login/Login.js'));
const ForgotPassword = lazy(() => import('./components/login/sendResetLink.js'));
const ResetPassword = lazy(() => import('./components/login/resetPassword.js'));
const ProtectedRoute = lazy(() => import('./protectedRoute/ProtectedRoute'));
// const Dashboard = lazy(() => import('./components/Dashboard/Dashboard.js'));
const AppMaster = lazy(() => import('./components/Masters/AppMaster.js'));
const Company = lazy(() => import('./components/Masters/Company.js'));
const Plant = lazy(() => import('./components/Masters/Plant.js'));
const CompanyPlantMapping = lazy(() => import('./components/Masters/CompanyPlantMapping.js'));
const RolesWithApps = lazy(() => import('./components/Masters/RoleswithApps.js'));
const Master = lazy(() => import('./components/Masters/Masters.js'));
const Profile = lazy(() => import('./components/profile/profile.js'));
const UserCreation = lazy(() => import('./components/user-creation/UserCreation.js'))
const CreateUser = lazy(() => import('./components/user-creation/CreateUser.js'))
const EmailConfig = lazy(() => import('./components/EmailConfig/emailconfig.js'));
const SchemeList = lazy(() => import('./components/Masters/SchemeList.js'));
const Createscheme = lazy(() => import('./components/Masters/CreateScheme.js'));
const AddNewStock = lazy(() => import('./components/Masters/AddNewStock.js'));
const Addstock = lazy(() => import('./components/Masters/AddStock.js'));
const SalesOrderApprovalList = lazy(() => import('./components/SalesOrderApproval/SalesOrderApprovalList.js'));
const SalesOrderDetails = lazy(() => import('./components/SalesOrderApproval/SalesOrderDetails.js'));
const DeliveryTracking = lazy(() => import('./components/DeliveryTrackingGRNApproval/DeliveryTracking.js'));
const TrackingReport = lazy(() => import('./components/DeliveryTrackingGRNApproval/TrackingReports.js'));
const DealerReport = lazy(() => import('./components/Reports/ReportsDealer.js'));
const DealerDashboard = lazy(() => import('./components/Dashboard/DealerDashboard.js'));
// Dealer
const StockAvailability = lazy(() => import("./components/Dealer/StockAvailability.js"));
const PlaceOrder = lazy(() => import("./components/Dealer/PlaceOrder.js"));
const ReturnOrder = lazy(() => import("./components/Dealer/ReturnOrder.js"));
const OrderStatus = lazy(() => import("./components/Dealer/OrderStatus.js"));
const OrderHistory = lazy(() => import("./components/Dealer/OrderHistory.js"));
const Requisition = lazy(() => import("./components/Dealer/Requisition.js"));
const Support = lazy(() => import("./components/Dealer/Support.js"));
const Rewards = lazy(() => import("./components/Dealer/Rewards.js"));
const DealerScheme = lazy(() => import("./components/Dealer/Scheme.js"));
const RetailerUserCreation= lazy(() => import('./components/user-creation/RetailerUserCreation.js'));
const CreateRequision= lazy(() => import('./components/SalesPages/CreateRequision.js'));
const CreateReailer= lazy(() => import('./components/user-creation/CreateRetailerUser.js'));
const AppRoutes = () => {
    return (
        <Suspense fallback={<Spinner />}>
            <Routes>
                <Route exact path="/" element={<Navigate to="/Login" />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/resetPassword" element={<ResetPassword />} />
                <Route path="/sendResetLink" element={<ForgotPassword />} />
                <Route element={<ProtectedRoute allowedRoles={["Admin", "Dealer", "Approver"]} />}>

                    {/* <Route path="/scheme" element={<SchemeList />} /> */}
                    {/* <Route path="/scheme" element={<Master />} /> */}
                </Route>

                {/* Admin routes */}
                <Route element={<ProtectedRoute allowedRoles="Admin" />}>
                    <Route path="/Masters" element={<Master />} />
                    <Route path="/AppMaster" element={<AppMaster />} />
                    <Route path="/RoleswithApps" element={<RolesWithApps />} />
                    <Route path="/Company" element={<Company />} />
                    <Route path="/Plant" element={<Plant />} />
                    <Route path="/user-management" element={<UserCreation />} />
                    <Route path="/create-user" element={<CreateUser />} />
                    <Route path="/manage-email-config" element={<EmailConfig />} />
                    {/* <Route path="/profile" element={<Profile />} /> */}
                    <Route path="/CompanyPlantMapping" element={<CompanyPlantMapping />} />
                    <Route path="/add-stock" element={<Addstock />} />
                    <Route path="/sales-order-approval" element={<SalesOrderApprovalList />} />
                    <Route path="/sales-order-details" element={<SalesOrderDetails />} />
                    <Route path="/delivery-tracking" element={<DeliveryTracking />} />
                    <Route path="/tracking-reports" element={<TrackingReport />} />
                    <Route path="/dealer-reports" element={<DealerReport />} />
                    <Route path="/scheme" element={<SchemeList />} />
                    <Route path="/create-scheme" element={<Createscheme />} />
                    <Route path="/Add-New-Sock" element={<AddNewStock />} />
                    {/* <Route path="/Masters" element={<Master />} />
                    <Route path="/AppMaster" element={<AppMaster />} />
                    <Route path="/RoleswithApps" element={<RolesWithApps />} />
                    <Route path="/Company" element={<Company />} />
                    <Route path="/Plant" element={<Plant />} />
                    <Route path="/user-management" element={<UserCreation />} />
                    <Route path="/manage-email-config" element={<EmailConfig />} />
                    <Route path="/CompanyPlantMapping" element={<CompanyPlantMapping />} />
                    <Route path="/add-stock" element={<Addstock />} />
                    <Route path="/sales-order-approval" element={<SalesOrderApprovalList />} />
                    <Route path="/sales-order-details" element={<SalesOrderDetails />} />
                    <Route path="/delivery-tracking" element={<DeliveryTracking />} />
                    <Route path="/tracking-reports" element={<TrackingReport />} />
                    <Route path="/dealer-reports" element={<DealerReport />} />
                    <Route path="/scheme" element={<SchemeList />} /> */}
                    {/* <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/form-builder" element={<FormBuilder />} />
                 
                    <Route path="/location-master" element={<LocationMaster />} />
                    <Route path="/manage-users" element={<UserCreation />} />*/}
                    {/* <Route path="/AppMaster" element={<AppMaster />} />
                    <Route path="/org-chart" element={<Organization />} />
                    <Route path="/RoleswithApps" element={<RolesWithApps />} />
                    <Route path="/manage-leaveTypes" element={<LeaveType />} />
                    <Route path="/manage-designations" element={<Designation />} />
                    <Route path="/manage-departments" element={<Department />} />
                    */}
                </Route>

                {/* Employee routes */}
                <Route element={<ProtectedRoute allowedRoles="Dealer" />}>
                    <Route path="/home" element={<DealerDashboard />} />
                    <Route path="/add-stock" element={<Addstock />} />
                    <Route path="/stock-availability" element={<StockAvailability />} />
                    <Route path="/place-order" element={<PlaceOrder />} />
                    <Route path="/return-order" element={<ReturnOrder />} />
                    <Route path="/order-status" element={<OrderStatus />} />
                    <Route path="/delivery-tracking" element={<DeliveryTracking />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                    <Route path="/scheme-master" element={<Master />} />
                    <Route path="/requisition" element={<Requisition />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/dealer-reports" element={<DealerReport />} />
                    <Route path="/create-scheme" element={<Createscheme />} />
                    <Route path="/Add-New-Sock" element={<AddNewStock />} />
                    <Route path="/sales-order-approval" element={<SalesOrderApprovalList />} />
                    <Route path="/sales-order-details" element={<SalesOrderDetails />} />
                    <Route path="/delivery-tracking" element={<DeliveryTracking />} />
                    <Route path="/tracking-reports" element={<TrackingReport />} />
                    <Route path="/dealer-reports" element={<DealerReport />} />
                    <Route path="/dealer-scheme" element={<DealerScheme />} />

                    {/* <Route path="/home" element={<DealerDashboard />} />
                    <Route path="/add-stock" element={<Addstock />} />
                    <Route path="/stock-availability" element={<StockAvailability />} />
                    <Route path="/place-order" element={<PlaceOrder />} />
                    <Route path="/return-order" element={<ReturnOrder />} />
                    <Route path="/order-status" element={<OrderStatus />} />
                    <Route path="/delivery-tracking" element={<DeliveryTracking />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                    <Route path="/scheme" element={<DealerScheme />} />
                    <Route path="/requisition" element={<Requisition />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="/dealer-reports" element={<DealerReport />} /> */}
                </Route>

                {/* Manager routes */}
                <Route element={<ProtectedRoute allowedRoles="Approver" />}>
                    <Route path="/sales-order-approval" element={<SalesOrderApprovalList />} />
                    <Route path="/add-stock" element={<Addstock />} />
                    <Route path="/sales-order-details" element={<SalesOrderDetails />} />
                    <Route path="/delivery-tracking" element={<DeliveryTracking />} />
                    <Route path="/tracking-reports" element={<TrackingReport />} />
                    {/* <Route path="/dealer-reports" element={<DealerReport />} /> */}
                    <Route path="/scheme" element={<SchemeList />} />

                </Route>

                {/* Sales routes */}
                <Route element={<ProtectedRoute allowedRoles="Sales" />}>
                    <Route path="/retailer-user-management" element={<RetailerUserCreation />} />
                    <Route path="/create-requision" element={<CreateRequision />} />
                     <Route path="/create-retailer" element={<CreateReailer />} />
                   

                </Route>
                {/* Add a fallback for unauthorized access */}
                <Route path="/Login" element={<h1>Unauthorized Access</h1>} />
            </Routes>
        </Suspense>
    );
}

export default AppRoutes;