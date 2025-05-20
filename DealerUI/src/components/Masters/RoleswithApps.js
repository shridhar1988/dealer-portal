// import React, { useRef, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { ToastContainer, toast } from 'react-toastify';
// import PleaseWaitButton from '../../shared/PleaseWaitButton';
// import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios';
// import $ from "jquery";
// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
 
 
// const config = require('../../config/config.json');
 
// const RoleswithApps = () => {
//   const inputRoleNameReference = useRef(null);
//   const selectAppsReference = useRef(null);
 
//   const personalInfo = useSelector((state) => state.personalInformationReducer);
//   const navigate = useNavigate();
//   const [roleName, setRoleName] = useState("");
//   const [appId, setAppId] = useState("");
//   const [isLoaderActive, setIsLoaderActive] = useState(false);
//   const [isLoader, setIsLoader] = useState(false);
//   const [allRolesList, setAllRolesList] = useState([]);
//   const [allAppsList, setAllAppsList] = useState([]);
//   const [updateOrDeleteId, setUpdateOrDeleteId] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchText, setSearchText] = useState("");
//   const rowsPerPage = 10;
 
//   const filteredRoles = allRolesList.filter((role) =>
//     role.roleName.toLowerCase().includes(searchText.toLowerCase())
//   );
 
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentRows = filteredRoles.slice(indexOfFirstRow, indexOfLastRow);
//   const totalPages = Math.ceil(filteredRoles.length / rowsPerPage);
 
//   const startEntry = indexOfFirstRow + 1;
//   const endEntry = Math.min(indexOfLastRow, filteredRoles.length);
 
//   const handlePageChange = (newPage) => {
//     if(newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };
 
//   useEffect(() => {
//     getAllAppsList();
//     setIsLoader(true);
//     setTimeout(() => {
//       setIsLoader(false);
//     }, 1000);
 
//     window.initMultiSelectFuncation();
//   }, []);
 
//   const exportToCSV = () => {
//     let csvContent = "Role Name,App Names\n";
//     allRolesList.forEach((role) => {
//       const apps = role.appIDList.map(id => {
//         const app = allAppsList.find(app => app.appID === id);
//         return app ? app.appName : '';
//       }).join(" | ");
//       csvContent += `${role.roleName},"${apps}"\n`;
//     });
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "RolesList.csv");
//   };
 
//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       allRolesList.map((role) => ({
//         "Role Name": role.roleName,
//         "App Names": role.appIDList.map(id => {
//           const app = allAppsList.find(app => app.appID === id);
//           return app ? app.appName : '';
//         }).join(" | "),
//       }))
//     );
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const data = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     saveAs(data, "RolesList.xlsx");
//   };
 
//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Roles List", 14, 10);
//     autoTable(doc, {
//       head: [["Role Name", "App Names"]],
//       body: allRolesList.map((role) => [
//         role.roleName,
//         role.appIDList.map(id => {
//           const app = allAppsList.find(app => app.appID === id);
//           return app ? app.appName : '';
//         }).join(" | ")
//       ]),
//     });
//     doc.save("RolesList.pdf");
//   };
 
//   const printTable = () => {
//     const printWindow = window.open("", "", "width=800,height=600");
//     printWindow.document.write("<html><head><title>Print Roles</title></head><body>");
//     printWindow.document.write("<h3>Roles List</h3>");
//     printWindow.document.write("<table border='1' cellspacing='0' cellpadding='5'><thead><tr><th>Role Name</th><th>App Names</th></tr></thead><tbody>");
//     allRolesList.forEach((role) => {
//       const apps = role.appIDList.map(id => {
//         const app = allAppsList.find(app => app.appID === id);
//         return app ? app.appName : '';
//       }).join(" | ");
//       printWindow.document.write(`<tr><td>${role.roleName}</td><td>${apps}</td></tr>`);
//     });
//     printWindow.document.write("</tbody></table></body></html>");
//     printWindow.document.close();
//     printWindow.print();
//   };
 
//   const getAllAppsList = () => {
//     setIsLoaderActive(true);
 
