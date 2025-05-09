import React from "react";
// import { IoIosCloseCircleOutline } from "react-icons/io";
import "./Dealer.css"; // Assuming the same CSS file as PlaceOrder for consistent styling

const ReturnOrder = () => {
  // Sample data based on the image
  const orders = [
    {
      sno: 1,
      salesOrderNumber: "1000000049",
      referenceNumber: "ITE0524",
      date: "12/03/2025",
      amount: "40,905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 2,
      salesOrderNumber: "1000000049",
      referenceNumber: "ITE0524",
      date: "12/03/2025",
      amount: "40,905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 3,
      salesOrderNumber: "1000000049",
      referenceNumber: "ITE0524",
      date: "12/03/2025",
      amount: "40,905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 4,
      salesOrderNumber: "1000000049",
      referenceNumber: "ITE0524",
      date: "12/03/2025",
      amount: "40,905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 5,
      salesOrderNumber: "1000000049",
      referenceNumber: "ITE0524",
      date: "12/03/2025",
      amount: "40,905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 6,
      salesOrderNumber: "1000000049",
      referenceNumber: "ITE0524",
      date: "12/03/2025",
      amount: "40,905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 7,
      salesOrderNumber: "1000000049",
      referenceNumber: "ITE0524",
      date: "12/03/2025",
      amount: "40,905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 8,
      salesOrderNumber: "1000000049",
      referenceNumber: "ITE0524",
      date: "12/03/2025",
      amount: "40,905.43",
      status: "Order Approved by ITEOS",
    },
    {
      sno: 9,
      salesOrderNumber: "1000000049",
      referenceNumber: "ITE0524",
      date: "12/03/2025",
      amount: "40,905.43",
      status: "Order Approved by ITEOS",
    },
  ];

  const handleReturn = (sno) => {
    alert(`Return action for order #${sno}`);
  };

  return (
    <section className="content">
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="m-0 pt-3 ml-1">
                <strong>Return Order</strong>
              </h5>
            </div>
          </div>
        </div>

        {/* Order Details Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="">
              <div className="card ">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="ml-3 mb-0">
                    <strong>Total Orders (8)</strong>
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
                        <th>Sales Order Number</th>
                        <th>Reference Number</th>
                        <th>Sales Order Date</th>
                        <th>Amount(₹)</th>
                        <th>Sales Order Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.sno}>
                          <td>{order.sno}</td>
                          <td>{order.salesOrderNumber}</td>
                          <td>{order.referenceNumber}</td>
                          <td>{order.date}</td>
                          <td>{order.amount}</td>
                          <td>
                            <span className="badge bg-success">
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleReturn(order.sno)}
                              className="btn btn-sm btn-primary"
                            >
                              Return
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
      </div>
    </section>
  );
};

export default ReturnOrder;
