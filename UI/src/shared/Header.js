import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearPersonalInformation } from "../reduxStorage/personalInformation";
import { clearSelectedEmployeePersonalInformation } from "../reduxStorage/selectedEmployeeInformation";
import { useNavigate } from "react-router-dom";

const config = require("../config/config.json");

function Header() {
  const personalInfo = useSelector((state) => state.personalInformationReducer);
  
  let navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    GetNotifications();
  }, []);

  const handleLogout = async () => {
    const userId = localStorage.getItem("loggedUserId");
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    try {
      const response = await axios.post(`${config.API_URL}AuthMaster/SignOut`, {
        params: { userID: userId },
      });
      if (!rememberedEmail) {
        localStorage.clear();
      }

      dispatch(clearPersonalInformation());
      dispatch(clearSelectedEmployeePersonalInformation());
      navigate("/Login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  };

  const GetNotifications = async () => {
    try {
      const response = await axios.get(
        `${config.API_URL}NotificationBrodcast/GetAllNotification`
      );
      if (response.data.success == "True") {
        const appsArray = response.data.data || [];
        const latestNotifications = response.data.data.slice(-5);
        setNotifications(latestNotifications || []);

      } else {
        toast.error("Notification not fetched!");
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const getRelativeTime = (dateString) => {
    const notificationDate = new Date(dateString);
    const currentDate = new Date();
    const differenceInMillis = currentDate - notificationDate;

    const minutes = Math.floor(differenceInMillis / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} mins ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days == 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
//     <>
//       <div className="wrapper">
//         <nav class="main-header navbar navbar-expand navbar-black navbar-light text-sm bg-lightblue-heder">
//           <ul class="navbar-nav" >
//             <li class="nav-item">
//               <a class="nav-link" data-widget="pushmenu" href="#" role="button">
//                 <i class="fas fa-bars"></i>
//               </a>
//             </li>
//           </ul>
// {/* 
//           <marquee
//             attribute_name="attribute_value"
//             style={{
//               color: "#FFFFFF",
//               fontSize: "small",
//               fontWeight: "800",
//               fontStyle: "italic",
//               marginLeft: "40px",
//             }}
//           >
//             Hello {personalInfo.firstName + " " + personalInfo.lastName}, Welcome to ITEOS, Thank you being
//             part of our services.
//           </marquee> */}
//           <ul className="navbar-nav ml-auto">
//             <li className="nav-item">
//               <a
//                 className="nav-link"
//                 data-widget="fullscreen"
//                 href="#"
//                 role="button"
//               >
//                 {/* <i className="fas fa-expand-arrows-alt"></i> */}
//               </a>
//             </li>

//             <li className="nav-item dropdown show">
//               <a className="nav-link" data-toggle="dropdown" href="#" aria-expanded="false">
//                 {/* <i className="fas fa-comments"></i> */}
//               </a>
//               <div className="dropdown-menu dropdown-menu-lg" style={{ left: 'inherit', right: '0px' }}>
//                 <div className="card-body notification p-0" style={{ maxHeight: '300px', overflowY: 'auto' }}>
//                   {notifications
//                     .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))
//                     .map((notif, index) => {
//                       const relativeTime = getRelativeTime(notif.createdOn);
//                       return (
//                         <>
//                           <a href="#" class="dropdown-item">
//                             <div class="media">
//                               <div class="media-body">
//                                 <h3 class="dropdown-item-title text-bold">
//                                   {notif.notificationHeading}
//                                   <span class="float-right text-sm text-muted"><i class="far fa-clock mr-1"></i>{relativeTime}</span>
//                                 </h3>
//                               </div>
//                             </div>
//                           </a>
//                           <div className="dropdown-divider"></div>
//                         </>
//                       );
//                     })}
//                 </div>
//                 <div className="dropdown-divider"></div>
//                 <a href="#" className="dropdown-item dropdown-footer" onClick={() => navigate("/broadcast-notification")} >View All Notifications</a>
//               </div>
//             </li>


//             <li className="nav-item dropdown show">
//               <a
//                 className="nav-link"
//                 data-toggle="dropdown"
//                 href="#"
//                 aria-expanded="true"
//               >
//                 {/* <i className="fas fa-cog"></i> */}
//               </a>
//               <div
//                 className="dropdown-menu dropdown-menu-sm p-1"
//                 style={{ left: "inherit", right: "0px" }}
//               >
//                 <a
//                   href="#"
//                   style={{
//                     cursor: "pointer"
//                   }}
//                   className="dropdown-item"
//                   onClick={handleLogout}
//                 >
//                   {/* <i className="fas fa-sign-out-alt logout mr-1"></i> Logout */}
//                 </a>
//               </div>
//             </li>
//           </ul>
//         </nav>
//       </div >
//     </>
<div className="wrapper">
  <nav className="main-header navbar navbar-expand navbar-light text-sm bg-lightblue-heder">
    <ul className="navbar-nav">
      <li className="nav-item">
        <a className="nav-link" data-widget="pushmenu" href="#" role="button">
          <i className="fas fa-bars"></i>
        </a>
      </li>
    </ul>

    <ul className="navbar-nav ml-auto align-items-center">
      {/* Notification Bell with red dot */}
      <li className="nav-item dropdown">
        <a className="nav-link position-relative" data-toggle="dropdown" href="#">
          <i className="fas fa-bell"></i>
          <span
            className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
            style={{ fontSize: '0.5rem' }}
          ></span>
        </a>
        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <span className="dropdown-header">No new notifications</span>
        </div>
      </li>

      {/* Username with dropdown */}
      <li className="nav-item dropdown ml-3">
      <a
  className="nav-link dropdown-toggle d-flex flex-column align-items-start"
  href="#"
  id="userDropdown"
  role="button"
  data-toggle="dropdown"
>
  <span className="d-flex align-items-center">
    <i className="fas fa-user-circle mr-2"></i>
    <span>{localStorage.getItem("loggedUserDisplayName")}</span>
  </span>
  <small className="text-muted ml-4">
    {localStorage.getItem("loggedUserRole")}
  </small>
</a>
        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
          <a className="dropdown-item" 
          // href="#" onClick={handleLogout}
          >
            <i className="fas fa-power-off text-danger mr-2"></i> Logout
          </a>
        </div>
      </li>
    </ul>
  </nav>
</div>

  );
}

export default Header;