//     axios.get(config.API_URL + 'AuthMaster/GetAllApps', {
//       headers: config.headers2,
//     }).then((response) => {
//       if(response.status == 200) {
//          console.log("response.data.data Get All Apps============>", response.data)
//         if(response.data.success == "success") {
//           if(response.data.data.length > 0) {
//             setAllAppsList(response.data.data);
//             getAllRolesList();
//           }
//         } else {
//           toast.error(response.data.message, config.tostar_config);
//         }
//       } else if(response.data.status.status == 500) {
//         toast.error("Invalid username or password", config.tostar_config);
//       }
//     }).catch((error) => {
//       toast.error("Please try again later.", config.tostar_config);
//     }).finally(() => {
//       setIsLoaderActive(false);
//     })
//   }
 
//   const getAllRolesList = () => {
//     setIsLoaderActive(true);
//     window.initDestroyDataTableFuncation();
//     axios.get(config.API_URL + 'AuthMaster/GetAllRoles?ClientId=' + config.ClientId, {
//       headers: config.headers2,
//     }).then((response) => {
//       if(response.status == 200) {
//         console.log("response.data.data  GetAllRoles============>", response.data)
//         if(response.data.success == "success") {
//           if(response.data.data.length > 0) {
//             setAllRolesList(response.data.data);
//             setTimeout(() => {
//               window.initDataTableFuncation();
//             }, 1000)
//           }
//         } else {
//           toast.error(response.data.message, config.tostar_config);
//           setTimeout(() => {
//             window.initDataTableFuncation();
//           }, 1000)
//         }
//       } else if(response.data.status.status == 500) {
//         toast.error("Invalid username or password", config.tostar_config);
//       }
//     }).catch((error) => {
//       toast.error("Please try again later.", config.tostar_config);
//     }).finally(() => {
//       setIsLoaderActive(false);
//     })
//   }
 
//   const handleEditRoleDetails = (roleObj) => {
//     setUpdateOrDeleteId(roleObj.roleID);
//     let getAppListArray = roleObj.appIDList
//     setRoleName(roleObj.roleName);
//     setAppId(getAppListArray);
//     window.assignValueToSelect2(getAppListArray);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }
 
//   const handleRemoveRole = (roleObj) => {
//     setUpdateOrDeleteId(roleObj.roleID);
//     window.confirmModalShow();
//   }
 
//   const yesConfirmSubmitRequest = () => {
//     setIsLoaderActive(true);
//     let APIMethodName = 'AuthMaster/DeleteRole?roleId=' + updateOrDeleteId
//     axios.post(config.API_URL + APIMethodName, {
//       headers: config.headers2,
//     }).then((response) => {
//       console.log(response);
//       if(response.data.success == "success") {
//         toast.success("Role deleted successfully...", config.tostar_config);
//         window.confirmModalHide();
//         clearAllFields();
//         getAllAppsList();
//         setIsLoaderActive(false);
//       } else {
//         setIsLoaderActive(false);
//         toast.error(response.data.message, config.tostar_config);
//       }
//     }).catch((error) => {
//       if(!error.response.data.success) {
//         toast.error(error.response.data.message, config.tostar_config);
//       } else {
//         toast.error("oops something went wrong. please try again later.", config.tostar_config);
//       }
//       setIsLoaderActive(false);
//     })
//   }
 
//   const handleCancelClick = () => {
//     clearAllFields();
//   }
 
//   const clearAllFields = () => {
//     setRoleName("");
//     $(".select2").val("");
//     window.assignValueToSelect2([]);
//     setUpdateOrDeleteId('');
//   }
 
//   const handleRoleSubmit = (e) => {
//     let getAllSelectedApps = $(".select2").val();
//     if(roleName) {
//       if(getAllSelectedApps) {
//         setIsLoaderActive(true);
//         let APIMethodName = ''
//         if(updateOrDeleteId != "") {
//           APIMethodName = 'AuthMaster/UpdateRole'
//         } else {
//           APIMethodName = 'AuthMaster/CreateRole'
//         }
 
