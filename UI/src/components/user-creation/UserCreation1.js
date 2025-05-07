import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { removeExtraSpaces } from '../../common/textOperations';
import { isValidEmail, isValidContact } from '../../common/validations';
import { ToastContainer, toast } from 'react-toastify';
import PleaseWaitButton from '../../shared/PleaseWaitButton';
import { Link } from 'react-router-dom'
import axios from 'axios';
import $ from "jquery";

const config = require('../../config/config.json');

const UserCreation = () => {

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

  const handleCancelClick = () => {
    clearAllFields();
    addProjectCardHeaderButtonClick();
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
  const getMappedPlantsForCompany = async (companyId) => {
    try {
      setIsLoaderActive(true);
      
      const mappingResponse = await axios.get(
        `${config.API_URL}CompanyPlantMappingMaster/GetAllCompanyPlantMappingsBasedOnCompanyId?companyId=${companyId}`,
        { headers: config.headers2 }
      );
      if (mappingResponse.status === 200 && mappingResponse.data.success === "True") {
        const mappedPlantIds = mappingResponse.data.data.map(item => item.plantId.toString());
        const filteredPlants = allPlantList.filter(plant =>
          mappedPlantIds.includes(plant.id.toString())
        );      
        setAllPlantList(filteredPlants);
      } else {
        toast.error(mappingResponse.data.message || "Failed to fetch plant mappings.");
        setAllPlantList([]);
      }
    } catch (error) {
      toast.error("Failed to fetch plant mappings. Try again later.");
      setAllPlantList([]);
    } finally {
      setIsLoaderActive(false);
    }
  };
  
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
  const validatePasswordPolicy = (password) => {
    const policyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return policyRegex.test(password);
  };
  
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
  const changeActiveUser = (event) => {
    setIsActiveUser(event.target.checked);
  }
  const handleUserSubmit = (e) => {
    window.initDestroyDataTableFuncation();
    if(removeExtraSpaces(userEmail)) {
      if(removeExtraSpaces(userName)) {
        if(removeExtraSpaces(firstName)) {
          if(removeExtraSpaces(lastName)) {
            if(removeExtraSpaces(contactNumber)) {
              if(isValidEmail(userEmail)) {
                if(password) {
                  if (password === passwordConfirm) {
                  if(roleId) {
                     if(companyId) {
                      if(plantId) {
                      if(dateOfBirth) {
                          if(address) {
                            debugger;
                            setIsLoaderActive(true);
                            let APIMethodName = ''
                            if(updateOrDeleteId !== "") {
                              APIMethodName = 'AuthMaster/UpdateUser'
                            } else {
                              APIMethodName = 'AuthMaster/CreateUser'
                            }
                            let getRoleName = allRolesList.find(x => x.roleID == roleId);
                            axios.post(config.API_URL + APIMethodName, {
                              "createdBy": personalInfo.userID,
                              "clientId": config.ClientId,
                              "modifiedBy": personalInfo.userID,
                              "userID": updateOrDeleteId,
                              "roleID": roleId,
                              "userName": userName,
                              "email": userEmail,
                              "password": password,
                              "contactNumber": contactNumber,
                              "accountGroup": companyId,
                              "firstName": firstName,
                              "lastName": lastName,
                              "address": address,
                              "dateOfBirth": dateOfBirth,
                              "isActive": true,
                              "joiningDate": plantId,
                              "roleName": getRoleName.roleName
                            }, {
                              headers: config.headers3,
                            }).then((response) => {
                               console.log("Create user",response);
                              if(response.data.success == "success") {
                                debugger;
                                if(updateOrDeleteId !== "")
                               { 
                                toast.success("User Updated Successfully...");
                                }else{
                                  toast.success("User Created Successfully...");
                                }
                                
                                clearAllFields();
                                addProjectCardHeaderButtonClick();
                                getUsersList();
                                setIsLoaderActive(false);
                                // setTimeout(() => {
                                //   window.initDataTableFuncation();
                                // }, 1000)
                              } else {
                                setIsLoaderActive(false);
                                toast.error(response.data.message);
                              }
                            }).catch((error) => {
                              toast.error("oops something went wrong. please try again later.");
                              setIsLoaderActive(false);
                            })
                          } else {
                            toast.error("Please enter address.");
                            inputAddressReference.current.focus();
                            inputAddressReference.current.classList.add('is-invalid');
                          }
                        } else {
                        toast.error("Please select date of birth.");
                        inputDateOfBirthReference.current.focus();
                        inputDateOfBirthReference.current.classList.add('is-invalid');
                      }
                    } else {
                      toast.error("Please select plant.");
                      inputPlantReference.current.focus();
                      inputPlantReference.current.classList.add('is-invalid');
                    }
                    } else {
                      toast.error("Please select company.");
                      inputCompanyReference.current.focus();
                      inputCompanyReference.current.classList.add('is-invalid');
                    }
                  } else {
                    
                    toast.error("Please select role.");
                    inputRoleReference.current.focus();
                    inputRoleReference.current.classList.add('is-invalid');
                  }
                } else {
                  toast.error("Passwords do not match.");
                  inputConfirmPasswordReference.current.focus();
                  inputConfirmPasswordReference.current.classList.add('is-invalid');
                }
              
                } else {
                  toast.error("Please enter password.");
                  inputPasswordReference.current.focus();
                  inputPasswordReference.current.classList.add('is-invalid');
                }
              } else {
                toast.error("Please enter valid email.");
                inputEmailReference.current.focus();
                inputEmailReference.current.classList.add('is-invalid');
              }
            } else {
              
              toast.error("Please enter mobile number.");
              inputContactNumberReference.current.focus();
              inputContactNumberReference.current.classList.add('is-invalid');
            }
          } else {
            toast.error("Please enter last name.");
            inputLastNameReference.current.focus();
            inputLastNameReference.current.classList.add('is-invalid');           
          }
        } else {
          toast.error("Please enter first name.");
            inputFirstNameReference.current.focus();
            inputFirstNameReference.current.classList.add('is-invalid');
         }
      } else {
        toast.error("Please enter user name.");
            inputUserNameReference.current.focus();
            inputUserNameReference.current.classList.add('is-invalid');       
      }
    } else {
      toast.error("Please enter email.");
      inputEmailReference.current.focus();
      inputEmailReference.current.classList.add('is-invalid');
    }
  }

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Manage Users</h1>
              <ol className="breadcrumb float-sm-left mt-1">
                <li className="breadcrumb-item"><Link to="/manage-employee">Home</Link></li>
                <li className="breadcrumb-item active">Manage Users</li>
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
              <div className="card card-outline card-primary collapsed-card">
                <div className="card-header">
                  <h3 className="card-title text-sm">Create New User</h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-danger btn-xs" id='AddNewHeaderButton' onClick={(e) => { addProjectCardHeaderButtonClick(e) }} data-card-widget="collapse">
                      <i className="fas fa-plus"></i> Add New User
                    </button>
                    <button type="button" className="btn btn-tool" data-card-widget="maximize">
                      <i className="fas fa-expand"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body text-sm" >
                  <div className='row'>
                  <div className="form-group  col-md-4">
                      <label for="userEmailInput" style={{ color: "#000" }}>Email<sup style={{ color: "red" }}>*</sup></label>
                      <input type="text" className="form-control form-control-sm" id="userEmailInput" ref={inputEmailReference} value={userEmail} onChange={(e) => {
                        setUserEmail(e.target.value);
                        inputEmailReference.current.classList.remove('is-invalid');
                      }} placeholder="Employee Email" />
                    </div>
                  <div className="form-group col-md-4">
                      <label for="userNameInput" style={{ color: "#000" }}>User Name<sup style={{ color: "red" }}>*</sup></label>
                      <input type="text" className="form-control form-control-sm" id="userNameInput" ref={inputUserNameReference} value={userName} onChange={(e) => {
                        setUserName(e.target.value);
                        inputUserNameReference.current.classList.remove('is-invalid');
                      }} placeholder="Employee User Name" />
                    </div>
                    <div className="form-group col-md-4">
                      <label for="firstNameInput" style={{ color: "#000" }}>First Name<sup style={{ color: "red" }}>*</sup></label>
                      <input type="text" className="form-control form-control-sm" id="firstNameInput" ref={inputFirstNameReference} value={firstName} onChange={(e) => {
                        setFirstName(e.target.value);
                        inputFirstNameReference.current.classList.remove('is-invalid');
                      }} placeholder="Employee First Name" />
                    </div>
                    <div className="form-group col-md-4">
                      <label for="lastNameInput" style={{ color: "#000" }}>Last Name<sup style={{ color: "red" }}>*</sup></label>
                      <input type="text" className="form-control form-control-sm" id="lastNameInput" ref={inputLastNameReference} value={lastName} onChange={(e) => {
                        setLastName(e.target.value);
                        inputLastNameReference.current.classList.remove('is-invalid');
                      }} placeholder="Employee Last Name" />
                    </div>
                    <div className="form-group  col-md-4">
                      <label for="contactNumberInput" style={{ color: "#000" }}>Contact Number<sup style={{ color: "red" }}>*</sup></label>
                      <input type="text" className="form-control form-control-sm" id="contactNumberInput" ref={inputContactNumberReference} value={contactNumber} onChange={(e) => {
                        const value = e.target.value;
                        if(/^\d{0,10}$/.test(value)) {
                          setContactNumber(value);
                          inputContactNumberReference.current.classList.remove('is-invalid');
                        }
                      }} placeholder="Contact Number" />
                    </div>  
                    {/* <div className="form-group col-md-4">
                      <label for="passwordInput" style={{ color: "#000" }}>Password<sup style={{ color: "red" }}>*</sup></label>
                      <input type="password" className="form-control form-control-sm" id="passwordInput" ref={inputPasswordReference} value={password} onChange={(e) => { setPassword(e.target.value); inputPasswordReference.current.classList.remove('is-invalid'); }} placeholder="Password" />
                      <span toggle="#passwordInput" class="fa fa-fw fa-eye-slash field-icon-password toggle-password"></span>
                    </div>
                    <div className="form-group col-md-4">
                      <label for="passwordInput" style={{ color: "#000" }}>Confirm Password<sup style={{ color: "red" }}>*</sup></label>
                      <input type="password" className="form-control form-control-sm" id="passwordInput1" ref={inputConfirmPasswordReference} value={passwordConfirm} onChange={(e) => { setConfirmPassword(e.target.value); inputConfirmPasswordReference.current.classList.remove('is-invalid'); }} placeholder="Confirm Password" />
                      <span toggle="#passwordInput1" class="fa fa-fw fa-eye-slash field-icon-password toggle-password"></span>
                    </div> */}
                    <div className="form-group col-md-4 position-relative">
                        <label htmlFor="passwordInput" style={{ color: "#000" }}>
                          Password<sup style={{ color: "red" }}>*</sup>
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control form-control-sm"
                          id="passwordInput"
                          ref={inputPasswordReference}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            inputPasswordReference.current.classList.remove('is-invalid');
                          }}
                          onBlur={() => {
                            if (!validatePasswordPolicy(password)) {
                              toast.error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
                              inputPasswordReference.current.classList.add('is-invalid');
                            }
                          }}
                          placeholder="Password"
                        />
                        <span
                          className={`fa fa-fw field-icon-password toggle-password ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                          onClick={() => setShowPassword(!showPassword)}                         
                        ></span>
                      </div>

                      <div className="form-group col-md-4 position-relative">
                        <label htmlFor="passwordInput1" style={{ color: "#000" }}>
                          Confirm Password<sup style={{ color: "red" }}>*</sup>
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control form-control-sm"
                          id="passwordInput1"
                          ref={inputConfirmPasswordReference}
                          value={passwordConfirm}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            inputConfirmPasswordReference.current.classList.remove('is-invalid');
                          }}
                          onBlur={() => {
                            if (password !== passwordConfirm) {
                              toast.error("Passwords do not match.");
                              inputConfirmPasswordReference.current.classList.add('is-invalid');
                            }
                          }}
                          placeholder="Confirm Password"
                        />
                        <span
                          className={`fa fa-fw field-icon-password toggle-password ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                          onClick={() => setShowPassword(!showPassword)}
                        ></span>
                      </div>


                    <div className="form-group col-md-4">
                      <label style={{ color: "#000" }}>Select Role<sup style={{ color: "red" }}>*</sup></label>
                      <select className="form-control form-control-sm" ref={inputRoleReference} value={roleId} onChange={(e) => { setRoleId(e.target.value); inputRoleReference.current.classList.remove('is-invalid'); }}>
                        <option value="">--Select--</option>
                        {allRolesList.map((role) => {
                          return (
                            <option key={"Mana_" + role.roleID} value={role.roleID}>{role.roleName}</option>
                          )
                        })}
                      </select>
                    </div>
                    <div className="form-group col-md-4">
                      <label style={{ color: "#000" }}>Select Company<sup style={{ color: "red" }}>*</sup></label>
                      <select className="form-control form-control-sm" ref={inputCompanyReference} value={companyId} onChange={(e) => {
                              const selectedCompanyId = e.target.value;
                              console.log("selectedCompanyId", selectedCompanyId)
                              setCompanyId(selectedCompanyId);
                              setPlantId(""); // Reset plant
                              inputCompanyReference.current.classList.remove("is-invalid");

                              if (selectedCompanyId) {
                                getMappedPlantsForCompany(selectedCompanyId);
                              } else {
                                setAllPlantList([]);
                              }
                            }}>
                        <option value="">--Select--</option>
                        {allCompanyList.map((role) => {
                          return (
                            <option key={role.id} value={role.id}>{role.companyName}</option>
                          )
                        })}
                      </select>
                    </div>
                    <div className="form-group col-md-4">
                      <label style={{ color: "#000" }}>Select Plant<sup style={{ color: "red" }}>*</sup></label>
                      <select className="form-control form-control-sm" ref={inputPlantReference} value={plantId} onChange={(e) => { setPlantId(e.target.value); inputPlantReference.current.classList.remove('is-invalid'); }}>
                        <option value="">--Select--</option>
                        {allPlantList.map((role) => {
                          return (
                            <option key={role.Id} value={role.Id}>{role.plantName}</option>
                          )
                        })}
                      </select>
                    </div>
                    <div className="form-group col-md-4">
                      <label style={{ color: "#000" }}>Date Of Birth</label>
                      <input type="date" className="form-control form-control-sm" ref={inputDateOfBirthReference} value={dateOfBirth} onChange={(e) => { setdateOfBirth(e.target.value); inputDateOfBirthReference.current.classList.remove('is-invalid') }} placeholder='Date Of Birth' />
                    </div>
                    <div className="form-group  col-md-8">
                      <label for="addressInput" style={{ color: "#000" }}>Address</label>
                      <textarea className="form-control form-control-sm" style={{ resize: 'none' }} id="addressInput" ref={inputAddressReference} value={address} onChange={(e) => { setAddress(e.target.value); inputAddressReference.current.classList.remove('is-invalid') }} placeholder="Enter Address"></textarea>
                    </div>
                    <div class="form-group col-md-5">
                      <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" id="customSwitch1" onChange={(e) => changeActiveUser(e)} value={isActiveUser} checked={isActiveUser} />
                        <label class="custom-control-label" for="customSwitch1" style={{ color: "#000" }}>User Can Access This Account?</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer text-sm">
                  {isLoaderActive ? <PleaseWaitButton className='float-right btn-xs ml-2 font-weight-medium auth-form-btn' /> :
                    <button type="submit" className="btn btn-success float-right btn-xs ml-2" onClick={(e) => { handleUserSubmit(e) }}>Save & Submit</button>
                  }
                  <button type="submit" className="btn btn-default float-right btn-xs" onClick={(e) => { handleCancelClick(e) }}>Cancel</button>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className="col-md-12">
              <div className="card card-outline card-primary ">
                <div className="card-header">
                  <h3 className="card-title text-sm">Users List ( {allUsersList.length} )</h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" id='listOfProjectsHeaderExpandButtion' onClick={(e) => { listOfProjectsHeaderExpandButtionClick(e) }} data-card-widget="collapse">
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
                  <table  class="table table-bordered table-sm table-striped">
                    <thead>
                      <tr>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }} className='text-center'>Sr. No.</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>User Name</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>First Name</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Last Name</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Date Of Birth</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Date Of Joining</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Email</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Contact Number</th>
                        {/* <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Department Name</th> */}
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Role</th>
                        {/* <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Account Status</th> */}
                        <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsersList.length > 0 ?
                        allUsersList.map((userObj, index) => {
                          const departmentName = department.find(x => x.departmentID == userObj.accountGroup);
                          return (
                            <tr style={{ textDecoration: userObj.isActive == true ? 'none' : 'line-through' }}>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>{index + 1}</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{userObj.userName || "N/A"}</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{userObj.firstName || "N/A"}</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{userObj.lastName || "N/A"}</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{userObj.dateOfBirth || "N/A"}</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{userObj.joiningDate || "N/A"}</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{userObj.email || "N/A"}</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{userObj.contactNumber || "N/A"}</td>
                              {/* <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{departmentName ? departmentName.departmentName : "N/A"}</td> */}
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{userObj.roleName || "N/A"}</td>
                              {/* <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{userObj.isActive == true ? "Active" : "In-active"}</td> */}
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>
                                <button type="button" class="btn bg-gradient-warning btn-xs" onClick={(e) => { handleEditTaskDetails(userObj) }} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                                  <i class="fas fa-pen" style={{ fontSize: 'smaller' }}></i>
                                </button>
                                {userObj.isActive == true ?
                                  <button type="button" class="btn bg-gradient-danger btn-xs ml-2" onClick={(e) => { handleRemoveUser(userObj) }} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                                    <i class="fas fa-trash" style={{ fontSize: 'smaller' }}></i>
                                  </button>
                                  : ""}
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
export default UserCreation;