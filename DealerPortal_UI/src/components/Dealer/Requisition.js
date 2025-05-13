import React, { useState } from "react";
// import { IoIosCloseCircleOutline } from "react-icons/io";
import "./Dealer.css"; // Assuming the same CSS file as PlaceOrder for consistent styling
import * as XLSX from "xlsx";
const PaymentDetails = () => {
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
  const payments = [
    {
      sno: 1,
      Materialcode: "100000001",
      MaterialName: "A.S.V.S 10 ml Liquid",
        OrderQuantity: "1000",  
        UOM : "NOS",
        ExpectedBy : "28.12.2024",
    },
    {
      sno: 2,
      Materialcode: "100000001",
      MaterialName: "A.S.V.S 10 ml Liquid",
        OrderQuantity: "1000",  
        UOM : "NOS",
        ExpectedBy : "28.12.2024",
    },
    {
      sno: 3,
      Materialcode: "100000001",
      MaterialName: "A.S.V.S 10 ml Liquid",
        OrderQuantity: "1000",  
        UOM : "NOS",
        ExpectedBy : "28.12.2024",
    },
    {
      sno: 4,
      Materialcode: "100000001",
      MaterialName: "A.S.V.S 10 ml Liquid",
        OrderQuantity: "1000",  
        UOM : "NOS",
        ExpectedBy : "28.12.2024",
    },
    {
      sno: 5,
      Materialcode: "100000001",
      MaterialName: "A.S.V.S 10 ml Liquid",
        OrderQuantity: "1000",  
        UOM : "NOS",
        ExpectedBy : "28.12.2024",
    },
    {
      sno: 6,
      Materialcode: "100000001",
      MaterialName: "A.S.V.S 10 ml Liquid",
        OrderQuantity: "1000",  
        UOM : "NOS",
        ExpectedBy : "28.12.2024",
    },
    {
      sno: 7,
      Materialcode: "100000001",
      MaterialName: "A.S.V.S 10 ml Liquid",
        OrderQuantity: "1000",  
        UOM : "NOS",
        ExpectedBy : "28.12.2024",
    },
    {
      sno: 8,
      Materialcode: "100000001",
      MaterialName: "A.S.V.S 10 ml Liquid",
        OrderQuantity: "1000",  
        UOM : "NOS",
        ExpectedBy : "28.12.2024",
    },
    {
      sno: 9,
      Materialcode: "100000001",
      MaterialName: "A.S.V.S 10 ml Liquid",
        OrderQuantity: "1000",  
        UOM : "NOS",
        ExpectedBy : "28.12.2024",
    },
  ];
const downloadExcel = () => {
  const table = document.querySelector("table"); // or use a ref for more control
  const workbook = XLSX.utils.table_to_book(table, { sheet: "Stock Data" });
  XLSX.writeFile(workbook, "Stock.xlsx");
};
  const handleDownload = (sno) => {
    alert(`Download action for payment #${sno}`);
  };

  return (
    <section className="content">
      <div className="container-fluid">
        {/* Header */}
        <div className="content-header px-1">
          <div className="container-fluid">
            <div className="row  align-items-center" >
            <div className="col-sm-6  mb-3" style={{ marginLeft: "-10px" }}>
                <h1 className="m-0">
                Requisition
                </h1>
              </div>
              <div className="col-sm-6 d-flex justify-content-end" style={{ marginLeft: "10px" }}>
                <div className="d-flex align-items-center">
                  <button
                     className="custom-btn custom-download-btn"
                     onClick={downloadExcel}
                  >
                    <i className="fas fa-download mr-1"></i> DOWNLOAD
                  </button>
                  {/* Hidden file input */}
                  <input
                    type="file"
                    id="fileUpload"
                    className="d-none"
                    // onChange={handleFileSelected} // your handler
                  />

                  {/* Label styled as button */}
                  <label
                    htmlFor="fileUpload"
                    className="custom-btn custom-upload-btn mr-2"
                  >
                    <i className="fas fa-upload mr-1"></i> UPLOAD
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card ">
              <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
                <h5 className="ml-3 mb-0">
                Total Entries ({payments.length})
                </h5>

                
              </div>
              <div className="table-responsive mt-2 px-4">
                {/* <table className="table table-border  text-left px-6 border">
                  <thead className="thead-light">
                    <tr> */}
                     <table  class="table table-sm" style={{border: '1px solid lightgray',borderTopRightRadius: '5px 5px',borderCollapse: 'separate'}} id="listOfProjectsTable">
                    <thead>
                      <tr style={{ backgroundColor: '#f2f2f2' }}>
                       <th style={{ fontWeight: '500' }}>Sno</th>

                       <th style={{ fontWeight: '500' }}>Material Code</th>

                       <th style={{ fontWeight: '500' }}>Material Name</th>

                       <th style={{ fontWeight: '500' }}>Order Quantity</th>

                       <th style={{ fontWeight: '500' }}>UOM</th>

                       <th style={{ fontWeight: '500' }}>Expected By</th>

                       <th style={{ fontWeight: '500' }}>Action</th>

                      
                    </tr>
                  </thead>

                  <tbody>
                    {payments.map((order) => (
                      <tr key={order.sno}>
                        <td>{order.sno}</td>

                        <td>{order.Materialcode}</td>

                        <td>{order.MaterialName}</td>

                        <td>{order.OrderQuantity}</td>

                        <td>{order.UOM}</td>

                        <td>{order.ExpectedBy}</td>

                       

                        <td>
                            <button
                            //   onClick={() => handleReturn(order.sno)}
                              className="requisition btn btn-sm btn-primary mr-2"
                            >
                              Submit
                            </button>
                            <button
                    className="requisition col-md-5 btn btn-sm btn-outline-primary"
                    // onClick={downloadExcel}
                  >
                    Edit
                  </button>
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="d-flex justify-content-between mt-2 mb-2">
                    <div>
                      Showing {startEntry} to {endEntry} of {allUsersList.length} entries
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

        {/* Zoom Controls */}
      </div>
    </section>
  );
};

export default PaymentDetails;