//         axios.post(config.API_URL + APIMethodName, {
//           "roleID": roleName,
//           "createdBy": personalInfo.userID,
//           "clientId": config.ClientId,
//           "modifiedBy": personalInfo.userID,
//           "roleName": roleName,
//           "appIDList": getAllSelectedApps,
//           "isActive": true
//         }, {
//           headers: config.headers2,
//         }).then((response) => {
//           console.log(response);
//           if(response.data.success == "success") {
//             if(APIMethodName == 'AuthMaster/UpdateRole') {
//               toast.success("Role Updated Successfully...", config.tostar_config);
//             } else {
//               toast.success("Role Created Successfully...", config.tostar_config);
//             }
//             clearAllFields();
//             getAllRolesList();
//             setIsLoaderActive(false);
//           } else {
//             setIsLoaderActive(false);
//             toast.error(response.data.message, config.tostar_config);
//           }
//         }).catch((error) => {
//           if(!error.response.data.success) {
//             toast.error(error.response.data.message, config.tostar_config);
//           } else {
//             toast.error("oops something went wrong. please try again later.", config.tostar_config);
//           }
//           setIsLoaderActive(false);
//         })
 
//       } else {
//         toast.error("Select apps.", config.tostar_config);
//         selectAppsReference.current.focus();
//         selectAppsReference.current.classList.add('is-invalid');
//       }
//     } else {
//       //toast.error("Please enter role name.");
//       toast.error('Please select role', config.tostar_config);
//       inputRoleNameReference.current.focus();
//       inputRoleNameReference.current.classList.add('is-invalid');
//     }
 
//   }
 
//   const cteateAttachmentHTML = (appArray) => {
 
   
//     if(appArray.length > 0) {
//       return appArray.map((appID, index) => {
//         let getEmaployeeName = allAppsList.find(x => x.appID == appID);
//         console.log("getEmaployeeName============>", getEmaployeeName);
        
//         return (<small key={index}className="badge badge-primary p-1 mt-1 ml-1"> {getEmaployeeName?.appName||""}</small>)
//       })
//     }
 
//   }
 
//   return (
//     <>
//       <div className="content-header">
//         <div className="container-fluid">
//           <div className="row mb-2">
//             <div className="col-sm-6">
//               <h1 className="m-0">Manage Roles<span
//                 hover-tooltip='In this you can manage the roles by giving the role name with the apps need to be accessed. You create a new, edit and delete the roles.'
//                 tooltip-position="bottom"
//               >
//                 <i
//                   className="fas fa-info-circle my-1 ml-2"
//                   style={{ color: "rgb(0 0 0 / 51%)" }}
//                 ></i>
//               </span></h1>
//               {/* <ol className="breadcrumb float-sm-left mt-1">
//                 <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
//                 <li className="breadcrumb-item"><Link to="/masters">Masters</Link></li>
//                 <li className="breadcrumb-item active">Manage Roles</li>
//               </ol> */}
//             </div>
//             <div className="col-sm-6">
//             </div>
//           </div>
//         </div>
//       </div>
 
//       <section className="content">
//         <div className="container-fluid">
//           <div className='row'>
//             <div className="col-md-12">
//               <div className="card position-relative">
//               {isLoader && (
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         width: "100%",
//                         height: "100%",
//                         backgroundColor: "rgb(233 236 239 / 81%)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         zIndex: 10,
//                       }}
//                     >
//                       <i
//                         className="fas fa-sync-alt fa-spin"
//                         style={{ fontSize: "2rem", color: "#333" }}
//                       ></i>
//                     </div>
//                   )}
//                 <div className="card-header">
//                   <h3 className="card-title text-sm"><i className='fas fa-arrow-left mr-2' style={{ cursor: 'pointer' }}
//                     onClick={() => navigate('/masters')} />Manage Role App Maps<span
//                       hover-tooltip='In this you can create the roles by giving the role name with the apps need to be accessed. You create a new and edit the roles with accessible apps.'
//                       tooltip-position="bottom"
//                     >
//                       <i
//                         className="fas fa-info-circle ml-2"
//                         style={{ color: "rgb(0 0 0 / 51%)" }}
//                       ></i>
//                     </span></h3>
//                   <div className="card-tools">
//                     <button type="button" className="btn btn-tool" data-card-widget="maximize">
//                       <i className="fas fa-expand"></i>
//                     </button>
//                   </div>
//                 </div>
//                 <div className="card-body text-sm ">
                  
