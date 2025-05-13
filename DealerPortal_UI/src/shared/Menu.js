import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Menu = () => {
  const personalInfo = useSelector((state) => state.personalInformationReducer);
  console.log("personalInfo", personalInfo);
  const gender = personalInfo.gender?.toLowerCase();
  const profileImg = personalInfo.profilePic ;

  let PImg = (profileImg === "undefined" || !profileImg)
  ? (gender === 'male' 
      ? require('../../src/assets/images/download.jpeg')
      : require('../../src/assets/images/default_img.png'))
  : profileImg;

  const [allRoutsList, setAllRoutsList] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    setAllRoutsList(personalInfo.menuItemNames);
  }, []);

  setTimeout(() => {
    window.$('[data-widget="treeview"]').Treeview("init");
  }, 1000);

  const location = useLocation();

  const routeIcons = {
    "/home": <i className="fas fa-home" />,
    "/Home": <i className="fas fa-home" />,
    "/employee-dashboard": <i className="fas fa-qrcode" />,
    "/manage-attendance": <i className="fas fa-calendar-alt" />,
    "/manage-leave": <i className="fas fa-binoculars" />,
    "/employee-leave": <i className="fas fa-walking" />,
    "/profile": <i className="fas fa-user" />,
    "/employee-profile": <i className="fas fa-user" />,
    "/manage-users": <i className="fas fa-user-plus" />,
    "/user-management": <i className="fas fa-user-plus" />,
    "/manage-payroll-template": <i className="fas fa-envelope-open-text" />,
    "/Masters": <i className="fas fa-cogs" />,
    "/scheme": <i className="fas fa-edit" />,
    "/leave-masters": <i className="fas fa-cogs" />,
    "/manage-employee": <i className="fas fa-users" />,
    "/manage-email-config": <i className="fas fa-envelope" />,
    "/form-builder": <i className="fas fa-edit" />,
    "/privacy-policy": <i className="fas fa-scroll" />,
    "/delivery-tracking": <i className="fas fa-receipt" />,
    "/sales-order-approval": <i className="fas fa-clock" />,
    "/tracking-reports": <i className="fas fa-tasks" />,
    "/dealer-reports": <i className="fas fa-tasks" />,
    "/add-stock": <i className="fas fa-plus-square" />,
    "/stock-availability": <i className="fas fa-boxes" />,
    "/place-order": <i className="fas fa-cart-plus" />,
    "/return-order": <i className="fas fa-undo-alt" />,
    "/order-status": <i className="fas fa-info-circle" />,
    "/order-history": <i className="fas fa-history" />,
    "/requisition": <i className="fas fa-file-alt" />,
    "/support": <i className="fas fa-headset" />,
    "/rewards": <i className="fas fa-gift" />,
    
    "/manage-attendace-regularization": (
      <i className="fas fa-calendar-check"></i>
    ),
    "/payroll": (isActive) => (
      <div
        className=""
        style={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <i
          className="fas fa-file"
          style={{
            filter: isActive
              ? "brightness(0) saturate(100%) invert(1)"
              : "none",
          }}
        />
        <i
          className="fas fa-rupee-sign"
          style={{
            position: "absolute",
            color: isActive ? "black" : "white",
            top: "58%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "7px",
          }}
        />
      </div>
    ),
    "/payroll-process": <i className="fas fa-clipboard-check"></i>,
    "/manage-holiday": <i className="fas fa-calendar-times"></i>,
    "/holiday-list": <i className="fas fa-calendar-minus"></i>,
    "/manage-expenses": (isActive) => (
      <div
        className=""
        style={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <i
          className="fas fa-money-check-alt"
          style={{
            filter: isActive
              ? "brightness(0) saturate(100%) invert(1)"
              : "none",
          }}
        />
        <i
          className="fas fa-rupee-sign"
          style={{
            position: "absolute",
            color: isActive ? "rgb(43, 83, 198)" : "white",
            background: isActive ? "white" : "black",
            top: "50%",
            left: "26%",
            transform: "translate(-50%, -50%)",
            fontSize: "7px",
          }}
        />
      </div>
    ),
    "/org-chart": <i class="fas fa-sitemap"></i>,
    "/reports": <i class="fas fa-copy"></i>,
    "/manage-holiday": <i className="fas fa-calendar-times"></i>,
    "/attendace-regularization": <i className="fas fa-calendar-check"></i>,
    "/manage-it-decelaration": <i className="fas fa-file-signature"></i>,
    "/employee-expense-management": (isActive) => (
      <div
        className=""
        style={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <i
          className="fas fa-money-check-alt"
          style={{
            filter: isActive
              ? "brightness(0) saturate(100%) invert(1)"
              : "none",
          }}
        />
        <i
          className="fas fa-rupee-sign"
          style={{
            position: "absolute",
            color: isActive ? "rgb(43, 83, 198)" : "white",
            background: isActive ? "white" : "black",
            top: "50%",
            left: "26%",
            transform: "translate(-50%, -50%)",
            fontSize: "7px",
          }}
        />
      </div>
    ),
    "/it-decelaration": <i className="fas fa-file-signature"></i>,
    "/income-tax-slab": (isActive) => (
      <div
        className=""
        style={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <i
          className="fas fa-receipt"
          style={{
            filter: isActive
              ? "brightness(0) saturate(100%) invert(1)"
              : "none",
          }}
        />
        <i
          className="fas fa-rupee-sign"
          style={{
            position: "absolute",
            color: isActive ? "rgb(43, 83, 198)" : "white",
            background: isActive ? "white" : "black",
            top: "50%",
            left: "30%",
            transform: "translate(-50%, -50%)",
            fontSize: "7px",
          }}
        />
      </div>
    ),
    "/manage-tax-slab": (isActive) => (
      <div
        className=""
        style={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <i
          className="fas fa-microchip"
          style={{
            filter: isActive
              ? "brightness(0) saturate(100%) invert(1)"
              : "none",
          }}
        />
        <i
          className="fas fa-rupee-sign"
          style={{
            position: "absolute",
            color: isActive ? "rgb(43, 83, 198)" : "white",
            background: isActive ? "white" : "black",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "9px",
          }}
        />
      </div>
    ),
  };

  const fullName =
    `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.length > 15
      ? `${personalInfo.firstName}`.slice(0, 15) + "..."
      : `${personalInfo.firstName}`;

  const isPathActive = (path) => {
    if (
      location.pathname === "/employee-details" &&
      path === "/manage-employee"
    ) {
      return true;
    }
    if (
      (location.pathname === "/user-attendance" || location.pathname === "/broadcast-notification") &&
      path === "/employee-dashboard"
    ) {
      return true;
    }

    const masterRoutes = [
      "/masters",
      "/AppMaster",
      "/RoleswithApps",
      "/manage-leaveTypes",
      "/manage-departments",
      "/manage-designations",
    ];
    if (masterRoutes.includes(location.pathname) && path === "/masters") {
      return true;
    }
    return location.pathname === path;
  };

  const handleNaviagte = () => {
    if (personalInfo.userRole == "Admin" || personalInfo.userRole == "HR" || personalInfo.userRole == "Manager") {
      navigate("/profile");
    } else if (personalInfo.userRole == "Employee") {
      navigate("/employee-profile");
    } else {
      navigate("/");
    }
  }

  return (
    <>
      <aside className="main-sidebar sidebar-light-maroon elevation-4 d-flex flex-column">
        <div className="header">
          <img
            id=""
            src={require("../assets/images/Hlogo.png")}
            className="img-fluid w-75 largeSidebarIcon mt-2 ml-1"
            style={{ height: 50 }}
          />

          <a
            href="#"
            id=""
            className="brand-link smallSidebarIcon"
            style={{ display: "none" }}
          >
            <img
              src={require("../assets/images/shortLogo.png")}
              alt="Iteos Logo"
              className="brand-image"
            />
            <span className="brand-text font-weight-light">
              ITEOS : Dealer Portal
            </span>
          </a>
        </div>

        <div
          className="sidebar flex-grow-1"
          style={{
            background: "#fdfefe",
            overflowY: "auto",
            height: "calc(100vh - 150px)",
          }}
        >
          <nav className="mt-3">
            <ul
              className="nav nav-pills nav-sidebar flex-column text-sm"
              data-widget="treeview"
              role="menu"
              data-accordion="true"
            >
              {allRoutsList.length > 0
                ? allRoutsList.map((routesObj, index) => {
                  const isActive = isPathActive(routesObj.appRoute);
                  return (
                    <li
                      key={"route_" + (index + 1)}
                      className={isActive ? "nav-item active" : "nav-item"}
                    >
                      <Link
                        className={isActive ? "nav-link active" : "nav-link"}
                        to={routesObj.appRoute}
                      >
                        <div className="d-flex">
                          <div className="col-md-2 text-center">
                            {routeIcons[routesObj.appRoute] ? (
                              typeof routeIcons[routesObj.appRoute] ===
                                "function" ? (
                                routeIcons[routesObj.appRoute](isActive)
                              ) : (
                                routeIcons[routesObj.appRoute]
                              )
                            ) : (
                              <i className="nav-icon far fa-circle text-danger"></i>
                            )}
                          </div>
                          <div className="col-md-10">
                            <p>{routesObj.appName}</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })
                : ""}
            </ul>
          </nav>
        </div>
        <div
          className="user-panel row"
          style={{
            position: "absolute",
            bottom: 0,
            left: 7,
            right: 0,
            background: "#fff",
            width: "100%",
            borderTop: "1px solid rgba(0, 0, 0, .125)",
          }}
        >

          <div className="col-md-12 d-flex align-items-center px-3 py-2" onClick={handleNaviagte} >

            <div className="largeSidebarIcon">
              <div className="Userimage" style={{ display: 'inline-grid' }}>
                <img src={PImg} className="img-circle elevation-2" alt="" />
              </div>
              <div className="info w-100" style={{ fontWeight: "bold", padding: '0px 0px 0px 25px' }}>
                <a
                  href="#"
                  className="d-block name-ellipsis"
                  title={`${personalInfo.firstName} ${personalInfo.lastName}`}
                >
                  {fullName}
                </a>
                <a href="#" style={{ fontSize: "x-small" }} className="d-block">
                  ({personalInfo.userRole})
                </a>
              </div>
            </div>

            <div className="smallSidebarIcon" style={{ display: "none" }}>
              <div className="Userimage" style={{ display: 'inline-grid' }}>
                <img src={PImg} className="img-circle elevation-2" alt="" />
              </div>
              <span className="brand-text font-weight-light">
                <div className="info w-100" style={{ fontWeight: "bold", padding: '5px 5px 0px 10px' }}>
                  <a
                    href="#"
                    className="d-block name-ellipsis"
                    title={`${personalInfo.firstName} ${personalInfo.lastName}`}
                  >
                    {fullName}
                  </a>
                  <a href="#" style={{ fontSize: "x-small" }} className="d-block">
                    ({personalInfo.userRole})
                  </a>
                </div>
              </span>
            </div>

          </div>


          {/* <div
            className="col-md-12 py-2 d-flex align-items-center justify-content-center"
            style={{
              background:
                "linear-gradient(to left, rgb(43 83 198 / 53%), rgb(35, 147, 222))",
            }}
          >
            <span
              className="brand-text largeSidebarIcon"
              style={{ fontWeight: 900, color: "#FFFFFF", fontSize: 16 }}
            >
              ITEOS : Dealer Portal
            </span>
            <span
              className="smallSidebarIcon"
              style={{ fontWeight: 900, color: "#FFFFFF", fontSize: 16, display: "none" }}
            >
              Dealer
            </span>
          </div> */}
        </div>
      </aside>
    </>
  );
};

export default Menu;
