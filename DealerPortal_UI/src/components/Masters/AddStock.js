// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import "../../App.css";
// import "./filter-style.css";
// import * as XLSX from "xlsx";
// function AddStock() {
//   const navigate = useNavigate();
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   const toggleFullscreen = () => {
//     setIsFullscreen(!isFullscreen);
//   };
//   const handleCreateClick = () => {
//     console.log("Create button clicked");
//     navigate("/Add-New-Sock");
//   };  const downloadExcel = () => {
//     const table = document.querySelector("table"); // or use a ref for more control
//     const workbook = XLSX.utils.table_to_book(table, { sheet: "Stock Data" });
//     XLSX.writeFile(workbook, "WarehouseStock.xlsx");
//   };

//   return (
//     <div>
//       {/* Page Header */}
//       <div className="content-header">
//         <div className="container-fluid">
//           <div className="row mb-2 align-items-center">
//             <div className="col-sm-6">
//               <h1 className="m-0">Stock Availability</h1>
//             </div>
//             <div className="col-sm-6 d-flex justify-content-end">
//               <div className="dropdown">
//                 {/* <h2
//                   className="dropdown-toggle text-primary m-0"
//                   role="button"
//                   id="standardDropdown"
//                   data-toggle="dropdown"
//                   aria-expanded="false"
//                   style={{ cursor: "pointer", fontSize: "1.5rem" }}
//                 >
//                   Standard
//                 </h2> */}
//                 <div
//                   className="dropdown-menu"
//                   aria-labelledby="standardDropdown"
//                 >
//                   <a className="dropdown-item" href="#">
//                     Option 1
//                   </a>
//                   <a className="dropdown-item" href="#">
//                     Option 2
//                   </a>
//                   <a className="dropdown-item" href="#">
//                     Option 3
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Section */}
//       <section className="content">
//         <div className="container-fluid">
//           <div className="row">{/* Your content goes here */}</div>
//         </div>
//       </section>

//       <div className="fileterdiv p-4">
//         <div className="d-flex justify-content-between align-items-center ml-2">
//           <div className="">
//             <div className="filter-bar d-flex align-items-center">
//               <div className="filter-dropdown  px-3 py-2">
//                 <i className="fa fa-filter" aria-hidden="true"></i>
//               </div>

//               {/* Filter By */}
//               <div className="filter-label d-flex align-items-center px-3 py-2 font-weight-bold">
//                 Filter By
//               </div>

//               {/* Reference ID Dropdown */}
//               <div className="filter-dropdown d-flex align-items-center px-3 py-2">
//                 <select className="form-select border-0 p-0 no-border-input font-weight-bold">
//                   <option>Plant</option>
//                   <option>Plant1</option>
//                   <option>Plant2</option>
//                 </select>
//               </div>

//               {/* Creation Date Dropdown */}
//               <div className="filter-dropdown d-flex align-items-center px-3 py-2">
//                 <select className="form-select border-0 p-0 no-border-input font-weight-bold">
//                   <option>Material</option>
//                   <option>Material A</option>
//                   <option>Material B</option>
//                 </select>
//               </div>

//               {/* Reset Filter */}
//               <div className="filter-reset d-flex align-items-center px-3 py-2 text-danger font-weight-bold">
//                 <i className="fas fa-redo mr-2"></i> Reset Filter
//               </div>
//             </div>
//           </div>

//           <div className="d-flex justify-content-end gap-2">
//             <button className="btn btn-primary" onClick={handleCreateClick}>
//               Add New Stock
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* <div className="d-flex justify-content-between align-items-center mb-3"> */}
//       {/* <h5 className="ml-3 mb-0">Scheme (3)</h5> */}

//       {/* <div className="d-flex align-items-center gap-2">
//     <button className="btn btn-primary mr-2" onClick={handleCreateClick}>Create</button>
//     <button className="btn btn-outline-secondary" title="Settings">
//       <i className="fas fa-cog"></i>
//     </button>
//     <button className="btn btn-outline-secondary" title="Expand">
//       <i className="fas fa-expand-arrows-alt"></i>
//     </button>
//   </div> */}
//       {/* </div> */}
//       <div className={`fileterdiv1 ${isFullscreen ? "fullscreen-table" : ""}`}>
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="ml-3 mb-0">Warehouse Stock Of Material</h5>

//           <div className="d-flex align-items-center gap-2 mt-2 mr-2">
//             <button className="btn btn-outline-secondary" title="Download"
//               onClick={downloadExcel}>
//               <i className="fas fa-download"></i>
//             </button>

//             <button
//               className="btn btn-outline-secondary"
//               title="Expand"
//               onClick={toggleFullscreen}
//             >
//               <i className="fas fa-expand-arrows-alt"></i>
//             </button>
//           </div>
//         </div>

