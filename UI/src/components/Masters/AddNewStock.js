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

import { FaUpload } from "react-icons/fa";

const config = require("../../config/config.json");

const AddNewStock = () => {
  const UserId = localStorage.getItem("loggedUserId");
  const inputAppNameReference = useRef(null);
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
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  useEffect(() => {
    window.initDatePickerFuncation();
  }, []);

//   const GetRoles = async () => {
//     setIsLoaderActive(true);

//     try {
//       const response = await axios.get(
//         `${config.API_URL}Department/GetAllDepartments`
//       );
//       const appsArray = response.data.data || [];
//       setRoles(appsArray);
//     } catch (error) {
//       console.error("Error fetching departments:", error);
//       toast.error("Error fetching departments");
//     } finally {
//       setIsLoaderActive(false);
//     }
//   };

  const handleAppNameChange = (e) => {
    const value = e.target.value;
    setAppName(value);
    setIsAppNameValid(value !== "");
  };

  const handleSubmit = async () => {
    inputAppNameReference.current.classList.remove("is-invalid");

    if (appName.trim() === "") {
      setIsAppNameValid(false);
      inputAppNameReference.current.focus();
      toast.error("Please Enter Department Name");
      return;
    }

    setIsLoaderActive(true);
    try {
      const appData = {
        departmentId: isEditMode ? editAppId : 0,
        departmentName: appName,
        createdBy: UserId,
        modifiedBy: isEditMode ? UserId : "",
      };

      const editAppData = {
        departmentId: isEditMode ? editAppId : 0,
        newDepartmentName: appName,
        createdBy: UserId,
        modifiedBy: isEditMode ? UserId : "",
      };

      const response = isEditMode
        ? await axios.put(
            `${config.API_URL}Department/UpdateDepartmentOfId`,
            editAppData
          )
        : await axios.post(
            `${config.API_URL}Department/CreateDepartment`,
            appData
          );

      if (response.data.success) {
        toast.success(
          isEditMode
            ? "Department updated successfully"
            : "Department created successfully"
        );
        handleCancel();
        setIsEditMode(false);
        setEditAppId("");
      } else {
        toast.error(response.data.message || "Error processing request");
      }
    } catch (error) {
      toast.error(error.response?.data || "An error occurred");
    } finally {
      setIsLoaderActive(false);
     
    }
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
    navigate("/add-stock");
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
                  Add New Stock
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
                  {/* <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li> */}
                  {/* <li className="breadcrumb-item"><Link to="/masters">Masters</Link></li> */}
                  {/* <li className="breadcrumb-item active">Manage Departments</li> */}
                </ol>
              </div>
              <div className="col-sm-6"></div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-outline card-primary">
                {/* <div className="card-header"> */}
                {/* <h3 className="card-title text-sm">
                                        <i className='fas fa-arrow-left mr-2' style={{ cursor: 'pointer' }}
                                        onClick={() => navigate('/masters')} />Create New Department<span
                                            hover-tooltip='In this you can create a new and edit the departments by giving the department name'
                                            tooltip-position="bottom"
                                        >
                                            <i
                                                className="fas fa-info-circle ml-2"
                                                style={{ color: "rgb(0 0 0 / 51%)" }}
                                            ></i>
                                        </span></h3> */}
                {/* <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="maximize">
                                            <i className="fas fa-expand"></i>
                                        </button>
                                    </div> */}
                {/* </div> */}

                <div className="card-body text-sm">
                  <div className="container mt-0">
                    <form className="row">
                      {/* Reference ID - Mandatory */}
                      <div className="col-md-6 d-flex align-items-center p-2">
                        <label
                          className="me-2 fw-bold"
                          style={{ width: "200px" }}
                        >
                         Material : <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" required />
                      </div>

                      {/* Valid From */}
                      <div className="col-md-6 d-flex align-items-center ">
                        <label
                          className="me-2 fw-bold"
                          style={{ width: "200px" }}
                        >
                          Plant :
                        </label>
                        <input type="text" className="form-control" />
                      </div>

                      {/* Valid To */}
                      <div className="col-md-6 d-flex align-items-center p-2">
                        <label
                          className="me-2 fw-bold"
                          style={{ width: "200px" }}
                        >
                         SLoc :
                        </label>
                        <input type="text" className="form-control" />
                      </div>

                      {/* Creation Date */}
                      <div className="col-md-6 d-flex align-items-center">
                        <label
                          className="me-2 fw-bold"
                          style={{ width: "200px" }}
                        >
                          Batch :
                        </label>
                        <input type="text" className="form-control" />
                      </div>

                      {/* Type */}
                      <div className="col-md-6 d-flex align-items-center p-2">
                        <label
                          className="me-2 fw-bold"
                          style={{ width: "200px" }}
                        >
                          BUn :
                        </label>
                        <input type="text" className="form-control" />
                      </div>

                      {/* Created By */}
                      <div className="col-md-6 d-flex align-items-center">
                        <label
                          className="me-2 fw-bold"
                          style={{ width: "200px" }}
                        >
                          Unrestricted :
                        </label>
                        <input type="text" className="form-control" />
                      </div>

                      <div className="col-md-6 d-flex align-items-center p-2">
                        <label
                          className="me-2 fw-bold"
                          style={{ width: "200px" }}
                        >
                          Quality Inspection :
                        </label>
                        <input type="text" className="form-control" />
                      </div>

                      {/* Created By */}
                      <div className="col-md-6 d-flex align-items-center">
                        <label
                          className="me-2 fw-bold"
                          style={{ width: "200px" }}
                        >
                          Value Unrestricted :
                        </label>
                        <input type="text" className="form-control" />
                      </div>

                      <div className="col-md-6 d-flex align-items-center p-2">
                        <label
                          className="me-2 fw-bold"
                          style={{ width: "200px" }}
                        >
                         Transit :
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    
                    </form>
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
                      Add
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

        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
             
            </div>
          </div>
        </div>

        {/* {showModal && (
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
                                        Are you sure you want to delete this Department? Once deleted, it
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
                )} */}
      </main>
      <ToastContainer position="top-center" />
    </>
  );
};

export default AddNewStock;
