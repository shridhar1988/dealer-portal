// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import PleaseWaitButton from '../../shared/PleaseWaitButton';
// import config from "../../config/config.json";

// const RequisitionsTable = () => {
//   const [allRequisitions, setAllRequisitions] = useState([]);
//   const [isLoaderActive, setIsLoaderActive] = useState(false);
//   const [selectedMaterials, setSelectedMaterials] = useState([]);
//   const [selectedRetailer, setSelectedRetailer] = useState("");
//   const [requisitionArray, setRequisitionArray] = useState([]);
//   const [addNewSectionsDisplay, setAddNewSectionsDisplay] = useState(false);
//   const [allUsersList, setAllUsersList] = useState([]);
//   const [materialList, setMaterialList] = useState([]);
//     const [updateOrDeleteId, setUpdateOrDeleteId] = useState("");

//      const [isEditing, setIsEditing] = useState(false);  

//   const inputRetailerReference = useRef(null);

  
//   const holidatecomponent = useRef([]);

 
//   useEffect(() => {
//     //fetchUsers();
//     getUsersList()
//   getAllMaterials()
//     getAllRequisitions();
//   }, []);
// const getUsersList = () => {
//     setIsLoaderActive(true);
//     window.initDestroyDataTableFuncation();
//     axios
//       .get(config.API_URL + "RetailerUserCreation/GetAllRetailerUsers")
//       .then((response) => {
//         if (response.status == 200) {
//           if (response.data.success == "success") {
//             if (response.data.data.length > 0) {
//               setAllUsersList(response.data.data);
//               setTimeout(() => {
//                 window.initDataTableFuncation();
//               }, 1000);
//             }
//           } else {
//             toast.error(response.data.message);
//             setTimeout(() => {
//               window.initDataTableFuncation();
//             }, 1000);
//           }
//         } else if (response.data.status.status == 500) {
//           toast.error("Invalid username or password");
//         }
//       })
//       .catch((error) => {
//         toast.error("Please try again later.");
//       })
//       .finally(() => {
//         setIsLoaderActive(false);
//       });
//   };

//  const getAllMaterials = () => {
//     setIsLoaderActive(true);
//     axios
//       .get(config.API_URL + "Requisition/GetAllMaterials", {
//         headers: config.headers2,
//       })
//       .then((response) => {
//         if (response.status === 200 && response.data.success === "True") {
//           setMaterialList(response.data.data || []);
//         } else {
//           toast.error(response.data.message || "Failed to fetch plants.");
//         }
//       })
//       .catch(() => {
//         toast.error("Please try again later.");
//       })
//       .finally(() => {
//         setIsLoaderActive(false);
//       });
//   };
//   const handleMaterialCodeChange = (value, index) => {
//     const selectedMaterial = materialList.find(
//       (item) => item.materialCode === value
//     );
//     if (selectedMaterial) {
//       const updatedArray = [...requisitionArray];
//       updatedArray[index].MaterialCode = selectedMaterial.materialCode;
//       updatedArray[index].MaterialName = selectedMaterial.materialName;
//       setRequisitionArray(updatedArray);
//     }
//   };

//   const getAllRequisitions = () => {
//     setIsLoaderActive(true);
//     window.initDestroyDataTableFuncation?.(); // Optional: Assuming defined globally
//     axios
//       .get(config.API_URL + "Requisition/GetAllRequisitions")
//       .then((response) => {
//         if (response.status === 200) {
//           if (response.data.success === "True") {
//             if (response.data.data.length > 0) {
//               setAllRequisitions(response.data.data);
//               setTimeout(() => {
//                 window.initDataTableFuncation?.(); // Optional: Assuming defined globally
//               }, 1000);
//             }
//           } else {
//             toast.error(response.data.message);
//             setTimeout(() => {
//               window.initDataTableFuncation?.();
//             }, 1000);
//           }
//         } else if (response.data.status?.status === 500) {
//           toast.error("Invalid username or password");
//         }
//       })
//       .catch((error) => {
//         toast.error("Please try again later.");
//       })
//       .finally(() => {
//         setIsLoaderActive(false);
//       });
//   };
// const yesConfirmSubmitRequest = () => {
    
//     setIsLoaderActive(true);
 
//     let APIMethodName = 'Requisition/DeleteRequisition?ClientId=' + config.ClientId + '&RequisitionID=' + updateOrDeleteId + '&loggedUserId=' + localStorage.getItem("loggedUserId")
//     axios.post(config.API_URL + APIMethodName, {
//       headers: config.headers2,
//     }).then((response) => {
  
//       if (response.data.success === "success") {
//      getAllRequisitions();
//         toast.success("Requisition deleted successfully...");
//         window.confirmModalHide();
   
      
//         setIsLoaderActive(false);
//       } else {
//         setIsLoaderActive(false);
//         getUsersList();
//         toast.error(response.data.message);
//       }
//     }).catch((error) => {
//       // if (!error.response.data.success) {
//       //   toast.error(error.response.data.message);
//       // } else {
//        // toast.error("Unable to delete the data please try again later.");
//       // }
//       setIsLoaderActive(false);
//     })
//   }
//   const MaterialyesConfirmSubmitRequest = () => {
    
//     setIsLoaderActive(true);
//     console.log("Requisition id", updateOrDeleteId)
//     let APIMethodName = 'Requisition/deleteRequisitionMaterials?id=' + updateOrDeleteId + '&modifiedBy=' + localStorage.getItem("loggedUserId")
//     axios.delete(config.API_URL + APIMethodName, {
//       headers: config.headers2,
//     }).then((response) => {
 
//       if (response.data.success === "True") {
//   getAllRequisitions();
//         toast.success("Materials deleted successfully...");
//         window.MaterialconfirmModalHide();
//         // clearAllFields();
      
//         setIsLoaderActive(false);
//       } else {
         
