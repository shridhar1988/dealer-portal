import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import $ from "jquery";

import "../Masters/filter-style.css";
import "../../App.css";

function Scheme() {
  const navigate = useNavigate();

  const personalInfo = useSelector((state) => state.personalInformationReducer);

  const handleCreateClick = () => {
    console.log("Create button clicked");
    navigate("/create-scheme");
  };
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [allSchemeList, setAllSchemeList] = useState([]);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [allUsersList, setAllUsersList] = useState([]);
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  const [currentPage, setCurrentPage] = useState(1);
  // const [searchText, setSearchText] = useState("");
  const rowsPerPage = 10;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  //const currentRows = filteredApps.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(allUsersList.length / rowsPerPage);

  const startEntry = indexOfFirstRow + 1;
  const endEntry = Math.min(indexOfLastRow, allUsersList.length);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const addProjectCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  };
  const listOfProjectsHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButton").click();
  };

  const handleNaviagte = () => {
    if (personalInfo.userRole === "Dealer") {
      navigate("/sales-order-details");
    } else if (personalInfo.userRole === "Approver") {
      navigate("/sales-order-details");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <div>
        <div className="content-header ml-2">
          <div className="container-fluid ">
            <div className="row">
              <div className="col-sm-6 "style={{marginLeft:"-7px",marginBottom :"-10px"}}>
                <h1 className="m-0 " style={{fontSize:"1.5rem",marginLeft:"-20px"}}>List Of Scheme</h1>
                {/* <ol className="breadcrumb float-sm-left mt-1">
                  <li className="breadcrumb-item">
                    <Link to="/manage-employee">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Scheme</li>
                </ol> */}
              </div>
              <div className="col-sm-6 d-flex justify-content-end">
                <div className="dropdown">
                  {/* <h2
                    className="dropdown-toggle text-primary m-0"
                    role="button"
                    id="standardDropdown"
                    data-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: "pointer", fontSize: "1.0rem" }}
                  >
                    Standard *
                  </h2> */}
                  <div
                    className="dropdown-menu"
                    aria-labelledby="standardDropdown"
                  >
                    <a className="dropdown-item" href="#">
                      Option 1
                    </a>
                    <a className="dropdown-item" href="#">
                      Option 2
                    </a>
                    <a className="dropdown-item" href="#">
                      Option 3
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="content ml-2">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card collapsed-card">
               
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card  ">
                <div className="d-flex justify-content-between align-items-center mb-1">
            <h4 className="ml-4 mb-0">
            Scheme (1)
            </h4>

            <div className="d-flex align-items-center gap-2 mt-0 mr-2">
              <button className="btn mt-1" type="button ">
       
       
              {/* <i className="bi bi-x-circle"
               style={{border :"none",outline: "none"}}></i> */}
              
               <svg className ="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle mr-1 mb-1" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg>
                {/* <IoIosCloseCircleOutline className="mr-1"/> */}
                Clear
              </button>

              <div className="d-flex align-items-center gap-2 mt-1 mr-2 filter-box">
                <span className="mr-2">Filter :</span>
                <div
                  className="input-group input-group-sm"
                  style={{ width: "70px" }}
                >
                  <select className="form-control font-weight-bold">
                    <option>
                      <strong>ALL</strong>
                    </option>
                  </select>
                </div>
              </div>
              <div style={{marginRight:'16px'}} >
              <button style={{border :"1px solid gray",borderTopRightRadius:"0px",borderBottomRightRadius:"0px"}}
                            type="button"
                            className="btn btn-tool"
                            id="listOfProjectsHeaderExpandButtion"
                            onClick={(e) => {
                              listOfProjectsHeaderExpandButtionClick(e);
                            }}
                            data-card-widget="collapse"
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <button style={{border :"1px solid gray",borderBottomLeftRadius :"0px",borderTopLeftRadius:"0px",borderBottomleftRadius:"0px"}}
                            type="button"
                            className="btn btn-tool"
                            data-card-widget="maximize"
                          >
                            <i className="fas fa-expand"></i>
                          </button>
                          </div>
            </div>
          </div>
                  <div className="card-body text-sm position-relative">
                    {isLoaderActive && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgb(233 236 239 / 81%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                      >
                        <i
                          className="fas fa-sync-alt fa-spin"
                          style={{ fontSize: "2rem", color: "#333" }}
                        ></i>
                      </div>
                    )}
                    <table
                      class="table table-sm"
                      style={{
                        border: "1px solid lightgray",
                        borderTopRightRadius: "5px 5px",
                        borderCollapse: "separate",
                      }}
                      id="listOfProjectsTable"
                    >
                      <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                          {/* <th style={{ fontWeight: '500' }}><div> <input type='checkbox'></input>
                    </div></th> */}
                          <th style={{ fontWeight: "500" }}>Reference ID</th>
                          <th style={{ fontWeight: "500" }}>Valid From</th>
                          <th style={{ fontWeight: "500" }}>Valid To</th>
                          <th style={{ fontWeight: "500" }}>Creation Date</th>
                          <th style={{ fontWeight: "500" }}>Type</th>
                          <th style={{ fontWeight: "500" }}>Created By</th>
                          <th style={{ fontWeight: "500" }}>File</th>
                          <th style={{ fontWeight: "500" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* <tr style={{ textDecoration: userObj.isActive == true ? 'none' : 'line-through' }}> */}
                        <tr style={{}}>
                          {/* <td style={{ fontWeight: '400', fontSize: 'smaller' }}>
                      <div> <input type='checkbox'></input>
                      </div>
                    </td> */}
                          <td
                            style={{ fontWeight: "400", fontSize: "smaller" }}
                          >
                            REF12345
                          </td>
                          <td
                            style={{ fontWeight: "400", fontSize: "smaller" }}
                          >
                            2025-01-01
                          </td>
                          <td
                            style={{ fontWeight: "400", fontSize: "smaller" }}
                          >
                            2025-02-21
                          </td>
                          <td
                            style={{ fontWeight: "400", fontSize: "smaller" }}
                          >
                            2025-04-20
                          </td>
                          <td
                            style={{ fontWeight: "400", fontSize: "smaller" }}
                          >
                            Standard
                          </td>
                          <td
                            style={{ fontWeight: "400", fontSize: "smaller" }}
                          >
                            Admin
                          </td>
                          <td
                            style={{ fontWeight: "400", fontSize: "smaller" }}
                          >
                            {/* <span className="px-2 py-1 flex items-center justify-center text-center rounded " onClick={handleNaviagte} style={{ backgroundColor: '#CCF0EB', color: '#00B698', cursor: 'pointer' }}>Order Pending for Approval</span> */}
                            <button class="btn btn-light p-1">
                              <a href="#" class="text-primary">
                                <i class="fas fa-file-alt"></i>
                              </a>
                            </button>
                          </td>
                          <td
                            style={{ fontWeight: "400", fontSize: "smaller" }}
                            className="text-center text-sm"
                          >
                            {/* <button type="button" class="btn btn-xs" onClick={handleNaviagte} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                        <i class="fas fa-ellipsis-v" style={{ fontSize: 'smaller' }}></i>
                      </button> */}
                          <button
                            //   onClick={() => handleReturn(order.sno)}
                              className="requisition btn btn-sm btn-primary mr-2"
                            >
                              Place Order
                            </button>
                           
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="d-flex justify-content-between mt-2">
                      <div>
                        Showing {startEntry} to {endEntry} of{" "}
                        {allUsersList.length} entries
                      </div>
                      <div>
                        <button
                          className="btn btn-xs btn-outline-primary"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <i className="fas fa-angle-double-left"></i>
                        </button>
                        <span className="m-1">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          className="btn btn-xs btn-outline-primary"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <i className="fas fa-angle-double-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Shafi Code */}
        {/* <div className={`fileterdiv1 ${isFullscreen ? "fullscreen-table" : ""}`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="ml-3 mb-0">Scheme (3)</h5>

          <div className="d-flex align-items-center gap-2 mt-2 mr-2">
            <button
              className="btn btn-primary mr-2"
              onClick={handleCreateClick}
            >
              Create
            </button>
            <button className="btn btn-outline-secondary" title="Settings">
              <i className="fas fa-cog"></i>
            </button>

            <button
              className="btn btn-outline-secondary"
              title="Expand"
              onClick={toggleFullscreen}
            >
              <i className="fas fa-expand-arrows-alt"></i>
            </button>
          </div>
        </div>

        <div className="table-responsive mt-4 px-4 ">
          <table className="table table-border table-striped text-center px-6 border">
            <thead className="thead-light">
              <tr>
                <th>Reference ID</th>
                <th>Valid From</th>
                <th>Valid To</th>
                <th>Creation Date</th>
                <th>Type</th>
                <th>Created By</th>
                <th>File</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="thead-white">
              <tr>
                <td>REF12345</td>
                <td>2025-01-01</td>
                <td>2025-12-31</td>
                <td>2025-04-20</td>
                <td>Standard</td>
                <td>Admin</td>
                <td>
                  <button class="btn btn-light p-1">
                    <a href="#" class="text-primary">
                      <i class="fas fa-file-alt"></i>
                    </a>
                  </button>
                </td>

                <td>
                  <button class="btn btn-light p-1">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td>REF67890</td>
                <td>2025-02-01</td>
                <td>2025-11-30</td>
                <td>2025-04-22</td>
                <td>Custom</td>
                <td>Manager</td>
                <td>
                  <button class="btn btn-light p-1">
                    <a href="#" class="text-primary">
                      <i class="fas fa-file-alt"></i>
                    </a>
                  </button>
                </td>
                <td>
                  <button class="btn btn-light p-1">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td>REF24680</td>
                <td>2025-03-15</td>
                <td>2025-10-15</td>
                <td>2025-04-25</td>
                <td>Premium</td>
                <td>User1</td>
                <td>
                  <button class="btn btn-light p-1">
                    <a href="#" class="text-primary">
                      <i class="fas fa-file-alt"></i>
                    </a>
                  </button>
                </td>
                <td>
                  <button class="btn btn-light p-1">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}
        {/* Shafi Code end */}
      </div>
    </>
  );
}

export default Scheme;