//                   <div className='row'>
//                     <div className="form-group col-md-3">
//                       <label className='labelStyle' for="userRoleNameInput" style={{ color: "#000" }}>Role Name<sup style={{ color: "red" }}>*</sup></label>
//                       {/* <input type="text" className="form-control form-control-sm" id="userRoleNameInput" ref={inputRoleNameReference} value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="Role Name" /> */}
//                       <select
//                         className="form-control form-control-sm"
//                         id="userRoleNameInput"
//                         ref={inputRoleNameReference}
//                         value={roleName}
//                         onChange={(e) => {
//                           setRoleName(e.target.value);
//                           inputRoleNameReference.current.classList.remove(
//                             "is-invalid"
//                           );
//                         }}
//                         // onChange={(e) => setRoleName(e.target.value)}
//                       >
//                         <option value="" disabled>Select Role</option>
//                         {allRolesList.map((role) => (
//                           <option key={role.roleID} value={role.roleID}>
//                             {role.roleName}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="form-group col-md-6">
//                       <label className='labelStyle' style={{ color: "#000" }}>Select Apps<sup style={{ color: "red" }}>*</sup></label>
//                       <select
//                         className="select2 w-100"
//                         multiple="multiple"
//                         data-placeholder="Select Apps.."
                        
//                         style={{ width: "100%" }}
//                         ref={selectAppsReference} value={appId} onChange={(e) => setAppId(e.target.value)}
//                       >
//                         <option value="">--Select--</option>
//                         {allAppsList.map((app) => {
//                           return (
//                             <option key={"Mana_" + app.appID} value={app.appID}>{app.appName}</option>
//                           )
//                         })}
//                       </select>
//                     </div>
 
//                   </div>
//                 </div>
//                 <div className="card-footer text-sm">
//                   {isLoaderActive ? <PleaseWaitButton className='float-right btn-xs ml-2 font-weight-medium auth-form-btn' /> :
//                     <button type="submit" className="btn btn-primary float-right btn-xs ml-2" onClick={(e) => { handleRoleSubmit(e) }}>Save & Submit</button>
//                   }
//                   <button type="submit" className="btn btn-default float-right btn-xs" onClick={(e) => { handleCancelClick(e) }}>Clear
//                   </button>
//                 </div>
//               </div>
 
//             </div>
//           </div>
 
//           <div className='row'>
//             <div className="col-md-12">
//               <div className="card">
//                 <div className="card-header">
//                   <h3 className="card-title text-sm">Roles List ( {allRolesList.length} )<span
//                     hover-tooltip='In this you can see the list of roles with selected apps in the table and edit, delete the roles with selected apps by using the action buttons.'
//                     tooltip-position="bottom"
//                   >
//                     <i
//                       className="fas fa-info-circle ml-2"
//                       style={{ color: "rgb(0 0 0 / 51%)" }}
//                     ></i>
//                   </span></h3>
//                   <div className="card-tools">
//                     <button type="button" className="btn btn-tool" data-card-widget="maximize">
//                       <i className="fas fa-expand"></i>
//                     </button>
//                   </div>
//                 </div>
//                 <div className="card-body text-sm position-relative">
//                   {isLoaderActive && (
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         width: "100%",
//                         height: "100%",
//                         backgroundColor: "rgb(233 236 239 / 81%)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         zIndex: 10,
//                       }}
//                     >
//                       <i
//                         className="fas fa-sync-alt fa-spin"
//                         style={{ fontSize: "2rem", color: "#333" }}
//                       ></i>
//                     </div>
//                   )}
//                   <div className="d-flex justify-content-between mb-2">
//                     <div>
//                       <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={exportToCSV}>Export CSV</button>
//                       <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={exportToExcel}>Export Excel</button>
//                       <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={exportToPDF}>Export PDF</button>
//                       <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={printTable}>Print</button>
//                     </div>
//                     <input
//                       type="text"
//                       className="form-control form-control-sm w-25"
//                       placeholder="Search by Role Name..."
//                       onChange={(e) => {
//                         setSearchText(e.target.value);
//                         setCurrentPage(1);
//                       }}
//                     />
//                   </div>
 