//         <div className="table-responsive  mt-4 ml-0 px-4">
//           <table className="table table-bordered table-striped text-center px-6 border">
//             <thead className="thead-grey">
//               <tr>
//                  <th style={{ fontWeight: '500' }}>Material</th>
//                  <th style={{ fontWeight: '500' }}>Plant</th>
//                  <th style={{ fontWeight: '500' }}>SLoc</th>
//                  <th style={{ fontWeight: '500' }}>Batch</th>
//                  <th style={{ fontWeight: '500' }}>BUn</th>
//                  <th style={{ fontWeight: '500' }}>Unrestricted</th>
//                  <th style={{ fontWeight: '500' }}>Quality Inspection</th>
//                  <th style={{ fontWeight: '500' }}>Value Unrestricted</th>
//                  <th style={{ fontWeight: '500' }}>Transit</th>
//               </tr>
//             </thead>
//             <tbody className="thead-white">
//               <tr>
//                 <td>3000</td>
//                 <td>4300</td>
//                 <td>002</td>
//                 <td>123456</td>
//                 <td>1</td>
//                 <td>2</td>
//                 <td>4</td>
//                 <td>2</td>
//                 <td>4</td>
//               </tr>
//               <tr>
//                 <td>3000</td>
//                 <td>4300</td>
//                 <td>002</td>
//                 <td>123456</td>
//                 <td>1</td>
//                 <td>2</td>
//                 <td>4</td>
//                 <td>2</td>
//                 <td>4</td>
//               </tr>
//               <tr>
//                 <td>3000</td>
//                 <td>4300</td>
//                 <td>002</td>
//                 <td>123456</td>
//                 <td>1</td>
//                 <td>2</td>
//                 <td>4</td>
//                 <td>2</td>
//                 <td>4</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddStock;



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";
import "./filter-style.css";
import * as XLSX from "xlsx";
import $ from "jquery";
import { useSelector } from "react-redux";
import { saveAs } from "file-saver";


