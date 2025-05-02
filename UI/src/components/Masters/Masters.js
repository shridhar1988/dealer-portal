import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import "./filter-style.css";



function Masters() {
  const navigate = useNavigate();
  
const handleCreateClick = () => {
console.log("Create button clicked");
  navigate('/create-scheme');
};
  return (
    // <div>
    //   <div className="content-header">
    //     <div className="container-fluid">
    //       <div className="row mb-2">
    //         <div className="col-sm-6">
    //           <h1 className="m-0">Masters List</h1>
    //           <ol className="breadcrumb float-sm-left mt-1">
    //             <li className="breadcrumb-item">
    //               <Link to="/dashboard">Home</Link>
    //             </li>
    //             <li className="breadcrumb-item active">Masters</li>
    //           </ol>
    //         </div>
    //         <div className="col-sm-6">
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <section className="content">
    //     <div className="container-fluid">
    //       <div className="row">
    //         <div className="col-md-12">
    //           <div className="card card-outline card-primary">
    //             <div className="card-header">
    //               <h3 className="card-title text-sm">Masters</h3>
    //               <div className="card-tools">
    //                 <button
    //                   type="button"
    //                   className="btn btn-tool"
    //                   data-card-widget="maximize"
    //                 >
    //                   <i className="fas fa-expand"></i>
    //                 </button>
    //               </div>
    //             </div>
    //             <div className="card-body">
    //               <div className="row ml-3">
    //                 <Link
    //                   className="btn btn-sm btn-primary mr-3 text-sm"
    //                   to={"/AppMaster"}
    //                 >
    //                   Apps
    //                 </Link>
    //                 <Link
    //                   className="btn btn-sm btn-primary mr-3 text-sm"
    //                   to={"/RoleswithApps"}
    //                 >
    //                   Roles
    //                 </Link>
    //                 <Link
    //                   className="btn btn-sm btn-primary mr-3 text-sm"
    //                   to={"/manage-leaveTypes"}
    //                 >
    //                   Leave Types
    //                 </Link>
    //                 <Link
    //                   className="btn btn-sm btn-primary mr-3 text-sm"
    //                   to={"/manage-departments"}
    //                 >
    //                   Departments
    //                 </Link>
    //                 <Link
    //                   className="btn btn-sm btn-primary mr-3 text-sm"
    //                   to={"/location-master"}
    //                 >
    //                   Locations
    //                 </Link>
    //                 <Link
    //                   className="btn btn-sm btn-primary mr-3 text-sm"
    //                   to={"/manage-designations"}
    //                 >
    //                   Designations
    //                 </Link>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </section>
    // </div>

    <div>
      {/* Page Header */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2 align-items-center">
            <div className="col-sm-6">
              <h1 className="m-0">Scheme Creation</h1>
            </div>
            <div className="col-sm-6 d-flex justify-content-end">
              <div className="dropdown">
                <h2
                  className="dropdown-toggle text-primary m-0"
                  role="button"
                  id="standardDropdown"
                  data-toggle="dropdown"
                  aria-expanded="false"
                  style={{ cursor: "pointer", fontSize: "1.5rem" }}
                >
                  Standard
                </h2>
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

      {/* Filter Row */}
      <div className="filter-container   ml-4 p-4">
        <div className="filter-bar d-flex align-items-center">
          {/* Filter Icon */}
          <div className="filter-icon d-flex align-items-center px-3 py-2">
            <i className="fa fa-filter" aria-hidden="true"></i>
          </div>

          {/* Filter By */}
          <div className="filter-label d-flex align-items-center px-3 py-2 font-weight-bold">
            Filter By
          </div>

          {/* Reference ID Dropdown */}
          <div className="filter-dropdown d-flex align-items-center px-3 py-2">
            <select className="form-select border-0 p-0 no-border-input font-weight-bold">
              <option>Reference ID</option>
              <option>REF001</option>
              <option>REF002</option>
            </select>
          </div>

          {/* Creation Date Dropdown */}
          <div className="filter-dropdown d-flex align-items-center px-3 py-2">
            <select className="form-select border-0 p-0 no-border-input font-weight-bold">
              <option>Creation Date</option>
              <option>Today</option>
              <option>Last 7 Days</option>
            </select>
          </div>

          {/* Reset Filter */}
          <div className="filter-reset d-flex align-items-center px-3 py-2 text-danger font-weight-bold">
            <i className="fas fa-redo mr-2"></i> Reset Filter
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
  <h5 className="ml-3 mb-0">Scheme (3)</h5>

  <div className="d-flex align-items-center gap-2">
    <button className="btn btn-primary mr-2" onClick={handleCreateClick}>Create</button>
    <button className="btn btn-outline-secondary" title="Settings">
      <i className="fas fa-cog"></i>
    </button>
    <button className="btn btn-outline-secondary" title="Expand">
      <i className="fas fa-expand-arrows-alt"></i>
    </button>
  </div>
</div>

      <div className="table-responsive mt-4 ml-4">
        <table className="table table-bordered table-striped text-center">
          <thead className="thead-grey">
            <tr>
              <th>Reference ID</th>
              <th>Valid From</th>
              <th>Valid To</th>
              <th>Creation Date</th>
              <th>Type</th>
              <th>Created By</th>
              <th>File</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="thead-white">
            <tr>
              <td>REF12345</td>
              <td>2025-01-01</td>
              <td>2025-12-31</td>
              <td>2025-04-20</td>
              <td>Standard</td>
              <td>Admin</td>
              <td>
                <button class="btn btn-light p-1">
                  <a href="#" class="text-primary">
                    <i class="fas fa-file-alt"></i>
                  </a>
                </button>
              </td>

              <td>
                <button class="btn btn-light p-1">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>REF67890</td>
              <td>2025-02-01</td>
              <td>2025-11-30</td>
              <td>2025-04-22</td>
              <td>Custom</td>
              <td>Manager</td>
              <td>
                <button class="btn btn-light p-1">
                  <a href="#" class="text-primary">
                    <i class="fas fa-file-alt"></i>
                  </a>
                </button>
              </td>
              <td>
                <button class="btn btn-light p-1">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td>REF24680</td>
              <td>2025-03-15</td>
              <td>2025-10-15</td>
              <td>2025-04-25</td>
              <td>Premium</td>
              <td>User1</td>
              <td>
                <button class="btn btn-light p-1">
                  <a href="#" class="text-primary">
                    <i class="fas fa-file-alt"></i>
                  </a>
                </button>
              </td>
              <td>
                <button class="btn btn-light p-1">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Masters;