//                   <table class="table table-bordered table-sm table-striped">
//                     <thead>
//                       <tr>
//                         <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }} className='text-center'>Sr. No.</th>
//                         <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Role Name</th>
//                         <th style={{ fontWeight: '500', fontSize: 'smaller' }}>App Names</th>
//                         <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }}>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {currentRows.length > 0 ? (
//                         currentRows.map((roleObj, index) => (
//                           <tr key={roleObj.roleID}>
//                             <td className="text-center text-sm">{indexOfFirstRow + index + 1}</td>
//                             <td>{roleObj.roleName}</td>
//                             <td>{cteateAttachmentHTML(roleObj.appIDList)}</td>
//                             <td className="text-center text-sm">
//                               <button type="button" className="btn btn-outline-primary btn-xs" onClick={() => handleEditRoleDetails(roleObj)}>
//                                 <i className="fas fa-pen"></i>
//                               </button>
//                               <button type="button" className="btn btn-outline-danger btn-xs ml-2" onClick={() => handleRemoveRole(roleObj)}>
//                                 <i className="fas fa-trash"></i>
//                               </button>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr><td colSpan="4" className="text-center">No roles found</td></tr>
//                       )}
//                     </tbody>
//                   </table>
//                   <div className="d-flex justify-content-between mt-2">
//                     <div>
//                       Showing {startEntry} to {endEntry} of {filteredRoles.length} entries
//                     </div>
//                     <div>
//                       <button
//                         className="btn btn-xs btn-outline-primary"
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                       >
//                         <i className="fas fa-angle-double-left"></i>
//                       </button>
//                       <span className="mx-2">Page {currentPage} of {totalPages}</span>
//                       <button
//                         className="btn btn-xs btn-outline-primary"
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                       >
//                         <i className="fas fa-angle-double-right"></i>
//                       </button>
//                     </div>
//                   </div>
 
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
 
//       <div id="confirmCommonModal" class="modal fade confirmCommonModal" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
//         <div class="modal-dialog modal-confirm">
//           <div class="modal-content">
//             <div class="modal-header">
//               <div class="icon-box">
//                 <i class="fas fa-info"></i>
//               </div>
//               <h5 class="modal-title w-100 text-center">Are you sure ?</h5>
//             </div>
//             <div class="modal-body">
//               <p class="text-center">By clicking on Yes delete all the role details. Once you deleted it can not be recovered.</p>
//             </div>
//             <div class="modal-footer col-md-12">
//               <button class="btn btn-default btn-sm" data-dismiss="modal">Cancel</button>
//               {isLoaderActive ? <PleaseWaitButton className='btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn' /> :
//                 <button class="btn btn-warning btn-sm pl-3 pr-3 ml-2" onClick={(e) => { yesConfirmSubmitRequest(e) }}>Yes</button>
//               }
//             </div>
//           </div>
//         </div>
//       </div>
//       <ToastContainer position="top-center" />
 
//     </>
 
//   );
// }
 
// export default RoleswithApps;
import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import PleaseWaitButton from '../../shared/PleaseWaitButton';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import $ from "jquery";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toBeEnabled } from '@testing-library/jest-dom/matchers';

const config = require('../../config/config.json');

