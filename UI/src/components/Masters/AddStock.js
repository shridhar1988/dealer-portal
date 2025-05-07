import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import "./filter-style.css";
import * as XLSX from "xlsx";
function AddStock() {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  const handleCreateClick = () => {
    console.log("Create button clicked");
    navigate("/Add-New-Sock");
  };  const downloadExcel = () => {
    const table = document.querySelector("table"); // or use a ref for more control
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Stock Data" });
    XLSX.writeFile(workbook, "WarehouseStock.xlsx");
  };
 
  return (
    <div>
      {/* Page Header */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2 align-items-center">
            <div className="col-sm-6">
              <h1 className="m-0">Stock Availability</h1>
            </div>
            <div className="col-sm-6 d-flex justify-content-end">
              <div className="dropdown">
                {/* <h2
                  className="dropdown-toggle text-primary m-0"
                  role="button"
                  id="standardDropdown"
                  data-toggle="dropdown"
                  aria-expanded="false"
                  style={{ cursor: "pointer", fontSize: "1.5rem" }}
                >
                  Standard
                </h2> */}
                <div
                  className="dropdown-menu"
                  aria-labelledby="standardDropdown"
                >
                  <a className="dropdown-item" href="#">
                    Option 1
                  </a>
                  <a className="dropdown-item" href="#">
                    Option 2
                  </a>
                  <a className="dropdown-item" href="#">
                    Option 3
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <section className="content">
        <div className="container-fluid">
          <div className="row">{/* Your content goes here */}</div>
        </div>
      </section>

      <div className="fileterdiv p-4">
        <div className="d-flex justify-content-between align-items-center ml-2">
          <div className="">
            <div className="filter-bar d-flex align-items-center">
              <div className="filter-dropdown  px-3 py-2">
                <i className="fa fa-filter" aria-hidden="true"></i>
              </div>

              {/* Filter By */}
              <div className="filter-label d-flex align-items-center px-3 py-2 font-weight-bold">
                Filter By
              </div>

              {/* Reference ID Dropdown */}
              <div className="filter-dropdown d-flex align-items-center px-3 py-2">
                <select className="form-select border-0 p-0 no-border-input font-weight-bold">
                  <option>Plant</option>
                  <option>Plant1</option>
                  <option>Plant2</option>
                </select>
              </div>

              {/* Creation Date Dropdown */}
              <div className="filter-dropdown d-flex align-items-center px-3 py-2">
                <select className="form-select border-0 p-0 no-border-input font-weight-bold">
                  <option>Material</option>
                  <option>Material A</option>
                  <option>Material B</option>
                </select>
              </div>

              {/* Reset Filter */}
              <div className="filter-reset d-flex align-items-center px-3 py-2 text-danger font-weight-bold">
                <i className="fas fa-redo mr-2"></i> Reset Filter
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-primary" onClick={handleCreateClick}>
              Add New Stock
            </button>
          </div>
        </div>
      </div>

      {/* <div className="d-flex justify-content-between align-items-center mb-3"> */}
      {/* <h5 className="ml-3 mb-0">Scheme (3)</h5> */}

      {/* <div className="d-flex align-items-center gap-2">
    <button className="btn btn-primary mr-2" onClick={handleCreateClick}>Create</button>
    <button className="btn btn-outline-secondary" title="Settings">
      <i className="fas fa-cog"></i>
    </button>
    <button className="btn btn-outline-secondary" title="Expand">
      <i className="fas fa-expand-arrows-alt"></i>
    </button>
  </div> */}
      {/* </div> */}
      <div className={`fileterdiv1 ${isFullscreen ? "fullscreen-table" : ""}`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="ml-3 mb-0">Warehouse Stock Of Material</h5>

          <div className="d-flex align-items-center gap-2 mt-2 mr-2">
            <button className="btn btn-outline-secondary" title="Download"
              onClick={downloadExcel}>
              <i className="fas fa-download"></i>
            </button>

            <button
              className="btn btn-outline-secondary"
              title="Expand"
              onClick={toggleFullscreen}
            >
              <i className="fas fa-expand-arrows-alt"></i>
            </button>
          </div>
        </div>

        <div className="table-responsive  mt-4 ml-0 px-4">
          <table className="table table-bordered table-striped text-center px-6 border">
            <thead className="thead-grey">
              <tr>
                <th>Material</th>
                <th>Plant</th>
                <th>SLoc</th>
                <th>Batch</th>
                <th>BUn</th>
                <th>Unrestricted</th>
                <th>Quality Inspection</th>
                <th>Value Unrestricted</th>
                <th>Transit</th>
              </tr>
            </thead>
            <tbody className="thead-white">
              <tr>
                <td>3000</td>
                <td>4300</td>
                <td>002</td>
                <td>123456</td>
                <td>1</td>
                <td>2</td>
                <td>4</td>
                <td>2</td>
                <td>4</td>
              </tr>
              <tr>
                <td>3000</td>
                <td>4300</td>
                <td>002</td>
                <td>123456</td>
                <td>1</td>
                <td>2</td>
                <td>4</td>
                <td>2</td>
                <td>4</td>
              </tr>
              <tr>
                <td>3000</td>
                <td>4300</td>
                <td>002</td>
                <td>123456</td>
                <td>1</td>
                <td>2</td>
                <td>4</td>
                <td>2</td>
                <td>4</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AddStock;
