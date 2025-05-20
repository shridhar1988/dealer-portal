import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { removeExtraSpaces } from "../../common/textOperations";
import { isValidEmail, isValidContact } from "../../common/validations";
import { ToastContainer, toast } from "react-toastify";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import { Link } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
// import { set } from 'react-datepicker/dist/date_utils';

const config = require("../../config/config.json");

const RetailerUserCreation = () => {
  const inputFirstNameReference = useRef(null);
  const inputLastNameReference = useRef(null);
  const inputAddressReference = useRef(null);
  const inputJoiningDateReference = useRef(null);
  const inputDateOfBirthReference = useRef(null);
  const inputUserNameReference = useRef(null);
  const inputEmailReference = useRef(null);
  const inputRoleReference = useRef(null);
  const inputPasswordReference = useRef(null);
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
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [accountGroup, setAccountGroup] = useState("");
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [allUsersList, setAllUsersList] = useState([]);
  const [updateOrDeleteId, setUpdateOrDeleteId] = useState("");
  const [isActiveUser, setIsActiveUser] = useState(true);

  //Added by Akshay
  const inputGSTNumberReference = useRef(null);
  const inputPANNumberReference = useRef(null);

  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPANNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    getUsersList();
  }, []);

  const validatePasswordPolicy = (password) => {
    const policyRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return policyRegex.test(password);
  };
  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      window.initDatePickerFuncation();
      return;
    }
  });

  const handleCancelClick = () => {
    clearAllFields();
    addProjectCardHeaderButtonClick();
  };

  const getUsersList = () => {
    setIsLoaderActive(true);

    window.initDestroyDataTableFuncation();
    axios
      .get(config.API_URL + "RetailerUserCreation/GetAllRetailerUsers")
      .then((response) => {
        if (response.status == 200) {
          if (response.data.success == "success") {
            if (response.data.data.length > 0) {
              setAllUsersList(response.data.data);
              setTimeout(() => {
                window.initDataTableFuncation();
              }, 1000);
            }
          } else {
            toast.error(response.data.message);
            setTimeout(() => {
              window.initDataTableFuncation();
            }, 1000);
          }
        } else if (response.data.status.status == 500) {
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

  // const getAllRolesList = () => {
  //   setIsLoaderActive(true);
  //   axios.get(config.API_URL + 'AuthMaster/GetAllRoles?ClientId=' + config.ClientId, {
  //     headers: config.headers2,
  //   }).then((response) => {
  //     if(response.status == 200) {
  //       if(response.data.success == "success") {
  //         if(response.data.data.length > 0) {
  //           setAllRolesList(response.data.data);
  //         }
  //       } else {
  //         toast.error(response.data.message);
  //       }
  //     } else if(response.data.status.status == 500) {
  //       toast.error("Invalid username or password");
  //     }
  //   }).catch((error) => {
  //     toast.error("Please try again later.");
  //   }).finally(() => {
  //     setIsLoaderActive(false);
  //   })
  // }

  // const getAllDepartments = async () => {
  //   setIsLoaderActive(true);
  //   try {
  //     const response = await axios.get(`${config.API_URL}Department/GetAllDepartments`);
  //     const appsArray = response.data.data || [];
  //     setDepartment(appsArray);
  //   } catch(error) {
  //     console.error('Error fetching departments:', error);
  //     toast.error('Error fetching departments');
  //   } finally {
  //     setIsLoaderActive(false);
  //   }
  // };

  const addProjectCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  };

  const listOfProjectsHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButton").click();
  };

  const handleEditTaskDetails = (userObj) => {
    setIsEdit(true);
    setUserName(userObj.userName);
    setUserEmail(userObj.email);
    setRoleId(userObj.roleID);
    setPassword(userObj.password);
    setContactNumber(userObj.contactNumber);
    setPANNumber(userObj.accountGroup);
    setUpdateOrDeleteId(userObj.userID);
    setFirstName(userObj.firstName);
    setLastName(userObj.lastName);
    setAddress(userObj.address);
    setGstNumber(userObj.clientId);
    // setJoiningDate(userObj.joiningDate);
    setIsActiveUser(userObj.isActive);
    listOfProjectsHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveUser = (userObj) => {
    setUpdateOrDeleteId(userObj.userID);
    window.confirmModalShow();
  };

  // const yesConfirmSubmitRequest = () => {
  //   setIsLoaderActive(true);
  //   let APIMethodName =
  //     "RetailerUserCreation/DeleteUser?ClientId=" +
  //     config.ClientId +
  //     "&UserID=" + &UserID=' + updateOrDeleteId + '&loggedUserId=' + localStorage.getItem("loggedUserId")
  //     updateOrDeleteId;
  //   axios
  //     .post(config.API_URL + APIMethodName, {
  //       headers: config.headers2,
  //     })
  //     .then((response) => {
  //       // console.log(response);
  //       if (response.data.success == "success") {
  //         toast.success("Retailer deleted successfully...");
  //         window.confirmModalHide();
  //         // clearAllFields();
  //         getUsersList();
  //         setIsLoaderActive(false);
  //       } else {
  //         setIsLoaderActive(false);
  //         toast.error(response.data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       if (!error.response.data.success) {
  //         toast.error(error.response.data.message);
  //       } else {
  //         toast.error("Please try again later.");
  //       }
  //       setIsLoaderActive(false);
  //     });
  // };
  const yesConfirmSubmitRequest = () => {
    
    setIsLoaderActive(true);
    console.log("user id", updateOrDeleteId)
    let APIMethodName = 'RetailerUserCreation/DeleteUser?ClientId=' + config.ClientId + '&UserID=' + updateOrDeleteId + '&loggedUserId=' + localStorage.getItem("loggedUserId")
    axios.post(config.API_URL + APIMethodName, {
      headers: config.headers2,
    }).then((response) => {
  
      if (response.data.success === "success") {
   
        toast.success("Retailer deleted successfully...");
        window.confirmModalHide();
        // clearAllFields();
        getUsersList();
        setIsLoaderActive(false);
      } else {
        setIsLoaderActive(false);
        getUsersList();
        toast.error(response.data.message);
      }
    }).catch((error) => {
      // if (!error.response.data.success) {
      //   toast.error(error.response.data.message);
      // } else {
       // toast.error("Unable to delete the data please try again later.");
      // }
      setIsLoaderActive(false);
    })
  }
  const clearAllFields = () => {
    setIsEdit(false);
    setUserName("");
    setUserEmail("");
    setPassword("");
    setContactNumber("");
    setUpdateOrDeleteId("");
    setFirstName("");
    setLastName("");
    setAddress("");
    setGstNumber("");
    setPANNumber("");
    setIsActiveUser(false);

    inputFirstNameReference.current.classList.remove("is-invalid");
    inputLastNameReference.current.classList.remove("is-invalid");
    inputAddressReference.current.classList.remove("is-invalid");
    inputUserNameReference.current.classList.remove("is-invalid");
    inputEmailReference.current.classList.remove("is-invalid");
    inputPasswordReference.current.classList.remove("is-invalid");
    inputContactNumberReference.current.classList.remove("is-invalid");
    inputGSTNumberReference.current.classList.remove("is-invalid");
    inputPANNumberReference.current.classList.remove("is-invalid");
  };

  const changeActiveUser = (event) => {
    setIsActiveUser(event.target.checked);
  };

  // const handleUserSubmit = (e) => {
  //   if (removeExtraSpaces(firstName)) {
  //     if (removeExtraSpaces(lastName)) {
  //       if (removeExtraSpaces(userName)) {
  //         if (removeExtraSpaces(userEmail)) {
  //           if (isValidEmail(userEmail)) {
  //             if (contactNumber){
              
  //               if (contactNumber.length < 10) {
  //                 if (gstNumber) {
  //                   if (panNumber) {
  //                     if (address) {
  //                       if (password) {
  //                         setIsLoaderActive(true);
  //                         let APIMethodName = "";
  //                         if (updateOrDeleteId != "") {
  //                           APIMethodName =
  //                             "RetailerUserCreation/UpdateRetailer";
  //                         } else {
  //                           APIMethodName =
  //                             "RetailerUserCreation/CreateRetailer";
  //                         }
  //                         // let getRoleName = allRolesList.find(x => x.roleID == roleId);
  //                         axios
  //                           .post(
  //                             config.API_URL + APIMethodName,
  //                             {
  //                               createdBy: personalInfo.userID,
  //                               clientId: config.ClientId,
  //                               modifiedBy: personalInfo.userID,
  //                               userID:
  //                                 updateOrDeleteId == ""
  //                                   ? personalInfo.userID
  //                                   : updateOrDeleteId,
  //                               roleID: config.RetailerRole,
  //                               userName: userName,
  //                               email: userEmail,
  //                               password: password,
  //                               contactNumber: contactNumber,
  //                               firstName: firstName,
  //                               lastName: lastName,
  //                               address: address,
  //                               gstNumber: gstNumber,
  //                               panNumber: panNumber,
  //                               isActive: isActiveUser,
  //                               roleName: "Retailer",
  //                             },
  //                             {
  //                               headers: config.header2,
  //                             }
  //                           )
  //                           .then((response) => {
  //                             // console.log(response);
  //                             if (response.data.success == "success") {
  //                               toast.success(
  //                                 isEdit == true
  //                                   ? "Retailer Updated Successfully..."
  //                                   : "Retailer Created Successfully..."
  //                               );
  //                               clearAllFields();
  //                               addProjectCardHeaderButtonClick();
  //                               getUsersList();
  //                               setIsLoaderActive(false);
  //                             } else {
  //                               setIsLoaderActive(false);
  //                               toast.error(response.data.message);
  //                             }
  //                           })
  //                           .catch((error) => {
  //                             if (!error.response.data.success) {
  //                               toast.error(error.response.data.message);
  //                             } else {
  //                               toast.error(
  //                                 "oops something went wrong. please try again later."
  //                               );
  //                             }
  //                             setIsLoaderActive(false);
  //                           });
  //                       } else {
  //                         toast.error("Please enter password.");
  //                         inputPasswordReference.current.focus();
  //                         inputPasswordReference.current.classList.add(
  //                           "is-invalid"
  //                         );
  //                       }
  //                     } else {
  //                       toast.error("Please enter address.");
  //                       inputAddressReference.current.focus();
  //                       inputAddressReference.current.classList.add(
  //                         "is-invalid"
  //                       );
  //                     }
  //                   } else {
  //                     toast.error("Please enter PAN number.");
  //                     inputPANNumberReference.current.focus();
  //                     inputPANNumberReference.current.classList.add(
  //                       "is-invalid"
  //                     );
  //                   }
  //                 } else {
  //                   toast.error("Please enter GST number.");
  //                   inputGSTNumberReference.current.focus();
  //                   inputGSTNumberReference.current.classList.add("is-invalid");
  //                 }
  //               } else {
  //                 toast.error("Please enter 10 digit contact number.");
  //                 inputContactNumberReference.current.focus();
  //                 inputContactNumberReference.current.classList.add(
  //                   "is-invalid"
  //                 );
  //               }
  //             }
  //             else {
  //               toast.error("Please  contact number.");
  //               inputContactNumberReference.current.focus();
  //               inputContactNumberReference.current.classList.add("is-invalid");
  //             }
  //           } else {
  //             toast.error("Please enter valid email.");
  //             inputEmailReference.current.focus();
  //             inputEmailReference.current.classList.add("is-invalid");
  //           }
  //         } else {
  //           toast.error("Please enter email.");
  //           inputEmailReference.current.focus();
  //           inputEmailReference.current.classList.add("is-invalid");
  //         }
  //       } else {
  //         toast.error("Please enter user name.");
  //         inputUserNameReference.current.focus();
  //         inputUserNameReference.current.classList.add("is-invalid");
  //       }
  //     } else {
  //       toast.error("Please enter last name.");
  //       inputLastNameReference.current.focus();
  //       inputLastNameReference.current.classList.add("is-invalid");
  //     }
  //   } else {
  //     toast.error("Please enter first name.");
  //     inputFirstNameReference.current.focus();
  //     inputFirstNameReference.current.classList.add("is-invalid");
  //   }
  // };
const handleUserSubmit = (e) => {
  // Trim and validate first name
  if (!removeExtraSpaces(firstName)) {
    toast.error("Please enter first name.");
    inputFirstNameReference.current.focus();
    inputFirstNameReference.current.classList.add("is-invalid");
    return;
  }

  // Trim and validate last name
  if (!removeExtraSpaces(lastName)) {
    toast.error("Please enter last name.");
    inputLastNameReference.current.focus();
    inputLastNameReference.current.classList.add("is-invalid");
    return;
  }

  // Trim and validate user name
  if (!removeExtraSpaces(userName)) {
    toast.error("Please enter user name.");
    inputUserNameReference.current.focus();
    inputUserNameReference.current.classList.add("is-invalid");
    return;
  }

  // Trim and validate email
  if (!removeExtraSpaces(userEmail)) {
    toast.error("Please enter email.");
    inputEmailReference.current.focus();
    inputEmailReference.current.classList.add("is-invalid");
    return;
  }

  if (!isValidEmail(userEmail)) {
    toast.error("Please enter valid email.");
    inputEmailReference.current.focus();
    inputEmailReference.current.classList.add("is-invalid");
    return;
  }

  // Validate contact number
  if (!contactNumber) {
    toast.error("Please enter contact number.");
    inputContactNumberReference.current.focus();
    inputContactNumberReference.current.classList.add("is-invalid");
    return;
  }

  if (contactNumber.length < 10) {
    toast.error("Please enter 10 digit contact number.");
    inputContactNumberReference.current.focus();
    inputContactNumberReference.current.classList.add("is-invalid");
    return;
  }

  // Validate GST number
  if (!gstNumber) {
    toast.error("Please enter GST number.");
    inputGSTNumberReference.current.focus();
    inputGSTNumberReference.current.classList.add("is-invalid");
    return;
  }

  // Validate PAN number
  if (!panNumber) {
    toast.error("Please enter PAN number.");
    inputPANNumberReference.current.focus();
    inputPANNumberReference.current.classList.add("is-invalid");
    return;
  }

  // Validate address
  if (!address) {
    toast.error("Please enter address.");
    inputAddressReference.current.focus();
    inputAddressReference.current.classList.add("is-invalid");
    return;
  }

  // Validate password
  if (!password) {
    toast.error("Please enter password.");
    inputPasswordReference.current.focus();
    inputPasswordReference.current.classList.add("is-invalid");
    return;
  }

  // All validations passed
  setIsLoaderActive(true);
  const APIMethodName = updateOrDeleteId !== ""
    ? "RetailerUserCreation/UpdateRetailer"
    : "RetailerUserCreation/CreateRetailer";

  axios.post(
    config.API_URL + APIMethodName,
    {
      createdBy: personalInfo.userID,
      clientId: config.ClientId,
      modifiedBy: personalInfo.userID,
      userID: updateOrDeleteId || personalInfo.userID,
      roleID: config.RetailerRole,
      userName: userName,
      email: userEmail,
      password: password,
      contactNumber: contactNumber,
      firstName: firstName,
      lastName: lastName,
      address: address,
      gstNumber: gstNumber,
      panNumber: panNumber,
      isActive: isActiveUser,
      roleName: "Retailer",
    },
    {
      headers: config.header2,
    }
  )
    .then((response) => {
      if (response.data.success === "success") {
        toast.success(
          isEdit ? "Retailer Updated Successfully..." : "Retailer Created Successfully..."
        );
        clearAllFields();
        addProjectCardHeaderButtonClick();
        getUsersList();
      } else {
        toast.error(response.data.message);
      }
      setIsLoaderActive(false);
    })
    .catch((error) => {
      const message =
        error?.response?.data?.message ||
        "Oops, something went wrong. Please try again later.";
      toast.error(message);
      setIsLoaderActive(false);
    });
};

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Manage Retailer</h1>
              {/* <ol className="breadcrumb float-sm-left mt-1">
                <li className="breadcrumb-item"><Link to="/manage-employee">Home</Link></li>
                <li className="breadcrumb-item active">Manage Users</li>
              </ol> */}
            </div>
            <div className="col-sm-6"></div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card ">
                <div className="card-header">
                  <h4 className="card-title ">
                    {" "}
                    {isEdit ? "Update" : "Create"} Retailer User
                  </h4>
                  <div className="card-tools">
                    {/* <button type="button" className="btn btn-danger btn-xs" id='AddNewHeaderButton' onClick={(e) => { addProjectCardHeaderButtonClick(e) }} data-card-widget="collapse">
                      <i className="fas fa-plus"></i> Add Retailer
                    </button> */}
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="maximize"
                    >
                      <i className="fas fa-expand"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body text-sm">
                  <div className="row">
                    {/* <div className="form-group col-md-4">
                      <label style={{ color: "#000" }}>Select Role<sup style={{ color: "red" }}>*</sup></label>
                      <select className="form-control form-control-sm" ref={inputRoleReference} value={roleId} onChange={(e) => { setRoleId(e.target.value); inputRoleReference.current.classList.remove('is-invalid'); }}>
                        <option value="">--Select--</option>
                        {allRolesList.map((role) => {
                          return (
                            <option key={"Mana_" + role.roleID} value={role.roleID}>{role.roleName}</option>
                          )
                        })}
                      </select>
                    </div> */}
                    <div className="form-group col-md-4">
                      <label
                        className="labelStyle"
                        for="firstNameInput"
                        style={{ color: "#000" }}
                      >
                        First Name<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="firstNameInput"
                        ref={inputFirstNameReference}
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          inputFirstNameReference.current.classList.remove(
                            "is-invalid"
                          );
                        }}
                        placeholder="Retailer First Name"
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label
                        className="labelStyle"
                        for="lastNameInput"
                        style={{ color: "#000" }}
                      >
                        Last Name<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="lastNameInput"
                        ref={inputLastNameReference}
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          inputLastNameReference.current.classList.remove(
                            "is-invalid"
                          );
                        }}
                        placeholder="Retailer Last Name"
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label
                        className="labelStyle"
                        for="userNameInput"
                        style={{ color: "#000" }}
                      >
                        User Name<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="userNameInput"
                        ref={inputUserNameReference}
                        value={userName}
                        onChange={(e) => {
                          setUserName(e.target.value);
                          inputUserNameReference.current.classList.remove(
                            "is-invalid"
                          );
                        }}
                        placeholder="Retailer User Name"
                      />
                    </div>
                    <div className="form-group  col-md-4">
                      <label
                        className="labelStyle"
                        for="userEmailInput"
                        style={{ color: "#000" }}
                      >
                        Email<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="userEmailInput"
                        ref={inputEmailReference}
                        value={userEmail}
                        onChange={(e) => {
                          setUserEmail(e.target.value);
                          inputEmailReference.current.classList.remove(
                            "is-invalid"
                          );
                        }}
                        placeholder="Retailer Email"
                      />
                    </div>
                    {/* <div className="form-group col-md-4">
                      <label for="passwordInput" style={{ color: "#000" }}>Password<sup style={{ color: "red" }}>*</sup></label>
                      <input type="password" className="form-control form-control-sm" id="passwordInput" ref={inputPasswordReference} value={password} onChange={(e) => { setPassword(e.target.value); inputPasswordReference.current.classList.remove('is-invalid'); }} placeholder="Password" />
                      <span toggle="#passwordInput" class="fa fa-fw fa-eye-slash field-icon-password toggle-password" style={{ position: 'absolute', top: '70%', right: '15px', transform: 'translateY(-50%)', cursor: 'pointer', }}></span>
                    </div> */}

                    <div className="form-group  col-md-4">
                      <label
                        className="labelStyle"
                        for="contactNumberInput"
                        style={{ color: "#000" }}
                      >
                        Contact Number<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="contactNumberInput"
                        ref={inputContactNumberReference}
                        value={contactNumber}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,10}$/.test(value)) {
                            setContactNumber(value);
                            inputContactNumberReference.current.classList.remove(
                              "is-invalid"
                            );
                          }
                        }}
                        placeholder="Contact Number"
                      />
                    </div>
                    {/* <div className="form-group col-md-4">
                      <label style={{ color: "#000" }}>Select Department<sup style={{ color: "red" }}>*</sup></label>
                      <select className="form-control form-control-sm" ref={inputAccountGroupReference} value={accountGroup} onChange={(e) => { setAccountGroup(e.target.value); inputAccountGroupReference.current.classList.remove('is-invalid'); }}>
                        <option value="">--Select--</option>
                        {department.map((role, index) => (
                          <option key={role.departmentID} value={role.departmentID}>
                            {role.departmentName}
                          </option>
                        ))}
                      </select>
                    </div> */}
                    <div className="form-group col-md-4">
                      <label className="labelStyle" style={{ color: "#000" }}>
                        GST Number
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        ref={inputGSTNumberReference}
                        value={gstNumber}
                        onChange={(e) => {
                          setGstNumber(e.target.value);
                          inputGSTNumberReference.current.classList.remove(
                            "is-invalid"
                          );
                        }}
                        placeholder="GST Number"
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label className="labelStyle" style={{ color: "#000" }}>
                        PAN Number
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        ref={inputPANNumberReference}
                        value={panNumber}
                        onChange={(e) => {
                          setPANNumber(e.target.value);
                          inputPANNumberReference.current.classList.remove(
                            "is-invalid"
                          );
                        }}
                        placeholder="PAN Number"
                      />
                    </div>
                    <div className="form-group  col-md-4">
                      <label
                        className="labelStyle"
                        for="addressInput"
                        style={{ color: "#000" }}
                      >
                        Address
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        style={{ resize: "none" }}
                        id="addressInput"
                        ref={inputAddressReference}
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          inputAddressReference.current.classList.remove(
                            "is-invalid"
                          );
                        }}
                        placeholder="Enter Address"
                      ></textarea>
                    </div>
                    <div className="form-group col-md-4 position-relative">
                      <label
                        className="labelStyle"
                        htmlFor="passwordInput"
                        style={{ color: "#6C757D" }}
                      >
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
                          inputPasswordReference.current.classList.remove(
                            "is-invalid"
                          );
                        }}
                        onBlur={() => {
                          if (!validatePasswordPolicy(password)) {
                            toast.error(
                              "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
                            );
                            inputPasswordReference.current.classList.add(
                              "is-invalid"
                            );
                          }
                        }}
                        placeholder="Password"
                      />
                      <span
                        className={`fa fa-fw field-icon-password toggle-password ${
                          showPassword ? "fa-eye" : "fa-eye-slash"
                        }`}
                        onClick={() => setShowPassword(!showPassword)}
                      ></span>
                    </div>
                    <div class="form-group">
                      <div class="custom-control custom-switch">
                        <input
                          type="checkbox"
                          class="custom-control-input"
                          id="customSwitch1"
                          onChange={(e) => changeActiveUser(e)}
                          value={isActiveUser}
                          checked={isActiveUser}
                        />
                        <label
                          class="custom-control-label labelStyle"
                          for="customSwitch1"
                          style={{ color: "#000" }}
                        >
                          User Can Access This Account?
                        </label>
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
                      className="btn btn-primary float-right btn-xs ml-2 pl-5 pr-5"
                      onClick={(e) => {
                        handleUserSubmit(e);
                      }}
                    >
                      {" "}
                      {isEdit ? "Update" : "Create"}
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn btn-default float-right btn-xs pl-5 pr-5"
                    onClick={(e) => {
                      handleCancelClick(e);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title text-sm">
                    Users List ( {allUsersList.length} )
                  </h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      id="listOfProjectsHeaderExpandButtion"
                      onClick={(e) => {
                        listOfProjectsHeaderExpandButtionClick(e);
                      }}
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="maximize"
                    >
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
                  <table class="table table-bordered table-sm table-striped">
                    <thead>
                      <tr>
                        <th
                          style={{ fontWeight: "500", fontSize: "smaller" }}
                          className="text-center"
                        >
                          Sr. No.
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          User Name
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          First Name
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          Last Name
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          GST Number
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          PAN Number
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          Email
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          Contact Number
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          Role
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          Account Status
                        </th>
                        <th
                          style={{
                            fontWeight: "500",
                            fontSize: "smaller",
                            width: "7%",
                          }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsersList.length > 0
                        ? allUsersList.map((userObj, index) => {
                            const departmentName = department.find(
                              (x) => x.departmentID == userObj.accountGroup
                            );
                            return (
                              <tr
                                style={{
                                  textDecoration:
                                    userObj.isActive == true
                                      ? "none"
                                      : "line-through",
                                }}
                              >
                                <td
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "smaller",
                                  }}
                                  className="text-center text-sm"
                                >
                                  {index + 1}
                                </td>
                                <td
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "smaller",
                                  }}
                                >
                                  {userObj.userName || "N/A"}
                                </td>
                                <td
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "smaller",
                                  }}
                                >
                                  {userObj.firstName || "N/A"}
                                </td>
                                <td
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "smaller",
                                  }}
                                >
                                  {userObj.lastName || "N/A"}
                                </td>
                                <td
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "smaller",
                                  }}
                                >
                                  {userObj.clientId || "N/A"}
                                </td>
                                <td
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "smaller",
                                  }}
                                >
                                  {userObj.accountGroup || "N/A"}
                                </td>
                                <td
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "smaller",
                                  }}
                                >
                                  {userObj.email || "N/A"}
                                </td>
                                <td
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "smaller",
                                  }}
                                >
                                  {userObj.contactNumber || "N/A"}
                                </td>
                                <td
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "smaller",
                                  }}
                                >
                                  {userObj.roleName || "N/A"}
                                </td>
                                <td
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "smaller",
                                  }}
                                >
                                  {userObj.isActive == true
                                    ? "Active"
                                    : "In-active"}
                                </td>
                                <td
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "smaller",
                                  }}
                                  className="text-center text-sm"
                                >
                                  <button
                                    type="button"
                                    class="btn bg-gradient-warning btn-xs"
                                    onClick={(e) => {
                                      handleEditTaskDetails(userObj);
                                    }}
                                       style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '50%' }}
                                  >
                                    <i
                                      class="fas fa-pen"
                                      style={{ fontSize: "smaller" }}
                                    ></i>
                                  </button>
                                  {userObj.isActive == true ? (
                                    <button
                                      type="button"
                                      class="btn bg-gradient-danger btn-xs ml-2"
                                      onClick={(e) => {
                                        handleRemoveUser(userObj);
                                      }}
                                         style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '50%' }}
                                    >
                                      <i
                                        class="fas fa-trash"
                                        style={{ fontSize: "smaller" }}
                                      ></i>
                                    </button>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        : ""}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        id="confirmCommonModal"
        class="modal fade confirmCommonModal"
        data-backdrop="static"
        tabindex="-1"
        role="dialog"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-confirm">
          <div class="modal-content">
            <div class="modal-header text-center">
              {/* <div class="icon-box">
                <i class="fas fa-info mt-2"></i>
              </div> */}
              <h5 class="modal-title w-100">Are you sure ?</h5>
            </div>
            <div class="modal-body">
              <p class="text-center">
                By clicking on Yes delete all the user details. Once you deleted
                it can not be recovered.
              </p>
            </div>
            <div class="modal-footer col-md-12">
              <button class="btn btn-default btn-sm" data-dismiss="modal">
                Cancel
              </button>
              {isLoaderActive ? (
                <PleaseWaitButton className="btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn" />
              ) : (
                <button
                  class="btn btn-warning btn-sm pl-3 pr-3 ml-2"
                  onClick={(e) => {
                    yesConfirmSubmitRequest(e);
                  }}
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

export default RetailerUserCreation;
