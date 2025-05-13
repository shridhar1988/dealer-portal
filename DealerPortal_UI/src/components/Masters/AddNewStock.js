


import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { removeExtraSpaces } from '../../common/textOperations';

import "./filter-style.css";
import axios from "axios";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// import { FaUpload } from "react-icons/fa";

const config = require("../../config/config.json");

const AddNewStock = () => {
  const UserId = localStorage.getItem("loggedUserId");
  const navigate = useNavigate();

  const inputMaterialReference = useRef(null);
  const inputPlantReference = useRef(null);
  const inputSlocReference = useRef(null);
  const inputBatchReference = useRef(null);
  const inputBunReference = useRef(null);
  const inputUnrestrictedReference = useRef(null);
  const inputQualityInspectionReference = useRef(null);
  const inputValueUnrestrictedReference = useRef(null);

  const [material, setMaterial] = useState("");
  const [plant, setPlant] = useState("");
  const [sloc, setSloc] = useState("");
  const [batch, setBatch] = useState("");
  const [bun, setBun] = useState("");
  const [unrestricted, setUnrestricted] = useState("");
  const [qualityInspection, setQualityInspection] = useState("");
  const [valueUnrestricted, setValueUnrestricted] = useState("");
 
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
    inputMaterialReference.current.classList.remove("is-invalid");

    if (removeExtraSpaces(material)) {
      inputMaterialReference.current.focus();
      if (removeExtraSpaces(plant)) {
        inputPlantReference.current.focus();       
        if (removeExtraSpaces(sloc)) {
          inputSlocReference.current.focus();      
          if (removeExtraSpaces(batch)) {
            inputBatchReference.current.focus();     
            if (removeExtraSpaces(bun)) {
              inputBunReference.current.focus();     
              if (removeExtraSpaces(unrestricted)) {
                inputUnrestrictedReference.current.focus();     
                if (removeExtraSpaces(qualityInspection)) {
                  inputQualityInspectionReference.current.focus();    
                  if (removeExtraSpaces(valueUnrestricted)) {
                    inputValueUnrestrictedReference.current.focus();         
                  }else{
                    toast.error("Please Enter Value Unrestricted  ");      
                    inputValueUnrestrictedReference.current.focus();
                    inputValueUnrestrictedReference.current.classList.add('is-invalid'); 
                  }     
                }else{
                  toast.error("Please Enter Quality Inspection");      
                  inputQualityInspectionReference.current.focus();
                  inputQualityInspectionReference.current.classList.add('is-invalid'); 
                }         
              }else{
                toast.error("Please Enter Unrestricted");      
                inputUnrestrictedReference.current.focus();
                inputUnrestrictedReference.current.classList.add('is-invalid'); 
              }        
            }else{
              toast.error("Please Enter Bun");      
              inputBunReference.current.focus();
              inputBunReference.current.classList.add('is-invalid'); 
            }       
          }else{
            toast.error("Please Enter Batch");      
            inputBatchReference.current.focus();
            inputBatchReference.current.classList.add('is-invalid'); 
          }   
        }else{
          toast.error("Please Enter Sloc");      
          inputSlocReference.current.focus();
          inputSlocReference.current.classList.add('is-invalid'); 
        }
      }else{
        toast.error("Please Enter Plant");      
        inputPlantReference.current.focus();
        inputPlantReference.current.classList.add('is-invalid'); 
      }
    }else{
      toast.error("Please Enter Material Name");      
      inputMaterialReference.current.focus();
      inputMaterialReference.current.classList.add('is-invalid'); 
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
    //         `${config.API_URL}Department/UpdateDepartmentOfId`,
    //         editAppData
    //       )
    //     : await axios.post(
    //         `${config.API_URL}Department/CreateDepartment`,
    //         appData
    //       );

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
      "<table border='1' cellspacing='0' cellpadding='5'><thead><tr> <th style={{ fontWeight: '500' }}>Department Name</th></tr></thead><tbody>"
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
     <section className="content">
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1 className="m-0"> Add New Stock</h1>
                    <ol className="breadcrumb float-sm-left mt-1">
                      <li className="breadcrumb-item"><Link to="/manage-employee">Home</Link></li>
                      <li className="breadcrumb-item active"> Add New Stock</li>
                    </ol>
                  </div>
                  <div className="col-sm-6">
                  </div>
                </div>
              </div>
            </div>
            </section>
            <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title text-sm">Create Stock</h3>
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
                      <div className='row'>
                        <div className="form-group  col-md-6 d-flex align-items-center  p-2">
                          <label for="material" style={{ color: "rgb(137 132 132)", width: "200px",fontWeight:"400" }}><strong>Material:</strong><sup style={{ color: "red" }}>*</sup></label>
                          <input type="text" className="form-control form-control-sm " id="material" ref={inputMaterialReference} value={material} onChange={(e) => {
                            setMaterial(e.target.value);
                            inputMaterialReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Material" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label for="plant" style={{ color: "rgb(137 132 132)", width: "200px",fontWeight:"400" }}><strong>Plant:</strong></label>
                          <input type="text" className="form-control form-control-sm" id="plant" ref={inputPlantReference} value={plant} onChange={(e) => {
                            setPlant(e.target.value);
                            inputPlantReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Plant" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label for="sloc" style={{ color: "rgb(137 132 132)", width: "200px",fontWeight:"400" }}><strong>Sloc:</strong></label>
                          <input type="text" className="form-control form-control-sm" id="sloc" ref={inputSlocReference} value={sloc} onChange={(e) => {
                            setSloc(e.target.value);
                            inputSlocReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Sloc" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label for="batch" style={{ color: "rgb(137 132 132)", width: "200px",fontWeight:"400" }}><strong>Batch:</strong></label>
                          <input type="text" className="form-control form-control-sm" id="batch" ref={inputBatchReference} value={batch} onChange={(e) => {
                            setBatch(e.target.value);
                            inputBatchReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Batch" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label for="bun" style={{ color: "rgb(137 132 132)", width: "200px",fontWeight:"400" }}><strong>Bun:</strong></label>
                          <input type="text" className="form-control form-control-sm" id="bun" ref={inputBunReference} value={bun} onChange={(e) => {
                            setBun(e.target.value);
                            inputBunReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Bun" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label for="unrestricted" style={{ color: "rgb(137 132 132)", width: "200px",fontWeight:"400" }}><strong>Unrestricted:</strong></label>
                          <input type="text" className="form-control form-control-sm" id="unrestricted" ref={inputUnrestrictedReference} value={unrestricted} onChange={(e) => {
                            setUnrestricted(e.target.value);
                            inputUnrestrictedReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Unrestricted" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label for="qualityInspection" style={{ color: "rgb(137 132 132)", width: "200px",fontWeight:"400" }}><strong>Quality Inspection:</strong></label>
                          <input type="text" className="form-control form-control-sm" id="qualityInspection" ref={inputQualityInspectionReference} value={qualityInspection} onChange={(e) => {
                            setQualityInspection(e.target.value);
                            inputQualityInspectionReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Quality Inspection" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label for="valueUnrestricted" style={{ color: "rgb(137 132 132)", width: "200px",fontWeight:"400" }}><strong>Value Unrestricted:</strong></label>
                          <input type="text" className="form-control form-control-sm" id="valueUnrestricted" ref={inputValueUnrestrictedReference} value={valueUnrestricted} onChange={(e) => {
                            setValueUnrestricted(e.target.value);
                            inputValueUnrestrictedReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Value Unrestricted" />
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
                        className="btn btn-primary float-right btn-l ml-3 w-10 mr-4" style={{width:"160px"}}
                        onClick={handleSubmit}
                      >
                        Create
                      </button>
                    )}
                    <button
                      type="submit"
                      className="btn btn-default float-right btn-l w-10" style={{width:"160px",border:"1px solid blue",color :"blue"}}
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

      <ToastContainer position="top-center" />
    </>
  );
};

export default AddNewStock;

