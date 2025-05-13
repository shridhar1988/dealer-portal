import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { removeExtraSpaces } from '../../common/textOperations';
import { isValidEmail, isValidContact } from '../../common/validations';
import { ToastContainer, toast } from 'react-toastify';
import PleaseWaitButton from '../../shared/PleaseWaitButton';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import $ from "jquery";
import "../Masters/filter-style.css";
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
// import { set } from 'react-datepicker/dist/date_utils';

const config = require('../../config/config.json');

const ReportsDealer = () => {
const navigate = useNavigate();
  const inputFirstNameReference = useRef(null);
  const inputLastNameReference = useRef(null);
  const inputAddressReference = useRef(null);
  const inputJoiningDateReference = useRef(null);
  const inputDateOfBirthReference = useRef(null);
  const inputUserNameReference = useRef(null);
  const inputEmailReference = useRef(null);
  const inputRoleReference = useRef(null);
  const inputCompanyReference = useRef(null);
  const inputPlantReference = useRef(null);
  const inputPasswordReference = useRef(null);
  const inputConfirmPasswordReference = useRef(null);
  const inputContactNumberReference = useRef(null);
  const inputAccountGroupReference = useRef(null);  

  const personalInfo = useSelector((state) => state.personalInformationReducer);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState([]);
  const [address, setAddress] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [dateOfBirth, setdateOfBirth] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [plantId, setPlantId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setConfirmPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [accountGroup, setAccountGroup] = useState("");
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [allRolesList, setAllRolesList] = useState([]);
  const [allCompanyList, setAllCompanyList] = useState([]);
  const [allPlantList, setAllPlantList] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);
  const [updateOrDeleteId, setUpdateOrDeleteId] = useState("");
  const [isActiveUser, setIsActiveUser] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showNextModal, setShowNextModal] = useState(false);
  const [showGRNSuccessModal, setShowGRNSuccessModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState("DeliveryHistory");
  const [allCustomerLedgerList, setAllCustomerLedgerList] = useState([]);
  const [allOrderHistoryList, setAllOrderHistoryList] = useState([]);
  const [allSaleSummeryList, setAllSaleSummeryList] = useState([]);
  const [allTopSellingProductsList, setAllSellingProductsList] = useState([]);
  const [allRepeatOrderList, setAllRepeatOrderList] = useState([]);
  const [allCancelReturnOrderList, setAllCancelReturnOrderList] = useState([]);
  const [activeBox, setActiveBox] = useState(null);


   const [currentPage, setCurrentPage] = useState(1);
   // const [searchText, setSearchText] = useState("");
    const rowsPerPage = 10;
  
    // const filteredApps = roles.filter((app) =>
    //   Object.values(app).some((val) =>
    //     val?.toString().toLowerCase().includes(searchText.toLowerCase())
    //   )
    // );
  
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    //const currentRows = filteredApps.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(allUsersList.length / rowsPerPage);
  
    const startEntry = indexOfFirstRow + 1;
    const endEntry = Math.min(indexOfLastRow, allUsersList.length);
  
    const handlePageChange = (newPage) => {
      if(newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    };
  
    // Export to Excel
        const exportToExcel = () => {
            debugger
            console.log(XLSX.utils); 
            const worksheet = XLSX.utils.json_to_sheet(
            allUsersList.map((trackingRecords) => ({        
                "App Name": trackingRecords.appName,
                "App Route": trackingRecords.appRoute,
            }))
            );
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "TrackingReport");
            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const data = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(data, "DeliveryReport.xlsx");
        };
    // Export to Excel
  useEffect(() => {
    getAllRolesList();
    getUsersList();
    getAllComapnyList();
    getAllPlantList();
    // getAllDepartments();
  }, []);

  const handleNaviagte = () => {
    if (personalInfo.userRole === "Dealer") {
      navigate("/sales-order-details");
    } else if (personalInfo.userRole === "Employee") {
      navigate("/employee-profile");
    } else {
      navigate("/");
    }
  };
  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if(firstUpdate.current) {
      window.initDatePickerFuncation();
      return;
    }
  });

 
  const getUsersList = () => {
    // window.initDestroyDataTableFuncation();
    setIsLoaderActive(true);

    window.initDestroyDataTableFuncation();
    axios.get(config.API_URL + 'AuthMaster/GetAllUsers?ClientId=' + config.ClientId, {
      headers: config.headers2,
    }).then((response) => {
      if(response.status == 200) {
        if(response.data.success == "success") {
          if(response.data.data.length > 0) {
            setAllUsersList(response.data.data);
            // setTimeout(() => {
            //   window.initDataTableFuncation();
            // }, 1000)
          }
        } else {
          toast.error(response.data.message);
          // setTimeout(() => {
          //   window.initDataTableFuncation();
          // }, 1000)
        }
      } else if(response.data.status.status == 500) {
        toast.error("Invalid username or password");
      }
    }).catch((error) => {
      toast.error("Please try again later.");
    }).finally(() => {
      setIsLoaderActive(false);
    });
  }
  const getAllRolesList = () => {
    setIsLoaderActive(true);

    axios.get(config.API_URL + 'AuthMaster/GetAllRoles?ClientId=' + config.ClientId, {
      headers: config.headers2,
    }).then((response) => {
      if(response.status == 200) {
        if(response.data.success == "success") {
          if(response.data.data.length > 0) {
            setAllRolesList(response.data.data);
          }
        } else {
          toast.error(response.data.message);
        }
      } else if(response.data.status.status == 500) {
        toast.error("Invalid username or password");
      }
    }).catch((error) => {
      toast.error("Please try again later.");
    }).finally(() => {
      setIsLoaderActive(false);
    })
  }
  const getAllComapnyList = () => {
    setIsLoaderActive(true);
    axios.get(config.API_URL + 'CompanyMaster/GetAllCompany', {
      headers: config.headers2,
    }).then((response) => {
    
      if(response.status == 200) {
        if(response.data.success == "True") {
          if(response.data.data.length > 0) {
            setAllCompanyList(response.data.data);
          }
        } else {
          toast.error(response.data.message);
        }
      } else if(response.data.status.status == 500) {
        toast.error("Invalid username or password");
      }
    }).catch((error) => {
      toast.error("Please try again later.");
    }).finally(() => {
      setIsLoaderActive(false);
    })
  }  
  const getAllPlantList = () => {
    setIsLoaderActive(true);
    axios.get(config.API_URL + 'PlantMaster/GetAllPlants', {
      headers: config.headers2,
    }).then((response) => {
      if(response.status == 200) {
        if(response.data.success == "True") {
          if(response.data.data.length > 0) {
            setAllPlantList(response.data.data);            
          }
        } else {
          toast.error(response.data.message);
        }
      } else if(response.data.status.status == 500) {
        toast.error("Invalid username or password");
      }
    }).catch((error) => {
      toast.error("Please try again later.");
    }).finally(() => {
      setIsLoaderActive(false);
    })
  }
  const addProjectCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  }
  const listOfProjectsHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButton").click();
  }
  const handleAcceptButtonClick = () => {
    setShowModal(true);
    //setShowNextModal(true)
  };

  const handleNextButtonClick = () => {
    setShowModal(false);
    setShowNextModal(true);
    //setShowNextModal(true)
  };
  const handlePODYesClick = () => {   
    setShowNextModal(false);
    setShowGRNSuccessModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setShowNextModal(false);
    setShowGRNSuccessModal(false);
    //get all delivery tracking list
   navigate("/delivery-tracking");

  };
  const handleEditTaskDetails = (userObj) => {
    setUserName(userObj.userName);
    setUserEmail(userObj.email);
    setRoleId(userObj.roleID);
    setPassword(userObj.password);
    setConfirmPassword(userObj.password);
    setCompanyId(userObj.accountGroup);
    setPlantId(userObj.joiningDate);
    setContactNumber(userObj.contactNumber);
   // setAccountGroup(userObj.accountGroup);
    setUpdateOrDeleteId(userObj.userID);
    setFirstName(userObj.firstName);
    setLastName(userObj.lastName);
    setAddress(userObj.address);
    setdateOfBirth(userObj.dateOfBirth);
    //setJoiningDate(userObj.joiningDate);
    setIsActiveUser(userObj.isActive);
    listOfProjectsHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const handleRemoveUser = (userObj) => {    
    setUpdateOrDeleteId(userObj.userID);
    window.confirmModalShow();
  }

  const yesConfirmSubmitRequest = () => {
    setIsLoaderActive(true);
    console.log("user id",updateOrDeleteId)
    let APIMethodName = 'AuthMaster/DeleteUser?ClientId=' + config.ClientId + '&UserID=' + updateOrDeleteId
    axios.post(config.API_URL + APIMethodName, {
      headers: config.headers2,
    }).then((response) => {
      // console.log(response);
      if(response.data.success == "success") {
        toast.success("User deleted successfully...");
        window.confirmModalHide();
        clearAllFields();
        getUsersList();
        setIsLoaderActive(false);
      } else {
        setIsLoaderActive(false);
        toast.error(response.data.message);
      }
    }).catch((error) => {
      if(!error.response.data.success) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Please try again later.");
      }
      setIsLoaderActive(false);
    })
  }

  
  const clearAllFields = () => {
    setUserName('');
    setUserEmail('');
    setRoleId('');
    setPassword('');
    setContactNumber('');
   // setAccountGroup('');
    setUpdateOrDeleteId('');
    setFirstName('');
    setLastName('');
    setAddress('');
    // setdateOfBirth('');
    inputFirstNameReference.current.classList.remove('is-invalid');
    inputLastNameReference.current.classList.remove('is-invalid');
    inputAddressReference.current.classList.remove('is-invalid');
    // inputJoiningDateReference.current.classList.remove('is-invalid');
    inputDateOfBirthReference.current.classList.remove('is-invalid');
    inputUserNameReference.current.classList.remove('is-invalid');
    inputEmailReference.current.classList.remove('is-invalid');
    inputRoleReference.current.classList.remove('is-invalid');
    inputPasswordReference.current.classList.remove('is-invalid');
    inputContactNumberReference.current.classList.remove('is-invalid');
    // inputAccountGroupReference.current.classList.remove('is-invalid');
  }
 

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-8">
              <h1 className="m-0">Reports</h1>
              <ol className="breadcrumb float-sm-left mt-1">
                <li className="breadcrumb-item"><Link to="/manage-employee">Home</Link></li>
                <li className="breadcrumb-item active">Reports</li>
              </ol>
            </div>
            {/* <div className="col-sm-4">
            <input
                        type="text"
                        className="form-control form-control-sm "
                        placeholder="Search By Sales Order No..."
                        style={{ borderRadius: '9rem'}}
                        onChange={(e) => {}}
                      />
            </div> */}
          </div>
        </div>
      </div>

      <section className="content">          
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 col-sm-6 col-12">
                <div className={`info-box ${activeBox === "DeliveryHistory" ? "active-box" : ""}`} onClick={()=> {setShowTableModal("DeliveryHistory"); setActiveBox("DeliveryHistory");}} style={{ borderLeft: '6px solid #009D12', cursor: 'pointer' }}>
                    <span className="info-box-icon"><i className="fas fa-clipboard-list"></i></span>
                    <div className="info-box-content">
                        <span className="info-box-number">Delivery Reports</span>
                    </div>
                </div>
                </div>

            <div className="col-md-3 col-sm-6 col-12">
            <div className={`info-box ${activeBox === "CustomerLedgerReports" ? "active-box" : ""}`}onClick={()=> {setShowTableModal("CustomerLedgerReports"); setActiveBox("CustomerLedgerReports");}} style={{ borderLeft: '6px solid #7D2CD9' , cursor: 'pointer' }}>
                <span className="info-box-icon"><i className="fas fa-tasks"></i></span>
                <div className="info-box-content">
                <span className="info-box-number">Customer Ledger Reports</span>
                </div>
            </div>
            </div>

            <div className="col-md-3 col-sm-6 col-12">
            <div className={`info-box ${activeBox === "OrderHistory" ? "active-box" : ""}`} onClick={()=>{ setShowTableModal("OrderHistory"); setActiveBox("OrderHistory");}} style={{ borderLeft: '6px solid #D45901', cursor: 'pointer' }}>
                <span className="info-box-icon"><i className="fas fa-history"></i></span>
                <div className="info-box-content">
                    <span className="info-box-number">Order History</span>
                </div>
            </div>
            </div>

            <div className="col-md-3 col-sm-6 col-12">
            <div className={`info-box ${activeBox === "SaleSummeryReports" ? "active-box" : ""}`} onClick={()=>{ setShowTableModal("SaleSummeryReports"); setActiveBox("SaleSummeryReports");}} style={{ borderLeft: '6px solid #0054A9', cursor: 'pointer' }}>
                <span className="info-box-icon"><i className="fas fa-chart-line"></i></span>
                <div className="info-box-content">
                <span className="info-box-number">Sale Summery Reports</span>
                </div>
            </div>
            </div>
            </div>
        </div>
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 col-sm-6 col-12">
                <div className={`info-box ${activeBox === "TopSellingReports" ? "active-box" : ""}`} onClick={()=> {setShowTableModal("TopSellingReports"); setActiveBox("TopSellingReports");}} style={{ borderLeft: '6px solid #FF9065', cursor: 'pointer',hover: '#f9f9f9' }}>
                    <span className="info-box-icon"><i className="fas fa-tags"></i></span>
                    <div className="info-box-content">
                    <span className="info-box-number">Top Selling Reports</span>
                    </div>
                </div>
                </div>

            <div className="col-md-3 col-sm-6 col-12">
            <div className={`info-box ${activeBox === "RepeatOrderReports" ? "active-box" : ""}`} onClick={()=> {setShowTableModal("RepeatOrderReports"); setActiveBox("RepeatOrderReports");}} style={{ borderLeft: '6px solid #4880FF', cursor: 'pointer' }}>
                <span className="info-box-icon"><i className="far fa-file-alt"></i></span>
                <div className="info-box-content">
                <span className="info-box-number">Repeat Order Report</span>
                </div>
            </div>
            </div>

            <div className="col-md-3 col-sm-6 col-12">
            <div className={`info-box ${activeBox === "CancelAndReturnReports" ? "active-box" : ""}`} onClick={()=> {setShowTableModal("CancelAndReturnReports"); setActiveBox("CancelAndReturnReports");}} style={{ borderLeft: '6px solid #B16FED', cursor: 'pointer' }}>
                <span className="info-box-icon"><i className="fas fa-undo-alt"></i></span>
                <div className="info-box-content">
                <span className="info-box-number">Cancel and Return Reports</span>
                </div>
            </div>
            </div>           
            </div>
        </div>

        <div className="container-fluid">
         <div className='row'>
            <div className="col-md-12">
              {/* Delivery Reports */}
            {showTableModal == "DeliveryHistory" && (
              <div className="card">
              <div className="card-header">
                    <div className='row'>
                      <div className='col-md-10'>
                        <h4 className="m-0">Delivery Reports ( {allUsersList.length} )</h4>
                      </div>
                      <div className='col-md-2 justify-content-end d-flex'>   
                            <button  type="button" className="btn btn-warning btn-sm pl-3 pr-3 ml-" onClick={exportToExcel} style={{
                                color: '#007BFF',             
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                padding: '1px 1px',
                                border: '1px solid #007BFF',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1px'
                            }} >
                                <i className="fas fa-download" style={{ marginRight: '8px' }}></i>Download
                            </button>               
                          <button type="button" className="btn btn-tool" id='listOfProjectsHeaderExpandButtion' onClick={(e) => { listOfProjectsHeaderExpandButtionClick(e) }} data-card-widget="collapse">
                            <i className="fas fa-minus"></i>
                          </button>
                          <button type="button" className="btn btn-tool" data-card-widget="maximize">
                            <i className="fas fa-expand"></i>
                          </button>  
                      </div> 
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
                  <table  className="table table-sm" style={{border: '1px solid lightgray',borderTopRightRadius: '5px 5px',borderCollapse: 'separate'}} id="listOfProjectsTable">
                    <thead>
                      <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ fontWeight: '500' }}>Sr. No</th>
                        <th style={{ fontWeight: '500' }}>Delivery Number</th>
                        <th style={{ fontWeight: '500' }}>Invoice Number</th>
                        <th style={{ fontWeight: '500' }}>Product Name</th>
                        <th style={{ fontWeight: '500' }}>Transporter</th>
                        <th style={{ fontWeight: '500' }}>LR No.</th>
                        <th style={{ fontWeight: '500' }}>LR Date</th>
                        <th style={{ fontWeight: '500' }}>Estimated Delivery</th>
                        <th style={{ fontWeight: '500' }}>Delivery Status</th>                        
                        <th style={{ fontWeight: '500' }}>Quantity</th>
                        <th style={{ fontWeight: '500' }}>Amount (₹)</th>                         
                      </tr>
                    </thead>
                    <tbody>
                      {allUsersList.length > 0 ?
                        allUsersList.map((userObj, index) => {
                          const departmentName = department.find(x => x.departmentID == userObj.accountGroup);
                          return (
                            <tr style={{ textDecoration: userObj.isActive == true ? 'none' : 'line-through' }}>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{index+1}</td> 
                               <td style={{ fontWeight: '400', fontSize: 'smaller' }}>DEL1057963</td>  
                               <td style={{ fontWeight: '400', fontSize: 'smaller' }}>9001057963</td> 
                               <td style={{ fontWeight: '400', fontSize: 'smaller' }}>A.S.V.A Liquid</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>SHREE GANESH</td>                           
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>110134562</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>07-05-2025</td> 
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>08-05-2025</td>  
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>
                                <button type="button" class="px-2 py-1 flex items-center justify-center text-center rounded" onClick={handleAcceptButtonClick} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', border: 'none', lineHeight: '1', borderRadius: '.25rem',backgroundColor: '#CCF0EB' ,color: '#00B698', cursor: 'pointer' }}>
                                 Delivered
                                </button>
                              </td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>110</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center'>
                              ₹9900.00
                              </td>   
                            </tr>
                          )
                        })
                        : ""
                      }
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-between mt-2">
                    <div>
                      Showing {startEntry} to {endEntry} of {allUsersList.length} entries
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
              </div>)}
              {/* Customer Ledger Reports */}
              {showTableModal == "CustomerLedgerReports" && (
                <div className="card card-outline card-primary ">
                <div className="card-header">
                        <div className='row'>
                        <div className='col-md-10'>
                            <h4 className="m-0">Customer Ledger Reports ( {allCustomerLedgerList.length} )</h4>
                        </div>
                        <div className='col-md-2 justify-content-end d-flex'>   
                            <button  type="button" className="btn btn-warning btn-sm pl-3 pr-3 ml-"  style={{
                                color: '#007BFF',              // Bootstrap blue
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                padding: '1px 1px',
                                border: '1px solid #007BFF',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1px'
                            }} >
                                <i className="fas fa-download" style={{ marginRight: '8px' }}></i>Download
                            </button>                     
                            <button type="button" className="btn btn-tool" id='listOfProjectsHeaderExpandButtion' onClick={(e) => { listOfProjectsHeaderExpandButtionClick(e) }} data-card-widget="collapse">
                                <i className="fas fa-minus"></i>
                            </button>
                            <button type="button" className="btn btn-tool" data-card-widget="maximize">
                                <i className="fas fa-expand"></i>
                            </button>  
                        </div> 
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
                    <table  className="table table-sm" style={{border: '1px solid lightgray',borderTopRightRadius: '5px 5px',borderCollapse: 'separate'}} id="listOfProjectsTable">
                        <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ fontWeight: '500' }}>Sr. No</th>
                            <th style={{ fontWeight: '500' }}>Delivery Number</th>
                            <th style={{ fontWeight: '500' }}>Invoice Number</th>
                            <th style={{ fontWeight: '500' }}>Product Name</th>
                            <th style={{ fontWeight: '500' }}>Transporter</th>
                            <th style={{ fontWeight: '500' }}>LR No.</th>
                            <th style={{ fontWeight: '500' }}>LR Date</th>
                            <th style={{ fontWeight: '500' }}>Estimated Delivery</th>
                            <th style={{ fontWeight: '500' }}>Delivery Status</th>                        
                            <th style={{ fontWeight: '500' }}>Quantity</th>
                            <th style={{ fontWeight: '500' }}>Amount (₹)</th>                         
                        </tr>
                        </thead>
                        <tbody>
                        {allCustomerLedgerList.length > 0 ?
                            allCustomerLedgerList.map((userObj, index) => {                            
                            return (
                                <tr style={{ textDecoration: userObj.isActive == true ? 'none' : 'line-through' }}>
                                    <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{index+1}</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>DEL1057963</td>  
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>9001057963</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>A.S.V.A Liquid</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>SHREE GANESH</td>                           
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>110134562</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>07-05-2025</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>08-05-2025</td>  
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>
                                    <button type="button" class="px-2 py-1 flex items-center justify-center text-center rounded" style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', border: 'none', lineHeight: '1', borderRadius: '.25rem',backgroundColor: '#CCF0EB' ,color: '#00B698', cursor: 'pointer' }}>
                                    Delivered
                                    </button>
                                </td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>110</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center'>
                                ₹9900.00
                                </td>   
                                </tr>
                            )
                            })
                            : ""
                        }
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between mt-2">
                    <div>
                      Showing {startEntry} to {endEntry} of {allUsersList.length} entries
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
              )}
              {/* Order History */}
              {showTableModal == "OrderHistory" && (
                <div className="card card-outline card-primary ">
                <div className="card-header">
                        <div className='row'>
                        <div className='col-md-10'>
                            <h4 className="m-0">Order History Reports ( {allOrderHistoryList.length} )</h4>
                        </div>
                        <div className='col-md-2 justify-content-end d-flex'>   
                            <button  type="button" className="btn btn-warning btn-sm pl-3 pr-3 ml-"  style={{
                                color: '#007BFF',              // Bootstrap blue
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                padding: '1px 1px',
                                border: '1px solid #007BFF',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1px'
                            }} >
                                <i className="fas fa-download" style={{ marginRight: '8px' }}></i>Download
                            </button>                    
                            <button type="button" className="btn btn-tool" id='listOfProjectsHeaderExpandButtion' onClick={(e) => { listOfProjectsHeaderExpandButtionClick(e) }} data-card-widget="collapse">
                                <i className="fas fa-minus"></i>
                            </button>
                            <button type="button" className="btn btn-tool" data-card-widget="maximize">
                                <i className="fas fa-expand"></i>
                            </button>  
                        </div> 
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
                    <table  class="table table-sm" style={{border: '1px solid lightgray',borderTopRightRadius: '5px 5px',borderCollapse: 'separate'}} id="listOfProjectsTable">
                        <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ fontWeight: '500' }}>Sr. No</th>
                            <th style={{ fontWeight: '500' }}>Delivery Number</th>
                            <th style={{ fontWeight: '500' }}>Invoice Number</th>
                            <th style={{ fontWeight: '500' }}>Product Name</th>
                            <th style={{ fontWeight: '500' }}>Transporter</th>
                            <th style={{ fontWeight: '500' }}>LR No.</th>
                            <th style={{ fontWeight: '500' }}>LR Date</th>
                            <th style={{ fontWeight: '500' }}>Estimated Delivery</th>
                            <th style={{ fontWeight: '500' }}>Delivery Status</th>                        
                            <th style={{ fontWeight: '500' }}>Quantity</th>
                            <th style={{ fontWeight: '500' }}>Amount (₹)</th>                         
                        </tr>
                        </thead>
                        <tbody>
                        {allOrderHistoryList.length > 0 ?
                            allOrderHistoryList.map((userObj, index) => {                            
                            return (
                                <tr style={{ textDecoration: userObj.isActive == true ? 'none' : 'line-through' }}>
                                    <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{index+1}</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>DEL1057963</td>  
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>9001057963</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>A.S.V.A Liquid</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>SHREE GANESH</td>                           
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>110134562</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>07-05-2025</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>08-05-2025</td>  
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>
                                    <button type="button" class="px-2 py-1 flex items-center justify-center text-center rounded" style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', border: 'none', lineHeight: '1', borderRadius: '.25rem',backgroundColor: '#CCF0EB' ,color: '#00B698', cursor: 'pointer' }}>
                                    Delivered
                                    </button>
                                </td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>110</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center'>
                                ₹9900.00
                                </td>   
                                </tr>
                            )
                            })
                            : ""
                        }
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between mt-2">
                    <div>
                      Showing {startEntry} to {endEntry} of {allUsersList.length} entries
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
              )}
              {/* Sale Summery Reports */}
              {showTableModal == "SaleSummeryReports" && (
                <div className="card card-outline card-primary ">
                <div className="card-header">
                        <div className='row'>
                        <div className='col-md-10'>
                            <h4 className="m-0">Sale Summery Reports ( {allSaleSummeryList.length} )</h4>
                        </div>
                        <div className='col-md-2 justify-content-end d-flex'>   
                            <button  type="button" className="btn btn-warning btn-sm pl-3 pr-3 ml-"  style={{
                                color: '#007BFF',              // Bootstrap blue
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                padding: '1px 1px',
                                border: '1px solid #007BFF',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1px'
                            }} >
                                <i className="fas fa-download" style={{ marginRight: '8px' }}></i>Download
                            </button>                  
                            <button type="button" className="btn btn-tool" id='listOfProjectsHeaderExpandButtion' onClick={(e) => { listOfProjectsHeaderExpandButtionClick(e) }} data-card-widget="collapse">
                                <i className="fas fa-minus"></i>
                            </button>
                            <button type="button" className="btn btn-tool" data-card-widget="maximize">
                                <i className="fas fa-expand"></i>
                            </button>  
                        </div> 
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
                    <table  class="table table-sm" style={{border: '1px solid lightgray',borderTopRightRadius: '5px 5px',borderCollapse: 'separate'}} id="listOfProjectsTable">
                        <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ fontWeight: '500' }}>Sr. No</th>
                            <th style={{ fontWeight: '500' }}>Delivery Number</th>
                            <th style={{ fontWeight: '500' }}>Invoice Number</th>
                            <th style={{ fontWeight: '500' }}>Product Name</th>
                            <th style={{ fontWeight: '500' }}>Transporter</th>
                            <th style={{ fontWeight: '500' }}>LR No.</th>
                            <th style={{ fontWeight: '500' }}>LR Date</th>
                            <th style={{ fontWeight: '500' }}>Estimated Delivery</th>
                            <th style={{ fontWeight: '500' }}>Delivery Status</th>                        
                            <th style={{ fontWeight: '500' }}>Quantity</th>
                            <th style={{ fontWeight: '500' }}>Amount (₹)</th>                         
                        </tr>
                        </thead>
                        <tbody>
                        {allSaleSummeryList.length > 0 ?
                            allSaleSummeryList.map((userObj, index) => {                            
                            return (
                                <tr style={{ textDecoration: userObj.isActive == true ? 'none' : 'line-through' }}>
                                    <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{index+1}</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>DEL1057963</td>  
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>9001057963</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>A.S.V.A Liquid</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>SHREE GANESH</td>                           
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>110134562</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>07-05-2025</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>08-05-2025</td>  
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>
                                    <button type="button" class="px-2 py-1 flex items-center justify-center text-center rounded" style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', border: 'none', lineHeight: '1', borderRadius: '.25rem',backgroundColor: '#CCF0EB' ,color: '#00B698', cursor: 'pointer' }}>
                                    Delivered
                                    </button>
                                </td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>110</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center'>
                                ₹9900.00
                                </td>   
                                </tr>
                            )
                            })
                            : ""
                        }
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between mt-2">
                    <div>
                      Showing {startEntry} to {endEntry} of {allUsersList.length} entries
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
              )}
              {/* Top Selling Reports */}
              {showTableModal == "TopSellingReports" && (
                <div className="card card-outline card-primary ">
                <div className="card-header">
                        <div className='row'>
                        <div className='col-md-10'>
                            <h4 className="m-0">Top Selling Product Reports ( {allTopSellingProductsList.length} )</h4>
                        </div>
                        <div className='col-md-2 justify-content-end d-flex'>   
                            <button  type="button" className="btn btn-warning btn-sm pl-3 pr-3 ml-"  style={{
                                color: '#007BFF',              // Bootstrap blue
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                padding: '1px 1px',
                                border: '1px solid #007BFF',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1px'
                            }} >
                                <i className="fas fa-download" style={{ marginRight: '8px' }}></i>Download
                            </button>                    
                            <button type="button" className="btn btn-tool" id='listOfProjectsHeaderExpandButtion' onClick={(e) => { listOfProjectsHeaderExpandButtionClick(e) }} data-card-widget="collapse">
                                <i className="fas fa-minus"></i>
                            </button>
                            <button type="button" className="btn btn-tool" data-card-widget="maximize">
                                <i className="fas fa-expand"></i>
                            </button>  
                        </div> 
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
                    <table  class="table table-sm" style={{border: '1px solid lightgray',borderTopRightRadius: '5px 5px',borderCollapse: 'separate'}} id="listOfProjectsTable">
                        <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ fontWeight: '500' }}>Sr. No</th>
                            <th style={{ fontWeight: '500' }}>Delivery Number</th>
                            <th style={{ fontWeight: '500' }}>Invoice Number</th>
                            <th style={{ fontWeight: '500' }}>Product Name</th>
                            <th style={{ fontWeight: '500' }}>Transporter</th>
                            <th style={{ fontWeight: '500' }}>LR No.</th>
                            <th style={{ fontWeight: '500' }}>LR Date</th>
                            <th style={{ fontWeight: '500' }}>Estimated Delivery</th>
                            <th style={{ fontWeight: '500' }}>Delivery Status</th>                        
                            <th style={{ fontWeight: '500' }}>Quantity</th>
                            <th style={{ fontWeight: '500' }}>Amount (₹)</th>                         
                        </tr>
                        </thead>
                        <tbody>
                        {allTopSellingProductsList.length > 0 ?
                            allTopSellingProductsList.map((userObj, index) => {                            
                            return (
                                <tr style={{ textDecoration: userObj.isActive == true ? 'none' : 'line-through' }}>
                                    <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{index+1}</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>DEL1057963</td>  
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>9001057963</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>A.S.V.A Liquid</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>SHREE GANESH</td>                           
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>110134562</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>07-05-2025</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>08-05-2025</td>  
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>
                                    <button type="button" class="px-2 py-1 flex items-center justify-center text-center rounded" style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', border: 'none', lineHeight: '1', borderRadius: '.25rem',backgroundColor: '#CCF0EB' ,color: '#00B698', cursor: 'pointer' }}>
                                    Delivered
                                    </button>
                                </td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>110</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center'>
                                ₹9900.00
                                </td>   
                                </tr>
                            )
                            })
                            : ""
                        }
                        </tbody>
                    </table>
                    </div>
                </div>
              )}
                {/* Repeat Order Reports */}
                {showTableModal == "RepeatOrderReports" && (
                <div className="card card-outline card-primary ">
                <div className="card-header">
                        <div className='row'>
                        <div className='col-md-10'>
                            <h4 className="m-0">Repeat Order Reports ( {allRepeatOrderList.length} )</h4>
                        </div>
                        <div className='col-md-2 justify-content-end d-flex'>   
                            <button  type="button" className="btn btn-warning btn-sm pl-3 pr-3 ml-"  style={{
                                color: '#007BFF',              // Bootstrap blue
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                padding: '1px 1px',
                                border: '1px solid #007BFF',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1px'
                            }} >
                                <i className="fas fa-download" style={{ marginRight: '8px' }}></i>Download
                            </button>                    
                            <button type="button" className="btn btn-tool" id='listOfProjectsHeaderExpandButtion' onClick={(e) => { listOfProjectsHeaderExpandButtionClick(e) }} data-card-widget="collapse">
                                <i className="fas fa-minus"></i>
                            </button>
                            <button type="button" className="btn btn-tool" data-card-widget="maximize">
                                <i className="fas fa-expand"></i>
                            </button>  
                        </div> 
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
                    <table  class="table table-sm" style={{border: '1px solid lightgray',borderTopRightRadius: '5px 5px',borderCollapse: 'separate'}} id="listOfProjectsTable">
                        <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ fontWeight: '500' }}>Sr. No</th>
                            <th style={{ fontWeight: '500' }}>Delivery Number</th>
                            <th style={{ fontWeight: '500' }}>Invoice Number</th>
                            <th style={{ fontWeight: '500' }}>Product Name</th>
                            <th style={{ fontWeight: '500' }}>Transporter</th>
                            <th style={{ fontWeight: '500' }}>LR No.</th>
                            <th style={{ fontWeight: '500' }}>LR Date</th>
                            <th style={{ fontWeight: '500' }}>Estimated Delivery</th>
                            <th style={{ fontWeight: '500' }}>Delivery Status</th>                        
                            <th style={{ fontWeight: '500' }}>Quantity</th>
                            <th style={{ fontWeight: '500' }}>Amount (₹)</th>                         
                        </tr>
                        </thead>
                        <tbody>
                        {allRepeatOrderList.length > 0 ?
                            allRepeatOrderList.map((userObj, index) => {                            
                            return (
                                <tr style={{ textDecoration: userObj.isActive == true ? 'none' : 'line-through' }}>
                                    <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{index+1}</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>DEL1057963</td>  
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>9001057963</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>A.S.V.A Liquid</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>SHREE GANESH</td>                           
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>110134562</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>07-05-2025</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>08-05-2025</td>  
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>
                                    <button type="button" class="px-2 py-1 flex items-center justify-center text-center rounded" style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', border: 'none', lineHeight: '1', borderRadius: '.25rem',backgroundColor: '#CCF0EB' ,color: '#00B698', cursor: 'pointer' }}>
                                    Delivered
                                    </button>
                                </td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>110</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center'>
                                ₹9900.00
                                </td>   
                                </tr>
                            )
                            })
                            : ""
                        }
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between mt-2">
                    <div>
                      Showing {startEntry} to {endEntry} of {allUsersList.length} entries
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
              )}
                {/* CancelAndReturnReports */}
                {showTableModal == "CancelAndReturnReports" && (
                <div className="card card-outline card-primary ">
                <div className="card-header">
                        <div className='row'>
                        <div className='col-md-10'>
                            <h4 className="m-0">Cancel And Return Reports ( {allCancelReturnOrderList.length} )</h4>
                        </div>
                        <div className='col-md-2 justify-content-end d-flex'>   
                            <button  type="button" className="btn btn-warning btn-sm pl-3 pr-3 ml-"  style={{
                                color: '#007BFF',              // Bootstrap blue
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                padding: '1px 1px',
                                border: '1px solid #007BFF',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1px'
                            }} >
                                <i className="fas fa-download" style={{ marginRight: '8px' }}></i>Download
                            </button>                    
                            <button type="button" className="btn btn-tool" id='listOfProjectsHeaderExpandButtion' onClick={(e) => { listOfProjectsHeaderExpandButtionClick(e) }} data-card-widget="collapse">
                                <i className="fas fa-minus"></i>
                            </button>
                            <button type="button" className="btn btn-tool" data-card-widget="maximize">
                                <i className="fas fa-expand"></i>
                            </button>  
                        </div> 
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
                    <table  class="table table-sm" style={{border: '1px solid lightgray',borderTopRightRadius: '5px 5px',borderCollapse: 'separate'}} id="listOfProjectsTable">
                        <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ fontWeight: '500' }}>Sr. No</th>
                            <th style={{ fontWeight: '500' }}>Delivery Number</th>
                            <th style={{ fontWeight: '500' }}>Invoice Number</th>
                            <th style={{ fontWeight: '500' }}>Product Name</th>
                            <th style={{ fontWeight: '500' }}>Transporter</th>
                            <th style={{ fontWeight: '500' }}>LR No.</th>
                            <th style={{ fontWeight: '500' }}>LR Date</th>
                            <th style={{ fontWeight: '500' }}>Estimated Delivery</th>
                            <th style={{ fontWeight: '500' }}>Delivery Status</th>                        
                            <th style={{ fontWeight: '500' }}>Quantity</th>
                            <th style={{ fontWeight: '500' }}>Amount (₹)</th>                         
                        </tr>
                        </thead>
                        <tbody>
                        {allCancelReturnOrderList.length > 0 ?
                            allCancelReturnOrderList.map((userObj, index) => {                            
                            return (
                                <tr style={{ textDecoration: userObj.isActive == true ? 'none' : 'line-through' }}>
                                    <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{index+1}</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>DEL1057963</td>  
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>9001057963</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>A.S.V.A Liquid</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>SHREE GANESH</td>                           
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>110134562</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>07-05-2025</td> 
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>08-05-2025</td>  
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>
                                    <button type="button" class="px-2 py-1 flex items-center justify-center text-center rounded" style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', border: 'none', lineHeight: '1', borderRadius: '.25rem',backgroundColor: '#CCF0EB' ,color: '#00B698', cursor: 'pointer' }}>
                                    Delivered
                                    </button>
                                </td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }}>110</td>
                                <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center'>
                                ₹9900.00
                                </td>   
                                </tr>
                            )
                            })
                            : ""
                        }
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between mt-2">
                    <div>
                      Showing {startEntry} to {endEntry} of {allUsersList.length} entries
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
              )}
            </div>
          </div>
        </div>
      </section>

      {showModal && (          
       <div
       className='modal fade show d-flex pt-5'
       tabIndex='-1'
       role='dialog'
       style={{ backgroundColor: '#5d5858b8', boxShadow: '#5d5858b 8' }}
       >
       <div className='modal-dialog modal-lg' role='document'>
         <div className='modal-content'>
         <div style={{ height: '7px', backgroundColor: '#267DD6', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}></div>
           
          <div className="col-md-12">
                  <i className="fas fa-times mt-4 mr-3 float-right" onClick={handleCloseModal} style={{ cursor: "pointer",color: "#333" }} ></i>
          </div>
          <div className="col-md-12">
             <i className="bi bi-x-lg mt-3 float-right" style={{ cursor: "pointer",color: "#333" }} ></i>
           </div>
           <div className='modal-body'>
              <p>
                 Please Enter Remarks
              </p>
              <textarea                       
                className={`form-control form-control-sm`}
                //value={"Remarks"}
                //ref={inputAppNameReference}
                placeholder='Enter Remarks...'
                // onChange={handleAppNameChange}
              />
           </div>
           <div className='d-flex justify-content-end pb-3 pr-3'>
           {isLoaderActive ? (
               <PleaseWaitButton className="btn btn-warning btn-sm ml-2" />
             ) : (
               <button
                 type='button'
                 className='btn btn-primary btn-sm ml-2'
                 onClick={handleNextButtonClick}
                 style={{marginRight: '10px'}}
               >
                 Next
               </button>
             )}
             <button
               type='button'
               className='btn btn-default btn-sm'
               onClick={handleCloseModal}
             >
               Back
             </button>
            
           </div>
         </div>
       </div>
       </div>
       )}

          {showNextModal && (          
                <div
                className='modal fade show d-flex pt-5'
                tabIndex='-1'
                role='dialog'
                style={{ backgroundColor: '#5d5858b8', boxShadow: '#5d5858b 8' }}
              >
                <div className='modal-dialog modal-lg' role='document'>
                  <div className='modal-content'>
                    <div style={{ height: '7px', backgroundColor: '#267DD6', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}></div>
                    <div className="col-md-12">
                      <i className="fas fa-times mt-4 mr-3 float-right" onClick={handleCloseModal} style={{ cursor: "pointer",color: "#333" }} ></i>
                    </div>
                    <div className='modal-body px-5'>
                        <h5 className='modal-title w-100 text-center' style={{ color: "#00B698" }}>
                          Information
                        </h5>
                    </div>
                    <div className='modal-body'>
                        <p className='text-center'>
                          Do you want to upload POD? <br />
                        </p>
                    </div>
                    <div className='d-flex justify-content-center pb-3 pr-3'>
                    {isLoaderActive ? (
                        <PleaseWaitButton className="btn btn-warning btn-sm ml-2" />
                      ) : (
                        <button
                          type='button'
                          className='btn btn-primary btn-sm ml-2'
                          onClick={handlePODYesClick}
                          style={{marginRight: '10px'}}
                        >
                          Yes
                        </button>
                      )}
                      <button
                        type='button'
                        className='btn btn-default btn-sm'
                        onClick={handleCloseModal}
                      >
                        No
                      </button>
                      
                    </div>
                  </div>
                </div>
              </div>
                )}
                 {showGRNSuccessModal && (          
                <div
                className='modal fade show d-flex pt-5'
                tabIndex='-1'
                role='dialog'
                style={{ backgroundColor: '#5d5858b8', boxShadow: '#5d5858b 8' }}
              >
                <div className='modal-dialog modal-lg' role='document'>
                  <div className='modal-content'>
                  <div style={{ height: '7px', backgroundColor: '#267DD6', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}></div>
                  <div className="col-md-12">
                  <i className="fas fa-times mt-4 mr-3 float-right" onClick={handleCloseModal} style={{ cursor: "pointer",color: "#333" }} ></i>
                </div>
                    <div className='modal-body px-5'>
                        <h5 className='modal-title w-100 text-center' style={{ color: "#00B698" }}>
                          Success
                        </h5>
                    </div>
                    <div className='modal-body'>
                        <p className='text-center'>
                         GRN Accepted successfully.! <br />
                        </p>
                    </div>
                    <div className='d-flex justify-content-center pb-3 pr-3'>
                      <button
                        type='button'
                        className='btn btn-primary btn-sm ml-2'
                        onClick={handleCloseModal}
                      >
                        Close
                      </button>
                      
                    </div>
                  </div>
                </div>
              </div>
                )}
      <ToastContainer position="top-center" />
    </>
  );
}
export default ReportsDealer;