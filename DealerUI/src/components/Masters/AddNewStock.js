// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";

// import "./filter-style.css";
// import axios from "axios";
// import PleaseWaitButton from "../../shared/PleaseWaitButton";
// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// // import { FaUpload } from "react-icons/fa";

// const config = require("../../config/config.json");

// const AddNewStock = () => {
//   const UserId = localStorage.getItem("loggedUserId");
//   const inputAppNameReference = useRef(null);
//   const navigate = useNavigate();
//   const [appName, setAppName] = useState("");
//   const [roles, setRoles] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [roleToDelete, setRoleToDelete] = useState(null);
//   const [isLoaderActive, setIsLoaderActive] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editAppId, setEditAppId] = useState(null);
//   const [isAppNameValid, setIsAppNameValid] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchText, setSearchText] = useState("");
//   const rowsPerPage = 10;

//   const filteredDepartments = roles.filter((dept) =>
//     dept.departmentName.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = filteredDepartments.slice(
//     indexOfFirstRow,
//     indexOfLastRow
//   );
//   const totalPages = Math.ceil(filteredDepartments.length / rowsPerPage);
//   const startEntry = indexOfFirstRow + 1;
//   const endEntry = Math.min(indexOfLastRow, filteredDepartments.length);
//   const [fileName, setFileName] = useState("");

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) setFileName(file.name);
//   };

//   useEffect(() => {
//     window.initDatePickerFuncation();
//   }, []);

// //   const GetRoles = async () => {
// //     setIsLoaderActive(true);

// //     try {
// //       const response = await axios.get(
// //         `${config.API_URL}Department/GetAllDepartments`
// //       );
// //       const appsArray = response.data.data || [];
// //       setRoles(appsArray);
// //     } catch (error) {
// //       console.error("Error fetching departments:", error);
// //       toast.error("Error fetching departments");
// //     } finally {
// //       setIsLoaderActive(false);
// //     }
// //   };

//   const handleAppNameChange = (e) => {
//     const value = e.target.value;
//     setAppName(value);
//     setIsAppNameValid(value !== "");
//   };

//   const handleSubmit = async () => {
//     inputAppNameReference.current.classList.remove("is-invalid");

//     if (appName.trim() === "") {
//       setIsAppNameValid(false);
//       inputAppNameReference.current.focus();
//       toast.error("Please Enter Department Name");
//       return;
//     }

//     setIsLoaderActive(true);
//     try {
//       const appData = {
//         departmentId: isEditMode ? editAppId : 0,
//         departmentName: appName,
//         createdBy: UserId,
//         modifiedBy: isEditMode ? UserId : "",
//       };

//       const editAppData = {
//         departmentId: isEditMode ? editAppId : 0,
//         newDepartmentName: appName,
//         createdBy: UserId,
//         modifiedBy: isEditMode ? UserId : "",
//       };

//       const response = isEditMode
//         ? await axios.put(
//             `${config.API_URL}Department/UpdateDepartmentOfId`,
//             editAppData
//           )
//         : await axios.post(
//             `${config.API_URL}Department/CreateDepartment`,
//             appData
//           );

//       if (response.data.success) {
//         toast.success(
//           isEditMode
//             ? "Department updated successfully"
//             : "Department created successfully"
//         );
//         handleCancel();
//         setIsEditMode(false);
//         setEditAppId("");
//       } else {
//         toast.error(response.data.message || "Error processing request");
//       }
//     } catch (error) {
//       toast.error(error.response?.data || "An error occurred");
//     } finally {
//       setIsLoaderActive(false);
     
//     }
//   };

//   const handleEdit = (app) => {
//     setAppName(app.departmentName);
//     setIsEditMode(true);
//     setEditAppId(app.departmentID);
//     setIsAppNameValid(true);
//   };

//   const handleDelete = (appId) => {
//     setRoleToDelete(appId.departmentID);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setRoleToDelete(null);
//   };

//   const deleteApp = async () => {
//     setIsLoaderActive(true);
//     try {
//       const response = await axios.delete(
//         `${config.API_URL}Department/DeleteDepartment/${roleToDelete}/${UserId}`
//       );

//       if (response.data.success) {
//         toast.success("Department deleted successfully");
   
//       } else {
//         toast.error(response.data.message || "Error deleting department");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setIsLoaderActive(false);
//       handleCloseModal();
//     }
//   };

