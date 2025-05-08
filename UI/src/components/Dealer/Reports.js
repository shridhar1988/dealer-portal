import React from "react";
import * as XLSX from "xlsx";
import "./Dealer.css"; // Assuming you have a CSS file for styling
import { IoIosCloseCircleOutline } from "react-icons/io";

const PlaceOrder = () => {
  const orderItems = [
    {
      materialCode: "30041",
      description: "A.S.V.S. 10 ml Liquid",
      hsnCode: "30021240",
      qty: "1",
      uom: "NOS",
      mrp: "480.11",
      nir: "331.27",
      reqRate: "487.00",
      cgst: "6.00",
      sgst: "6.00",
      igst: "0.00",
      amount: "331.27",
    },
    {
      materialCode: "30041",
      description: "A.S.V.S. 10 ml Liquid",
      hsnCode: "30021240",
      qty: "1",
      uom: "NOS",
      mrp: "480.11",
      nir: "331.27",
      reqRate: "487.00",
      cgst: "6.00",
      sgst: "6.00",
      igst: "0.00",
      amount: "331.27",
    },
  ];

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="col-sm-6  mb-3">
          <h5 className="m-0 pt-3">Place Order</h5>
        </div>

        {/* Sales Order Creation Section */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header border-0">
                <h5>Sales Order Creation</h5>
              </div>
              <div className="card-body py-1">
                <div className="row">
                  <div className="col-12 col-md-3">
                    <p className="mb-1">
                      <strong className="salesorder">Credit Limit:</strong>
                      <span style={{ color: "green" }}>
                        {" "}
                        <strong>15,51,089.00 ₹</strong>
                      </span>
                    </p>
                  </div>
                  <div className="col-12 col-md-3">
                    <p className="mb-1">
                      <strong className="salesorder">Exposure:</strong>
                      <span className="Exposure">
                        {" "}
                        <strong>19,645.00 ₹</strong>
                      </span>
                    </p>
                  </div>
                  <div className="col-12 col-md-3">
                    <p className="mb-1">
                      <strong className="salesorder">Utilization:</strong>
                      <span className="Utilization">
                        {" "}
                        <strong> 1.30%</strong>
                      </span>
                    </p>
                  </div>
                  <div className="col-12 col-md-3">
                    <p className="mb-1">
                      <strong className="salesorder">Credit Exposure:</strong>
                      <span className="Creditxposure">
                        {" "}
                        <strong>15,31,435.00 ₹</strong>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card ">
              <div className="card-header border-0 d-flex justify-content-between align-items-center">
                <h6 className="card-title ">
                  <strong>Order Details</strong>
                </h6>
                {/* <div>
                    <button className="btn btn-sm btn-outline-primary mr-2">
                      <i className="fas fa-download mr-1"></i> DOWNLOAD
                    </button>
                    <button className="btn btn-sm btn-outline-primary mr-2">
                      <i className="fas fa-upload mr-1"></i> UPLOAD
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      Reset
                    </button>
                  </div> */}
                <div className="button d-flex justify-content-end">
                  <div className="d-flex align-items-center ml-4">
                    <button
                      className="btn btn-sm btn-outline-primary mr-2"
                      // onClick={downloadExcel}
                    >
                      <i className="fas fa-download "></i> DOWNLOAD
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
                      className="btn btn-sm btn-outline-primary mr-2"
                    >
                      <i className="fas fa-upload mr-1"></i> UPLOAD
                    </label>
                    <button className="btn btn-sm btn-outline-primary">
                      Reset
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {/* Form Fields */}
                <div className="place card-body text-sm">
                  <div className="container">
                    <form className="row">
                      {/* Reference ID - Mandatory */}
                      <div className="col-md-6 d-flex align-items-center">
                        <label
                          className="me-2 fw-bold"
                          style={{ width: "200px" }}
                        >
                          Order Reference :{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" required />
                      </div>

                      {/* Valid From */}
                      <div className="col-md-6 d-flex align-items-center">
                        <label
                          className="me-2 fw-bold"
                          style={{ width: "200px" }}
                        >
                          Request Date :
                        </label>
                        <input type="date" className="form-control" />
                      </div>

                      {/* Valid To */}
                      <div className="col-md-6 d-flex align-items-center p-2">
                        <label
                          className="me-2 fw-bold"
                          style={{ width: "200px" }}
                        >
                          Ship From :
                        </label>
                        <input type="text" className="form-control" />
                      </div>

                      {/* Creation Date */}
                      <div className="col-md-6 d-flex align-items-center">
                        <label
                          className="me-2 fw-bold"
                          style={{ width: "200px" }}
                        >
                          Ship To :
                        </label>
                        <input type="text" className="form-control" />
                      </div>

                      {/* Type */}
                      <div className="col-md-6 d-flex align-items-center p-2">
                        <label
                          className="me-2 fw-bold"
                          style={{ width: "200px" }}
                        >
                          Order Type : <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>

                      {/* Created By */}
                      <div className="col-md-6 d-flex align-items-center">
                        <label
                          className="me-2 fw-bold"
                          style={{ width: "200px" }}
                        >
                          Product: <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <input type="text" className="form-control" />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              <i className="fas fa-search"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Table */}
                <div className="table-responsive border">
                  <table className="table">
                    <thead className="thead-light">
                      <tr>
                        <th>Material Code</th>
                        <th>Material Description</th>
                        <th>HSN Code</th>
                        <th>Qty</th>
                        <th>UOM</th>
                        <th>MRP(₹)</th>
                        <th>NIR(₹)</th>
                        <th>REQ.Rate(₹)</th>
                        <th>CGST(%)</th>
                        <th>SGST(%)</th>
                        <th>IGST(%)</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item, index) => (
                        <tr key={index}>
                          <td>{item.materialCode}</td>
                          <td>{item.description}</td>
                          <td>{item.hsnCode}</td>
                          <td>{item.qty}</td>
                          <td>{item.uom}</td>
                          <td>{item.mrp}</td>
                          <td>{item.nir}</td>
                          <td>{item.reqRate}</td>
                          <td>{item.cgst}</td>
                          <td>{item.sgst}</td>
                          <td>{item.igst}</td>
                          <td>{item.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Remark Section */}
                <div className="mt-3">
                  <h6>Remark</h6>
                  <textarea className="form-control" rows="3"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaceOrder;
