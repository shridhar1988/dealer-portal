import React from "react";
// import { IoIosCloseCircleOutline } from "react-icons/io";
import "./Dealer.css"; // Assuming the same CSS file as PlaceOrder for consistent styling

const PaymentDetails = () => {
  // Sample data based on the image
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

  const handleDownload = (sno) => {
    alert(`Download action for payment #${sno}`);
  };

  return (
    <section className="content">
      <div className="container-fluid">
        {/* Header */}
        <div className="content-header px-1">
          <div className="container-fluid">
            <div className="row mb-2 align-items-center">
              <div className="col-sm-6  ">
                <h1 className="m-0">
                  <strong>Requisition</strong>
                </h1>
              </div>
              <div className="col-sm-6 d-flex justify-content-end">
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-outline-primary mr-2"
                    // onClick={downloadExcel}
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
                    className="btn btn-sm btn-outline-primary mr-2"
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
                  <strong>Total Entries ({payments.length})</strong>
                </h5>

                
              </div>
              <div className="table-responsive mt-2 px-4">
                <table className="table table-border  text-left px-6 border">
                  <thead className="thead-light">
                    <tr>
                      <th>Sno</th>

                      <th>Material Code</th>

                      <th>Material Name</th>

                      <th>Order Quantity</th>

                      <th>UOM</th>

                      <th>Expected By</th>

                      <th>Action</th>

                      
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
