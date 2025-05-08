import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import "./filter-style.css";
import axios from "axios";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { removeExtraSpaces } from '../../common/textOperations';

// import { FaUpload } from "react-icons/fa";

const config = require("../../config/config.json");

const CreateScheme = () => {
  const UserId = localStorage.getItem("loggedUserId");

  const inputAppNameReference = useRef(null);
  const inputReferanceIdReference = useRef(null);
  const inputValidFromReference = useRef(null);
  const inputValidToReference = useRef(null);
  const inputCreationDateReference = useRef(null);
  const inputCreatedByReference = useRef(null);
  const inputSchemeTypeReference = useRef(null);

  const [referanceId, setReferanceId] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [schemeType, setschemeType] = useState("");

  const navigate = useNavigate();
  const [appName, setAppName] = useState("");
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editAppId, setEditAppId] = useState(null);
  const [isAppNameValid, setIsAppNameValid] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const rowsPerPage = 10;

  const filteredDepartments = roles.filter((dept) =>
    dept.departmentName.toLowerCase().includes(searchText.toLowerCase())
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredDepartments.slice(
    indexOfFirstRow,
    indexOfLastRow
  );
  const totalPages = Math.ceil(filteredDepartments.length / rowsPerPage);
  const startEntry = indexOfFirstRow + 1;
  const endEntry = Math.min(indexOfLastRow, filteredDepartments.length);
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };
  useEffect(() => {
    GetRoles();
    window.initDatePickerFuncation();
  }, []);

  const GetRoles = async () => {
    setIsLoaderActive(true);

    try {
      const response = await axios.get(
        `${config.API_URL}Department/GetAllDepartments`
      );
      const appsArray = response.data.data || [];
      setRoles(appsArray);
    } catch (error) {
      console.error("Error fetching departments:", error);
      // toast.error("Error fetching departments");
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleAppNameChange = (e) => {
    const value = e.target.value;
    setAppName(value);
    setIsAppNameValid(value !== "");
  };

  const handleSubmit = async () => {
    inputReferanceIdReference.current.classList.remove('is-invalid');
    if (removeExtraSpaces(referanceId)) {
      inputReferanceIdReference.current.focus();
      if (removeExtraSpaces(validFrom)) {
        inputValidFromReference.current.focus();
        if (removeExtraSpaces(validTo)) {
          inputValidToReference.current.focus();
          if (removeExtraSpaces(creationDate)) {
            inputCreationDateReference.current.focus();
            if (removeExtraSpaces(createdBy)) {
              inputCreatedByReference.current.focus();
              if (removeExtraSpaces(schemeType)) {
                inputSchemeTypeReference.current.focus();
              } else {
                toast.error("Please Enter Scheme Type");
                inputSchemeTypeReference.current.focus();
                inputSchemeTypeReference.current.classList.add('is-invalid');
              }
            } else {
              toast.error("Please Enter Created By");
              inputCreatedByReference.current.focus();
              inputCreatedByReference.current.classList.add('is-invalid');
            }
          } else {
            toast.error("Please Enter Creation Date");
            inputCreationDateReference.current.focus();
            inputCreationDateReference.current.classList.add('is-invalid');
          }
        } else {
          toast.error("Please Enter Valid To");
          inputValidToReference.current.focus();
          inputValidToReference.current.classList.add('is-invalid');
        }
      } else {
        toast.error("Please Enter Valid From");
        inputValidFromReference.current.focus();
        inputValidFromReference.current.classList.add('is-invalid');
      }
    } else {
      toast.error("Please Enter Referance Id");
      inputReferanceIdReference.current.focus();
      inputReferanceIdReference.current.classList.add('is-invalid');
    }

    // setIsLoaderActive(true);
    // try {
    //   const appData = {
    //     departmentId: isEditMode ? editAppId : 0,
    //     departmentName: appName,
    //     createdBy: UserId,
    //     modifiedBy: isEditMode ? UserId : "",
    //   };

    //   const editAppData = {
    //     departmentId: isEditMode ? editAppId : 0,
    //     newDepartmentName: appName,
    //     createdBy: UserId,
    //     modifiedBy: isEditMode ? UserId : "",
    //   };

    //   const response = isEditMode
    //     ? await axios.put(
    //       `${config.API_URL}Department/UpdateDepartmentOfId`,
    //       editAppData
    //     )
    //     : await axios.post(
    //       `${config.API_URL}Department/CreateDepartment`,
    //       appData
    //     );

    //   if (response.data.success) {
    //     toast.success(
    //       isEditMode
    //         ? "Department updated successfully"
    //         : "Department created successfully"
    //     );
    //     handleCancel();
    //     setIsEditMode(false);
    //     setEditAppId("");
    //   } else {
    //     toast.error(response.data.message || "Error processing request");
    //   }
    // } catch (error) {
    //   toast.error(error.response?.data || "An error occurred");
    // } finally {
    //   setIsLoaderActive(false);
    //   GetRoles();
    // }
  };

  const handleEdit = (app) => {
    setAppName(app.departmentName);
    setIsEditMode(true);
    setEditAppId(app.departmentID);
    setIsAppNameValid(true);
  };

  const handleDelete = (appId) => {
    setRoleToDelete(appId.departmentID);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRoleToDelete(null);
  };

  const deleteApp = async () => {
    setIsLoaderActive(true);
    try {
      const response = await axios.delete(
        `${config.API_URL}Department/DeleteDepartment/${roleToDelete}/${UserId}`
      );

      if (response.data.success) {
        toast.success("Department deleted successfully");
        GetRoles();
      } else {
        toast.error(response.data.message || "Error deleting department");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoaderActive(false);
      handleCloseModal();
    }
  };

  const handleCancel = () => {
    setAppName("");
    setIsAppNameValid(true);
    setEditAppId(null);
    setIsEditMode(false);
    navigate("/scheme");
  };

  const exportToCSV = () => {
    let csvContent = "Department Name\n";
    filteredDepartments.forEach((dept) => {
      csvContent += `${dept.departmentName}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "DepartmentList.csv");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredDepartments.map((dept) => ({
        "Department Name": dept.departmentName,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Departments");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "DepartmentList.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Department List", 14, 10);
    autoTable(doc, {
      head: [["Department Name"]],
      body: filteredDepartments.map((dept) => [dept.departmentName]),
    });
    doc.save("DepartmentList.pdf");
  };

  const printTable = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(
      "<html><head><title>Print Departments</title></head><body>"
    );
    printWindow.document.write("<h3>Department List</h3>");
    printWindow.document.write(
      "<table border='1' cellspacing='0' cellpadding='5'><thead><tr><th>Department Name</th></tr></thead><tbody>"
    );
    filteredDepartments.forEach((dept) => {
      printWindow.document.write(`<tr><td>${dept.departmentName}</td></tr>`);
    });
    printWindow.document.write("</tbody></table></body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <main id="main" className="addAssignee">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">
                  Create Scheme
                  <span
                    hover-tooltip="In this you can manage the departments used in the employee creation and onboarding by giving the department name. You create a new, edit and delete the departments."
                    tooltip-position="bottom"
                  >
                    {/* <i
                                        className="fas fa-info-circle my-1 ml-2"
                                        style={{ color: "rgb(0 0 0 / 51%)" }}
                                    ></i> */}
                  </span>
                </h1>
                <ol className="breadcrumb float-sm-left mt-1">
                  <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
                  {/* <li className="breadcrumb-item"><Link to="/masters">Masters</Link></li>  */}
                  <li className="breadcrumb-item active">Create Scheme</li>
                </ol>
              </div>
              <div className="col-sm-6"></div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title text-sm">Create New Scheme</h3>
                    <div className="card-tools">
                      {/* <button type="button" className="btn btn-danger btn-xs" id='AddNewHeaderButton' onClick={(e) => { addProjectCardHeaderButtonClick(e) }} data-card-widget="collapse">
                        <i className="fas fa-plus"></i> Add New User
                      </button> */}
                      <button type="button" className="btn btn-tool" data-card-widget="maximize">
                        <i className="fas fa-expand"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body text-sm">
                    <div className="container mt-0">
                      {/* <form className="row g-3">
                        <div className="col-md-6 form-group d-flex align-items-center p-2">
                          <label
                            className="me-2 fw-bold"
                            style={{ width: "200px" }}
                          >
                            Reference ID : <span className="text-danger">*</span>
                          </label>
                          <input type="text" className="form-control" required />
                        </div>

                        <div className="col-md-6 d-flex align-items-center">
                          <label
                            className="me-2 fw-bold"
                            style={{ width: "200px" }}
                          >
                            Valid From :
                          </label>
                          <input type="date" className="form-control" />
                        </div>

                        <div className="col-md-6 d-flex align-items-center p-2">
                          <label
                            className="me-2 fw-bold"
                            style={{ width: "200px" }}
                          >
                            Valid To :
                          </label>
                          <input type="date" className="form-control" />
                        </div>

                        <div className="col-md-6 d-flex align-items-center">
                          <label
                            className="me-2 fw-bold"
                            style={{ width: "200px" }}
                          >
                            Creation Date :
                          </label>
                          <input type="date" className="form-control" />
                        </div>

                        <div className="col-md-6 d-flex align-items-center p-2">
                          <label
                            className="me-2 fw-bold"
                            style={{ width: "200px" }}
                          >
                            Type :
                          </label>
                          <input type="text" className="form-control" />
                        </div>

                        <div className="col-md-6 d-flex align-items-center">
                          <label
                            className="me-2 fw-bold"
                            style={{ width: "200px" }}
                          >
                            Created By :
                          </label>
                          <input type="text" className="form-control" />
                        </div>

                        <div className="col-md-6 d-flex align-items-center p-2">
                          <label htmlFor="fileUpload" className="me-2 fw-bold mb-0" style={{ width: "200px" }}>
                            File:
                          </label>

                          <div className="upload-box position-relative" style={{ width: '100%' }}>
                            <input
                              type="file"
                              id="fileUpload"
                              onChange={handleFileChange}
                              style={{ display: 'none' }}
                              className="form-control"
                            />
                            <div className="d-flex">
                              <div className="file-display form-control flex-grow-1" style={{
                                backgroundColor: '#fff',
                                border: '1px solid #ddd',
                                padding: '8px',
                                overflow: 'hidden'
                              }}>
                                {selectedFileName || ' '}
                              </div>
                              <label
                                htmlFor="fileUpload"
                                className="upload-button d-flex align-items-center justify-content-center"
                                style={{
                                  backgroundColor: '#f1f6fb',
                                  border: '1px solid #ddd',
                                  borderLeft: 'none',
                                  borderTopRightRadius: '4px',
                                  borderBottomRightRadius: '4px',
                                  padding: '8px 12px',
                                  cursor: 'pointer',
                                  color: '#2a63f7',
                                  fontWeight: '500',
                                  display: 'flex',
                                  gap: '6px',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                <i className="fas fa-cloud-upload-alt"></i> Upload File
                              </label>
                            </div>
                          </div>
                        </div>

                      </form> */}
                      <div className='row'>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label for="referanceId" style={{ color: "#000", width: "200px" }}>Reference ID:<sup style={{ color: "red" }}>*</sup></label>
                          <input type="text" className="form-control form-control-sm" id="referanceId" ref={inputReferanceIdReference} value={referanceId} onChange={(e) => {
                            setReferanceId(e.target.value);
                            inputReferanceIdReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Referance Id" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label for="validFrom" style={{ color: "#000", width: "200px" }}>Valid From:</label>
                          <input type="text" className="form-control form-control-sm" id="validFrom" ref={inputValidFromReference} value={validFrom} onChange={(e) => {
                            setValidFrom(e.target.value);
                            inputValidFromReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Valid From" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label for="validTo" style={{ color: "#000", width: "200px" }}>Valid To:</label>
                          <input type="text" className="form-control form-control-sm" id="validTo" ref={inputValidToReference} value={validTo} onChange={(e) => {
                            setValidTo(e.target.value);
                            inputValidToReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Valid To" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label for="creationDate" style={{ color: "#000", width: "200px" }}>Creation Date:</label>
                          <input type="date" className="form-control form-control-sm" id="creationDate" ref={inputCreationDateReference} value={creationDate} onChange={(e) => {
                            setCreationDate(e.target.value);
                            inputCreationDateReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Valid To" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label for="schemeType" style={{ color: "#000", width: "200px" }}>Type:</label>
                          <input type="text" className="form-control form-control-sm" id="schemeType" ref={inputSchemeTypeReference} value={schemeType} onChange={(e) => {
                            setschemeType(e.target.value);
                            inputSchemeTypeReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Type" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label for="createdBy" style={{ color: "#000", width: "200px" }}>Created By:</label>
                          <input type="text" className="form-control form-control-sm" id="createdBy" ref={inputCreatedByReference} value={createdBy} onChange={(e) => {
                            setCreatedBy(e.target.value);
                            inputCreatedByReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Created by" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label htmlFor="fileUpload" className="me-2 fw-bold mb-0" style={{ width: "200px" }}>
                            File:
                          </label>

                          <div className="upload-box position-relative" style={{ width: '100%' }}>
                            <input
                              type="file"
                              id="fileUpload"
                              onChange={handleFileChange}
                              style={{ display: 'none' }}
                              className="form-control"
                            />
                            <div className="d-flex">
                              <div className="file-display form-control flex-grow-1" style={{
                                backgroundColor: '#fff',
                                border: '1px solid #ddd',
                                padding: '8px',
                                overflow: 'hidden'
                              }}>
                                {selectedFileName || ' '}
                              </div>
                              <label
                                htmlFor="fileUpload"
                                className="upload-button d-flex align-items-center justify-content-center"
                                style={{
                                  backgroundColor: '#f1f6fb',
                                  border: '1px solid #ddd',
                                  borderLeft: 'none',
                                  borderTopRightRadius: '4px',
                                  borderBottomRightRadius: '4px',
                                  padding: '8px 12px',
                                  cursor: 'pointer',
                                  color: '#2a63f7',
                                  fontWeight: '500',
                                  display: 'flex',
                                  gap: '6px',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                <i className="fas fa-cloud-upload-alt"></i> Upload File
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer text-sm">
                    {isLoaderActive ? (
                      <PleaseWaitButton className="float-right btn-xs ml-2 font-weight-medium auth-form-btn" />
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-primary float-right btn-l ml-2 w-10"
                        onClick={handleSubmit}
                      >
                        Create
                      </button>
                    )}
                    <button
                      type="submit"
                      className="btn btn-default float-right btn-l w-10"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12"></div>
          </div>
        </div>
      </main>
      <ToastContainer position="top-center" />
    </>
  );
};

export default CreateScheme;
