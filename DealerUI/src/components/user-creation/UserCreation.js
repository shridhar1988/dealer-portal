import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { removeExtraSpaces } from "../../common/textOperations";
import { isValidEmail, isValidContact } from "../../common/validations";
import { ToastContainer, toast } from "react-toastify";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import $ from "jquery";

const config = require("../../config/config.json");

const UserCreation = () => {
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
  const [isEdit, setIsEdit] = useState(false);
  const [showActiveUsers, setShowActiveUsers] = useState(true); // New state for toggling active/inactive users
const [showRetailerUsers, setShowRetailerUsers] = useState(false);
  useEffect(() => {
    getAllRolesList();
    getUsersList();
    getAllComapnyList();
    getAllPlantList();
    // getAllDepartments();
  }, []);

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
  const getUsersList = (filterRetailers = showRetailerUsers) => {
  setIsLoaderActive(true);
  window.initDestroyDataTableFuncation();

  axios
    .get(`${config.API_URL}AuthMaster/GetAllUsers?ClientId=${config.ClientId}`, {
      headers: config.headers2,
    })
    .then((response) => {
      if (response.status === 200 && response.data.success === "success") {
        let users = response.data.data;
        if (filterRetailers) {
          users = users.filter(user => user.roleName === "Retailer");
        }
        setAllUsersList(users);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    })
    .catch(() => {
      toast.error("Please try again later.");
    })
    .finally(() => {
      setIsLoaderActive(false);
    });
};

  // const getUsersList = () => {
  //   // window.initDestroyDataTableFuncation();

  //   setIsLoaderActive(true);

  //   window.initDestroyDataTableFuncation();
  //   axios
  //     .get(
  //       config.API_URL + "AuthMaster/GetAllUsers?ClientId=" + config.ClientId,
  //       {
  //         headers: config.headers2,
  //       }
  //     )
  //     .then((response) => {
  //       if (response.status == 200) {
  //         if (response.data.success == "success") {
  //           if (response.data.data.length > 0) {

  //             setAllUsersList(response.data.data);
  //             if(!showRetailerUsers)
  //             {
          
  //               setAllUsersList(response.data.data.filter(x=>x.roleName == "Retailer"))
  //             }
  //             // setTimeout(() => {
  //             //   window.initDataTableFuncation();
  //             // }, 1000)
  //           }
  //         } else {
  //           toast.error(response.data.message);
  //           // setTimeout(() => {
  //           //   window.initDataTableFuncation();
  //           // }, 1000)
  //         }
  //       } else if (response.data.status.status == 500) {
  //         toast.error("Invalid username or password");
  //       }
  //     })
  //     .catch((error) => {
  //       // toast.error("Please try again later.");
  //     })
  //     .finally(() => {
  //       setIsLoaderActive(false);
  //     });
  // };
  const getAllRolesList = () => {
    setIsLoaderActive(true);

    axios
      .get(
        config.API_URL + "AuthMaster/GetAllRoles?ClientId=" + config.ClientId,
        {
          headers: config.headers2,
        }
      )
      .then((response) => {
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
      })
      .catch((error) => {
        toast.error("Please try again later.");
      })
      .finally(() => {
        setIsLoaderActive(false);
      });
  };
  const getAllComapnyList = () => {
    setIsLoaderActive(true);
    axios
      .get(config.API_URL + "CompanyMaster/GetAllCompany", {
        headers: config.headers2,
      })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.success === "True") {
            if (response.data.data.length > 0) {
              setAllCompanyList(response.data.data);
            }
          } else {
            toast.error(response.data.message);
          }
        } else if (response.data.status.status === 500) {
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
  const getMappedPlantsForCompany = async (companyId) => {
    try {
      setIsLoaderActive(true);

      const mappingResponse = await axios.get(
        `${config.API_URL}CompanyPlantMappingMaster/GetAllCompanyPlantMappingsBasedOnCompanyId?companyId=${companyId}`,
        { headers: config.headers2 }
      );
      if (
        mappingResponse.status === 200 &&
        mappingResponse.data.success === "True"
      ) {
        const mappedPlantIds = mappingResponse.data.data.map((item) =>
          item.plantId.toString()
        );
        const filteredPlants = allPlantList.filter((plant) =>
          mappedPlantIds.includes(plant.id.toString())
        );
        setAllPlantList(filteredPlants);
      } else {
        toast.error(
          mappingResponse.data.message || "Failed to fetch plant mappings."
        );
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
    axios
      .get(config.API_URL + "PlantMaster/GetAllPlants", {
        headers: config.headers2,
      })
      .then((response) => {
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
      })
      .catch((error) => {
        toast.error("Please try again later.");
      })
      .finally(() => {
        setIsLoaderActive(false);
      });
  };
  const addProjectCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  };
  const addNewUser = () => {
    navigate("/create-user");
  };
  const listOfProjectsHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButton").click();
  };
  // const handleEditTaskDetails = (userObj) => {
  //   localStorage.setItem('Edit UserId',userObj.userID);
  //   localStorage.setItem('EditUserData',[userObj]);

  //   console.log('edit called',userObj)
  //   setIsEdit(true);
  //   setUserName(userObj.userName);
  //   setUserEmail(userObj.email);
  //   setRoleId(userObj.roleID);
  //   setPassword(userObj.password);
  //   setConfirmPassword(userObj.password);
  //   setCompanyId(userObj.accountGroup);
  //   setPlantId(userObj.joiningDate);
  //   setContactNumber(userObj.contactNumber);
  //   // setAccountGroup(userObj.accountGroup);
  //   setUpdateOrDeleteId(userObj.userID);
  //   setFirstName(userObj.firstName);
  //   setLastName(userObj.lastName);
  //   setAddress(userObj.address);
  //   setdateOfBirth(userObj.dateOfBirth);
  //   //setJoiningDate(userObj.joiningDate);
  //   setIsActiveUser(userObj.isActive);
  //   listOfProjectsHeaderExpandButtionClick();
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  //   navigate('/Edit-User');
  // }
  const handleEditTaskDetails = (userID) => {
    navigate(`/create-user?userID=${userID}`);
  };
  const handleRemoveUser = (userObj) => {
    setUpdateOrDeleteId(userObj.userID);
    window.confirmModalShow();
  };
  const yesConfirmSubmitRequest = () => {
    setIsLoaderActive(true);
    console.log("user id", updateOrDeleteId);
    let APIMethodName =
      "AuthMaster/DeleteUser?ClientId=" +
      config.ClientId +
      "&UserID=" +
      updateOrDeleteId +
      "&loggedUserId=" +
      localStorage.getItem("loggedUserId");
    axios
      .post(config.API_URL + APIMethodName, {
        headers: config.headers2,
      })
      .then((response) => {
        if (response.data.success === "success") {
          toast.success("User deleted successfully...");
          window.confirmModalHide();
          // clearAllFields();
          getUsersList();
          setIsLoaderActive(false);
        } else {
          setIsLoaderActive(false);
          getUsersList();
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        // if (!error.response.data.success) {
        //   toast.error(error.response.data.message);
        // } else {
        // toast.error("Unable to delete the data please try again later.");
        // }
        setIsLoaderActive(false);
      });
  };
  const validatePasswordPolicy = (password) => {
    const policyRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return policyRegex.test(password);
  };

  const clearAllFields = () => {
    setUserName("");
    setUserEmail("");
    setRoleId("");
    setPassword("");
    setContactNumber("");
    // setAccountGroup('');
    setUpdateOrDeleteId("");
    setFirstName("");
    setLastName("");
    setAddress("");
    // setdateOfBirth('');
    //setJoiningDate('');
    setdateOfBirth("");
    //setJoiningDate('');
    inputFirstNameReference.current.classList.remove("is-invalid");
    inputLastNameReference.current.classList.remove("is-invalid");
    inputAddressReference.current.classList.remove("is-invalid");
    // inputJoiningDateReference.current.classList.remove('is-invalid');
    inputDateOfBirthReference.current.classList.remove("is-invalid");
    inputUserNameReference.current.classList.remove("is-invalid");
    inputEmailReference.current.classList.remove("is-invalid");
    inputRoleReference.current.classList.remove("is-invalid");
    inputPasswordReference.current.classList.remove("is-invalid");
    inputContactNumberReference.current.classList.remove("is-invalid");
    // inputAccountGroupReference.current.classList.remove('is-invalid');
  };
  const changeActiveUser = (event) => {
    setIsActiveUser(event.target.checked);
  };
  const handleUserSubmit = (e) => {
    window.initDestroyDataTableFuncation();
    if (removeExtraSpaces(userEmail)) {
      if (removeExtraSpaces(userName)) {
        if (removeExtraSpaces(firstName)) {
          if (removeExtraSpaces(lastName)) {
            if (removeExtraSpaces(contactNumber)) {
              if (isValidEmail(userEmail)) {
                if (password) {
                  if (password === passwordConfirm) {
                    if (roleId) {
                      if (companyId) {
                        if (plantId) {
                          if (dateOfBirth) {
                            if (address) {
                              setIsLoaderActive(true);
                              let APIMethodName = "";
                              if (updateOrDeleteId !== "") {
                                APIMethodName = "AuthMaster/UpdateUser";
                              } else {
                                APIMethodName = "AuthMaster/CreateUser";
                              }
                              let getRoleName = allRolesList.find(
                                (x) => x.roleID == roleId
                              );
                              axios
                                .post(
                                  config.API_URL + APIMethodName,
                                  {
                                    createdBy: personalInfo.userID,
                                    clientId: config.ClientId,
                                    modifiedBy: personalInfo.userID,
                                    userID: updateOrDeleteId,
                                    roleID: roleId,
                                    userName: userName,
                                    email: userEmail,
                                    password: password,
                                    contactNumber: contactNumber,
                                    accountGroup: companyId,
                                    firstName: firstName,
                                    lastName: lastName,
                                    address: address,
                                    dateOfBirth: dateOfBirth,
                                    isActive: true,
                                    joiningDate: plantId,
                                    roleName: getRoleName.roleName,
                                  },
                                  {
                                    headers: config.headers3,
                                  }
                                )
                                .then((response) => {
                                  console.log("Create user", response);
                                  if (response.data.success == "success") {
                                    debugger;
                                    if (updateOrDeleteId !== "") {
                                      toast.success(
                                        "User Updated Successfully..."
                                      );
                                    } else {
                                      toast.success(
                                        "User Created Successfully..."
                                      );
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
                                })
                                .catch((error) => {
                                  toast.error(
                                    "oops something went wrong. please try again later."
                                  );
                                  setIsLoaderActive(false);
                                });
                            } else {
                              toast.error("Please enter address.");
                              inputAddressReference.current.focus();
                              inputAddressReference.current.classList.add(
                                "is-invalid"
                              );
                            }
                          } else {
                            toast.error("Please select date of birth.");
                            inputDateOfBirthReference.current.focus();
                            inputDateOfBirthReference.current.classList.add(
                              "is-invalid"
                            );
                          }
                        } else {
                          toast.error("Please select plant.");
                          inputPlantReference.current.focus();
                          inputPlantReference.current.classList.add(
                            "is-invalid"
                          );
                        }
                      } else {
                        toast.error("Please select company.");
                        inputCompanyReference.current.focus();
                        inputCompanyReference.current.classList.add(
                          "is-invalid"
                        );
                      }
                    } else {
                      toast.error("Please select role.");
                      inputRoleReference.current.focus();
                      inputRoleReference.current.classList.add("is-invalid");
                    }
                  } else {
                    toast.error("Passwords do not match.");
                    inputConfirmPasswordReference.current.focus();
                    inputConfirmPasswordReference.current.classList.add(
                      "is-invalid"
                    );
                  }
                } else {
                  toast.error("Please enter password.");
                  inputPasswordReference.current.focus();
                  inputPasswordReference.current.classList.add("is-invalid");
                }
              } else {
                toast.error("Please enter valid email.");
                inputEmailReference.current.focus();
                inputEmailReference.current.classList.add("is-invalid");
              }
            } else {
              toast.error("Please enter mobile number.");
              inputContactNumberReference.current.focus();
              inputContactNumberReference.current.classList.add("is-invalid");
            }
          } else {
            toast.error("Please enter last name.");
            inputLastNameReference.current.focus();
            inputLastNameReference.current.classList.add("is-invalid");
          }
        } else {
          toast.error("Please enter first name.");
          inputFirstNameReference.current.focus();
          inputFirstNameReference.current.classList.add("is-invalid");
        }
      } else {
        toast.error("Please enter user name.");
        inputUserNameReference.current.focus();
        inputUserNameReference.current.classList.add("is-invalid");
      }
    } else {
      toast.error("Please enter email.");
      inputEmailReference.current.focus();
      inputEmailReference.current.classList.add("is-invalid");
    }
  };

  const handleToggleUsers = (showActive) => {
    setShowActiveUsers(showActive);
  };
const handleRetailerUsers = (isRetailer) => {
  setShowRetailerUsers(isRetailer);
  getUsersList(isRetailer); // Pass flag to filter in getUsersList
};

  const filteredUsers = allUsersList.filter(
    (user) => user.isActive === showActiveUsers
  );
  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">List Of Users</h1>
            </div>
            <div className="col-sm-6 justify-content-end d-flex">
              <button
                type="button"
                className="btn  btn-sm btn-primary mr-2"
                id="AddNewHeaderButton"
                onClick={addNewUser}
              >
                Add User
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  showActiveUsers ? "btn-primary" : "btn-outline-primary"
                } mr-2`}
                onClick={() => handleToggleUsers(true)}
                style={{ display: showActiveUsers ? "none" : "inline-block" }}
              >
                Active
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  !showActiveUsers ? "btn-primary" : "btn-outline-primary"
                } mr-2`}
                onClick={() => handleToggleUsers(false)}
                style={{ display: !showActiveUsers ? "none" : "inline-block" }}
              >
                Inactive
              </button>
              {showRetailerUsers ? (
  <button
    type="button"
    className="btn btn-sm btn-outline-primary mr-2"
    onClick={() => handleRetailerUsers(false)}
  >
    All Users
  </button>
) : (
  <button
    type="button"
    className="btn btn-sm btn-outline-primary mr-2"
    onClick={() => handleRetailerUsers(true)}
  >
    Retailers
  </button>
)}

                {/* <button
                type="button"
                className={`btn btn-sm  btn-outline-primary mr-2`}
                onClick={() => handleRetailerUsers()}
                 style={{ display: !showActiveUsers ? "none" : "inline-block" }}
              >
                Retailers
              </button>
              <button
                type="button"
                className={`btn btn-sm  btn-outline-primary mr-2`}
                onClick={() => handleAllUsers()}
                 style={{ display: !showRetailerUsers ? "none" : "inline-block" }}
              >
                All Users
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
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
                          Date Of Birth
                        </th>
                        {/* <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Date Of Joining</th> */}
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          Email
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          Contact Number
                        </th>
                        {/* <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Department Name</th> */}
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          Role
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          Is Active
                        </th>
                        {/* <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Account Status</th> */}
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
                      {filteredUsers && filteredUsers.length > 0 ? (
                        filteredUsers.map((userObj, index) => {
                          return (
                            <tr
                              key={userObj.userID}
                              // style={{ textDecoration: userObj.isActive === true ? 'none' : 'line-through' }}
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
                                {userObj.dateOfBirth || "N/A"}
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
                                {userObj.isActive === true
                                  ? "Active"
                                  : "InActive"}
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
                                  className="btn bg-gradient-primary btn-xs"
                                  onClick={() =>
                                    handleEditTaskDetails(userObj.userID)
                                  }
                                  style={{
                                    padding: "5px",
                                    fontSize: ".75rem",
                                    lineHeight: "0",
                                    borderRadius: "50%",
                                  }}
                                >
                                  <i
                                    className="fas fa-pen"
                                    style={{ fontSize: "smaller" }}
                                  ></i>
                                </button>
                                {userObj.isActive === true && (
                                  <button
                                    type="button"
                                    className="btn bg-gradient-danger btn-xs ml-2"
                                    onClick={() => handleRemoveUser(userObj)}
                                    style={{
                                      padding: "5px",
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
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="10" className="text-center text-muted">
                            No data found
                          </td>
                        </tr>
                      )}
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
              <div class="icon-box">
                {/* <i class="fas fa-info mt-2"></i> */}
              </div>
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
export default UserCreation;
