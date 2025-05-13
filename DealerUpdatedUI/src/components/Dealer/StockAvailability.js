import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./Dealer.css"; 
import $ from "jquery";

const handleFileSelected = (e) => {
  const file = e.target.files[0];
  if (file) {
    console.log("Selected file:", file);
    // process upload…
  }
};
 const listOfProjectsHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButton").click();
  };


// const Header = () => (

//   // <div className="content-header px-1">
//   //   <div className="container-fluid">
//   //     <div className="row  align-items-center"style={{marginTop:"-14px"} }>
//   //       <div className="col-sm-6" >
//   //         <h1 className="m-0"><strong>Stock Availability</strong></h1>

//   //       </div>
//   //       <div className="col-sm-6 d-flex justify-content-end">
//   //     <div className="d-flex align-items-center">
//   //       {/* Download Button */}
//   //       <button
//   //         className="custom-btn custom-download-btn"
//   //         onClick={downloadExcel}
//   //       >
//   //         <i className="fas fa-download"></i> DOWNLOAD
//   //       </button>

//   //       {/* Hidden file input */}
//   //       <input
//   //         type="file"
//   //         id="fileUpload"
//   //         className="d-none"
//   //         onChange={handleFileSelected}
//   //       />

//   //       {/* Upload Button (Label styled as button) */}
//   //       <label
//   //         htmlFor="fileUpload"
//   //         className="custom-btn custom-upload-btn"
//   //       >
//   //         <i className="fas fa-upload"></i> UPLOAD
//   //       </label>
//   //     </div>
//   //   </div>
//   //     </div>
//   //   </div>
//   // </div>

// );
const downloadExcel = () => {
  const table = document.querySelector("table"); // or use a ref for more control
  const workbook = XLSX.utils.table_to_book(table, { sheet: "Stock Data" });
  XLSX.writeFile(workbook, "Stock.xlsx");
};
const StockAvailability = () => {
  const [allUsersList, setAllUsersList] = useState([]);
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
  const stockData = [
    {
      sno: 1,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "123456",
      batch: "PC",
      unrestricted: "0",
      qualityInspect: "0",
      value: "0.00",
    },
    {
      sno: 2,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "123",
      batch: "PC",
      unrestricted: "0",
      qualityInspect: "0",
      value: "0.00",
    },
    {
      sno: 3,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "123456",
      batch: "PC",
      unrestricted: "1",
      qualityInspect: "1",
      value: "0.00",
    },
    {
      sno: 4,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "12",
      batch: "PC",
      unrestricted: "0",
      qualityInspect: "0",
      value: "0.00",
    },
    {
      sno: 5,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "123456",
      batch: "PC",
      unrestricted: "0",
      qualityInspect: "0",
      value: "0.00",
    },
    {
      sno: 6,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "123",
      batch: "PC",
      unrestricted: "542",
      qualityInspect: "0",
      value: "0.00",
    },
    {
      sno: 7,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "123456",
      batch: "PC",
      unrestricted: "345",
      qualityInspect: "104",
      value: "0.00",
    },
    {
      sno: 8,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "1234",
      batch: "PC",
      unrestricted: "0",
      qualityInspect: "0",
      value: "0.00",
    },
    {
      sno: 9,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "123456",
      batch: "PC",
      unrestricted: "0",
      qualityInspect: "0",
      value: "0.00",
    },
  ];

  return (
    <section className="content">
      <div className="col-12 mb-4 ml-0">
        <div className="content-header">
          <div className="container-fluid">
            <div
              className="row  align-items-center"
              style={{ marginTop: "-14px" }}
            >
              <div className="col-sm-6  mb-3" style={{ marginLeft: "-12px" }}>
                <h1 className="m-0 pt-2"style={{fontSize:"1.5rem"}}>
                  Stock Availability
                </h1>
           
               
              </div>
             
              <div
                className="col-sm-6 d-flex justify-content-end align-items-center"
                style={{ marginLeft: "12px",marginTop:"-12px" }}
              >
                <div className="d-flex  align-items-center">
                  {/* Download Button */}
                  <button
                    className="custom-btn custom-download-btn"
                    onClick={downloadExcel}
                  >
                    <i className="fas fa-download"></i> DOWNLOAD
                  </button>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    id="fileUpload"
                    className="d-none"
                    onChange={handleFileSelected}
                  />

                  {/* Upload Button (Label styled as button) */}
                  <label
                    htmlFor="fileUpload"
                    className="custom-btn custom-upload-btn"
                  >
                    <i className="fas fa-upload"></i> UPLOAD
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card "style ={{marginTop:"-10px"}}>
          <div className="d-flex justify-content-between align-items-center mb-1 ">
            <h4 className="ml-4 mb-0">
             Warehouse Stock Of Material
            </h4>

            <div className="d-flex align-items-center gap-2 mt-0 mr-4">
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

              <div className="d-flex align-items-center gap-2 mt-2 mr-2 filter-box" style={{height:"33px"}}>
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
              <div >
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
          <div className="table-responsive mt-2 px-4">
            {/* <table className="table table-border  text-center px-6 border">
            <thead className="thead-light">
              <tr> */}
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
                  <th style={{ fontWeight: "500" }}>Sno</th>
                  <th style={{ fontWeight: "500" }}>Material No</th>
                  <th style={{ fontWeight: "500" }}>Description</th>
                  <th style={{ fontWeight: "500" }}>Plant</th>
                  <th style={{ fontWeight: "500" }}>Sloc</th>
                  <th style={{ fontWeight: "500" }}>Batch</th>
                  <th style={{ fontWeight: "500" }}>UOM</th>
                  <th style={{ fontWeight: "500" }}>Unrestricted</th>
                  <th style={{ fontWeight: "500" }}>Quality Inspect</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map((item) => (
                  <tr key={item.sno}>
                    <td>{item.sno}</td>
                    <td>{item.materialNo}</td>
                    <td>{item.description}</td>
                    <td>{item.plant}</td>
                    <td>{item.sloc}</td>
                    <td>{item.batch}</td>
                    <td>{item.uom}</td>
                    <td>{item.unrestricted}</td>
                    <td>{item.qualityInspect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-between mt-2 mb-2">
              <div>
                Showing {startEntry} to {endEntry} of {allUsersList.length}{" "}
                entries
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
    </section>
  );
};

export default StockAvailability;