function AddStock() {

  const personalInfo = useSelector((state) => state.personalInformationReducer);
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [allStockList, setAllStockList] = useState([]);


  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  // const [searchText, setSearchText] = useState("");
  const rowsPerPage = 10;

  // const filteredApps = roles.filter((app) =>
  //   Object.values(app).some((val) =>
  //     val?.toString().toLowerCase().includes(searchText.toLowerCase())
  //   )
  // );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  //const currentRows = filteredApps.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(allStockList.length / rowsPerPage);

  const startEntry = indexOfFirstRow + 1;
  const endEntry = Math.min(indexOfLastRow, allStockList.length);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  //Pagination
  const handleNaviagte = () => {
    if (personalInfo.userRole === "Dealer") {
      navigate("/sales-order-details");
    } else if (personalInfo.userRole === "Approver") {
      navigate("/sales-order-details");
    } else {
      navigate("/");
    }
  };
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  const exportToExcel = () => {
    debugger
    console.log(XLSX.utils);
    const worksheet = XLSX.utils.json_to_sheet(
      allStockList.map((trackingRecords) => ({
        "App Name": trackingRecords.appName,
        "App Route": trackingRecords.appRoute,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TrackingReport");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "TrackingReport.xlsx");
  };

  const handleCreateClick = () => {
    console.log("Create button clicked");
    navigate("/Add-New-Sock");
  }; const downloadExcel = () => {
    const table = document.querySelector("table"); // or use a ref for more control
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Stock Data" });
    XLSX.writeFile(workbook, "WarehouseStock.xlsx");
  };

  const addProjectCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  }
  const listOfProjectsHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButton").click();
  }
  return (
    <>
      <section className="content">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Stock Availability</h1>
                <ol className="breadcrumb float-sm-left mt-1">
                  <li className="breadcrumb-item"><Link to="/manage-employee">Home</Link></li>
                  <li className="breadcrumb-item active">Stock Availability</li>
                </ol>
              </div>
              <div className="col-sm-6">
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className='row'>
              <div className="col-md-12">
                <div className="card  collapsed-card">
                  <div className="fileterdiv p-4">
                    <div className="d-flex justify-content-between align-items-center ml-2">
                      <div className="">
                        <div className="filter-bar d-flex align-items-center">
                          <div className="filter-dropdown  px-3 py-2">
                            <i className="fa fa-filter" aria-hidden="true"></i>
                          </div>

                          {/* Filter By */}
                          <div className="filter-label text-nowrap d-flex align-items-center px-3 py-2 font-weight-bold">
                            Filter By
                          </div>

                          {/* Reference ID Dropdown */}
                          <div className="filter-dropdown d-flex align-items-center px-3 py-2">
                            <select className="form-select text-nowrap border-0 p-0 no-border-input font-weight-bold">
                              <option value="" disabled selected hidden>Plant</option>
                              <option value="">Plant1</option>
                              <option value="">Plant2</option>
                            </select>
                          </div>

                          {/* Creation Date Dropdown */}
                          <div className="filter-dropdown d-flex align-items-center px-3 py-2">
                            <select className="form-select text-nowrap border-0 p-0 no-border-input font-weight-bold">
                              <option value="" disabled selected hidden>Material</option>
                              <option value="">M1</option>
                              <option value="">M2</option>
                            </select>
                          </div>

                          {/* Reset Filter */}
                          <div className="filter-reset text-nowrap d-flex align-items-center px-3 py-2 text-danger font-weight-bold">
                            <i className="fas fa-redo mr-2"></i> Reset Filter
                          </div>
                        </div>

                      </div>
                      <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-primary" onClick={handleCreateClick}>
                          Add New Stock
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='row'>
              <div className="col-md-12">
                <div className="card  ">
                  <div className="card-header">
                    <div className='row'>
                      <div className='col-md-7'>
                        <h4 className="m-0">Warehouse Stock of Material ( {allStockList.length} )</h4>
                      </div>
                      {/* <div className='col-md-3'>
                        <input
                          type="text"
                          className="form-control form-control-sm "
                          placeholder="Search..."
                          style={{ borderRadius: '9rem' }}
                          onChange={(e) => { }}
                        />
                      </div> */}
                      <div className='col-md-5 justify-content-end d-flex'>
                        <button type="button" className="btn btn-warning btn-sm pl-3 pr-3 ml-" onClick={exportToExcel} style={{
                          color: '#007BFF',              // Bootstrap blue
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          padding: '1px 1px',
                          border: '1px solid #007BFF',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1px'
                        }} >
                          <i className="fas fa-download" style={{ marginRight: '5px' }}></i>Download
                        </button>
                        <button type="button" className="btn btn-tool" id='listOfProjectsHeaderExpandButtion' onClick={(e) => { listOfProjectsHeaderExpandButtionClick(e) }} data-card-widget="collapse">
                          <i className="fas fa-minus"></i>
                        </button>
                        <button type="button" className="btn btn-tool" data-card-widget="maximize">
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
                    <table class="table table-sm" style={{ border: '1px solid lightgray', borderTopRightRadius: '5px 5px', borderCollapse: 'separate' }} id="listOfProjectsTable">
                      <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                          {/* <th style={{ fontWeight: '500' }}><div> <input type='checkbox'></input>
                          </div></th> */}
                          <th style={{ fontWeight: '500' }}>Material</th>
                          <th style={{ fontWeight: '500' }}>Plant</th>
                          <th style={{ fontWeight: '500' }}>SLoc</th>
                          <th style={{ fontWeight: '500' }}>Batch</th>
                          <th style={{ fontWeight: '500' }}>BUn</th>
                          <th style={{ fontWeight: '500' }}>Unrestricted</th>
                          <th style={{ fontWeight: '500' }}>Quality Inspection</th>
                          <th style={{ fontWeight: '500' }}>Value Unrestricted</th>
                          <th style={{ fontWeight: '500' }}>Transit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {allStockList.length > 0 ?
                          allStockList.map((userObj, index) => {

                            return ( */}
                        {/* <tr style={{ textDecoration: userObj.isActive == true ? 'none' : 'line-through' }}> */}
                        <tr>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }}>300</td>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }}>4300</td>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }}>001</td>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }}>123123</td>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }}>PC</td>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }}>0</td>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }}>0</td>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }}>0.00</td>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }}>In
                            {/* <button type="button" class="btn bg-gradient-warning btn-xs" onClick={(e) => { handleEditTaskDetails(userObj) }} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                                  <i class="fas fa-pen" style={{ fontSize: 'smaller' }}></i>
                                </button>
                                {userObj.isActive == true ?
                                  <button type="button" class="btn bg-gradient-danger btn-xs ml-2" onClick={(e) => { handleRemoveUser(userObj) }} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                                    <i class="fas fa-trash" style={{ fontSize: 'smaller' }}></i>
                                  </button>
                                  : ""} */}
                            {/* <button type="button" class="btn btn-xs" onClick={handleNaviagte} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                                    <i class="fas fa-ellipsis-v" style={{ fontSize: 'smaller' }}></i>
                                  </button> */}

                          </td>
                        </tr>
                        {/* )
                          })
                          : ""
                        } */}
                      </tbody>
                    </table>
                    <div className="d-flex justify-content-between mt-2">
                      <div>
                        Showing {startEntry} to {endEntry} of {allStockList.length} entries
                      </div>
                      <div>
                        <button
                          className="btn btn-xs btn-outline-primary"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <i className="fas fa-angle-double-left"></i>
                        </button>
                        <span className="m-1">Page {currentPage} of {totalPages}</span>
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

      </section>
    </>


  );
}

export default AddStock;
