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

const DeliveryTracking = () => {
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
            <div className="col-sm-8">
              <h1 className="m-0">Delivery Tracking</h1>
              <ol className="breadcrumb float-sm-left mt-1">
                <li className="breadcrumb-item"><Link to="/manage-employee">Home</Link></li>
                <li className="breadcrumb-item active">Delivery Tracking</li>
              </ol>
            </div>
            <div className="col-sm-4">
            <input
                        type="text"
                        className="form-control form-control-sm "
                        placeholder="Search By Sales Order No..."
                        style={{ borderRadius: '9rem'}}
                        onChange={(e) => {}}
                      />
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
         <div className='row'>
            <div className="col-md-12">
              <div className="card">
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
                      <th style={{ fontWeight: '500' }}>Invoice Number</th>
                      <th style={{ fontWeight: '500' }}>Invoice Date</th>
                        <th style={{ fontWeight: '500' }}>Sales Order Number</th>                        
                        <th style={{ fontWeight: '500' }}>Sales Order Date</th>
                        <th style={{ fontWeight: '500' }}>Transporter</th>
                        <th style={{ fontWeight: '500' }}>LR No.</th>
                        <th style={{ fontWeight: '500' }}>LR Date</th>
                        <th style={{ fontWeight: '500' }}>EWay Bill No</th>
                        <th style={{ fontWeight: '500' }}>Amount (₹)</th>
                        <th style={{ fontWeight: '500' }}>Order Recived</th>
                         
                      </tr>
                    </thead>
                    <tbody>
                      {allUsersList.length > 0 ?
                        allUsersList.map((userObj, index) => {
                          const departmentName = department.find(x => x.departmentID == userObj.accountGroup);
                          return (
                            <tr style={{ textDecoration: userObj.isActive == true ? 'none' : 'line-through' }}>
                               <td style={{ fontWeight: '400', fontSize: 'smaller' }}>9001057963</td>  
                               <td style={{ fontWeight: '400', fontSize: 'smaller' }}>27.04.2025</td> 
                               <td style={{ fontWeight: '400', fontSize: 'smaller' }}>1101</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>05/05/2025</td>                           
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>Akshay K</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>7963</td> 
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>07-05-2025</td>  
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>661256453989</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>11023.1</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center'>
                                  <button type="button" class="px-2 py-1 flex items-center justify-center text-center rounded" onClick={handleAcceptButtonClick} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', border: 'none', lineHeight: '1', borderRadius: '.25rem',backgroundColor: '#CCF0EB' ,color: '#00B698', cursor: 'pointer' }}>
                                 Accept
                                </button>
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
                  <i className="fas fa-times mt-3 mr-2 float-right" onClick={handleCloseModal} style={{ cursor: "pointer",color: "#333" }} ></i>
          </div>
          <div className="col-md-12">
             <i className="bi bi-x-lg mt-0 float-right" style={{ cursor: "pointer",color: "#333" }} ></i>
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
export default DeliveryTracking;