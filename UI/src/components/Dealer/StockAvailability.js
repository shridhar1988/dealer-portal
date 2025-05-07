import React from "react";
import * as XLSX from "xlsx";
import "./Dealer.css"; // Assuming you have a CSS file for styling
import { IoIosCloseCircleOutline } from "react-icons/io";
const handleFileSelected = (e) => {
  const file = e.target.files[0];
  if (file) {
    console.log("Selected file:", file);
    // process upload…
  }
};
const Header = () => (
  <div className="content-header px-1">
    <div className="container-fluid">
      <div className="row mb-2 align-items-center">
        <div className="col-sm-6  ">
          <h1 className="m-0">Stock Availability</h1>
        </div>
        <div className="col-sm-6 d-flex justify-content-end">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-sm btn-outline-primary mr-2"
              onClick={downloadExcel}
            >
              <i className="fas fa-download mr-1"></i> DOWNLOAD
            </button>
            {/* Hidden file input */}
            <input
              type="file"
              id="fileUpload"
              className="d-none"
              onChange={handleFileSelected} // your handler
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
);
const downloadExcel = () => {
  const table = document.querySelector("table"); // or use a ref for more control
  const workbook = XLSX.utils.table_to_book(table, { sheet: "Stock Data" });
  XLSX.writeFile(workbook, "Stock.xlsx");
};
const StockAvailability = () => {
  const stockData = [
    {
      sno: 1,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "123456",
      batch: "PC",
      unrestricted: "0",
      qualityInspect: "0",
      value: "0.00",
    },
    {
      sno: 2,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "123",
      batch: "PC",
      unrestricted: "0",
      qualityInspect: "0",
      value: "0.00",
    },
    {
      sno: 3,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "123456",
      batch: "PC",
      unrestricted: "1",
      qualityInspect: "1",
      value: "0.00",
    },
    {
      sno: 4,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "12",
      batch: "PC",
      unrestricted: "0",
      qualityInspect: "0",
      value: "0.00",
    },
    {
      sno: 5,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "123456",
      batch: "PC",
      unrestricted: "0",
      qualityInspect: "0",
      value: "0.00",
    },
    {
      sno: 6,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "123",
      batch: "PC",
      unrestricted: "542",
      qualityInspect: "0",
      value: "0.00",
    },
    {
      sno: 7,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "123456",
      batch: "PC",
      unrestricted: "345",
      qualityInspect: "104",
      value: "0.00",
    },
    {
      sno: 8,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "1234",
      batch: "PC",
      unrestricted: "0",
      qualityInspect: "0",
      value: "0.00",
    },
    {
      sno: 9,
      materialNo: "3000",
      description: "A.S.V.S. 10 ml LIquid",
      plant: "4300",
      sloc: "123456",
      batch: "PC",
      unrestricted: "0",
      qualityInspect: "0",
      value: "0.00",
    },
  ];

  return (
    <div className="col-12 mb-4 ml-2 ">
      <Header />
      <div className="card ">
        {/* <div className="card-header border-0 d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Warehouse Stock of Material</h6>

          <div className="col-sm-6 d-flex justify-content-end">
          <div className="d-flex align-items-center ">
            <span className="mr-2">Filter:</span>
            <div
              className="input-group input-group-sm"
              style={{ width: "150px" }}
            >
              <select className="form-control">
                <option>ALL</option>
              </select>
              <div className="input-group-append">
                <button className="btn btn-outline-secondary" type="button">
                  <i className="fas fa-times"></i> Clear
                </button>
              </div>
            </div>
          </div></div>
        </div> */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="ml-3 mb-0">Warehouse Stock of Material</h5>

          <div className="d-flex align-items-center gap-2 mt-2 mr-2">
            <button className="btn mt-1" type="button">
            <IoIosCloseCircleOutline className="mr-1"/>
              Clear
            </button>

            <div className="d-flex align-items-center gap-2 mt-2 mr-2 filter-box">
              <span className="mr-2">Filter :</span>
              <div
                className="input-group input-group-sm"
                style={{ width: "70px" }}
              >
                <select className="form-control font-weight-bold">
                  <option ><strong>ALL</strong></option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive mt-2 px-4">
          <table className="table table-border  text-center px-6 border">
            <thead className="thead-light">
              <tr>
                <th>Sno</th>
                <th>Material No</th>
                <th>Description</th>
                <th>Plant</th>
                <th>Sloc</th>
                <th>Batch</th>
                <th>UOM</th>
                <th>Unrestricted</th>
                <th>Quality Inspect</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((item) => (
                <tr key={item.sno}>
                  <td>{item.sno}</td>
                  <td>{item.materialNo}</td>
                  <td>{item.description}</td>
                  <td>{item.plant}</td>
                  <td>{item.sloc}</td>
                  <td>{item.batch}</td>
                  <td>{item.uom}</td>
                  <td>{item.unrestricted}</td>
                  <td>{item.qualityInspect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockAvailability;
