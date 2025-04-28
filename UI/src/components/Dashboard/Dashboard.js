import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Dashboard.css";
import config from "../../config/config.json";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import laudi from "../../assets/images/employeeDashleadySpeaker.png";
import $ from "jquery";

function Dashboard() {
  const personalInfo = useSelector((state) => state.personalInformationReducer);
  const [gender, setGender] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      GetAttendencePercentage();
    }, 500);

    return () => clearTimeout(timeout);
  }, []);


  const fetchDashboardData = async () => {
    await Promise.all([
      GetGenderCount(),
      getUsersList(),
      GetNotifications(),
      GetAttendencePercentage()
    ]);
    if(window.barChart) window.barChart();


    // setTimeout(() => {
    if(window.calendar)
      window.calendar();
    // }, 1000);
    // if(window.serviceChart) window.serviceChart();
    // if(window.salaryChart) window.salaryChart();
  };



  const GetGenderCount = async () => {
    try {
      const response = await axios.get(
        `${config.apiEndPoint}/EmployeeData/GetTotalGenderCountt`
      );
      if(response.data.success === "True") {
        // console.log("all Gender--->", response.data.data[0].count);
        setGender(response.data.data || []);
        const genderData = response.data.data || [];
        const totalCount = genderData.reduce(
          (sum, gender) => sum + (gender.count || 0),
          0
        );
        const maleCount = genderData.find(g => g.gender === 'Male')?.count || 0;
        const femaleCount = genderData.find(g => g.gender === 'Female')?.count || 0;
        window.donutChart(maleCount, femaleCount);
        setCount(totalCount);
      } else {
        console.error("Error fetching departments:");
      }
    } catch(error) {
      console.error("Error fetching departments:");
    }
  };

  const GetNotifications = async () => {
    try {
      const response = await axios.get(
        `${config.apiEndPoint}/TextFile/NotifiactionText`
      );

      if(response.data.data.length > 0) {
        const latestNotifications = response.data.data.slice(-10);
        setNotifications(latestNotifications || []);
        // console.log("all notifications--->", response.data.data);
      } else {
        console.error("Error fetching notifications:");
      }
    } catch(error) {
      console.error("Error fetching notifications:");
    }
  };

  const getUsersList = () => {
    axios
      .get(
        config.API_URL + "AuthMaster/GetAllUsers?ClientId=" + config.ClientId,
        {
          headers: config.headers2,
        }
      )
      .then((response) => {
        if(response.status == 200) {
          if(response.data.success == "success") {
            if(response.data.data.length > 0) {
              setAllUsersList(response.data.data);
            }
          } else {
            setAllUsersList([]);
          }
        } else if(response.data.status.status == 500) {
          toast.error("Invalid users data.");
          setAllUsersList([]);
        }
      })
      .catch((error) => {
        console.error("Please try again later.");
      });
  };

  const GetAttendencePercentage = async () => {
    const currentYear = new Date().getFullYear();
    const totalMonths = 12;

    const presentData = Array(totalMonths).fill(0);
    const absentData = Array(totalMonths).fill(0);

    try {
      for(let month = 1; month <= totalMonths; month++) {
        const monthStr = month.toString().padStart(2, "0");
        const response = await axios.get(
          `${config.apiEndPoint}/EmployeeAttendenceCheck/GetAllandanceStatusOfAllEmployeeByMonth?month=${monthStr}&year=${currentYear}`
        );

        if(response.data.success === "True" && response.data.data.result.length > 0) {
          const entry = response.data.data.result[0]; // Assuming one result per month
          presentData[month - 1] = entry.presentPercentage;
          absentData[month - 1] = entry.absentPercentage;
        }
      }

      // console.log("Filled Present Data:", presentData);
      // console.log("Filled Absent Data:", absentData);

      if(typeof window.barChart === "function") {
        window.barChart(presentData, absentData);
      } else {
        console.error("barChart function is not defined on window.");
      }
    } catch(error) {
      console.error("Error fetching Attendance data:", error);
      if(typeof window.barChart === "function") {
        window.barChart([], []);
      }
    }
  };



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getRelativeTime = (dateString) => {
    const notificationDate = new Date(dateString);
    const currentDate = new Date();
    const differenceInMillis = currentDate - notificationDate;

    const minutes = Math.floor(differenceInMillis / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if(minutes < 1) return "Just now";
    if(minutes < 60) return `${minutes} mins ago`;
    if(hours < 24) return `${hours} hours ago`;
    if(days == 1) return "Yesterday";
    return `${days} days ago`;
  };

  const extractDetails = (notification) => {
    const match = notification.match(
      /Date\s*:\s*([^~]+).*?Message\s*:\s*([^,]+),/
    );
    if(match) {
      return {
        date: match[1].trim(),
        message: match[2].trim(),
      };
    }
    return null;
  };

  const parsedNotifications = notifications.map(extractDetails).filter(Boolean);

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Home</h1>
              <ol className="breadcrumb float-sm-left mt-1">
                <li className="breadcrumb-item">
                  <Link to="/home">Home</Link>
                </li>
                <li className="breadcrumb-item active">Home</li>
              </ol>
            </div>
            <div className="col-sm-6">
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row pt-1">
            <div className="col-lg-7 col-md-6 col-sm-12">
              <div
                className="card leady"
                style={{ background: "#D8E4FD", borderRadius: "10px" }}
              >
                <h4
                  className="card-header pb-0"
                  style={{ borderBottom: "none" }}
                >
                  Announcements
                </h4>
                <div className="card-body pt-2">
                  <div className="row">
                    <div className="col-md-9">
                      <h6 className="mb-2">Hello There!</h6>
                      <p className="mb-2">
                        Welcome to our Announcement Center! Here, you can easily
                        create and send out announcements to keep everyone
                        informed and engaged.
                      </p>
                    </div>
                    <div className="col-md-3">
                      <img
                        src={laudi}
                        alt=""
                        className="laudi img-fluid w-100"
                      ></img>
                    </div>
                    <div className="col-md-12">
                      <button
                        type="button"
                        className="btn-sm btn-primary text-sm"
                        style={{ border: "none" }}
                        onClick={() => navigate("/broadcast-notification")}
                      >
                        <i className="fas fa-plus mr-2"></i>Create
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-6 col-sm-12">
              <div
                className="card card-outline"
                style={{
                  height: "92%",
                  borderRadius: "10px",
                  backgroundColor: "rgb(219 224 233 / 53%)",
                }}
              >
                <div className="card-header">
                  <div className="row">
                    <div className="col-md-10">
                      <h4 className="mb-0">Notifications</h4>
                    </div>
                    <div className="col-md-2">
                      <a href="/notification" className="float-right mt-1">
                        View All
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className="card-body notification pt-2"
                  style={{
                    height: "7rem",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <style>
                    {
                      `.notification { 
                      position: relative;
                      }
                      .message {
                      display: -webkit-box;
                      -webkit-line-clamp: 2;
                      -webkit-box-orient: vertical;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      }
                      .notification-list {
                      animation: scroll 20s linear infinite;
                      position: absolute;
                      top: 0;
                      width: 100%;
                      animation-play-state: running;
                      }
                      .notification-list:hover {
                      animation-play-state: paused;
                      }
                      @keyframes scroll {
                      0% {
                      top: 0;
                      }
                      100% {
                      top: -300%;
                      }
                      }
                      .notification::-webkit-scrollbar {
                      display: none;
                      }`
                    }
                  </style>

                  <div className="notification-list">
                    {parsedNotifications
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((notif, index) => {
                        const cleanedMessage = notif.message
                          .replace(/}/, ".")
                          .trim();
                        const [dateString, time] = notif.date.split(" ");
                        const formattedDate = formatDate(dateString);
                        const relativeTime = getRelativeTime(notif.date);
                        return (
                          <div
                            key={index}
                            className="row py-1"
                            style={{
                              borderBottom: "1px solid rgba(0, 0, 0, .125)",

                              height: "3rem",
                            }}
                          >
                            <div className="col-md-9">
                              <p className="text-xs text-bold message">
                                {" "}
                                {cleanedMessage}
                              </p>
                            </div>

                            <div
                              className="col-md-3 text-end"
                              style={{ color: "rgba(63, 1, 1, 0.5)" }}
                            >
                              <span className="text-xs">{formattedDate}</span>
                              <br />
                              <span className="text-xs">({relativeTime})</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row pt-1">
            <div className="col-lg-12 col-md-6 col-sm-12">
              <div className="card card-outline card-primary" style={{ borderRadius: "10px" }}>
                <div className="card-header" style={{ borderBottom: "none" }}>
                  <h6 className="mb-2">Employee Attendance</h6>
                  <button
                    className="btn btn-xs"
                    style={{ background: "#3c8dbc", color: "#fff" }}
                  >
                    Present
                  </button>{" "}
                  <button
                    className="btn btn-xs"
                    style={{ background: "rgb(255 126 126)", color: "#fff" }}
                  >
                    Absent
                  </button>
                </div>
                <div className="card-body pt-0">
                  <div id="bar-chart" style={{ height: "200px" }}></div>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-5 col-md-6 col-sm-12">
              <div
                className="card card-outline"
                style={{ height: "297px", borderRadius: "10px" }}
              >
                <div className="card-body py-0">
                  <div id="calendar"></div>


                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div className="container-fluid">
          <div className="row pt-1">
            <div className="col-lg-6 col-md-3 col-sm-12">
              <div className="card card-outline card-primary" style={{ borderRadius: "10px" }}>
                <div className="card-header" style={{ borderBottom: "none" }}>
                  <h6 className="mb-0">Gender Distribution ({count})</h6>
                </div>
                <div
                  id="donutChart"
                  style={{ width: "400px", height: "275px" }}
                ></div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div
                className="card card-outline card-primary"
                style={{ height: "320px", borderRadius: "10px" }}
              >
                <div className="card-body py-0">
                  <div id="calendar"></div>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-4 col-md-3 col-sm-12">
              <div
                className="card card-outline"
                style={{ borderRadius: "10px" }}
              >
                <div className="card-header" style={{ borderBottom: "none" }}>
                  <h6 className="mb-0">Years in Service Distribution</h6>
                </div>
                <div className="card-body pt-0">
                  <div
                    id="line-chart"
                    style={{ width: "330px", height: "260px" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-3 col-sm-12">
              <div
                className="card card-outline"
                style={{ borderRadius: "10px" }}
              >
                <div className="card-header" style={{ borderBottom: "none" }}>
                  <h6 className="mb-0">Salary revision Frequency</h6>
                </div>
                <div className="card-body pt-0">
                  <div
                    id="area-chart"
                    style={{ width: "330px", height: "260px" }}
                  ></div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      <ToastContainer position="top-center" />
    </>
  );
}

export default Dashboard;