//   const handleCancel = () => {
//     setAppName("");
//     setIsAppNameValid(true);
//     setEditAppId(null);
//     setIsEditMode(false);
//     navigate("/add-stock");
//   };

//   const exportToCSV = () => {
//     let csvContent = "Department Name\n";
//     filteredDepartments.forEach((dept) => {
//       csvContent += `${dept.departmentName}\n`;
//     });
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "DepartmentList.csv");
//   };

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       filteredDepartments.map((dept) => ({
//         "Department Name": dept.departmentName,
//       }))
//     );
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Departments");
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const data = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     saveAs(data, "DepartmentList.xlsx");
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Department List", 14, 10);
//     autoTable(doc, {
//       head: [["Department Name"]],
//       body: filteredDepartments.map((dept) => [dept.departmentName]),
//     });
//     doc.save("DepartmentList.pdf");
//   };

//   const printTable = () => {
//     const printWindow = window.open("", "", "width=800,height=600");
//     printWindow.document.write(
//       "<html><head><title>Print Departments</title></head><body>"
//     );
//     printWindow.document.write("<h3>Department List</h3>");
//     printWindow.document.write(
//       "<table border='1' cellspacing='0' cellpadding='5'><thead><tr><th>Department Name</th></tr></thead><tbody>"
//     );
//     filteredDepartments.forEach((dept) => {
//       printWindow.document.write(`<tr><td>${dept.departmentName}</td></tr>`);
//     });
//     printWindow.document.write("</tbody></table></body></html>");
//     printWindow.document.close();
//     printWindow.print();
//   };

//   return (
//     <>
//       <main id="main" className="addAssignee">
//         <div className="content-header">
//           <div className="container-fluid">
//             <div className="row mb-2">
//               <div className="col-sm-6">
//                 <h1 className="m-0">
//                   Add New Stock
//                   <span
//                     hover-tooltip="In this you can manage the departments used in the employee creation and onboarding by giving the department name. You create a new, edit and delete the departments."
//                     tooltip-position="bottom"
//                   >
//                     {/* <i
//                                         className="fas fa-info-circle my-1 ml-2"
//                                         style={{ color: "rgb(0 0 0 / 51%)" }}
//                                     ></i> */}
//                   </span>
//                 </h1>
//                 <ol className="breadcrumb float-sm-left mt-1">
//                   {/* <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li> */}
//                   {/* <li className="breadcrumb-item"><Link to="/masters">Masters</Link></li> */}
//                   {/* <li className="breadcrumb-item active">Manage Departments</li> */}
//                 </ol>
//               </div>
//               <div className="col-sm-6"></div>
//             </div>
//           </div>
//         </div>

//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-md-12">
//               <div className="card card-outline card-primary">
//                 {/* <div className="card-header"> */}
//                 {/* <h3 className="card-title text-sm">
//                                         <i className='fas fa-arrow-left mr-2' style={{ cursor: 'pointer' }}
//                                         onClick={() => navigate('/masters')} />Create New Department<span
//                                             hover-tooltip='In this you can create a new and edit the departments by giving the department name'
//                                             tooltip-position="bottom"
//                                         >
//                                             <i
//                                                 className="fas fa-info-circle ml-2"
//                                                 style={{ color: "rgb(0 0 0 / 51%)" }}
//                                             ></i>
//                                         </span></h3> */}
//                 {/* <div className="card-tools">
//                                         <button type="button" className="btn btn-tool" data-card-widget="maximize">
//                                             <i className="fas fa-expand"></i>
//                                         </button>
//                                     </div> */}
//                 {/* </div> */}

//                 <div className="card-body text-sm">
//                   <div className="container mt-0">
//                     <form className="row">
//                       {/* Reference ID - Mandatory */}
//                       <div className="col-md-6 d-flex align-items-center p-2">
//                         <label className='labelStyle'
//                           className="me-2 fw-bold"
//                           style={{ width: "200px" }}
//                         >
//                          Material : <span className="text-danger">*</span>
//                         </label>
//                         <input type="text" className="form-control" required />
//                       </div>

//                       {/* Valid From */}
//                       <div className="col-md-6 d-flex align-items-center ">
//                         <label className='labelStyle'
//                           className="me-2 fw-bold"
//                           style={{ width: "200px" }}
//                         >
//                           Plant :
//                         </label>
//                         <input type="text" className="form-control" />
//                       </div>

//                       {/* Valid To */}
//                       <div className="col-md-6 d-flex align-items-center p-2">
//                         <label className='labelStyle'
//                           className="me-2 fw-bold"
//                           style={{ width: "200px" }}
//                         >
//                          SLoc :
//                         </label>
//                         <input type="text" className="form-control" />
//                       </div>

//                       {/* Creation Date */}
//                       <div className="col-md-6 d-flex align-items-center">
//                         <label className='labelStyle'
//                           className="me-2 fw-bold"
//                           style={{ width: "200px" }}
//                         >
//                           Batch :
//                         </label>
//                         <input type="text" className="form-control" />
//                       </div>

//                       {/* Type */}
//                       <div className="col-md-6 d-flex align-items-center p-2">
//                         <label className='labelStyle'
//                           className="me-2 fw-bold"
//                           style={{ width: "200px" }}
//                         >
//                           BUn :
//                         </label>
//                         <input type="text" className="form-control" />
//                       </div>

//                       {/* Created By */}
//                       <div className="col-md-6 d-flex align-items-center">
//                         <label className='labelStyle'
//                           className="me-2 fw-bold"
//                           style={{ width: "200px" }}
//                         >
//                           Unrestricted :
//                         </label>
//                         <input type="text" className="form-control" />
//                       </div>

//                       <div className="col-md-6 d-flex align-items-center p-2">
//                         <label className='labelStyle'
//                           className="me-2 fw-bold"
//                           style={{ width: "200px" }}
//                         >
//                           Quality Inspection :
//                         </label>
//                         <input type="text" className="form-control" />
//                       </div>

//                       {/* Created By */}
//                       <div className="col-md-6 d-flex align-items-center">
//                         <label className='labelStyle'
//                           className="me-2 fw-bold"
//                           style={{ width: "200px" }}
//                         >
//                           Value Unrestricted :
//                         </label>
//                         <input type="text" className="form-control" />
//                       </div>

//                       <div className="col-md-6 d-flex align-items-center p-2">
//                         <label className='labelStyle'
//                           className="me-2 fw-bold"
//                           style={{ width: "200px" }}
//                         >
//                          Transit :
//                         </label>
//                         <input type="text" className="form-control" />
//                       </div>
                    
//                     </form>
//                   </div>
//                 </div>
//                 <div className="card-footer text-sm">
//                   {isLoaderActive ? (
//                     <PleaseWaitButton className="float-right btn-xs ml-2 font-weight-medium auth-form-btn" />
//                   ) : (
//                     <button
//                       type="submit"
//                       className="btn btn-primary float-right btn-l ml-2 w-10"
//                       onClick={handleSubmit}
//                     >
//                       Add
//                     </button>
//                   )}
//                   <button
//                     type="submit"
//                     className="btn btn-default float-right btn-l w-10"
//                     onClick={handleCancel}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-md-12">
//               {/* <div className="card card-outline card-primary"> */}
//               {/* <div className="card-header">
//                                     <h3 className="card-title text-sm">Department List ( {roles.length} )<span
//                                         hover-tooltip='In this you can see the list of departments in the table and edit, delete the departments by using the action buttons.'
//                                         tooltip-position="bottom"
//                                     >
//                                         <i
//                                             className="fas fa-info-circle ml-2"
//                                             style={{ color: "rgb(0 0 0 / 51%)" }}
//                                         ></i>
//                                     </span></h3>
//                                     <div className="card-tools">
//                                         <button type="button" className="btn btn-tool" data-card-widget="maximize">
//                                             <i className="fas fa-expand"></i>
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <div className="card-body text-sm position-relative" >
//                                     <div className="d-flex justify-content-between mb-2">
//                                         <div>
//                                             <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={exportToCSV}>Export CSV</button>
//                                             <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={exportToExcel}>Export Excel</button>
//                                             <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={exportToPDF}>Export PDF</button>
//                                             <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={printTable}>Print</button>
//                                         </div>
//                                         <input
//                                             type="text"
//                                             className="form-control form-control-sm w-25"
//                                             placeholder="Search Department..."
//                                             onChange={(e) => {
//                                                 setSearchText(e.target.value);
//                                                 setCurrentPage(1);
//                                             }}
//                                         />
//                                     </div>

//                                     <table class="table table-bordered table-sm table-striped">
//                                         {isLoaderActive && (
//                                             <div
//                                                 style={{
//                                                     position: "absolute",
//                                                     top: 0,
//                                                     left: 0,
//                                                     width: "100%",
//                                                     height: "100%",
//                                                     backgroundColor: "rgb(233 236 239 / 81%)",
//                                                     display: "flex",
//                                                     alignItems: "center",
//                                                     justifyContent: "center",
//                                                     zIndex: 10,
//                                                 }}
//                                             >
//                                                 <i
//                                                     className="fas fa-sync-alt fa-spin"
//                                                     style={{ fontSize: "2rem", color: "#333" }}
//                                                 ></i>
//                                             </div>
//                                         )}
//                                         <thead>
//                                             <tr>
//                                                 <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }} className='text-center'>Sr. No.</th>
//                                                 <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Department Name</th>
//                                                 <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }}>Action</th>
//                                             </tr>
//                                         </thead>
//                                         {/* <tbody>
//                                             {roles.length > 0 ?
//                                                 roles.map((roleObj, index) => {
//                                                     return (
//                                                         <tr>
//                                                             <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>{index + 1}</td>
//                                                             <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{roleObj.departmentName}</td>
//                                                             <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>
//                                                                 <button type="button" class="btn btn-outline-warning btn-xs" onClick={(e) => { handleEdit(roleObj) }} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
//                                                                     <i class="fas fa-edit" style={{ fontSize: 'smaller' }}></i>
//                                                                 </button>
//                                                                 <button type="button" class="btn btn-outline-danger btn-xs ml-2" onClick={(e) => { handleDelete(roleObj) }} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
//                                                                     <i class="fas fa-trash" style={{ fontSize: 'smaller' }}></i>
//                                                                 </button>
//                                                             </td>
//                                                         </tr>
//                                                     )
//                                                 })
//                                                 : ""
//                                             }
//                                         </tbody> */}

//               {/* <tbody>
//                                             {currentRows.length > 0 ? (
//                                                 currentRows.map((roleObj, index) => (
//                                                     <tr key={roleObj.departmentID}>
//                                                         <td className='text-center text-sm'>{indexOfFirstRow + index + 1}</td>
//                                                         <td>{roleObj.departmentName}</td>
//                                                         <td className='text-center text-sm'>
//                                                             <button type="button" className="btn btn-outline-warning btn-xs" onClick={() => handleEdit(roleObj)}>
//                                                                 <i className="fas fa-edit"></i>
//                                                             </button>
//                                                             <button type="button" className="btn btn-outline-danger btn-xs ml-2" onClick={() => handleDelete(roleObj)}>
//                                                                 <i className="fas fa-trash"></i>
//                                                             </button>
//                                                         </td>
//                                                     </tr>
//                                                 ))
//                                             ) : (
//                                                 <tr><td colSpan="3" className="text-center">No departments found</td></tr>
//                                             )}
//                                         </tbody> */}

//               {/* </table> */}
//               {/* <div className="d-flex justify-content-between mt-2">
//                                         <div>
//                                             Showing {startEntry} to {endEntry} of {filteredDepartments.length} entries
//                                         </div>
//                                         <div>
//                                             <button
//                                                 className="btn btn-xs btn-outline-primary"
//                                                 onClick={() => handlePageChange(currentPage - 1)}
//                                                 disabled={currentPage === 1}
//                                             >
//                                                 <i className="fas fa-angle-double-left"></i>
//                                             </button>
//                                             <span className="mx-2">Page {currentPage} of {totalPages}</span>
//                                             <button
//                                                 className="btn btn-xs btn-outline-primary"
//                                                 onClick={() => handlePageChange(currentPage + 1)}
//                                                 disabled={currentPage === totalPages}
//                                             >
//                                                 <i className="fas fa-angle-double-right"></i>
//                                             </button>
//                                         </div>
//                                     </div> */}

//               {/* </div> */}
//               {/* </div> */}
//             </div>
//           </div>
//         </div>

//         {/* {showModal && (
//                     <div
//                         className='modal fade show d-flex pt-5'
//                         tabIndex='-1'
//                         role='dialog'
//                         style={{ backgroundColor: '#5d5858b8', boxShadow: '#5d5858b 8' }}
//                     >
//                         <div className='modal-dialog modal-lg' role='document'>
//                             <div className='modal-content'>
//                                 <div className="col-md-12">
//                                     <i className="bi bi-x-lg mt-3 float-right" onClick={handleCloseModal} style={{ cursor: "pointer" }} ></i>
//                                 </div>
//                                 <div className='modal-body px-5'>
//                                     <h5 className='modal-title w-100 text-center'>
//                                         Are you sure?
//                                     </h5>
//                                 </div>
//                                 <div className='modal-body'>
//                                     <p className='text-center'>
//                                         Are you sure you want to delete this Department? Once deleted, it
//                                         cannot be recovered.
//                                     </p>
//                                 </div>
//                                 <div className='d-flex justify-content-center pb-4'>
//                                     <button
//                                         type='button'
//                                         className='btn btn-default btn-sm'
//                                         onClick={handleCloseModal}
//                                     >
//                                         Cancel
//                                     </button>
//                                     {isLoaderActive ? (
//                                         <PleaseWaitButton className="btn btn-warning btn-sm ml-2" />
//                                     ) : (
//                                         <button
//                                             type='button'
//                                             className='btn btn-success btn-sm ml-2'
//                                             onClick={deleteApp}
//                                         >
//                                             Yes
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )} */}
//       </main>
//       <ToastContainer position="top-center" />
//     </>
//   );
// };