//         setIsLoaderActive(false);
//         getUsersList();     getAllRequisitions();
//         toast.error(response.data.message);
//       }
//     }).catch((error) => {
//       // if (!error.response.data.success) {
//       //   toast.error(error.response.data.message);
//       // } else {
//        // toast.error("Unable to delete the data please try again later.");
//       // }
//       setIsLoaderActive(false);
//     })
//   }
//   const handleRequisition = (requisition) => {
//     setUpdateOrDeleteId(requisition.id);
//     window.confirmModalShow();
//   };
//   const handleMaterials = (material) => {
  
//     setUpdateOrDeleteId(material.id);
//     window.MaterialconfirmModalShow();
//   };
//   const retailerChangehandler = (value) => {
//     setSelectedRetailer(value);
//     if(!selectedRetailer)
//     {
//         inputRetailerReference.focus();
//         inputRetailerReference.currentclassList.add("is-invalid");

//     }
//   };

//   const AddNewPayrollTemplateClickHandler = () => {
//     setAddNewSectionsDisplay(true);
//     setRequisitionArray([
//       {
//         MaterialCode: "",
//         MaterialName: "",
//         OrderQuantiy: "",
//         UOM: "",
//         ExpectedBy: "",
//       },
//     ]);
//   };

//   const cancleAddNewPayrollTemplateClickHandler = () => {
//     setAddNewSectionsDisplay(false);
//     setRequisitionArray([]);
//     setSelectedRetailer("");
//   };

//   const addRequisitionComponents = () => {
//     setRequisitionArray([
//       ...requisitionArray,
//       {
//         MaterialCode: "",
//         MaterialName: "",
//         OrderQuantiy: "",
//         UOM: "",
//         ExpectedBy: "",
//       },
//     ]);
//   };



//   const handleMaterialNameChange = (value, index) => {
//     const updatedArray = [...requisitionArray];
//     updatedArray[index].MaterialName = value;
//     setRequisitionArray(updatedArray);
//   };

//   const handleOrderQuantityChange = (e, index, field) => {
//     const updatedArray = [...requisitionArray];
//     updatedArray[index].OrderQuantiy = e.target.value;
//     setRequisitionArray(updatedArray);
//   };

//   const handleUOMChange = (value, index) => {
//     const updatedArray = [...requisitionArray];
//     updatedArray[index].UOM = value;
//     setRequisitionArray(updatedArray);
//   };

//   const handleExpectedDateChange = (e, index, field) => {
//     const updatedArray = [...requisitionArray];
//     updatedArray[index].ExpectedBy = e.target.value;
//     setRequisitionArray(updatedArray);
//   };

//   const removeComponentFromArray = (index) => {
//     const updatedArray = requisitionArray.filter((_, i) => i !== index);
//     setRequisitionArray(updatedArray);
//   };

//   const saveRequisitionTemplateClickHandler = async () => {
//     if (!selectedRetailer) {
//      inputRetailerReference.current.focus();
//      inputRetailerReference.current.classList.add("is-invalid");
//       toast.error("Please select a retailer.");
//       return;
//     }
 
//     if (requisitionArray.length === 0) {
//       toast.error("Please add at least one material.");
//       return;
//     }
//     for (const material of requisitionArray) {
//       if (
//         !material.MaterialCode ||
//         !material.MaterialName ||
//         !material.OrderQuantiy ||
//         !material.UOM ||
//         !material.ExpectedBy
//       ) {
//         toast.error("Please fill all material fields.");
//         return;
//       }
//     }

//     const payload = {
//       id: 0,
//       retailerId: selectedRetailer,
//       isActive: true,
//       materials: requisitionArray.map((material) => ({
//         requisitionId: 0,
//         materialCode: material.MaterialCode,
//         materialName: material.MaterialName,
//         orderQuantiy: material.OrderQuantiy,
//         uom: material.UOM,
//         expectedBy: material.ExpectedBy,
//         status: true,
//       })),
//       userId: localStorage.getItem("loggedUserId"), // Replace with actual user ID from auth context
//     };

//     setIsLoaderActive(true);
//     try {
//       const response = await axios.post(
//         config.API_URL + "Requisition/CreateRequisition",
//         payload
//       );
//       if (response.status === 200 && response.data.success === "True") {
//         toast.success("Requisition created successfully!");
//         setAddNewSectionsDisplay(false);
//         setRequisitionArray([]);
//         setSelectedRetailer("");
//         getAllRequisitions(); // Refresh the requisition list
//       } else {
//         toast.error(response.data.message || "Failed to create requisition.");
//       }
//     } catch (error) {
//       toast.error("Error creating requisition. Please try again later.");
//     } finally {
//       setIsLoaderActive(false);
//     }
//   };

//   const handleViewMaterials = (materials) => {
//     setSelectedMaterials(materials);
//     window.$("#materialsModal").modal("show"); // Bootstrap modal trigger
//   };

//   return (
//     <>
//       {/* Content Header */}
//       <div className="content-header">
//         <div className="container-fluid">
//           <div className="row mb-2">
//             <div className="col-sm-6">
//               <h5 className="m-0">Create Requisition</h5>
//             </div>
//             <div className="col-sm-6"></div>
//           </div>
//         </div>
//       </div>

