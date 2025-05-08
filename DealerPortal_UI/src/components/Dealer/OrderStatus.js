import React from "react";
// import { IoIosCloseCircleOutline } from "react-icons/io";
import "./Dealer.css"; // Assuming the same CSS file as PlaceOrder for consistent styling

const OrderStatus = () => {
  // Sample data based on the image
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
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="m-0 pt-2 ml-1">
                  <strong>Order Status Tracking</strong>
                </h5>
              </div>
              <div className="d-flex align-items-center m-0 pt-3 ml-1">
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
              </div>
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
                    <strong>Total Sales Orders ({invoices.length})</strong>
                  </h5>

                  <div className="d-flex align-items-center gap-2 mt-2 mr-2">
                    <button className="btn mt-1" type="button">
                      {/* <IoIosCloseCircleOutline className="mr-1" /> */}
                      Clear
                    </button>

                    <div className="d-flex align-items-center gap-2 mt-2 mr-2 filter-box">
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
                  </div>
                </div>
                <div
                  className="table-responsive mt-2 px-4"
                  style={{ height: "400px", overflowY: "auto" }}
                >
                  <table className="table table-border  text-left px-6 border">
                    <thead className="thead-light">
                      <tr>
                        <th>Sno</th>
                        <th>Sales Order Number</th>
                        <th>Reference Number</th>
                        <th>Sales Order Date</th>
                        <th>Amount(₹)</th>
                        <th>Sales Order Status</th>
                        <th></th>
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
