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

const config = require('../../config/config.json');

const SalesOrderApprovalList = () => {
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
    } else if (personalInfo.userRole === "Approver") {
      navigate("/sales-order-details");
    } else {
      navigate("/");
    }
  };
  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
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
      if (response.status == 200) {
        if (response.data.success == "success") {
          if (response.data.data.length > 0) {
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
      } else if (response.data.status.status == 500) {
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
      if (response.status == 200) {
        if (response.data.success == "success") {
          if (response.data.data.length > 0) {
            setAllRolesList(response.data.data);
          }
        } else {
          toast.error(response.data.message);
        }
      } else if (response.data.status.status == 500) {
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

      if (response.status == 200) {
        if (response.data.success == "True") {
          if (response.data.data.length > 0) {
            setAllCompanyList(response.data.data);
          }
        } else {
          toast.error(response.data.message);
        }
      } else if (response.data.status.status == 500) {
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
      if (response.status == 200) {
        if (response.data.success == "True") {
          if (response.data.data.length > 0) {
            setAllPlantList(response.data.data);
          }
        } else {
          toast.error(response.data.message);
        }
      } else if (response.data.status.status == 500) {
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
  const handleRemoveUser = (userObj) => {
    setUpdateOrDeleteId(userObj.userID);
    window.confirmModalShow();
  }

  const yesConfirmSubmitRequest = () => {
    setIsLoaderActive(true);
    console.log("user id", updateOrDeleteId)
    let APIMethodName = 'AuthMaster/DeleteUser?ClientId=' + config.ClientId + '&UserID=' + updateOrDeleteId
    axios.post(config.API_URL + APIMethodName, {
      headers: config.headers2,
    }).then((response) => {
      // console.log(response);
      if (response.data.success == "success") {
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
      if (!error.response.data.success) {
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
              {/* <ol className="breadcrumb float-sm-left mt-1">
                <li className="breadcrumb-item"><Link to="/manage-employee">Home</Link></li>
                <li className="breadcrumb-item active">Sales Order Approval</li>
              </ol> */}
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
              <div className="card  collapsed-card">
                <div className="fileterdiv p-4">
                  <div className="d-flex justify-content-between align-items-center ml-2">
                    <div className="">
                      <div className="filter-bar d-flex align-items-center">
                        <div className="filter-dropdown  px-3 py-2">
                          <i className="fa fa-filter" aria-hidden="true"></i>
                        </div>

                        {/* Filter By */}
                        <div className="filter-label text-nowrap d-flex align-items-center px-3 py-2 font-weight-bold">
                          Filter By
                        </div>

                        {/* Reference ID Dropdown */}
                        <div className="filter-dropdown d-flex align-items-center px-3 py-2">
                          <select className="form-select text-nowrap border-0 p-0 no-border-input font-weight-bold">
                            <option value="" disabled selected hidden>Stock List</option>
                            <option value="">Stock1</option>
                            <option value="">Stock2</option>
                          </select>
                        </div>

                        {/* Creation Date Dropdown */}
                        <div className="filter-dropdown d-flex align-items-center px-3 py-2">
                          <select className="form-select text-nowrap border-0 p-0 no-border-input font-weight-bold">
                            <option value="" disabled selected hidden>Sales Order Date</option>
                            <option value="">01-05-2025</option>
                            <option value="">02-05-2025</option>
                          </select>
                        </div>

                        {/* Reset Filter */}
                        <div className="filter-reset text-nowrap d-flex align-items-center px-3 py-2 text-danger font-weight-bold">
                          <i className="fas fa-redo mr-2"></i> Reset Filter
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className="col-md-12">
              <div className="card  ">
                <div className="card-header">
                  <div className='row'>
                    <div className='col-md-8'>
                      <h4 className="m-0">Total Sales Order ( {allUsersList.length} )</h4>
                    </div>
                    <div className='col-md-3'>
                      <input
                        type="text"
                        className="form-control form-control-sm "
                        placeholder="Search By Sales Order No..."
                        style={{ borderRadius: '9rem' }}
                        onChange={(e) => { }}
                      />
                    </div>
                    <div className='col-md-1'>
                      <div >
                        <button type="button" className="btn btn-tool" id='listOfProjectsHeaderExpandButtion' onClick={(e) => { listOfProjectsHeaderExpandButtionClick(e) }} data-card-widget="collapse">
                          <i className="fas fa-minus"></i>
                        </button>
                        <button type="button" className="btn btn-tool" data-card-widget="maximize">
                          <i className="fas fa-expand"></i>
                        </button>
                      </div>
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
                  <table class="table table-sm" style={{ border: '1px solid lightgray', borderTopRightRadius: '5px 5px', borderCollapse: 'separate' }} id="listOfProjectsTable">
                    <thead>
                      <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ fontWeight: '500' }}><div> <input type='checkbox'></input>
                        </div></th>
                        <th style={{ fontWeight: '500' }}>Sales Order Number</th>
                        <th style={{ fontWeight: '500' }}>Stockist</th>
                        <th style={{ fontWeight: '500' }}>Sales Order Date</th>
                        <th style={{ fontWeight: '500' }}>Order Type</th>
                        <th style={{ fontWeight: '500' }}>Amount (₹)</th>
                        <th style={{ fontWeight: '500' }}>Status</th>
                        <th style={{ fontWeight: '500' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsersList.length > 0 ?
                        allUsersList.map((userObj, index) => {
                          const departmentName = department.find(x => x.departmentID == userObj.accountGroup);
                          return (
                            <tr style={{ textDecoration: userObj.isActive == true ? 'none' : 'line-through' }}>
                              {/* <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>{index + 1}</td> */}
                              {/* <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{userObj.userName || "N/A"}</td> */}
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>
                                <div> <input type='checkbox'></input>
                                </div>
                              </td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>1101</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>Akshay K</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>05/05/2025</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>Special Rate</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>11023.1</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>
                                <span className="px-2 py-1 flex items-center justify-center text-center rounded " onClick={handleNaviagte} style={{ backgroundColor: '#CCF0EB', color: '#00B698', cursor: 'pointer' }}>Order Pending for Approval</span>
                              </td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>
                                {/* <button type="button" class="btn bg-gradient-warning btn-xs" onClick={(e) => { handleEditTaskDetails(userObj) }} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                                  <i class="fas fa-pen" style={{ fontSize: 'smaller' }}></i>
                                </button>
                                {userObj.isActive == true ?
                                  <button type="button" class="btn bg-gradient-danger btn-xs ml-2" onClick={(e) => { handleRemoveUser(userObj) }} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                                    <i class="fas fa-trash" style={{ fontSize: 'smaller' }}></i>
                                  </button>
                                  : ""} */}
                                <button type="button" class="btn btn-xs" onClick={handleNaviagte} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                                  <i class="fas fa-ellipsis-v" style={{ fontSize: 'smaller' }}></i>
                                </button>

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
            </div>
          </div>
        </div>
      </section>

      <div id="confirmCommonModal" class="modal fade confirmCommonModal" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-confirm">
          <div class="modal-content">
            <div class="modal-header text-center">
              <div class="icon-box">
                <i class="fas fa-info mt-2"></i>
              </div>
              <h5 class="modal-title w-100">Are you sure ?</h5>
            </div>
            <div class="modal-body">
              <p class="text-center">By clicking on Yes delete all the user details. Once you deleted it can not be recovered.</p>
            </div>
            <div class="modal-footer col-md-12">
              <button class="btn btn-default btn-sm" data-dismiss="modal">Cancel</button>
              {isLoaderActive ? <PleaseWaitButton className='btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn' /> :
                <button class="btn btn-warning btn-sm pl-3 pr-3 ml-2" onClick={(e) => { yesConfirmSubmitRequest(e) }}>Yes</button>
              }
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}
export default SalesOrderApprovalList;