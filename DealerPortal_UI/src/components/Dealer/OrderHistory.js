import React from "react";
// import { IoIosCloseCircleOutline } from "react-icons/io";
import "./Dealer.css"; // Assuming the same CSS file as PlaceOrder for consistent styling

const OrderHistory = () => {
  // Sample data based on the image
  const orders = [
    {
      sno: 1,
      salesOrderNo: "262427",
      deliveryNo: "80321204",
      invoiceNo: "9001020390",
      invoiceDate: "28.12.2024",
      lrNo: "6797",
      lrDate: "28.12.2024",
      transp: "DIVYA P",
    },
    {
      sno: 2,
      salesOrderNo: "262427",
      deliveryNo: "80321204",
      invoiceNo: "9001020390",
      invoiceDate: "28.12.2024",
      lrNo: "6797",
      lrDate: "28.12.2024",
      transp: "DIVYA P",
    },
    {
      sno: 3,
      salesOrderNo: "262427",
      deliveryNo: "80321204",
      invoiceNo: "9001020390",
      invoiceDate: "28.12.2024",
      lrNo: "6797",
      lrDate: "28.12.2024",
      transp: "DIVYA P",
    },
    {
      sno: 4,
      salesOrderNo: "262427",
      deliveryNo: "80321204",
      invoiceNo: "9001020390",
      invoiceDate: "28.12.2024",
      lrNo: "6797",
      lrDate: "28.12.2024",
      transp: "DIVYA P",
    },
    {
      sno: 5,
      salesOrderNo: "262427",
      deliveryNo: "80321204",
      invoiceNo: "9001020390",
      invoiceDate: "28.12.2024",
      lrNo: "6797",
      lrDate: "28.12.2024",
      transp: "DIVYA P",
    },
    {
      sno: 6,
      salesOrderNo: "262427",
      deliveryNo: "80321204",
      invoiceNo: "9001020390",
      invoiceDate: "28.12.2024",
      lrNo: "6797",
      lrDate: "28.12.2024",
      transp: "DIVYA P",
    },
    {
      sno: 7,
      salesOrderNo: "262427",
      deliveryNo: "80321204",
      invoiceNo: "9001020390",
      invoiceDate: "28.12.2024",
      lrNo: "6797",
      lrDate: "28.12.2024",
      transp: "DIVYA P",
    },
    {
      sno: 8,
      salesOrderNo: "262427",
      deliveryNo: "80321204",
      invoiceNo: "9001020390",
      invoiceDate: "28.12.2024",
      lrNo: "6797",
      lrDate: "28.12.2024",
      transp: "DIVYA P",
    },
    {
      sno: 9,
      salesOrderNo: "262427",
      deliveryNo: "80321204",
      invoiceNo: "9001020390",
      invoiceDate: "28.12.2024",
      lrNo: "6797",
      lrDate: "28.12.2024",
      transp: "DIVYA P",
    },
  ];

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
                    placeholder="Search by Transporter, Sales Order No, Delivery No"
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
                    <strong>Total Sales Orders ({orders.length})</strong>
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
                <div className="table-responsive mt-2 px-4">
                  <table className="table table-border  text-left px-6 border">
                    <thead className="thead-light">
                      <tr>
                        <th>Sno</th>

                        <th>Sales Order No</th>

                        <th>Delivery No</th>

                        <th>Invoice No</th>

                        <th>Invoice Date</th>

                        <th>LR No</th>

                        <th>LR Date</th>

                        <th>Transporter</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.sno}>
                          <td>{order.sno}</td>

                          <td>{order.salesOrderNo}</td>

                          <td>{order.deliveryNo}</td>

                          <td>{order.invoiceNo}</td>

                          <td>{order.invoiceDate}</td>

                          <td>{order.lrNo}</td>

                          <td>{order.lrDate}</td>

                          <td>{order.transp}</td>
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

export default OrderHistory;