const RoleswithApps = () => {
  const inputRoleNameReference = useRef(null);
  const selectAppsReference = useRef(null);

  const personalInfo = useSelector((state) => state.personalInformationReducer);
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState("");
  const [appId, setAppId] = useState("");
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [allRolesList, setAllRolesList] = useState([]);
  const [allAppsList, setAllAppsList] = useState([]);
  const [updateOrDeleteId, setUpdateOrDeleteId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const rowsPerPage = 10;

  const filteredRoles = allRolesList.filter((role) =>
    role.roleName.toLowerCase().includes(searchText.toLowerCase())
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRoles.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredRoles.length / rowsPerPage);

  const startEntry = indexOfFirstRow + 1;
  const endEntry = Math.min(indexOfLastRow, filteredRoles.length);

  const handlePageChange = (newPage) => {
    if(newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    getAllAppsList();
    setIsLoader(true);
    setTimeout(() => {
      setIsLoader(false);
    }, 1000);

    window.initMultiSelectFuncation();
  }, []);

  const exportToCSV = () => {
    let csvContent = "Role Name,App Names\n";
    allRolesList.forEach((role) => {
      const apps = role.appIDList.map(id => {
        const app = allAppsList.find(app => app.appID === id);
        return app ? app.appName : '';
      }).join(" | ");
      csvContent += `${role.roleName},"${apps}"\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "RolesList.csv");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      allRolesList.map((role) => ({
        "Role Name": role.roleName,
        "App Names": role.appIDList.map(id => {
          const app = allAppsList.find(app => app.appID === id);
          return app ? app.appName : '';
        }).join(" | "),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "RolesList.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Roles List", 14, 10);
    autoTable(doc, {
      head: [["Role Name", "App Names"]],
      body: allRolesList.map((role) => [
        role.roleName,
        role.appIDList.map(id => {
          const app = allAppsList.find(app => app.appID === id);
          return app ? app.appName : '';
        }).join(" | ")
      ]),
    });
    doc.save("RolesList.pdf");
  };

  const printTable = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write("<html><head><title>Print Roles</title></head><body>");
    printWindow.document.write("<h3>Roles List</h3>");
    printWindow.document.write("<table border='1' cellspacing='0' cellpadding='5'><thead><tr><th>Role Name</th><th>App Names</th></tr></thead><tbody>");
    allRolesList.forEach((role) => {
      const apps = role.appIDList.map(id => {
        const app = allAppsList.find(app => app.appID === id);
        return app ? app.appName : '';
      }).join(" | ");
      printWindow.document.write(`<tr><td>${role.roleName}</td><td>${apps}</td></tr>`);
    });
    printWindow.document.write("</tbody></table></body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const getAllAppsList = () => {
    setIsLoaderActive(true);
    axios.get(config.API_URL + 'AuthMaster/GetAllApps', {
      headers: config.headers2,
    }).then((response) => {
      if(response.status == 200) {
        if(response.data.success == "success") {
          if(response.data.data.length > 0) {
            setAllAppsList(response.data.data);
            getAllRolesList();
          }
        } else {
          toast.error(response.data.message, config.tostar_config);
        }
      } else if(response.data.status.status == 500) {
        toast.error("Invalid username or password", config.tostar_config);
      }
    }).catch((error) => {
      toast.error("Please try again later.", config.tostar_config);
    }).finally(() => {
      setIsLoaderActive(false);
    })
  }

  const getAllRolesList = () => {
    setIsLoaderActive(true);
    window.initDestroyDataTableFuncation();
    axios.get(config.API_URL + 'AuthMaster/GetAllRoles?ClientId=' + config.ClientId, {
      headers: config.headers2,
    }).then((response) => {
      if(response.status == 200) {
        if(response.data.success == "success") {
          if(response.data.data.length > 0) {
            setAllRolesList(response.data.data);
            setTimeout(() => {
              window.initDataTableFuncation();
            }, 1000)
          }
        } else {
          toast.error(response.data.message, config.tostar_config);
          setTimeout(() => {
            window.initDataTableFuncation();
          }, 1000)
        }
      } else if(response.data.status.status == 500) {
        toast.error("Invalid username or password", config.tostar_config);
      }
    }).catch((error) => {
      toast.error("Please try again later.", config.tostar_config);
    }).finally(() => {
      setIsLoaderActive(false);
    })
  }

  const handleEditRoleDetails = (roleObj) => {
    setUpdateOrDeleteId(roleObj.roleID);
    setIsEditing(true);
    setRoleName(roleObj.roleName);
    let getAppListArray = roleObj.appIDList;
    setAppId(getAppListArray);
    window.assignValueToSelect2(getAppListArray);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleRemoveRole = (roleObj) => {
    setUpdateOrDeleteId(roleObj.roleID);
    window.confirmModalShow();
  }

  const yesConfirmSubmitRequest = () => {
    setIsLoaderActive(true);
    let APIMethodName = 'AuthMaster/DeleteRole?roleId=' + updateOrDeleteId;
    axios.post(config.API_URL + APIMethodName, {
      headers: config.headers2,
    }).then((response) => {
      if(response.data.success == "success") {
        toast.success("Role deleted successfully...", config.tostar_config);
        window.confirmModalHide();
        clearAllFields();
        getAllAppsList();
        setIsLoaderActive(false);
      } else {
        setIsLoaderActive(false);
        toast.error(response.data.message, config.tostar_config);
      }
    }).catch((error) => {
      if(!error.response.data.success) {
        toast.error(error.response.data.message, config.tostar_config);
      } else {
        toast.error("oops something went wrong. please try again later.", config.tostar_config);
      }
      setIsLoaderActive(false);
    })
  }

  const handleCancelClick = () => {
    clearAllFields();
  }

  const clearAllFields = () => {
    setRoleName("");
    setIsEditing(false);
    $(".select2").val("");
    window.assignValueToSelect2([]);
    setUpdateOrDeleteId('');
  }

  const handleRoleSubmit = (e) => {
    let getAllSelectedApps = $(".select2").val();
    if(roleName) {
      if(getAllSelectedApps) {
        setIsLoaderActive(true);
        let APIMethodName = updateOrDeleteId ? 'AuthMaster/UpdateRole' : 'AuthMaster/CreateRole';
        
        const payload = {
          "createdBy": personalInfo.userID,
          "clientId": config.ClientId,
          "modifiedBy": personalInfo.userID,
          "roleName": roleName,
          "appIDList": getAllSelectedApps,
          "isActive": true
        };

        if (updateOrDeleteId) {
          payload.roleID = updateOrDeleteId;
        }

        axios.post(config.API_URL + APIMethodName, payload, {
          headers: config.headers2,
        }).then((response) => {
          if(response.data.success == "success") {
            toast.success(updateOrDeleteId ? "Role Updated Successfully..." : "Role Created Successfully...", config.tostar_config);
            clearAllFields();
            getAllRolesList();
            setIsLoaderActive(false);
          } else {
            setIsLoaderActive(false);
            toast.error(response.data.message, config.tostar_config);
          }
        }).catch((error) => {
          if(!error.response.data.success) {
            toast.error(error.response.data.message, config.tostar_config);
          } else {
            toast.error("oops something went wrong. please try again later.", config.tostar_config);
          }
          setIsLoaderActive(false);
        })
      } else {
        toast.error("Select apps.", config.tostar_config);
        selectAppsReference.current.focus();
        selectAppsReference.current.classList.add('is-invalid');
      }
    } else {
      toast.error(!isEditing ? 'Please enter role name' : 'Please select role', config.tostar_config);
      inputRoleNameReference.current.focus();
      inputRoleNameReference.current.classList.add('is-invalid');
    }
  }

  const cteateAttachmentHTML = (appArray) => {
    if(appArray.length > 0) {
      return appArray.map((appID, index) => {
        let getEmaployeeName = allAppsList.find(x => x.appID == appID);
        return (<small key={index} className="badge badge-primary p-1 mt-1 ml-1"> {getEmaployeeName?.appName||""}</small>)
      })
    }
  }

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Manage Roles<span
                hover-tooltip='In this you can manage the roles by giving the role name with the apps need to be accessed. You create a new, edit and delete the roles.'
                tooltip-position="bottom"
              >
                <i
                  className="fas fa-info-circle my-1 ml-2"
                  style={{ color: "rgb(0 0 0 / 51%)" }}
                ></i>
              </span></h1>
            </div>
            <div className="col-sm-6">
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className='row'>
            <div className="col-md-12">
              <div className="card position-relative">
                {isLoader && (
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
                <div className="card-header">
                  <h3 className="card-title text-sm"><i className='fas fa-arrow-left mr-2' style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/masters')} />Manage Role App Maps<span
                      hover-tooltip='In this you can create the roles by giving the role name with the apps need to be accessed. You create a new and edit the roles with accessible apps.'
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
                <div className="card-body text-sm">
                  <div className='row'>
                    <div className="form-group col-md-3">
                      <label className='labelStyle' for="userRoleNameInput" style={{ color: "#000" }}>Role Name<sup style={{ color: "red" }}>*</sup></label>
                      {!isEditing ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="userRoleNameInput"
                          ref={inputRoleNameReference}
                          value={roleName}
                          onChange={(e) => {
                            setRoleName(e.target.value);
                            inputRoleNameReference.current.classList.remove("is-invalid");
                          }}
                          placeholder="Role Name"
                        />
                      ) : (
                        <select
                          className="form-control form-control-sm"
                          id="userRoleNameInput"
                          ref={inputRoleNameReference}
                          value={roleName}
                          disabled
                          
                          onChange={(e) => {
                            setRoleName(e.target.value);
                            inputRoleNameReference.current.classList.remove("is-invalid");
                            
                          }}
                        >
                          <option value="" disabled>Select Role</option>
                          {allRolesList.map((role) => (
                            <option key={role.roleID} value={role.roleName}>
                              {role.roleName}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="form-group col-md-6">
                      <label className='labelStyle' style={{ color: "#000" }}>Select Apps<sup style={{ color: "red" }}>*</sup></label>
                      <select
                        className="select2 w-100"
                        multiple="multiple"
                        data-placeholder="Select Apps.."
                        style={{ width: "100%" }}
                        ref={selectAppsReference}
                        value={appId}
                        onChange={(e) => setAppId(e.target.value)}
                      >
                        <option value="">--Select--</option>
                        {allAppsList.map((app) => (
                          <option key={"Mana_" + app.appID} value={app.appID}>{app.appName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="card-footer text-sm">
                  {isLoaderActive ? <PleaseWaitButton className='float-right btn-xs ml-2 font-weight-medium auth-form-btn' /> :
                    <button
                      type="submit"
                      className="btn btn-primary float-right btn-xs ml-2"
                      onClick={(e) => handleRoleSubmit(e)}
                    >
                      {isEditing ? 'Update' : 'Save & Submit'}
                    </button>
                  }
                  <button
                    type="submit"
                    className="btn btn-default float-right btn-xs"
                    onClick={(e) => handleCancelClick(e)}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title text-sm">Roles List ( {allRolesList.length} )<span
                    hover-tooltip='In this you can see the list of roles with selected apps in the table and edit, delete the roles with selected apps by using the action buttons.'
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
                      placeholder="Search by Role Name..."
                      onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  <table className="table table-bordered table-sm table-striped">
                    <thead>
                      <tr>
                        <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }} className='text-center'>Sr. No.</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Role Name</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>App Names</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRows.length > 0 ? (
                        currentRows.map((roleObj, index) => (
                          <tr key={roleObj.roleID}>
                            <td className="text-center text-sm">{indexOfFirstRow + index + 1}</td>
                            <td>{roleObj.roleName}</td>
                            <td>{cteateAttachmentHTML(roleObj.appIDList)}</td>
                            <td className="text-center text-sm">
                              <button type="button" className="btn btn-outline-primary btn-xs" onClick={() => handleEditRoleDetails(roleObj)}>
                                <i className="fas fa-pen"></i>
                              </button>
                              <button type="button" className="btn btn-outline-danger btn-xs ml-2" onClick={() => handleRemoveRole(roleObj)}>
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4" className="text-center">No roles found</td></tr>
                      )}
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-between mt-2">
                    <div>
                      Showing {startEntry} to {endEntry} of {filteredRoles.length} entries
                    </div>
                    <div>
                      <button
                        className="btn btn-xs btn-outline-primary"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="fas fa-angle-double-left"></i>
                      </button>
                      <span className="mx-2">Page {currentPage} of {totalPages}</span>
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
      </section>

      <div id="confirmCommonModal" className="modal fade confirmCommonModal" data-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-confirm">
          <div className="modal-content">
            <div className="modal-header">
              <div className="icon-box">
                {/* <i className="fas fa-info"></i> */}
              </div>
              <h5 className="modal-title w-100 text-center">Are you sure ?</h5>
            </div>
            <div className="modal-body">
              <p className="text-center">By clicking on Yes delete all the role details. Once you deleted it can not be recovered.</p>
            </div>
            <div className="modal-footer col-md-12">
              <button className="btn btn-default btn-sm" data-dismiss="modal">Cancel</button>
              {isLoaderActive ? <PleaseWaitButton className='btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn' /> :
                <button className="btn btn-warning btn-sm pl-3 pr-3 ml-2" onClick={(e) => yesConfirmSubmitRequest(e)}>Yes</button>
              }
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}

export default RoleswithApps;