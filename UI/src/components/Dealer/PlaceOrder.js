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
        <div className="col-sm-6">
          <h5 className="m-0 p-2">Place Order</h5>
        </div>
      
  
          {/* Sales Order Creation Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header border-0">
                  <h6 >Sales Order Creation</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-md-3">
                      <p className="mb-1">
                        <strong>Credit Limit:</strong> 15,51,089.00 ₹
                      </p>
                    </div>
                    <div className="col-12 col-md-3">
                      <p className="mb-1">
                        <strong>Exposure:</strong> 19,645.00 ₹
                      </p>
                    </div>
                    <div className="col-12 col-md-3">
                      <p className="mb-1">
                        <strong>Utilization:</strong> 1.30%
                      </p>
                    </div>
                    <div className="col-12 col-md-3">
                      <p className="mb-1">
                        <strong>Credit Exposure:</strong> 15,31,435.00 ₹
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
              <div className="card">
                <div className="card-header border-0 d-flex justify-content-between align-items-center">
                  <h6 className="card-title">Order Details</h6>
                  <div>
                    <button className="btn btn-sm btn-outline-primary mr-2">
                      <i className="fas fa-download mr-1"></i> DOWNLOAD
                    </button>
                    <button className="btn btn-sm btn-outline-primary mr-2">
                      <i className="fas fa-upload mr-1"></i> UPLOAD
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      Reset
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {/* Form Fields */}
                  <div className="row mb-3">
                    <div className="col-12 col-md-3">
                      <div className="form-group">
                        <label>
                          Order Reference: <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="ITEOS24"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-3">
                      <div className="form-group">
                        <label>Requested Date:</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="12/03/2025"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-3">
                      <div className="form-group">
                        <label>Ship Form:</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="Ahmedabad CFA"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-3">
                      <div className="form-group">
                        <label>Ship To:</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue="V. G. Raja"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-3">
                      <div className="form-group">
                        <label>
                          Type: <span className="text-danger">*</span>
                        </label>
                        <select className="form-control">
                          <option>Select Order Type</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-md-3">
                      <div className="form-group">
                        <label>Product:</label>
                        <div className="input-group">
                          <select className="form-control">
                            <option>Select Product</option>
                          </select>
                          <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button">
                              <i className="fas fa-search"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  {/* Table */}
                  <div className="table-responsive">
                    <table className="table table-hover table-striped">
                      <thead>
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
