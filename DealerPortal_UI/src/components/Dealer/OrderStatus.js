import React, { useState } from "react";
// import { IoIosCloseCircleOutline } from "react-icons/io";
import "./Dealer.css"; // Assuming the same CSS file as PlaceOrder for consistent styling

const OrderStatus = () => {
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
  const invoices = [
    {
      sno: 1,
      SalesOrderNo: "9001020390",
      ReferenceNumber: "Iteos001",
      orderDate: "28.12.2024",
      amount: "40905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 2,
      SalesOrderNo: "9001020390",
      ReferenceNumber: "Iteos001",
      orderDate: "28.12.2024",
      amount: "40905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 3,
      SalesOrderNo: "9001020390",
      ReferenceNumber: "Iteos001",
      orderDate: "28.12.2024",
      amount: "40905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 4,
      SalesOrderNo: "9001020390",
      ReferenceNumber: "Iteos001",
      orderDate: "28.12.2024",
      amount: "40905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 5,
      SalesOrderNo: "9001020390",
      ReferenceNumber: "Iteos001",
      orderDate: "28.12.2024",
      amount: "40905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 6,
      SalesOrderNo: "9001020390",
      ReferenceNumber: "Iteos001",
      orderDate: "28.12.2024",
      amount: "40905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 7,
      SalesOrderNo: "9001020390",
      ReferenceNumber: "Iteos001",
      orderDate: "28.12.2024",
      amount: "40905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 8,
      SalesOrderNo: "9001020390",
      ReferenceNumber: "Iteos001",
      orderDate: "28.12.2024",
      amount: "40905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 9,
      SalesOrderNo: "9001020390",
      ReferenceNumber: "Iteos001",
      orderDate: "28.12.2024",
      amount: "40905.43",
      status: "Order Approved by ITEOS",
    },
  ];

  const handleDownload = (sno) => {
    alert(`Download action for invoice #${sno}`);
  };

  return (
    <section className="content">
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-2">

          <div className="col-12 mt-2 mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="m-0 pt-2 ml-1">
                  Order Status and Tracking
                </h5>
              </div>
              {/* <div className="d-flex align-items-center m-0 pt-3 ml-1">
                <div
                  className="input-group"
                  style={{
                    border: "1px solid lightgray",
                    borderRadius: "12px",
                    overflow: "auto",
                  }}
                >
                  <div className="input-group-append">
                    <span
                      className="input-group-text"
                      style={{ backgroundColor: "white", border: "none" }}
                    >
                      <i className="fas fa-search"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search"
                    className="form-control"
                    style={{ border: "none" }}
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Invoice Details Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="">
              <div className="card ">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="ml-3 mb-0">
                  Total Sales Orders ({invoices.length})
                  </h5>

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
              <div >
              {/* <button style={{border :"1px solid gray",borderTopRightRadius:"0px",borderBottomRightRadius:"0px"}}
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
                          </button> */}
                          </div>
            </div>
                </div>
                <div
                  className="table-responsive mt-2 px-4"
                  style={{ height: "400px", overflowY: "auto" }}
                >
                  {/* <table className="table table-border  text-left px-6 border">
                    <thead className="thead-light">
                      <tr> */}
                       <table  class="table table-sm" style={{border: '1px solid lightgray',borderTopRightRadius: '5px 5px',borderCollapse: 'separate'}} id="listOfProjectsTable">
                    <thead>
                      <tr style={{ backgroundColor: '#f2f2f2' }}>
                         <th style={{ fontWeight: '500' }}>Sno</th>
                         <th style={{ fontWeight: '500' }}>Sales Order Number</th>
                         <th style={{ fontWeight: '500' }}>Reference Number</th>
                         <th style={{ fontWeight: '500' }}>Sales Order Date</th>
                         <th style={{ fontWeight: '500' }}>Amount(₹)</th>
                         <th style={{ fontWeight: '500' }}>Sales Order Status</th>
                         <th style={{ fontWeight: '500' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((order) => (
                        <tr key={order.sno}>
                          <td>{order.sno}</td>
                          <td>{order.SalesOrderNo}</td>
                          <td>{order.ReferenceNumber}</td>
                          <td>{order.orderDate}</td>
                          <td>{order.amount}</td>
                          <td>
                            <span className="badge bg-success">
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button class="btn btn-light p-1">
                              <i class="fas fa-ellipsis-v"></i>
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
        </div>

        {/* Zoom Controls */}
      </div>
    </section>
  );
};

export default OrderStatus;
