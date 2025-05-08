import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { removeExtraSpaces } from '../../common/textOperations';
import { isValidEmail, isValidContact } from '../../common/validations';
import { ToastContainer, toast } from 'react-toastify';
import PleaseWaitButton from '../../shared/PleaseWaitButton';
import { Link,useNavigate } from 'react-router-dom'
import axios from 'axios';
import $ from "jquery";
import "../Masters/filter-style.css";

const config = require('../../config/config.json');

const SalesOrderDetails = () => {

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);


  useEffect(() => {
    getAllRolesList();
    getUsersList();
    getAllComapnyList();
    getAllPlantList();
    // getAllDepartments();
  }, []);

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if(firstUpdate.current) {
      window.initDatePickerFuncation();
      return;
    }
  });
  const handleApproveModel = () => {
    // setRoleToDelete(appId.appID);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
   //call api to fetch data here
    navigate('/sales-order-approval');   
    //setRoleToDelete(null);
  };
  const  handleSuccessClose = () => {
    setShowSuccessModal(false);
    setShowModal(false);
    navigate('/sales-order-approval');
    //Call Approve API here
   }
  const handleRejectModal = () => {
    debugger
    setShowRejectModal(true);
    setShowModal(false);
    //navigate('/sales-order-approval');
  //  setRoleToDelete(null);
  };
 const  handleApproveConfirm = () => {
  setShowModal(false);
  setShowSuccessModal(true);
  //Call Approve API here
 }
 
 const  handleRejectConfirm = () => {
  debugger
  setShowRejectModal(false);
  navigate('/sales-order-approval');
  //Call Approve API here
 }
 
 
 
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
    setdateOfBirth('');
    //setJoiningDate('');
    setdateOfBirth('');
    //setJoiningDate('');
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
            <div className="col-sm-6">
              <h1 className="m-0">Sales Order Approval</h1>
              <ol className="breadcrumb float-sm-left mt-1">
                <li className="breadcrumb-item"><Link to="/manage-employee">Home</Link></li>
                <li className="breadcrumb-item active">Sales Order Approval</li>
              </ol>
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
              <div className="card shadow-sm rounded border-0 p-3" style={{ backgroundColor: "#fff" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="mb-0 fw-bold">Sales Order Number</h5>
                    <small className="text-muted">(1000000049)</small>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-light border"><i className="fas fa-print"></i></button>
                    <button className="btn btn-light border"><i className="fas fa-eye"></i></button>
                    <button className="btn btn-light border"><i className="fas fa-clone"></i></button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <label className="text-muted fw-medium pr-2">Order Reference:</label>
                    <span className="fw-semibold">ITEOS24</span>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted fw-medium pr-2">Ship From:</label>
                    <span className="fw-semibold">Ahmedabad CFA</span>
                    </div>
                    <div className="col-md-4">
                    <label className="text-muted fw-medium pr-2">Payment Method:</label>
                    <span className="fw-semibold">Payment within 21 days</span>
                    </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <label className="text-muted fw-medium pr-2">Ship To:</label>
                    <span className="fw-semibold">V.G. Raja</span>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted fw-medium pr-2">Order Type:</label>
                    <span className="fw-semibold">ORDER WITH SCHEME</span>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted fw-medium pr-2">Status:</label>
                    <span className="badge bg-light text-purple fw-bold px-3 py-1" style={{ backgroundColor: '#f3e8ff', color: '#8e44ad' }}>Pending</span>    
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-4">
                    <label className="text-muted fw-medium pr-2">Total Amount:</label>
                    <span className="fw-bold text-success">15,51,089.00 ₹</span>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted fw-medium pr-2">Total Tax:</label>
                    <span className="fw-bold text-primary">19,645.00 ₹</span>
                  </div>
                  <div className="col-md-4">
                    <label className="text-muted fw-medium pr-2">Grand Total:</label>
                    <span className="fw-bold text-purple" style={{ color: "#8e44ad" }}>40,645.00 ₹</span> 
                  </div>
                </div>
                {/* <table className="table table-borderless table-sm mb-2">
                  <tbody>
                    <tr>
                      <td className="text-muted fw-medium">Order Reference:</td>
                      <td className="fw-semibold mr-50">ITEOS24</td>
                      <td className="text-muted fw-medium">Ship From:</td>
                      <td className="fw-semibold">Ahmedabad CFA</td>
                      <td className="text-muted fw-medium">Payment Method:</td>
                      <td className="fw-semibold">Payment within 21 days</td>
                    </tr>
                  </tbody>
                </table> */}
                {/* <table className="table table-borderless table-sm mb-2">
                  <tbody>
                    <tr>
                      <td className="text-muted fw-medium">Ship To:</td>
                      <td className="fw-semibold">V.G. Raja</td>
                      <td className="text-muted fw-medium">Order Type:</td>
                      <td className="fw-semibold">ORDER WITH SCHEME</td>
                      <td className="text-muted fw-medium">Status:</td>                      
                      <td>                        
                        <span className="badge bg-light text-purple fw-bold px-3 py-1" style={{ backgroundColor: '#f3e8ff', color: '#8e44ad' }}>Pending</span>
                      </td>
                    </tr>
                  </tbody>
                </table> */}
                {/* <hr />
                <table className="table table-borderless table-sm mb-2">
                  <tbody>
                    <tr>
                      <td className="text-muted fw-medium">Total Amount:</td>
                      <td className="fw-bold text-success">15,51,089.00 ₹</td>
                      <td className="text-muted fw-medium">Total Tax:</td>
                      <td className="fw-bold text-primary">19,645.00 ₹</td>
                      <td className="text-muted fw-medium">Grand Total:</td>
                      <td className="fw-bold text-purple" style={{ color: "#8e44ad" }}>40,645.00 ₹</td>
                    </tr>
                  </tbody>
                </table> */}
              </div>

            </div>
          </div>

          <div className='row'>
            <div className="col-md-12">
              {/* <div className="card  ">
                <div className="card-header">
                    <div className='row'>
                      <div className='col-md-1'>
                         Items
                      </div>
                      <div className='col-md-1'>
                        Remarks
                     
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
                  <table id="table1" class="table table-bordered table-sm" style={{borderRadius: '9rem'}}>
                    <thead>
                      <tr style={{ backgroundColor: '#f2f2f2' }}>
                      <th style={{ fontWeight: '500' }}></th>
                        <th style={{ fontWeight: '500' }}>Sales Order Number</th>
                        <th style={{ fontWeight: '500' }}>Stockist</th>
                        <th style={{ fontWeight: '500' }}>Sales Order Date</th>
                        <th style={{ fontWeight: '500' }}>Order Type</th>
                        <th style={{ fontWeight: '500' }}>Amount (₹)</th>
                        <th style={{ fontWeight: '500' }}>Status</th>
                         <th style={{ fontWeight: '500', width: "7%" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsersList.length > 0 ?
                        allUsersList.map((userObj, index) => {
                          const departmentName = department.find(x => x.departmentID == userObj.accountGroup);
                          return (
                            <tr style={{ textDecoration: userObj.isActive == true ? 'none' : 'line-through' }}>
                               <td style={{ fontWeight: '400', fontSize: 'smaller' }}>
                                <div> <input type='checkbox'></input>
                                </div>
                              </td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>1101</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>Akshay K</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>05/05/2025</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>Special Rate</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>11023.1</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center'>
                              <span className="px-2 py-1 flex items-center justify-center text-center rounded " style={{ backgroundColor: '#CCF0EB' ,color: '#00B698' }}>Order Pending for Approval</span>
                              </td>                             
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>
                               
                              </td>
                            </tr>
                          )
                        })
                        : ""
                      }
                    </tbody>
                  </table>
                  <table id="table1" class="table table-bordered table-sm" style={{borderRadius: '9rem'}}>
                    <thead>
                      <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ fontWeight: '500' }}></th>
                       
                      </tr>
                    </thead>
                    <tbody>                     
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>1101</td>                                                   
                              
                    </tbody>
                  </table>
                </div>
              </div> */}
            <div class="card card-primary card-outline card-outline-tabs">
              <div class="card-header p-0 border-bottom-0">
                <ul class="nav nav-tabs" id="custom-tabs-four-tab" role="tablist">
                  <li class="nav-item">
                    <a class="nav-link active text-bold" id="custom-tabs-four-home-tab" data-toggle="pill" href="#custom-tabs-four-home" role="tab" aria-controls="custom-tabs-four-home" aria-selected="true">Items</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link  text-bold" id="custom-tabs-four-profile-tab" data-toggle="pill" href="#custom-tabs-four-profile" role="tab" aria-controls="custom-tabs-four-profile" aria-selected="false">Remark</a>
                  </li>
                  
                </ul>
              </div>
              <div class="card-body" style={{ padding: '0px' }}>
                <div class="tab-content" id="custom-tabs-four-tabContent">
                  <div class="tab-pane fade show active" id="custom-tabs-four-home" role="tabpanel" aria-labelledby="custom-tabs-four-home-tab">
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
                  <table id="table1" class="table table-sm" style={{border: '1px solid lightgray',borderTopRightRadius: '5px 5px',borderCollapse: 'separate'}}>
                    <thead>
                      <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ fontWeight: '500' }}>Products (4)</th>
                        <th style={{ fontWeight: '500' }}>HSN Code </th>
                        <th style={{ fontWeight: '500' }}>Qty</th>
                        <th style={{ fontWeight: '500' }}>MRP (₹)</th>
                        <th style={{ fontWeight: '500' }}>NIR (₹)</th>
                        <th style={{ fontWeight: '500' }}>CGST (%)</th>
                        <th style={{ fontWeight: '500'}}>SGST (%)</th>
                        <th style={{ fontWeight: '500'}}>IGST (%)</th>
                        <th style={{ fontWeight: '500'}}>AMT (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsersList.length > 0 ?
                        allUsersList.map((userObj, index) => {
                          const departmentName = department.find(x => x.departmentID == userObj.accountGroup);
                          return (
                            <tr style={{ textDecoration: userObj.isActive == true ? 'none' : 'line-through' }}>                               
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>400001 A.S.V.A 10ml Liquid</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>300201</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>25</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>48.05</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>123.1</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>6.0
                              </td>   
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>6.0
                              </td>                       
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>6.0
                              </td>     
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>
                               234.01
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
              <div class="tab-pane fade" id="custom-tabs-four-profile" role="tabpanel" aria-labelledby="custom-tabs-four-profile-tab">
                    What need to do here?? 
              </div>
                  
                </div>
              </div>
            </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-12 mb-4'>
                 {isLoaderActive ? <PleaseWaitButton className='float-right btn-xs ml-2 font-weight-medium auth-form-btn' /> :
                    <button type="submit" className="btn btn-primary float-right btn-xs ml-2" onClick={handleApproveModel}>Approve</button>
                  }
                  <button type="submit" className="btn btn-default float-right btn-xs" onClick={handleRejectModal}>Reject</button>                
            </div>
          </div>
        </div>
      </section>

       {showModal && (
          <div
            className='modal fade show d-flex align-items-center justify-content-center'
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
                <div className='modal-body pl-5 pr-5'>
                  {/* <i class="fas fa-info-circle pl-5" style={{color:"blue"}}></i> */}
                  <h5 className='modal-title w-100 text-center'>
                    Confirmation
                  </h5>
                </div>
                <div className='modal-body'>
                  <p className='text-center'>
                    Do you want to approve this request? <br />
                  </p>
                </div>
                <div className='d-flex justify-content-center pb-4'>
                {isLoaderActive ? (
                    <PleaseWaitButton className="btn btn-warning btn-sm ml-2" />
                  ) : (
                    <button
                      type='button'
                      className='btn btn-primary btn-sm mr-2 pl-3 pr-3' 
                      onClick={handleApproveConfirm}
                    >
                      Yes
                    </button>
                  )}
                  <button
                    type='button'
                    className='btn btn-default btn-sm'
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>                 
                </div>
              </div>
            </div>
          </div>
        )}
         {showSuccessModal && (
          <div
            className='modal fade show d-flex align-items-center justify-content-center'
            tabIndex='-1'
            role='dialog'
            style={{ backgroundColor: '#5d5858b8', boxShadow: '#5d5858b 8' }}
          >
            <div className='modal-dialog modal-lg' role='document'>
              <div className='modal-content'>
              <div style={{ height: '7px', backgroundColor: '#267DD6', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}></div>
                <div className="col-md-12">
                  <i className="fas fa-times mt-4 mr-3 float-right" onClick={handleCloseModal} style={{ cursor: "pointer",color: "#000" }} ></i>
                </div>
                <div className='modal-body pl-5 pr-5'>
                  {/* <i class="fas fa-check-circle"></i> */}
                  <h5 className='modal-title w-100 text-center' style={{ color: "#00B698" }}>
                    Success
                  </h5>
                </div>
                <div className='modal-body'>
                  <p className='text-center'>
                    Do you want to approve this request? <br />
                  </p>
                </div>
                <div className='d-flex justify-content-center pb-4'>
                  {/* <button
                    type='button'
                    className='btn btn-default btn-sm'
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button> */}
                  {isLoaderActive ? (
                    <PleaseWaitButton className="btn btn-warning btn-sm ml-2" />
                  ) : (
                    <button
                      type='button'
                      className='btn btn-primary btn-sm ml-2'
                      onClick={handleSuccessClose}
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
         {showRejectModal && (
          <div
            className='modal fade show d-flex align-items-center justify-content-center'
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
                    Confimation
                  </h5>
                </div>
                <div className='modal-body'>
                  <p className='text-center'>
                    Do you want to reject this request? 
                    <br />
                    What needs to do here??
                  </p>
                </div>
                <div className='d-flex justify-content-center pb-4'>
                  {/* <button
                    type='button'
                    className='btn btn-default btn-sm'
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button> */}
                  {isLoaderActive ? (
                    <PleaseWaitButton className="btn btn-warning btn-sm ml-2" />
                  ) : (
                    <button
                      type='button'
                      className='btn btn-primary btn-sm ml-2'
                      onClick={handleRejectConfirm}
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      <ToastContainer position="top-center" />
    </>
  );
}
export default SalesOrderDetails;