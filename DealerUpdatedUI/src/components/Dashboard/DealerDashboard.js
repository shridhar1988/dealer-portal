import React from "react";
import "./Dashboard.css";

const DealerDashboard = () => {
  // Data for LatestOrders
  const orders = [
    {
      number: "1000000048",
      date: "12/03/2025",
      status: "Order Approved By Iteos",
    },
    { number: "1000000047", date: "12/03/2025", status: "Order Under Process" },
    {
      number: "1000000046",
      date: "12/03/2025",
      status: "Order Approved By Iteos",
    },
    { number: "1000000046", date: "12/03/2025", status: "Order Under Process" },
    {
      number: "1000000048",
      date: "12/03/2025",
      status: "Order Approved By Iteos",
    },
    { number: "1000000047", date: "12/03/2025", status: "Order Under Process" },
    {
      number: "1000000046",
      date: "12/03/2025",
      status: "Order Approved By Iteos",
    },
    { number: "1000000046", date: "12/03/2025", status: "Order Under Process" },
  ];

  // Data for OrderTrends
  const trends = [
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
  ];

  return (
    <section className="content">
      <div className="container-fluid">
        {/* Header */}
        <div className="row col-md-12">
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-0">
                <div className="col-sm-6">
                  <h1 style={{fontSize:"1.5rem",marginLeft:"-10px"}}>Dashboard</h1>
                  <ol className="breadcrumb float-sm-left mt-0"></ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row ">
          <div className="col-md-4 mb-1 mt-1">
            <div className="tile updates-tile px-3">
              <span className="updates-label mt-3">Updates</span>
              <h6 className="tile-header mb-0">Stock List Outstanding Data</h6>
              <hr className="bar mb-0 mt-2" />
              <p className="tile-text mb-2" >
                Outstanding 
                {/* <br /> */}
                Amount
                <br />
                <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                  19,654.00 ₹
                </span>
              </p>
            </div>
          </div>

          <div className="col-md-2 mb-2 mt-1 ">
            <div className="card card-outline card-light py-0"style={{height:"126px",borderTop:"0px"}}>
              <div className="card-body text-center p-0 ">
                <div className="progress-circle-container">
                  <svg
                    className="progress-circle"
                    width="55"
                    height="65"
                    viewBox="0 0 36 36"
                  >
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#28a745"
                      strokeWidth="3"
                      strokeDasharray="90, 100"
                    />
                  </svg>
                  <div className="percentage"style={{fontSize: "0.7rem"}}>90%</div>
                </div>
                <p className="text-sm text-muted mb-1">Credit Limit</p>
                <p className="font-weight-bold"  >15,51,089.00 ₹</p>
              </div>
            </div>
          </div>

          <div className="col-md-2 mb-2 mt-1">
            <div className="card card-outline card-light py-0" style={{height:"126px",borderTop:"0px"}}>
              <div className="card-body text-center p-0">
                <div className="progress-circle-container">
                  <svg
                    className="progress-circle"
                   width="55"
                    height="65"
                    viewBox="0 0 36 36"
                  >
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#6f42c1"
                      strokeWidth="3"
                      strokeDasharray="75, 100"
                    />
                  </svg>
                  <div className="percentage"style={{fontSize: "0.7rem"}}>75%</div>
                </div>
                <p className="text-sm text-muted mb-1">Exposure</p>
                <p className="font-weight-bold">19,645.00 ₹</p>
              </div>
            </div>
          </div>

          <div className="col-md-2 mb-2 mt-1">
            <div className="card card-outline card-light py-0" style={{height:"126px",borderTop:"0px"}}>
              <div className="card-body text-center p-0">
                <div className="progress-circle-container">
                  <svg
                    className="progress-circle"
                    width="55"
                    height="65"
                    viewBox="0 0 36 36"
                  >
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#fd7e14"
                      strokeWidth="3"
                      strokeDasharray="65, 100"
                    />
                  </svg>
                  <div className="percentage"style={{fontSize: "0.7rem"}}>65%</div>
                </div>
                <p className="text-sm text-muted mb-1">Utilization</p>
                <p className="font-weight-bold ">1.30%</p>
              </div>
            </div>
          </div>

          <div className="col-md-2 mb-2 mt-1">
            <div className="card card-outline card-light py-0" style={{height:"126px",borderTop:"0px"}}>
              <div className="card-body text-center p-0">
                <div className="progress-circle-container">
                  <svg
                    className="progress-circle"
                    width="55"
                    height="65"
                    viewBox="0 0 36 36"
                  >
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#007bff"
                      strokeWidth="3"
                      strokeDasharray="90, 100"
                    />
                  </svg>
                  <div className="percentage" style={{fontSize: "0.7rem"}}>90%</div>
                </div>
                <p className="text-sm text-muted mb-1">Credit Exposure</p>
                <p className="font-weight-bold">19,645.00 ₹</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row"style={{ marginTop: "-9px" }}>
          <div className="col-12 col-lg-8">
            <div className="card ">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="m-0 ml-3">
                    <strong>Latest Orders</strong>
                  </h6>
                </div>
                <div className="d-flex align-items-center m-0 pt-1 ml-1 pr-2 pb-1">
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
                      placeholder="Search "
                      className="form-control"
                      style={{ border: "none", width: "150px", height: "30px" }}
                    />
                  </div>
                </div>
              </div>

              <div className="card-body p-0">
                <div
                  className="table-responsive border px-2 py-2"
                  style={{ height: "250px", overflowY: "auto" }}
                >
                  {/* <table className="table">
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
                    <thead
                      className=""
                      style={{ position: "sticky", top: "0", zIndex: "1" }}
                    >
                      <tr style={{ backgroundColor: "#f2f2f2" }}>
                        <th style={{ fontWeight: "500" }}>
                          Sales Order Number
                        </th>
                        <th style={{ fontWeight: "500", position: "sticky" }}>
                          Order Date
                        </th>
                        <th style={{ fontWeight: "500", position: "sticky" }}>
                          Order Status
                        </th>
                        <th style={{ fontWeight: "500", position: "sticky" }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-left">
                      {orders.map((order, index) => (
                        <tr key={index}>
                          <td>{order.number}</td>
                          <td>{order.date}</td>
                          <td>
                            <span
                              className={`badge ${
                                order.status === "Order Approved By Iteos"
                                  ? "bg-success"
                                  : "bg-warning"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-primary">
                              Reorder
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

          {/* OrderTrends */}
          <div className="col-12 col-lg-4">
            <div className="card ">
              <div
                className="card-header border-0 d-flex align-items-center "
                style={{ marginBottom: "-15px", marginTop: "-5px" }}
              >
                <h6
                  className="card-title me-auto mr-4 text-nowrap"
                  style={{ paddingRight: "75px" }}
                >
                  <strong>Order Trends</strong>
                </h6>
                <select className="form-control form-control-sm bg-light">
                  <option>7 Days</option>
                </select>
              </div>
              <hr className=" mx-3 " />
              <div
                className="card-body"
                style={{
                  height: "240px",
                  overflowY: "auto",
                  marginTop: "-20px",
                }}
              >
                {trends.map((trend, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center mb-3"
                  >
                    <div>
                      <p className="mb-0 font-weight-bold">{trend.name}</p>
                      <small className="text-muted">{trend.quantity}</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <p className="mb-0 font-weight-bold mr-2">
                        {trend.amount}
                      </p>
                      <i className="fas fa-arrow-up text-success"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealerDashboard;