//       {/* Create Requisition Form */}
//       <div className="container-fluid">
//         <div className="col-md-12">
//           <div className="card card-collapsed">
//             <div className="card-header">
//               <div className="row align-items-center">
//                 <div className="col-md-6">
//                   <h4 className="card-title">Select Retailer</h4>
//                   <select
//                     className="form-control form-control-sm w-50 ml-2"
//                     id="userRoleNameInput"
//                     style={{ display: "inline-block" }}
//                   ref={inputRetailerReference}
//                     value={selectedRetailer}
//                     //onChange={(e) => retailerChangehandler(e.target.value)}
//                      onChange={(e) => {
//                           setSelectedRetailer(e.target.value);
//                           inputRetailerReference.current.classList.remove(
//                             "is-invalid"
//                           );
//                         }}
//                   >
//                     <option value="">--Select--</option>
//                     {allUsersList.map((user) => (
//                       <option key={user.userID} value={user.userID}>
//                         {user.userName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div className="col-md-6 float-right">
//                   <div className="card-tools float-right mt-1">
//                     <button
//                       type="button"
//                       className="btn btn-tool"
//                       data-card-widget="maximize"
//                     >
//                       <i className="fas fa-expand"></i>
//                     </button>
//                   </div>
//                   {isLoaderActive ? (
//                     <button
//                       className="btn btn-sm float-right btn-primary mr-1 pr-4 pl-4"
//                       disabled
//                     >
//                       <i className="fas fa-sync-alt fa-spin"></i> Loading...
//                     </button>
//                   ) : !addNewSectionsDisplay ? (
//                     <button
//                       className="btn btn-sm float-right btn-primary mr-1 pr-4 pl-4"
//                       type="button"
//                       onClick={AddNewPayrollTemplateClickHandler}
//                     >
//                       Add Requisition Details
//                     </button>
//                   ) : (
//                     <>
//                       <button
//                         className="btn btn-sm float-right btn-default mr-1"
//                         onClick={cancleAddNewPayrollTemplateClickHandler}
//                         type="button"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         className="btn btn-sm float-right btn-primary mr-2"
//                         onClick={saveRequisitionTemplateClickHandler}
//                         type="button"
//                       >
//                         Save Requisition
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="card-body position-relative">
//               {isLoaderActive && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "100%",
//                     backgroundColor: "rgb(233 236 239 / 81%)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     zIndex: 10,
//                   }}
//                 >
//                   <i
//                     className="fas fa-sync-alt fa-spin"
//                     style={{ fontSize: "2rem", color: "#333" }}
//                   ></i>
//                 </div>
//               )}
//               {addNewSectionsDisplay && (
//                 <div className="row">
//                   <div className="col-md-12 mt-3">
//                     <div className="table-responsive">
//                       <table
//                         id="faqs"
//                         className="table table-bordered table-sm"
//                       >
//                         <thead>
//                           <tr className="text-sm">
//                             <th width="2%"></th>
//                             <th width="5%">Sr. No.</th>
//                             <th width="12%">Material Code</th>
//                             <th width="12%">Material Name</th>
//                             <th width="12%">Order Quantity</th>
//                             <th width="12%">UOM</th>
//                             <th width="12%">Expected By</th>
//                             <th width="6%">Action</th>
//                           </tr>
//                         </thead>
//                         <tbody id="tblBodyId">
//                           {requisitionArray.length > 0 &&
//                             requisitionArray.map((data, index) => (
//                               <tr key={index}>
//                                 <td
//                                   className="text-center"
//                                   style={{ background: "#238edc" }}
//                                 >
//                                   <span className="handle ui-sortable-handle mt-5">
//                                     <i className="fas fa-ellipsis-v"></i>
//                                     <i className="fas fa-ellipsis-v"></i>
//                                   </span>
//                                 </td>
//                                 <td>{index + 1}</td>
//                                 <td>
//                                   <select
//                                     className="form-control form-control-sm"
//                                     value={data.MaterialCode || ""}
//                                     onChange={(e) =>
//                                       handleMaterialCodeChange(
//                                         e.target.value,
//                                         index
//                                       )
//                                     }
//                                   >
//                                     <option value="">--Select--</option>
//                                     {materialList.map((item) => (
//                                       <option
//                                         key={item.id}
//                                         value={item.materialCode}
//                                       >
//                                         {item.materialCode}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </td>
//                                 <td>
//                                   <select
//                                     className="form-control form-control-sm"
//                                     value={data.MaterialName || ""}
//                                     onChange={(e) =>
//                                       handleMaterialNameChange(
//                                         e.target.value,
//                                         index
//                                       )
//                                     }
//                                   >
//                                     <option value="">--Select--</option>
//                                     {materialList.map((item) => (
//                                       <option
//                                         key={item.id}
//                                         value={item.materialName}
//                                       >
//                                         {item.materialName}
//                                       </option>
//                                     ))}
//                                   </select>
//                                 </td>
//                                 <td>
//                                   <input
//                                     type="text"
//                                     name="orderQuantityInput"
//                                     placeholder="Enter Quantity"
//                                     value={data.OrderQuantiy || ""}
//                                     onChange={(e) =>
//                                       handleOrderQuantityChange(e, index)
//                                     }
//                                     className="form-control form-control-sm"
//                                   />
//                                 </td>
//                                 <td>
//                                   <select
//                                     className="form-control form-control-sm"
//                                     value={data.UOM || ""}
//                                     onChange={(e) =>
//                                       handleUOMChange(e.target.value, index)
//                                     }
//                                   >
//                                     <option value="">--Select--</option>
//                                     <option value="EA">Each</option>
//                                     <option value="KG">Kilogram</option>
//                                     <option value="G">Gram</option>
//                                     <option value="L">Liter</option>
//                                   </select>
//                                 </td>
//                                 <td>
//                                   <input
//                                     type="date"
//                                     name="expectedDateInput"
//                                     placeholder="Select Date"
//                                     value={data.ExpectedBy || ""}
//                                     onChange={(e) =>
//                                       handleExpectedDateChange(e, index)
//                                     }
//                                     className="form-control form-control-sm"
//                                   />
//                                 </td>
//                                 <td>
//                                   <span
//                                     className="btn btn-outline-danger btn-sm cursor-pointer"
//                                     onClick={() =>
//                                       removeComponentFromArray(index)
//                                     }
//                                     title="Delete"
//                                   >
//                                     <i className="fas fa-trash"></i>
//                                   </span>
//                                 </td>
//                               </tr>
//                             ))}
//                         </tbody>
//                       </table>
//                     </div>
//                     <div className="text-right">
//                       <button
//                         onClick={addRequisitionComponents}
//                         className="btn btn-sm float-right btn-light"
//                       >
//                         + Add New Requisition Material
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Requisition List */}
//       <div className="row" style={{ marginRight: "7px", marginLeft: "7px" }}>
//         <div className="col-md-12">
//           <div className="card">
//             <div className="card-header">
//               <h3 className="card-title text-sm">
//                 Requisition List ( {allRequisitions.length} )
//               </h3>
//               <div className="card-tools">
//                 <button
//                   type="button"
//                   className="btn btn-tool"
//                   data-card-widget="collapse"
//                 >
//                   <i className="fas fa-minus"></i>
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-tool"
//                   data-card-widget="maximize"
//                 >
//                   <i className="fas fa-expand"></i>
//                 </button>
//               </div>
//             </div>
//             <div className="card-body text-sm position-relative">
//               {isLoaderActive && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "100%",
//                     backgroundColor: "rgb(233 236 239 / 81%)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     zIndex: 10,
//                   }}
//                 >
//                   <i
//                     className="fas fa-sync-alt fa-spin"
//                     style={{ fontSize: "2rem", color: "#333" }}
//                   ></i>
//                 </div>
//               )}
//               <table className="table table-bordered table-sm table-striped">
//                 <thead>
//                   <tr>
//                     <th
//                       style={{ fontWeight: "500", fontSize: "smaller" }}
//                       className="text-center"
//                     >
//                       Sr. No.
//                     </th>
//                     <th style={{ fontWeight: "500", fontSize: "smaller" }}>
//                       Requisition ID
//                     </th>
//                     <th style={{ fontWeight: "500", fontSize: "smaller" }}>
//                       Retailer Name
//                     </th>
//                     <th style={{ fontWeight: "500", fontSize: "smaller" }}>
//                       Requested By
//                     </th>
//                     <th style={{ fontWeight: "500", fontSize: "smaller" }}>
//                       Status
//                     </th>
//                     <th style={{ fontWeight: "500", fontSize: "smaller" }}>
//                       Active
//                     </th>
//                     <th
//                       style={{
//                         fontWeight: "500",
//                         fontSize: "smaller",
//                         width: "7%",
//                       }}
//                     >
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {allRequisitions.length > 0 ? (
//                     allRequisitions.map((requisition, index) => (
//                       <tr
//                         key={requisition.id}
//                         style={{
//                           textDecoration: requisition.isActive
//                             ? "none"
//                             : "line-through",
//                         }}
//                       >
//                         <td
//                           style={{ fontWeight: "400", fontSize: "smaller" }}
//                           className="text-center text-sm"
//                         >
//                           {index + 1}
//                         </td>
//                         <td style={{ fontWeight: "400", fontSize: "smaller" }}>
//                           {requisition.id || "N/A"}
//                         </td>
//                         <td style={{ fontWeight: "400", fontSize: "smaller" }}>
//                           {requisition.retailerName || "N/A"}
//                         </td>
//                         <td style={{ fontWeight: "400", fontSize: "smaller" }}>
//                           {requisition.requestedBy || "N/A"}
//                         </td>
//                         <td style={{ fontWeight: "400", fontSize: "smaller" }}>
//                           {requisition.requisitionStatus
//                             ? "Processed"
//                             : "Pending"}
//                         </td>
//                         <td style={{ fontWeight: "400", fontSize: "smaller" }}>
//                           {requisition.isActive ? "Active" : "Inactive"}
//                         </td>
//                        <td style={{ fontWeight: "400", fontSize: "smaller", display: "flex", gap: "8px", alignItems: "center" }}>
//   <button
//     type="button"
//     className="btn bg-gradient-primary btn-xs"
//     style={{ padding: "8px", fontSize: ".75rem", lineHeight: "0", borderRadius: "50%" }}
//   >
//     <i className="fas fa-pen" style={{ fontSize: "smaller" }}></i>
//   </button>
//   <button
//     type="button"
//     className="btn bg-gradient-primary btn-xs"
//     onClick={() => handleViewMaterials(requisition.materials)}
//     style={{ padding: "8px", fontSize: ".75rem", lineHeight: "0", borderRadius: "50%" }}
//   >
//     <i className="fas fa-eye" style={{ fontSize: "smaller" }}></i>
//   </button>
//   {requisition.isActive && (
//     <button
//       type="button"
//       className="btn bg-gradient-danger btn-xs"
//       onClick={() => handleRequisition(requisition)}
//       style={{ padding: "8px", fontSize: ".75rem", lineHeight: "0", borderRadius: "50%" }}
//     >
//       <i className="fas fa-trash" style={{ fontSize: "smaller" }}></i>
//     </button>
//   )}
// </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="7" className="text-center">
//                         No requisitions found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Materials Modal */}
//       <div
//         className="modal fade"
//         id="materialsModal"
//         tabIndex="-1"
//         role="dialog"
//         aria-labelledby="materialsModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-lg" role="document">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title" id="materialsModalLabel">
//                 Materials Details
//               </h5>
//               <button
//                 type="button"
//                 className="close"
//                 data-dismiss="modal"
//                 aria-label="Close"
//               >
//                 <span aria-hidden="true">×</span>
//               </button>
//             </div>
//             <div className="modal-body">
//               <table className="table table-bordered">
//                 <thead>
//                   <tr>
//                     <th>Material Code</th>
//                     <th>Material Name</th>
//                     <th>Order Quantity</th>
//                     <th>UOM</th>
//                     <th>Expected By</th>
//                     <th>Status</th>
//                      <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedMaterials.length > 0 ? (
//                     selectedMaterials.map((material, index) => (
//                       <tr key={index}>
//                         <td>{material.materialCode || "N/A"}</td>
//                         <td>{material.materialName || "N/A"}</td>
//                         <td>{material.orderQuantiy || "N/A"}</td>
//                         <td>{material.uom || "N/A"}</td>
//                         <td>{material.expectedBy || "N/A"}</td>
//                         <td>{material.status ? "Active" : "Inactive"}</td>
//                             <td style={{ fontWeight: "400", fontSize: "smaller" }}>
                        
                          
           
//                                     <button
//                                       type="button"
//                                       class="btn bg-gradient-danger btn-xs ml-2"
//                                       onClick={(e) => {
//                                         handleMaterials(material);
//                                       }}
//                                       style={{
//                                         padding: "5px",
//                                         fontSize: ".75rem",
//                                         lineHeight: "0",
//                                         borderRadius: ".15rem",
//                                       }}
//                                     >
//                                       <i
//                                         class="fas fa-trash"
//                                         style={{ fontSize: "smaller" }}
//                                       ></i>
//                                     </button>
                                  
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="6" className="text-center">
//                         No materials found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 data-dismiss="modal"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//  <div id="confirmCommonModal" class="modal fade confirmCommonModal" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
//         <div class="modal-dialog modal-confirm">
//           <div class="modal-content">
//             <div class="modal-header text-center">
//               <div class="icon-box">
//                 {/* <i class="fas fa-info mt-2"></i> */}
//               </div>
//               <h5 class="modal-title w-100">Are you sure ?</h5>
//             </div>
//             <div class="modal-body">
//               <p class="text-center">By clicking on Yes delete all the user details. Once you deleted it can not be recovered.</p>
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


//        <div id="MaterialconfirmCommonModal" class="modal fade MaterialconfirmCommonModal" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
//         <div class="modal-dialog modal-confirm">
//           <div class="modal-content">
//             <div class="modal-header text-center">
//               <div class="icon-box">
//                 {/* <i class="fas fa-info mt-2"></i> */}
//               </div>
//               <h5 class="modal-title w-100"> Are you sure ?</h5>
//             </div>
//             <div class="modal-body">
//               <p class="text-center">By clicking on Yes delete all the user details. Once you deleted it can not be recovered.</p>
//             </div>
//             <div class="modal-footer col-md-12">
//               <button class="btn btn-default btn-sm" data-dismiss="modal">Cancel</button>
//               {isLoaderActive ? <PleaseWaitButton className='btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn' /> :
//                 <button class="btn btn-warning btn-sm pl-3 pr-3 ml-2" onClick={(e) => { MaterialyesConfirmSubmitRequest(e) }}>Yes</button>
//               }
//             </div>
//           </div>
//         </div>
//       </div>
//       <ToastContainer position="top-center" />
//     </>
//   );
// };

// export default RequisitionsTable;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PleaseWaitButton from '../../shared/PleaseWaitButton';
import config from "../../config/config.json";

const RequisitionsTable = () => {
  const [allRequisitions, setAllRequisitions] = useState([]);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState("");
  const [requisitionArray, setRequisitionArray] = useState([]);
  const [addNewSectionsDisplay, setAddNewSectionsDisplay] = useState(false);
  const [allUsersList, setAllUsersList] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [updateOrDeleteId, setUpdateOrDeleteId] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const inputRetailerReference = useRef(null);
  const holidatecomponent = useRef([]);

  useEffect(() => {
    getUsersList();
    getAllMaterials();
    getAllRequisitions();
  }, []);

  const getUsersList = () => {
    setIsLoaderActive(true);
    window.initDestroyDataTableFuncation?.();
    axios
      .get(config.API_URL + "RetailerUserCreation/GetAllRetailerUsers")
      .then((response) => {
        if (response.status === 200) {
          if (response.data.success === "success") {
            if (response.data.data.length > 0) {
             setAllUsersList(response.data.data.filter(x=>x.createdBy == localStorage.getItem("loggedUserId")));
              setTimeout(() => {
                window.initDataTableFuncation?.();
              }, 1000);
            }
          } else {
            toast.error(response.data.message);
            setTimeout(() => {
              window.initDataTableFuncation?.();
            }, 1000);
          }
        } else if (response.data.status?.status === 500) {
          toast.error("Invalid username or password");
        }
      })
      .catch((error) => {
        toast.error("Please try again later.");
      })
      .finally(() => {
        setIsLoaderActive(false);
      });
  };

  const getAllMaterials = () => {
    setIsLoaderActive(true);
    axios
      .get(config.API_URL + "Requisition/GetAllMaterials", {
        headers: config.headers2,
      })
      .then((response) => {
        if (response.status === 200 && response.data.success === "True") {
          setMaterialList(response.data.data || []);
        } else {
          toast.error(response.data.message || "Failed to fetch materials.");
        }
      })
      .catch(() => {
        toast.error("Please try again later.");
      })
      .finally(() => {
        setIsLoaderActive(false);
      });
  };

  const getAllRequisitions = () => {
    setIsLoaderActive(true);
    window.initDestroyDataTableFuncation?.();
    axios
      .get(config.API_URL + "Requisition/GetAllRequisitions")
      .then((response) => {
        if (response.status === 200) {
          if (response.data.success === "True") {
            if (response.data.data.length > 0) {
              setAllRequisitions(response.data.data);
              setTimeout(() => {
                window.initDataTableFuncation?.();
              }, 1000);
            }
          } else {
            // toast.error(response.data.message);
            // console.log('rewq',response.data.message)
            setTimeout(() => {
              window.initDataTableFuncation?.();
            }, 1000);
          }
        } else if (response.data.status?.status === 500) {
          toast.error("Invalid username or password");
        }
      })
      .catch((error) => {
        toast.error("Please try again later.");
      })
      .finally(() => {
        setIsLoaderActive(false);
      });
  };

  const handleEditRequisition = (requisition) => {
    setIsEditing(true);
    setUpdateOrDeleteId(requisition.id);
    setSelectedRetailer(requisition.retailerId);
    setRequisitionArray(
      requisition.materials.map((material) => ({
        MaterialCode: material.materialCode,
        MaterialName: material.materialName,
        OrderQuantiy: material.orderQuantiy,
        UOM: material.uom,
        ExpectedBy: material.expectedBy,
      }))
    );
    setAddNewSectionsDisplay(true);
    if (inputRetailerReference.current) {
      inputRetailerReference.current.classList.remove("is-invalid");
    }
  };

  const yesConfirmSubmitRequest = () => {
    setIsLoaderActive(true);
    let APIMethodName = `Requisition/DeleteRequisition?ClientId=${config.ClientId}&RequisitionID=${updateOrDeleteId}&loggedUserId=${localStorage.getItem("loggedUserId")}`;
    axios
      .post(config.API_URL + APIMethodName, {}, { headers: config.headers2 })
      .then((response) => {
        if (response.data.success === "success") {
          getAllRequisitions();
          toast.success("Requisition deleted successfully...");
          window.confirmModalHide();
        } else {
          toast.error(response.data.message);
          getUsersList();
        }
      })
      .catch((error) => {
        toast.error("Unable to delete the data please try again later.");
      })
      .finally(() => {
        setIsLoaderActive(false);
      });
  };

  const MaterialyesConfirmSubmitRequest = () => {
    setIsLoaderActive(true);
    let APIMethodName = `Requisition/deleteRequisitionMaterials?id=${updateOrDeleteId}&modifiedBy=${localStorage.getItem("loggedUserId")}`;
    axios
      .delete(config.API_URL + APIMethodName, { headers: config.headers2 })
      .then((response) => {
        if (response.data.success === "True") {
          getAllRequisitions();
          toast.success("Materials deleted successfully...");
          window.MaterialconfirmModalHide();
        } else {
          toast.error(response.data.message);
          getUsersList();
          getAllRequisitions();
        }
      })
      .catch((error) => {
        toast.error("Unable to delete the data please try again later.");
      })
      .finally(() => {
        setIsLoaderActive(false);
      });
  };

  const handleRequisition = (requisition) => {
    setUpdateOrDeleteId(requisition.id);
    window.confirmModalShow();
  };

  const handleMaterials = (material) => {
    setUpdateOrDeleteId(material.id);
    window.MaterialconfirmModalShow();
  };

  const handleMaterialCodeChange = (value, index) => {
    const selectedMaterial = materialList.find(
      (item) => item.materialCode === value
    );
    if (selectedMaterial) {
      const updatedArray = [...requisitionArray];
      updatedArray[index].MaterialCode = selectedMaterial.materialCode;
      updatedArray[index].MaterialName = selectedMaterial.materialName;
      setRequisitionArray(updatedArray);
    }
  };

  const handleMaterialNameChange = (value, index) => {
    const updatedArray = [...requisitionArray];
    updatedArray[index].MaterialName = value;
    setRequisitionArray(updatedArray);
  };

  const handleOrderQuantityChange = (e, index) => {
    const updatedArray = [...requisitionArray];
    updatedArray[index].OrderQuantiy = e.target.value;
    setRequisitionArray(updatedArray);
  };

  const handleUOMChange = (value, index) => {
    const updatedArray = [...requisitionArray];
    updatedArray[index].UOM = value;
    setRequisitionArray(updatedArray);
  };

  const handleExpectedDateChange = (e, index) => {
    const updatedArray = [...requisitionArray];
    updatedArray[index].ExpectedBy = e.target.value;
    setRequisitionArray(updatedArray);
  };

  const removeComponentFromArray = (index) => {
    const updatedArray = requisitionArray.filter((_, i) => i !== index);
    setRequisitionArray(updatedArray);
  };

  const AddNewPayrollTemplateClickHandler = () => {
    setAddNewSectionsDisplay(true);
    setIsEditing(false);
    setUpdateOrDeleteId("");
    setSelectedRetailer("");
    setRequisitionArray([
      {
        MaterialCode: "",
        MaterialName: "",
        OrderQuantiy: "",
        UOM: "",
        ExpectedBy: "",
      },
    ]);
  };

  const cancleAddNewPayrollTemplateClickHandler = () => {
    setAddNewSectionsDisplay(false);
    setIsEditing(false);
    setUpdateOrDeleteId("");
    setRequisitionArray([]);
    setSelectedRetailer("");
    if (inputRetailerReference.current) {
      inputRetailerReference.current.classList.remove("is-invalid");
    }
  };

  const addRequisitionComponents = () => {
    setRequisitionArray([
      ...requisitionArray,
      {
        MaterialCode: "",
        MaterialName: "",
        OrderQuantiy: "",
        UOM: "",
        ExpectedBy: "",
      },
    ]);
  };

  const saveRequisitionTemplateClickHandler = async () => {
    if (!selectedRetailer) {
      inputRetailerReference.current.focus();
      inputRetailerReference.current.classList.add("is-invalid");
      toast.error("Please select a retailer.");
      return;
    }

    if (requisitionArray.length === 0) {
      toast.error("Please add at least one material.");
      return;
    }

    for (const material of requisitionArray) {
      if (
        !material.MaterialCode ||
        !material.MaterialName ||
        !material.OrderQuantiy ||
        !material.UOM ||
        !material.ExpectedBy
      ) {
        toast.error("Please fill all material fields.");
        return;
      }
    }

    const payload = {
      id: isEditing ? parseInt(updateOrDeleteId) : 0,
      retailerId: selectedRetailer,
      isActive: true,
      materials: requisitionArray.map((material) => ({
        requisitionId: isEditing ? parseInt(updateOrDeleteId) : 0,
        materialCode: material.MaterialCode,
        materialName: material.MaterialName,
        orderQuantiy: material.OrderQuantiy,
        uom: material.UOM,
        expectedBy: material.ExpectedBy,
        status: true,
      })),
      userId: localStorage.getItem("loggedUserId"),
    };

    setIsLoaderActive(true);
    try {
      const endpoint = isEditing ? "Requisition/UpdateRequisition" : "Requisition/CreateRequisition";
      const response = await axios.post(config.API_URL + endpoint, payload, {
        headers: config.headers2,
      });
      if (response.status === 200 && response.data.success === "True") {
        toast.success(
          isEditing ? "Requisition updated successfully!" : "Requisition created successfully!"
        );
        setAddNewSectionsDisplay(false);
        setIsEditing(false);
        setUpdateOrDeleteId("");
        setRequisitionArray([]);
        setSelectedRetailer("");
        getAllRequisitions();
      } else {
        toast.error(response.data.message || `Failed to ${isEditing ? "update" : "create"} requisition.`);
      }
    } catch (error) {
      toast.error(`Error ${isEditing ? "updating" : "creating"} requisition. Please try again later.`);
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleViewMaterials = (materials) => {
    setSelectedMaterials(materials);
    window.$("#materialsModal").modal("show");
  };

  return (
    <>
      {/* Content Header */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h5 className="m-0">Create Requisition</h5>
            </div>
            <div className="col-sm-6"></div>
          </div>
        </div>
      </div>

      {/* Create Requisition Form */}
      <div className="container-fluid">
        <div className="col-md-12">
          <div className="card card-collapsed">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h4 className="card-title">Select Retailer</h4>
                  <select
                    className="form-control form-control-sm w-50 ml-2"
                    id="userRoleNameInput"
                    style={{ display: "inline-block" }}
                    ref={inputRetailerReference}
                    value={selectedRetailer}
                    onChange={(e) => {
                      setSelectedRetailer(e.target.value);
                      inputRetailerReference.current.classList.remove("is-invalid");
                    }}
                  >
                    <option value="">--Select--</option>
                    {allUsersList.filter(x=>x.isActive===true).map((user) => (
                      <option key={user.userID} value={user.userID}>
                        {user.userName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 float-right">
                  <div className="card-tools float-right mt-1">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="maximize"
                    >
                      <i className="fas fa-expand"></i>
                    </button>
                  </div>
                  {isLoaderActive ? (
                    <button
                      className="btn btn-sm float-right btn-primary mr-1 pr-4 pl-4"
                      disabled
                    >
                      <i className="fas fa-sync-alt fa-spin"></i> Loading...
                    </button>
                  ) : !addNewSectionsDisplay ? (
                    <button
                      className="btn btn-sm float-right btn-primary mr-1 pr-4 pl-4"
                      type="button"
                      onClick={AddNewPayrollTemplateClickHandler}
                    >
                      Add Requisition Details
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm float-right btn-default mr-1"
                        onClick={cancleAddNewPayrollTemplateClickHandler}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-sm float-right btn-primary mr-2"
                        onClick={saveRequisitionTemplateClickHandler}
                        type="button"
                      >
                        {isEditing ? "Update Requisition" : "Save Requisition"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="card-body position-relative">
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
              {addNewSectionsDisplay && (
                <div className="row">
                  <div className="col-md-12 mt-3">
                    <div className="table-responsive">
                      <table id="faqs" className="table table-bordered table-sm">
                        <thead>
                          <tr className="text-sm">
                            <th width="2%"></th>
                            <th width="5%">Sr. No.</th>
                            <th width="12%">Material Code</th>
                            <th width="12%">Material Name</th>
                            <th width="12%">Order Quantity</th>
                            <th width="12%">UOM</th>
                            <th width="12%">Expected By</th>
                            <th width="6%">Action</th>
                          </tr>
                        </thead>
                        <tbody id="tblBodyId">
                          {requisitionArray.length > 0 &&
                            requisitionArray.map((data, index) => (
                              <tr key={index}>
                                <td
                                  className="text-center"
                                  style={{ background: "#238edc" }}
                                >
                                  <span className="handle ui-sortable-handle mt-5">
                                    <i className="fas fa-ellipsis-v"></i>
                                    <i className="fas fa-ellipsis-v"></i>
                                  </span>
                                </td>
                                <td>{index + 1}</td>
                                <td>
                                  <select
                                    className="form-control form-control-sm"
                                    value={data.MaterialCode || ""}
                                    onChange={(e) =>
                                      handleMaterialCodeChange(e.target.value, index)
                                    }
                                  >
                                    <option value="">--Select--</option>
                                    {materialList.map((item) => (
                                      <option key={item.id} value={item.materialCode}>
                                        {item.materialCode}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td>
                                  <select
                                    className="form-control form-control-sm"
                                    value={data.MaterialName || ""}
                                    onChange={(e) =>
                                      handleMaterialNameChange(e.target.value, index)
                                    }
                                  >
                                    <option value="">--Select--</option>
                                    {materialList.map((item) => (
                                      <option key={item.id} value={item.materialName}>
                                        {item.materialName}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    name="orderQuantityInput"
                                    placeholder="Enter Quantity"
                                    value={data.OrderQuantiy || ""}
                                    onChange={(e) => handleOrderQuantityChange(e, index)}
                                    className="form-control form-control-sm"
                                  />
                                </td>
                                <td>
                                  <select
                                    className="form-control form-control-sm"
                                    value={data.UOM || ""}
                                    onChange={(e) => handleUOMChange(e.target.value, index)}
                                  >
                                    <option value="">--Select--</option>
                                    <option value="EA">Each</option>
                                    <option value="KG">Kilogram</option>
                                    <option value="G">Gram</option>
                                    <option value="L">Liter</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="date"
                                    name="expectedDateInput"
                                    placeholder="Select Date"
                                    value={data.ExpectedBy || ""}
                                    onChange={(e) => handleExpectedDateChange(e, index)}
                                    className="form-control form-control-sm"
                                  />
                                </td>
                                <td>
                                  <span
                                    className="btn btn-outline-danger btn-sm cursor-pointer"
                                    onClick={() => removeComponentFromArray(index)}
                                    title="Delete"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={addRequisitionComponents}
                        className="btn btn-sm float-right btn-light"
                      >
                        + Add New Requisition Material
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Requisition List */}
      <div className="row" style={{ marginRight: "7px", marginLeft: "7px" }}>
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title text-sm">
                Requisition List ( {allRequisitions.length} )
              </h3>
              <div className="card-tools">
                <button type="button" className="btn btn-tool" data-card-widget="collapse">
                  <i className="fas fa-minus"></i>
                </button>
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
              <table className="table table-bordered table-sm table-striped">
                <thead>
                  <tr>
                    <th
                      style={{ fontWeight: "500", fontSize: "smaller" }}
                      className="text-center"
                    >
                      Sr. No.
                    </th>
                    <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                      Requisition ID
                    </th>
                    <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                      Retailer Name
                    </th>
                    <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                      Requested By
                    </th>
                    <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                      Status
                    </th>
                    <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                      Active
                    </th>
                    <th
                      style={{ fontWeight: "500", fontSize: "smaller", width: "7%" }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allRequisitions.length > 0 ? (
                    allRequisitions.map((requisition, index) => (
                      <tr
                        key={requisition.id}
                        style={{
                          textDecoration: requisition.isActive ? "none" : "line-through",
                        }}
                      >
                        <td
                          style={{ fontWeight: "400", fontSize: "smaller" }}
                          className="text-center text-sm"
                        >
                          {index + 1}
                        </td>
                        <td style={{ fontWeight: "400", fontSize: "smaller" }}>
                          {requisition.id || "N/A"}
                        </td>
                        <td style={{ fontWeight: "400", fontSize: "smaller" }}>
                          {requisition.retailerName || "N/A"}
                        </td>
                        <td style={{ fontWeight: "400", fontSize: "smaller" }}>
                          {requisition.requestedBy || "N/A"}
                        </td>
                        <td style={{ fontWeight: "400", fontSize: "smaller" }}>
                          {requisition.requisitionStatus ? "Processed" : "Pending"}
                        </td>
                        <td style={{ fontWeight: "400", fontSize: "smaller" }}>
                          {requisition.isActive ? "Active" : "Inactive"}
                        </td>
                        <td
                          style={{
                            fontWeight: "400",
                            fontSize: "smaller",
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                          }}
                        >
                          <button
                            type="button"
                            className="btn bg-gradient-primary btn-xs"
                            onClick={() => handleEditRequisition(requisition)}
                            style={{
                              padding: "8px",
                              fontSize: ".75rem",
                              lineHeight: "0",
                              borderRadius: "50%",
                            }}
                          >
                            <i className="fas fa-pen" style={{ fontSize: "smaller" }}></i>
                          </button>
                          <button
                            type="button"
                            className="btn bg-gradient-primary btn-xs"
                            onClick={() => handleViewMaterials(requisition.materials)}
                            style={{
                              padding: "8px",
                              fontSize: ".75rem",
                              lineHeight: "0",
                              borderRadius: "50%",
                            }}
                          >
                            <i className="fas fa-eye" style={{ fontSize: "smaller" }}></i>
                          </button>
                          {requisition.isActive && (
                            <button
                              type="button"
                              className="btn bg-gradient-danger btn-xs"
                              onClick={() => handleRequisition(requisition)}
                              style={{
                                padding: "8px",
                                fontSize: ".75rem",
                                lineHeight: "0",
                                borderRadius: "50%",
                              }}
                            >
                              <i
                                className="fas fa-trash"
                                style={{ fontSize: "smaller" }}
                              ></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No requisitions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Modal */}
      <div
        className="modal fade"
        id="materialsModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="materialsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="materialsModalLabel">
                Materials Details
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Material Code</th>
                    <th>Material Name</th>
                    <th>Order Quantity</th>
                    <th>UOM</th>
                    <th>Expected By</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMaterials.length > 0 ? (
                    selectedMaterials.map((material, index) => (
                      <tr key={index}>
                        <td>{material.materialCode || "N/A"}</td>
                        <td>{material.materialName || "N/A"}</td>
                        <td>{material.orderQuantiy || "N/A"}</td>
                        <td>{material.uom || "N/A"}</td>
                        <td>{material.expectedBy || "N/A"}</td>
                        <td>{material.status ? "Active" : "Inactive"}</td>
                        <td style={{ fontWeight: "400", fontSize: "smaller" }}>
                          <button
                            type="button"
                            className="btn bg-gradient-danger btn-xs ml-2"
                            onClick={() => handleMaterials(material)}
                            style={{
                              padding: "5px",
                              fontSize: ".75rem",
                              lineHeight: "0",
                              borderRadius: ".15rem",
                            }}
                          >
                            <i
                              className="fas fa-trash"
                              style={{ fontSize: "smaller" }}
                            ></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No materials found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Requisition Delete Confirmation Modal */}
      <div
        id="confirmCommonModal"
        className="modal fade confirmCommonModal"
        data-backdrop="static"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-confirm">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title w-100">Are you sure?</h5>
            </div>
            <div className="modal-body">
              <p className="text-center">
                By clicking Yes, you will delete the requisition. Once deleted, it cannot be recovered.
              </p>
            </div>
            <div className="modal-footer col-md-12">
              <button className="btn btn-default btn-sm" data-dismiss="modal">
                Cancel
              </button>
              {isLoaderActive ? (
                <PleaseWaitButton
                  className="btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn"
                />
              ) : (
                <button
                  className="btn btn-warning btn-sm pl-3 pr-3 ml-2"
                  onClick={yesConfirmSubmitRequest}
                >
                  Yes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Material Delete Confirmation Modal */}
      <div
        id="MaterialconfirmCommonModal"
        className="modal fade MaterialconfirmCommonModal"
        data-backdrop="static"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-confirm">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title w-100">Are you sure?</h5>
            </div>
            <div className="modal-body">
              <p className="text-center">
                By clicking Yes, you will delete the material. Once deleted, it cannot be recovered.
              </p>
            </div>
            <div className="modal-footer col-md-12">
              <button className="btn btn-default btn-sm" data-dismiss="modal">
                Cancel
              </button>
              {isLoaderActive ? (
                <PleaseWaitButton
                  className="btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn"
                />
              ) : (
                <button
                  className="btn btn-warning btn-sm pl-3 pr-3 ml-2"
                  onClick={MaterialyesConfirmSubmitRequest}
                >
                  Yes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" />
    </>
  );
};

export default RequisitionsTable;