// export default AddNewStock;


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
     <section className="content">
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1 className="m-0"> Add New Stock</h1>
                    {/* <ol className="breadcrumb float-sm-left mt-1">
                      <li className="breadcrumb-item"><Link to="/manage-employee">Home</Link></li>
                      <li className="breadcrumb-item active"> Add New Stock</li>
                    </ol> */}
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
                    <h4 className="card-title text-sm">Create Stock</h4>
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
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label className='labelStyle' for="material" style={{ color: "#000", width: "200px" }}>Material:<sup style={{ color: "red" }}>*</sup></label>
                          <input type="text" className="form-control form-control-sm" id="material" ref={inputMaterialReference} value={material} onChange={(e) => {
                            setMaterial(e.target.value);
                            inputMaterialReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Material" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label className='labelStyle' for="plant" style={{ color: "#000", width: "200px" }}>Plant:</label>
                          <input type="text" className="form-control form-control-sm" id="plant" ref={inputPlantReference} value={plant} onChange={(e) => {
                            setPlant(e.target.value);
                            inputPlantReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Plant" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label className='labelStyle' for="sloc" style={{ color: "#000", width: "200px" }}>Sloc:</label>
                          <input type="text" className="form-control form-control-sm" id="sloc" ref={inputSlocReference} value={sloc} onChange={(e) => {
                            setSloc(e.target.value);
                            inputSlocReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Sloc" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label className='labelStyle' for="batch" style={{ color: "#000", width: "200px" }}>Batch:</label>
                          <input type="text" className="form-control form-control-sm" id="batch" ref={inputBatchReference} value={batch} onChange={(e) => {
                            setBatch(e.target.value);
                            inputBatchReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Batch" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label className='labelStyle' for="bun" style={{ color: "#000", width: "200px" }}>Bun:</label>
                          <input type="text" className="form-control form-control-sm" id="bun" ref={inputBunReference} value={bun} onChange={(e) => {
                            setBun(e.target.value);
                            inputBunReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Bun" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label className='labelStyle' for="unrestricted" style={{ color: "#000", width: "200px" }}>Unrestricted:</label>
                          <input type="text" className="form-control form-control-sm" id="unrestricted" ref={inputUnrestrictedReference} value={unrestricted} onChange={(e) => {
                            setUnrestricted(e.target.value);
                            inputUnrestrictedReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Unrestricted" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label className='labelStyle' for="qualityInspection" style={{ color: "#000", width: "200px" }}>Quality Inspection:</label>
                          <input type="text" className="form-control form-control-sm" id="qualityInspection" ref={inputQualityInspectionReference} value={qualityInspection} onChange={(e) => {
                            setQualityInspection(e.target.value);
                            inputQualityInspectionReference.current.classList.remove('is-invalid');
                          }} placeholder="Enter Quality Inspection" />
                        </div>
                        <div className="form-group  col-md-6 d-flex align-items-center p-2">
                          <label className='labelStyle' for="valueUnrestricted" style={{ color: "#000", width: "200px" }}>Value Unrestricted:</label>
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
                        className="btn btn-primary float-right btn-xs ml-2 w-10 pr-4 pl-4"
                        onClick={handleSubmit}
                      >
                        Create
                      </button>
                    )}
                    <button
                      type="submit"
                      className="btn btn-default float-right btn-xs w-10 pr-4 pl-4"
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

