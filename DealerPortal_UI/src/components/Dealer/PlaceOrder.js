import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./Dealer.css"; // Assuming you have a CSS file for styling
// import { IoIosCloseCircleOutline } from "react-icons/io";




const PlaceOrder = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
  const downloadExcel = () => {
    const table = document.querySelector("table"); // or use a ref for more control
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Stock Data" });
    XLSX.writeFile(workbook, "Stock.xlsx");
  };
  const handleReviewClick = () => {
    setShowModal(true);
};

const handleCloseModal = () => {
    setShowModal(false);
};
const handleCloseConfirmModal = () => {
  setShowConfirmModal(false);
};


const handleConfirmOrder = () => {
  // Close the review modal and open the confirmation modal
  setShowModal(false);
  setShowConfirmModal(true);
};

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="col-sm-6  mb-3">
          {/* <h5 className="m-0 pt-3">
            <strong>Place Order</strong>
          </h5> */}
            <h5 className="m-0 pt-3">
            Place Order
                </h5>
          
                {showConfirmModal && (<h5 className="m-0 pt-3">
                  New Sales order
                </h5>)}
        </div>

        {/* Sales Order Creation Section */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header border-0">
                <h5>
                Sales Order Creation
                </h5>
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
              <div className="card-header border-0" style={{marginTop:"-12px"}}>
             <div className=" d-flex justify-content-between align-items-center">   <h6 className="card-title ">
                  <strong style={{textWrap:"nowrap"}}>Order Details</strong>
                </h6>
               
                <div className="d-flex align-items-center ">
                  <div className="d-flex align-items-center">
                    <button
                      className="custom-btn custom-download-btn "
                       onClick={downloadExcel}
                    >
                      <i className="fas fa-download "></i> DOWNLOAD
                    </button>
                 
                    <input
                      type="file"
                      id="fileUpload"
                      className="d-none"
                      // onChange={handleFileSelected} // your handler
                    />

                 
                    <label
                      htmlFor="fileUpload"
                     className="custom-btn custom-upload-btn mr-2"
                    >
                      <i className="fas fa-upload mr-1"></i> UPLOAD
                    </label>
                    <button className="btn btn-sm btn-outline-primary mt-2" style={{border:"1px solid blue",borderRadius:"2.2rem",height:"31px"}}>
                      Reset
                    </button>
                  </div>
                </div></div>
              </div>
              <div className="card-body">
                {/* Form Fields */}
                <div className="place card-body text-sm ">
                  <div className="container">
                    <form className="row">
                      {/* Reference ID - Mandatory */}
                      <div className="col-md-6 d-flex align-items-center">
                        <label
                          className="me-2 fw-bold"
                          style={{ color: "rgb(137 132 132)", width: "200px",fontWeight:"400" }}
                        >
                          <strong>Order Reference :</strong>{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" required />
                      </div>

                      {/* Valid From */}
                      <div className="col-md-6 d-flex align-items-center">
                        <label
                          className="me-2 fw-bold"
                          style={{ color: "rgb(137 132 132)", width: "200px",fontWeight:"400" }}
                        >
                          <strong>Request Date :</strong>
                        </label>
                        <input type="date" className="form-control" />
                      </div>

                      {/* Valid To */}
                      <div className="col-md-6 d-flex align-items-center p-2">
                        <label
                          className="me-2 fw-bold"
                          style={{ color: "rgb(137 132 132)", width: "200px",fontWeight:"400" }}
                        >
                        <strong>  Ship From :</strong>
                        </label>
                        <input type="text" className="form-control" />
                      </div>

                      {/* Creation Date */}
                      <div className="col-md-6 d-flex align-items-center">
                        <label
                          className="me-2 fw-bold"
                          style={{ color: "rgb(137 132 132)", width: "200px",fontWeight:"400" }}
                        >
                         <strong> Ship To :</strong>
                        </label>
                        <input type="text" className="form-control" />
                      </div>

                      {/* Type */}
                      <div className="col-md-6 d-flex align-items-center p-2">
                        <label
                          className="me-2 fw-bold"
                          style={{ color: "rgb(137 132 132)", width: "200px",fontWeight:"400" }}
                        >
                          <strong>Order Type : </strong><span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>

                      {/* Created By */}
                      <div className="col-md-6 d-flex align-items-center">
                        <label
                          className="me-2 fw-bold"
                          style={{ color: "rgb(137 132 132)", width: "200px",fontWeight:"400" }}
                        >
                          <strong>Product:</strong> <span className="text-danger">*</span>
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
                {/* <div className="table-responsive border"> */}
                  {/* <table className="table">
                    <thead className="thead-light" style={{textwrap:"nowrap"}}>
                      <tr> */}
                      <div className="">
                       <table  class="table table-sm" style={{border: '1px solid lightgray',borderTopRightRadius: '5px 5px',borderCollapse: 'separate',maxHeight:"400px",overflowY : "auton"}} id="listOfProjectsTable">
                    <thead>
                      <tr style={{ backgroundColor: '#f2f2f2' }}>
                         <th style={{ fontWeight: '500' }}>Material Code</th>
                         <th style={{ fontWeight: '500' }}>Material Description</th>
                         <th style={{ fontWeight: '500' }}>HSN Code</th>
                         <th style={{ fontWeight: '500' }}>Qty</th>
                         <th style={{ fontWeight: '500' }}>UOM</th>
                         <th style={{ fontWeight: '500' }}>MRP(₹)</th>
                         <th style={{ fontWeight: '500' }}>NIR(₹)</th>
                         <th style={{ fontWeight: '500' }}>REQ.Rate(₹)</th>
                         <th style={{ fontWeight: '500' }}>CGST(%)</th>
                         <th style={{ fontWeight: '500' }}>SGST(%)</th>
                         <th style={{ fontWeight: '500' }}>IGST(%)</th>
                         <th style={{ fontWeight: '500' }}>Amount</th>
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
                <div className=" mt-4">
                  <h6>Remark</h6>
                  <textarea className="form-control" rows="3"></textarea>
                </div>
                <div className="fileterdiv1">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="ml-3 mb-0">
                      <strong></strong>
                    </h5>

                    <div className="d-flex align-items-center gap-2 mt-2 mr-2">
                      <button
                        className="btn btn-primary mr-2"
                        // onClick={handleCreateClick}
                      >Place Order
                       
                      </button>
                      <button
                        className="btn btn-primary mr-2"
                         onClick={handleReviewClick}
                      >
                         Review Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal fade show d-block pt-4 " tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    {/* <div className="modal-header card-outline card-primary">
                        <h5 className="modal-title">Review Order </h5>
                        <button type="button" className="close" onClick={handleCloseModal}>
                            <span>&times;</span>
                        </button>
                    </div> */}
                    <div className="d-flex justify-content-between align-items-center  card-outline card-primary">
              <div>
                <h5 className="m-0 pt-2 ml-3">
                  <strong>Review Order</strong>
                </h5>
              </div>
              <div className="d-flex align-items-center m-0 pt-3 mr-3">
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
                    <div className="modal-body">
                        {/* <h6>Order Summary</h6> */}
                        <div className="table-responsive border"   style={{ maxHeight: "400px", overflowY: "auto", height: "100%" }}>
                            <table className="table ">
                                <thead className="thead-light">
                                    <tr>
                                     <th style={{ fontWeight: '500' }}></th>  
                                         <th style={{ fontWeight: '500' }}>Products (0)</th>                                        
                                         <th style={{ fontWeight: '500' }}>HSN Code</th>
                                         <th style={{ fontWeight: '500' }}>Qty</th>
                                         <th style={{ fontWeight: '500' }}>UOM</th>
                                         <th style={{ fontWeight: '500' }}>MRP (₹)</th>
                                         <th style={{ fontWeight: '500' }}>Amt (₹)</th>
                                 
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems.map((item, index) => (
                                        <tr key={index}>
                                         <td>
    <input type="checkbox" className="" onChange={(e) => console.log("Checkbox toggled:", e.target.checked)} />
</td>
 <td>A.S.V.S 10 ml liquid</td>
                                            <td>{item.hsnCode}</td>
                                            <td>{item.qty}</td>
                                            <td>{item.uom}</td>
                                            <td>{item.mrp}</td>
                                            <td>{item.amount}</td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3">
                            {/* <h6>Total Amount: {orderItems.reduce((total, item) => total + parseFloat(item.amount), 0).toFixed(2)}</h6> */}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleConfirmOrder}>
                           Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )}
    {showConfirmModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)",paddingTop:"100px" }}>
                    <div className="modal-dialog modal-sm  card card-outline card-primary ">
                        <div className="modal-content "style={{border:"none"}}>
                            <div className="modal-header" style={{border:"none"}}>
                                {/* <h5 className="modal-title">Order Confirmation</h5> */}
                                <button type="button" className="close" onClick={handleCloseConfirmModal}>
                                    <span>×</span>
                                </button>
                            </div>
                            <div className="modal-body text-center "style={{border:"none"}}>
                              <i className="fas fa-check-circle fa-3x text-success"></i>
                                <h5 className="text-success">Success</h5>
                                <p className=""style={{color:"gray"}}>Sales Order Created 1009272</p>
                            </div>
                            <div className="modal-footer justify-content-center" style={{border:"none"}}>
                                <button type="button" className="btn btn-primary" onClick={handleCloseConfirmModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    </section>
  
  );
};

export default PlaceOrder;
