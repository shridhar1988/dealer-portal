import React from "react";
import { Link } from "react-router-dom";

function Masters() {

  return (
    <div>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Masters List</h1>
              <ol className="breadcrumb float-sm-left mt-1">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active">Masters</li>
              </ol>
            </div>
            <div className="col-sm-6">
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-outline card-primary">
                <div className="card-header">
                  <h3 className="card-title text-sm">Masters</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="maximize"
                    >
                      <i className="fas fa-expand"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row ml-3">
                    <Link
                      className="btn btn-sm btn-primary mr-3 text-sm"
                      to={"/AppMaster"}
                    >
                      Apps
                    </Link>
                    <Link
                      className="btn btn-sm btn-primary mr-3 text-sm"
                      to={"/RoleswithApps"}
                    >
                      Roles
                    </Link>
                    <Link
                      className="btn btn-sm btn-primary mr-3 text-sm"
                      to={"/Company"}
                    >
                      Company
                    </Link>
                     <Link
                      className="btn btn-sm btn-primary mr-3 text-sm"
                      to={"/Plant"}
                    >
                      Plant
                    </Link>
                    <Link
                      className="btn btn-sm btn-primary mr-3 text-sm"
                      to={"/CompanyPlantMapping"}
                    >
                      Company & Plant
                    </Link>
                    
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Masters;