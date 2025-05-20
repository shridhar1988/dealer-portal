import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';
import PleaseWaitButton from '../../shared/PleaseWaitButton';
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const config = require("../../config/config.json");

const AppMaster = () => {
  const UserId = localStorage.getItem('loggedUserId');
  const inputAppNameReference = useRef(null);
  const inputAppRouteReference = useRef(null);

  const navigate = useNavigate();
  const [appName, setAppName] = useState('');
  const [appRoute, setAppRoute] = useState('');
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editAppId, setEditAppId] = useState(null);
  const [isAppNameValid, setIsAppNameValid] = useState(true);
  const [isAppRouteValid, setIsAppRouteValid] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const rowsPerPage = 10;

  const filteredApps = roles.filter((app) =>
    Object.values(app).some((val) =>
      val?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredApps.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredApps.length / rowsPerPage);

  const startEntry = indexOfFirstRow + 1;
  const endEntry = Math.min(indexOfLastRow, filteredApps.length);

  const handlePageChange = (newPage) => {
    if(newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  useEffect(() => {
    GetRoles();
    window.initDatePickerFuncation();
  }, []);

  const GetRoles = async () => {
    setIsLoaderActive(true);
    try {
      const response = await axios.get(`${config.API_URL}AuthMaster/GetAllApps`);
      const appsArray = response.data.data || [];
      setRoles(appsArray);
    } catch(error) {
      console.error('Error fetching Apps:', error);
      toast.error('Error fetching Apps');
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleAppNameChange = (e) => {
    const value = e.target.value;
    setAppName(value);
    setIsAppNameValid(value !== '');
  };

  const handleAppRouteChange = (e) => {
    const value = e.target.value.trim();
    setAppRoute(value);
    // setIsAppRouteValid(value !== '');
  };

  const handleSubmit = async () => {

    inputAppNameReference.current.classList.remove('is-invalid');
    inputAppRouteReference.current.classList.remove('is-invalid');

    if(appName.trim() === '') {
      setIsAppNameValid(false);
      inputAppNameReference.current.focus();
      toast.error('Please Enter App Name');
      return;
    }

    if(appRoute.trim() === '') {
      setIsAppRouteValid(false);
      inputAppRouteReference.current.focus();
      toast.error('Please Enter App Route');
      return;
    }

    setIsLoaderActive(true);
    try {
      const appData = {
        appID: isEditMode ? editAppId : 0,
        appName: appName,
        appRoute: appRoute,
        clientId: config.ClientId,
        createdBy: UserId,
        modifiedBy: UserId
      };

      const response = isEditMode
        ? await axios.put(`${config.API_URL}AuthMaster/UpdateApp`, appData)
        : await axios.post(`${config.API_URL}AuthMaster/CreateApp`, appData);

      if(response.data.success === 'success') {
        toast.success(isEditMode ? 'App updated successfully' : 'App created successfully');
        handleCancel();
        setIsEditMode(false);
        setEditAppId('');
      } else {
        toast.error(response.data.message || 'Error processing request');
      }
    } catch(error) {
      toast.error(error.response?.data || 'An error occurred');
    } finally {
      setIsLoaderActive(false);
      GetRoles();
    }
  };

  const handleEdit = (app) => {
    setAppName(app.appName);
    setAppRoute(app.appRoute);
    setIsEditMode(true);
    setEditAppId(app.appID);
    setIsAppNameValid(true);
    setIsAppRouteValid(true);
  };

  const handleDelete = (appId) => {
    setRoleToDelete(appId.appID);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRoleToDelete(null);
  };

  const deleteApp = async (appId) => {
    setIsLoaderActive(true);

    try {
      const response = await axios.delete(`${config.API_URL}AuthMaster/DeleteApp`,
        {
          data: {
            appID: roleToDelete,
            appName: appId.appName,
            appRoute: appId.appRoute,
            clientId: config.ClientId,
            isActive: true,
          }
        }
      );

      if(response.data.success) {
        toast.success('App deleted successfully');
        GetRoles();
      } else {
        toast.error(response.data.message || 'Error deleting App');
      }
    } catch(error) {
      toast.error(error.message);
    } finally {
      setIsLoaderActive(false);
      handleCloseModal();
    }
  };

  const handleCancel = () => {
    setAppName('');
    setAppRoute('');
    setIsAppNameValid(true);
    setIsAppRouteValid(true);
    setEditAppId(null);
    setIsEditMode(false);
  };

  const exportToCSV = () => {
    let csvContent = "App Name,App Route\n";
    filteredApps.forEach((app) => {
      csvContent += `${app.appName},${app.appRoute}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "AppList.csv");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredApps.map((app) => ({
        "App Name": app.appName,
        "App Route": app.appRoute,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Apps");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "AppList.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("App List", 14, 10);
    autoTable(doc, {
      head: [["App Name", "App Route"]],
      body: filteredApps.map((app) => [app.appName, app.appRoute]),
    });
    doc.save("AppList.pdf");
  };

  const printTable = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write("<html><head><title>Print Apps</title></head><body>");
    printWindow.document.write("<h3>App List</h3>");
    printWindow.document.write("<table border='1' cellspacing='0' cellpadding='5'><thead><tr><th>App Name</th><th>App Route</th></tr></thead><tbody>");
    filteredApps.forEach((app) => {
      printWindow.document.write(`<tr><td>${app.appName}</td><td>${app.appRoute}</td></tr>`);
    });
    printWindow.document.write("</tbody></table></body></html>");
    printWindow.document.close();
    printWindow.print();
  };



  return (
    <>
      <main id='main' className='addAssignee'>
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Manage Apps
                  <span
                    hover-tooltip='In this you can manage the sidebar tabs which are accessed based on the role by giving the app name and app route. You create a new, edit and delete the app routes.'
                    tooltip-position="bottom"
                  >
                    <i
                      className="fas fa-info-circle my-1 ml-2"
                      style={{ color: "rgb(0 0 0 / 51%)" }}
                    ></i>
                  </span></h1>
                {/* <ol className="breadcrumb float-sm-left mt-1">
                  <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
                  <li className="breadcrumb-item"><Link to="/masters">Masters</Link></li>
                  <li className="breadcrumb-item active">Manage Apps</li>
                </ol> */}
              </div>
              <div className="col-sm-6">
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className='row'>
            <div className="col-md-12">
              <div className="card ">
                <div className="card-header">
                  <h3 className="card-title text-sm"><i className='fas fa-arrow-left mr-2' style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/masters')} /> Create New App
                    <span
                      hover-tooltip='In this you can create a new and edit the app routes by giving the app name and app-route'
                      tooltip-position="bottom"
                    >
                      <i
                        className="fas fa-info-circle ml-2"
                        style={{ color: "rgb(0 0 0 / 51%)" }}
                      ></i>
                    </span></h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="maximize">
                      <i className="fas fa-expand"></i>
                    </button>
                  </div>
                </div>

                <div className='card-body text-sm'>
                  <div className='row'>
                    <div className="form-group col-md-3">
                      <label className='labelStyle' >
                        App Name<sup style={{ color: 'red' }}>*</sup>
                      </label >
                      <input
                        type='text'
                        className={`form-control form-control-sm ${isAppNameValid ? '' : 'is-invalid'}`}
                        value={appName}
                        ref={inputAppNameReference}
                        placeholder='Enter App Name'
                        onChange={handleAppNameChange}
                      />
                    </div>
                    <div className='col-md-3 mb-1'>
                      <label className='labelStyle' style={{ color: "#000" }}>
                        App Route<sup style={{ color: 'red' }}>*</sup>
                      </label>
                      <input
                        type='text'
                        className={`form-control form-control-sm ${isAppRouteValid ? '' : 'is-invalid'}`}
                        value={appRoute}
                        ref={inputAppRouteReference}
                        placeholder='Enter App Route'
                        onChange={handleAppRouteChange}
                      />
                    </div>

                  </div>
                </div>
                <div className="card-footer text-sm">
                  {isLoaderActive ? <PleaseWaitButton className='float-right btn-xs ml-2 font-weight-medium auth-form-btn' /> :
                    <button type="submit" className="btn btn-primary float-right btn-xs ml-2" onClick={handleSubmit}>Save & Submit</button>
                  }
                  <button type="submit" className="btn btn-default float-right btn-xs" onClick={handleCancel}>Clear</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className='row'>
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title text-sm">Roles List ( {roles.length} )
                    <span
                      hover-tooltip='In this you can see the list of app-routes in the table and edit, delete the app routes by using the action buttons.'
                      tooltip-position="bottom"
                    >
                      <i
                        className="fas fa-info-circle ml-2"
                        style={{ color: "rgb(0 0 0 / 51%)" }}
                      ></i>
                    </span></h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" data-card-widget="maximize">
                      <i className="fas fa-expand"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body text-sm position-relative">
                  <div className="d-flex justify-content-between mb-2">
                    <div>
                      <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={exportToCSV}>Export CSV</button>
                      <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={exportToExcel}>Export Excel</button>
                      <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={exportToPDF}>Export PDF</button>
                      <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={printTable}>Print</button>
                    </div>
                    <input
                      type="text"
                      className="form-control form-control-sm w-25"
                      placeholder="Search..."
                      onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  <table class="table table-bordered table-sm table-striped">
                    {isLoaderActive && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgb(233 236 239 / 81%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                      >
                        <i
                          className="fas fa-sync-alt fa-spin"
                          style={{ fontSize: "2rem", color: "#333" }}
                        ></i>
                      </div>
                    )}
                    <thead>
                      <tr>
                        <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }} className='text-center'>Sr. No.</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>App Name</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>App Routes</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRows.map((roleObj, index) => (
                        <tr key={roleObj.appID}>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>{indexOfFirstRow + index + 1}</td>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{roleObj.appName}</td>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{roleObj.appRoute}</td>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>
                            <button type="button" className="btn btn-outline-primary btn-xs" onClick={() => { handleEdit(roleObj) }} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                              <i class="fas fa-pen" style={{ fontSize: 'smaller' }}></i>
                            </button>
                            <button type="button" className="btn btn-outline-danger btn-xs ml-2" onClick={() => { handleDelete(roleObj) }} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                              <i className="fas fa-trash" style={{ fontSize: 'smaller' }}></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-between mt-2">
                    <div>
                      Showing {startEntry} to {endEntry} of {filteredApps.length} entries
                    </div>
                    <div>
                      <button
                        className="btn btn-xs btn-outline-primary"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="fas fa-angle-double-left"></i>
                      </button>
                      <span className="m-1">Page {currentPage} of {totalPages}</span>
                      <button
                        className="btn btn-xs btn-outline-primary"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <i className="fas fa-angle-double-right"></i>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>


        {showModal && (
          <div
            className='modal fade show d-flex pt-5'
            tabIndex='-1'
            role='dialog'
            style={{ backgroundColor: '#5d5858b8', boxShadow: '#5d5858b 8' }}
          >
            <div className='modal-dialog modal-lg' role='document'>
              <div className='modal-content'>
                <div className="col-md-12">
                  <i className="bi bi-x-lg mt-3 float-right" onClick={handleCloseModal} style={{ cursor: "pointer" }} ></i>
                </div>
                <div className='modal-body px-5'>
                  <h5 className='modal-title w-100 text-center'>
                    Are you sure?
                  </h5>
                </div>
                <div className='modal-body'>
                  <p className='text-center'>
                    Are you sure you want to delete this App? Once deleted, it
                    cannot be recovered.
                  </p>
                </div>
                <div className='d-flex justify-content-center pb-4'>
                  <button
                    type='button'
                    className='btn btn-default btn-sm'
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  {isLoaderActive ? (
                    <PleaseWaitButton className="btn btn-warning btn-sm ml-2" />
                  ) : (
                    <button
                      type='button'
                      className='btn btn-success btn-sm ml-2'
                      onClick={deleteApp}
                    >
                      Yes
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main >
      <ToastContainer position="top-center" />

    </>
  );
};

export default AppMaster;