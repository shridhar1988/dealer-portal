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

const Plant = () => {
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
      const response = await axios.get(`${config.API_URL}PlantMaster/GetAllPlants`);
      console.log("Get All Plant response",response.data.data);
      const appsArray = response.data.data || [];
      setRoles(appsArray);
    } catch(error) {
      console.error('Error fetching Plants:', error);
      toast.error('Error fetching Plants');
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
    setIsAppRouteValid(value !== '');
  };

  const handleSubmit = async () => {

    inputAppNameReference.current.classList.remove('is-invalid');
    inputAppRouteReference.current.classList.remove('is-invalid');

    if(appName.trim() === '') {
      setIsAppNameValid(false);
      inputAppNameReference.current.focus();
      toast.error('Please Enter Plant Name');
      return;
    }

    if(appRoute.trim() === '') {
      setIsAppRouteValid(false);
      inputAppRouteReference.current.focus();
      toast.error('Please Enter Plant Description');
      return;
    }

    setIsLoaderActive(true);
    try {
      const appData = {
        appID: isEditMode ? editAppId : 0,
        PlantName: appName,
        PlantDescription: appRoute,
        clientId: config.ClientId,
        createdBy: UserId,
        modifiedBy: UserId
      };
      debugger;
      const response = isEditMode
        ? await axios.post(`${config.API_URL}PlantMaster/updatePlant?Id=${appData.appID}`, appData)
        : await axios.post(`${config.API_URL}PlantMaster/addPlant`, appData);
        console.log("Add Plant response",response.data);
      if(response.data.success === 'True') {
        debugger;
        toast.success(isEditMode ? 'Plant updated successfully' : 'Plant created successfully');
        handleCancel();
        setIsEditMode(false);
        setEditAppId('');
      } else {
        debugger;
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
    console.log("Edit Plant", app);
    setAppName(app.plantName);
    setAppRoute(app.plantDescription);
    setIsEditMode(true);
    setEditAppId(app.id);
    setIsAppNameValid(true);
    setIsAppRouteValid(true);
  };

  const handleDelete = (appId) => {
    console.log("Delete Plant", appId);
    setRoleToDelete(appId.id);
    //setRoleToDelete(appId.appID);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRoleToDelete(null);
  };

  const deleteApp = async (appId) => {
    setIsLoaderActive(true);

    try {
      const response = await axios.delete(`${config.API_URL}PlantMaster/deletePlant?id=${roleToDelete}&modifiedBy=${UserId}`,
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
        toast.success('Plant deleted successfully');
        GetRoles();
      } else {
        toast.error(response.data.message || 'Error deleting Plant');
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
    let csvContent = "Plant Name,Plant Description\n";
    filteredApps.forEach((app) => {
      csvContent += `${app.plantName},${app.plantDescription}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "PlantList.csv");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredApps.map((app) => ({
        "Plant Name": app.plantName,
        "Plant Description": app.plantDescription,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plants");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "PlantList.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Plant List", 14, 10);
    autoTable(doc, {
      head: [["Plant Name", "Plant Description"]],
      body: filteredApps.map((app) => [app.plantName, app.plantDescription]),
    });
    doc.save("PlantList.pdf");
  };

  const printTable = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write("<html><head><title>Print Plants</title></head><body>");
    printWindow.document.write("<h3>Plant List</h3>");
    printWindow.document.write("<table border='1' cellspacing='0' cellpadding='5'><thead><tr><th>Plant Name</th><th>Plant Description</th></tr></thead><tbody>");
    filteredApps.forEach((app) => {
      printWindow.document.write(`<tr><td>${app.plantName}</td><td>${app.plantDescription}</td></tr>`);
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
                <h1 className="m-0">Manage Plant
                  <span
                    hover-tooltip='In this you can manage the Plant which are accessed based on the role by giving the Plant name and Plant Description. You create a new, edit and delete the Plant Info.'
                    tooltip-position="bottom"
                  >
                    <i
                      className="fas fa-info-circle my-1 ml-2"
                      style={{ color: "rgb(0 0 0 / 51%)" }}
                    ></i>
                  </span></h1>
                <ol className="breadcrumb float-sm-left mt-1">
                  <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
                  <li className="breadcrumb-item"><Link to="/masters">Masters</Link></li>
                  <li className="breadcrumb-item active">Manage Plant</li>
                </ol>
              </div>
              <div className="col-sm-6">
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className='row'>
            <div className="col-md-12">
              <div className="card card-outline card-primary">
                <div className="card-header">
                  <h3 className="card-title text-sm"><i className='fas fa-arrow-left mr-2' style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/masters')} /> Create New Plant
                    <span
                      hover-tooltip='In this you can create a new and edit the Plant by giving the Plant name and Plant Description.'
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
                      <label style={{ color: "#000" }}>
                      Plant Name<sup style={{ color: 'red' }}>*</sup>
                      </label>
                      <input
                        type='text'
                        className={`form-control form-control-sm ${isAppNameValid ? '' : 'is-invalid'}`}
                        value={appName}
                        ref={inputAppNameReference}
                        placeholder='Enter Plant Name'
                        onChange={handleAppNameChange}
                      />
                    </div>
                    <div className='col-md-3 mb-1'>
                      <label style={{ color: "#000" }}>
                      Plant Description<sup style={{ color: 'red' }}>*</sup>
                      </label>
                      <input
                        type='text'
                        className={`form-control form-control-sm ${isAppRouteValid ? '' : 'is-invalid'}`}
                        value={appRoute}
                        ref={inputAppRouteReference}
                        placeholder='Enter Plant Descrciption'
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
              <div className="card card-outline card-primary">
                <div className="card-header">
                  <h3 className="card-title text-sm">Plant List ( {roles.length} )
                    <span
                      hover-tooltip='In this you can see the list of Plants in the table and edit, delete the Plant by using the action buttons.'
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
                      placeholder="Search Plants..."
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
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Plant Name</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Plant Decription</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRows.map((roleObj, index) => (
                        <tr key={roleObj.appID}>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>{indexOfFirstRow + index + 1}</td>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{roleObj.plantName}</td>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{roleObj.plantDescription}</td>
                          <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>
                            <button type="button" className="btn btn-outline-warning btn-xs" onClick={() => { handleEdit(roleObj) }} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                              <i className="fas fa-edit" style={{ fontSize: 'smaller' }}></i>
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
                    Are you sure you want to delete this Plant? Once deleted, it
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

export default Plant;