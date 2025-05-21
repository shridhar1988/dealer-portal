
import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { removeExtraSpaces } from "../../common/textOperations";
import { isValidEmail } from "../../common/validations";
import { ToastContainer, toast } from "react-toastify";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import axios from "axios";
import $ from "jquery";
import default_image from "../../assets/images/profile_pic.png";
import "./userCreation.css";

const config = require("../../config/config.json");

const CreateUser = () => {
  const navigate = useNavigate();
  const location = useLocation();

 
  const inputFirstNameReference = useRef(null);
  const inputLastNameReference = useRef(null);
  const inputAddressReference = useRef(null);
  const inputDateOfBirthReference = useRef(null);
  const inputUserNameReference = useRef(null);
  const inputEmailReference = useRef(null);
  const inputRoleReference = useRef(null);
  const inputCompanyReference = useRef(null);
  const inputPlantReference = useRef(null);
  const inputPasswordReference = useRef(null);
  const inputConfirmPasswordReference = useRef(null);
  const inputContactNumberReference = useRef(null);
  const fileInputRef = useRef(null);

  const personalInfo = useSelector((state) => state.personalInformationReducer);

  // State variables
  const [isEdit, setIsEdit] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [plantId, setPlantId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setConfirmPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [allRolesList, setAllRolesList] = useState([]);
  const [allCompanyList, setAllCompanyList] = useState([]);
  const [allPlantList, setAllPlantList] = useState([]);
  const [filteredPlantList, setFilteredPlantList] = useState([]);
  const [updateOrDeleteId, setUpdateOrDeleteId] = useState("");
  const [isActiveUser, setIsActiveUser] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(default_image);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  

  const [allUsersList, setAllUsersList] = useState([]);

 
  const [userID, setUserID] = useState("");
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userID = queryParams.get("userID")?.trim();
    
    setUserID(userID);
    

    
    getAllRolesList();
   
  }, [location.search]);


useEffect(() => {
  // Load company and plant list on component mount
  const loadData = async () => {
    await getAllCompanyList(); // Load company first
    await getAllPlantList();   // Then load all plants
    await getUsersList(userID); // Finally load user data
  };

  loadData();
}, []);useEffect(() => {
  if (allCompanyList.length && allPlantList.length) {
    getUsersList(userID); // call when both are loaded
  }
}, [allCompanyList, allPlantList]);

const getUsersList = async (userID) => {
  try {
    const response = await axios.get(
      `${config.API_URL}AuthMaster/GetAllUsers?ClientId=${config.ClientId}`,
      { headers: config.headers2 }
    );

    if (response.status === 200 && response.data.success === "success") {
      const userObj = response.data.data.find((u) => u.userID === userID);
      console.log(userObj, "test");

      if (userObj) {
        setAllUsersList(response.data.data);
        console.log("response", response.data.data);

        setUpdateOrDeleteId(userObj.userID);
        setUserName(userObj.userName || "");
        setUserEmail(userObj.email || "");
        setRoleId(userObj.roleID || "");
        setPassword(userObj.password || "");
        setConfirmPassword(userObj.password || "");
        setContactNumber(userObj.contactNumber || "");
        setFirstName(userObj.firstName || "");
        setLastName(userObj.lastName || "");
        setAddress(userObj.address || "");
        setDateOfBirth(userObj.dateOfBirth || "");
        setProfileImage(userObj.profilePhoto || default_image);
        setIsActiveUser(userObj.isActive);

        const companyId = userObj.company || "";
        const plantId = userObj.plant || "";

        setCompanyId(companyId);

        if (companyId) {
          await getMappedPlantsForCompany(companyId); // Wait for plant list to load
          setPlantId(plantId); // Set plant after fetching plant list
        } else {
          setFilteredPlantList([]);
          setPlantId("");
        }
      }
    } else {
      toast.error(response.data.message || "Something went wrong.");
    }
  } catch (error) {
    toast.error("Please try again later.");
    console.error("Error fetching users list:", error);
  }
};

  

  useLayoutEffect(() => {
    window.initDatePickerFuncation();
  }, []);

  // API Calls
  const getAllRolesList = async () => {
    setIsLoaderActive(true);
    try {
      const response = await axios.get(
        `${config.API_URL}AuthMaster/GetAllRoles?ClientId=${config.ClientId}`,
        { headers: config.headers2 }
      );
      if (response.status === 200 && response.data.success === "success") {
        setAllRolesList(response.data.data || []);
      } else {
        toast.error(response.data.message || "Failed to fetch roles.");
      }
    } catch (error) {
      toast.error("Please try again later.");
    } finally {
      setIsLoaderActive(false);
    }
  };

  const getAllCompanyList = async () => {
    setIsLoaderActive(true);
    try {
      const response = await axios.get(
        `${config.API_URL}CompanyMaster/GetAllCompany`,
        { headers: config.headers2 }
      );
      if (response.status === 200 && response.data.success === "True") {
        setAllCompanyList(response.data.data || []);
      } else {
        toast.error(response.data.message || "Failed to fetch companies.");
      }
    } catch (error) {
      toast.error("Please try again later.");
    } finally {
      setIsLoaderActive(false);
    }
  };

  const getAllPlantList = async () => {
    setIsLoaderActive(true);
    try {
      const response = await axios.get(
        `${config.API_URL}PlantMaster/GetAllPlants`,
        { headers: config.headers2 }
      );
      if (response.status === 200 && response.data.success === "True") {
        setAllPlantList(response.data.data || []);
      } else {
        toast.error(response.data.message || "Failed to fetch plants.");
      }
    } catch (error) {
      toast.error("Please try again later.");
    } finally {
      setIsLoaderActive(false);
    }
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
        setFilteredPlantList(filteredPlants);
      } else {
        toast.error(
          mappingResponse.data.message || "Failed to fetch plant mappings."
        );
        setFilteredPlantList([]);
      }
    } catch (error) {
      toast.error("Failed to fetch plant mappings. Try again later.");
      setFilteredPlantList([]);
    } finally {
      setIsLoaderActive(false);
    }
  };

  // Handlers
  const handleCancelClick = () => {
    clearAllFields();
    navigate("/user-creation");
  };

  const clearAllFields = () => {
    setProfileImage(default_image);
    setProfileImageFile(null);
    setUserName("");
    setUserEmail("");
    setRoleId("");
    setPassword("");
    setConfirmPassword("");
    setContactNumber("");
    setCompanyId("");
    setPlantId("");
    setFirstName("");
    setLastName("");
    setAddress("");
    setDateOfBirth("");
    setIsActiveUser(true);
    setIsEdit(false);
    setUpdateOrDeleteId("");
    setFilteredPlantList([]);

    // Clear validation classes
    inputFirstNameReference.current?.classList.remove("is-invalid");
    inputLastNameReference.current?.classList.remove("is-invalid");
    inputAddressReference.current?.classList.remove("is-invalid");
    inputDateOfBirthReference.current?.classList.remove("is-invalid");
    inputUserNameReference.current?.classList.remove("is-invalid");
    inputEmailReference.current?.classList.remove("is-invalid");
    inputRoleReference.current?.classList.remove("is-invalid");
    inputCompanyReference.current?.classList.remove("is-invalid");
    inputPlantReference.current?.classList.remove("is-invalid");
    inputPasswordReference.current?.classList.remove("is-invalid");
    inputConfirmPasswordReference.current?.classList.remove("is-invalid");
    inputContactNumberReference.current?.classList.remove("is-invalid");

    localStorage.removeItem("EditUserData");
    localStorage.removeItem("Edit UserId");
  };

  const validatePasswordPolicy = (password) => {
    const policyRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return policyRegex.test(password);
  };

  const loadFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    } else {
      setProfileImageFile(null);
      setProfileImage(default_image);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    // Validation
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
    if (!removeExtraSpaces(userName)) {
      toast.error("Please enter user name.");
      inputUserNameReference.current.focus();
      inputUserNameReference.current.classList.add("is-invalid");
      return;
    }
    if (!removeExtraSpaces(firstName)) {
      toast.error("Please enter first name.");
      inputFirstNameReference.current.focus();
      inputFirstNameReference.current.classList.add("is-invalid");
      return;
    }
    if (!removeExtraSpaces(lastName)) {
      toast.error("Please enter last name.");
      inputLastNameReference.current.focus();
      inputLastNameReference.current.classList.add("is-invalid");
      return;
    }
    if (!removeExtraSpaces(contactNumber)) {
      toast.error("Please enter mobile number.");
      inputContactNumberReference.current.focus();
      inputContactNumberReference.current.classList.add("is-invalid");
      return;
    }
    if (contactNumber && contactNumber.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      inputContactNumberReference.current.focus();
      inputContactNumberReference.current.classList.add("is-invalid");
      return;
    }
    if (!isEdit && !password) {
      toast.error("Please enter password.");
      inputPasswordReference.current.focus();
      inputPasswordReference.current.classList.add("is-invalid");
      return;
    }
    if (!isEdit && !validatePasswordPolicy(password)) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      inputPasswordReference.current.focus();
      inputPasswordReference.current.classList.add("is-invalid");
      return;
    }
    if (!isEdit && !passwordConfirm) {
      toast.error("Please enter confirm password.");
      inputConfirmPasswordReference.current.focus();
      inputConfirmPasswordReference.current.classList.add("is-invalid");
      return;
    }
    if (!isEdit && password !== passwordConfirm) {
      toast.error("Passwords do not match.");
      inputConfirmPasswordReference.current.focus();
      inputConfirmPasswordReference.current.classList.add("is-invalid");
      return;
    }
    if (!roleId) {
      toast.error("Please select role.");
      inputRoleReference.current.focus();
      inputRoleReference.current.classList.add("is-invalid");
      return;
    }
    if (!companyId) {
      toast.error("Please select company.");
      inputCompanyReference.current.focus();
      inputCompanyReference.current.classList.add("is-invalid");
      return;
    }
    if (!plantId) {
      toast.error("Please select plant.");
      inputPlantReference.current.focus();
      inputPlantReference.current.classList.add("is-invalid");
      return;
    }
    if (!dateOfBirth) {
      toast.error("Please select date of birth.");
      inputDateOfBirthReference.current.focus();
      inputDateOfBirthReference.current.classList.add("is-invalid");
      return;
    }
    if (!address) {
      toast.error("Please enter address.");
      inputAddressReference.current.focus();
      inputAddressReference.current.classList.add("is-invalid");
      return;
    }

    // Prepare payload
    setIsLoaderActive(true);
    const APIMethodName = userID
      ? "AuthMaster/UpdateUser"
      : "AuthMaster/CreateUser";
    const roleName =
      allRolesList.find((x) => x.roleID === roleId)?.roleName || "";

    const formData = new FormData();
    formData.append("createdBy", personalInfo.userID);
    formData.append("clientId", config.ClientId);
    formData.append("modifiedBy", personalInfo.userID);
    formData.append("userID", updateOrDeleteId);
    formData.append("roleID", roleId);
    formData.append("userName", userName);
    formData.append("email", userEmail);
    if (!isEdit) formData.append("password", password); // Only send password for create
    formData.append("contactNumber", contactNumber);
    formData.append("company", companyId);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("address", address);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("isActive", isActiveUser);
    formData.append("plant", plantId); // Assuming plantId is used as joiningDate
    formData.append("roleName", roleName);
    if (profileImageFile) 
        {formData.append("ProfilePic", profileImageFile);}
    else if(profileImage)
    {
        formData.append("ProfilePic", profileImage);
    }

    try {
      const response = await axios.post(
        config.API_URL + APIMethodName,
        formData,
        {
          headers: {
            ...config.headers3,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success === "success") {
        toast.success(
          userID
            ? "User Updated Successfully..."
            : "User Created Successfully..."
        );
        clearAllFields();
          setTimeout(() => {
    navigate("/user-management");
  }, 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Oops, something went wrong. Please try again later.");
    } finally {
      setIsLoaderActive(false);
    }
  };

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">
                {userID ? "Update User" : "Create New User"}
              </h1>
            </div>
            <div className="col-sm-6"></div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body text-sm">
                  <div className="row">
                   <div class="profile-pic d-flex justify-content-start mt-0 mb-0 col-12">
                      <label
                         className="labelStyle"
                        class="-label"
                        for="file"
                        style={{
                          width: "120px",
                          height: "120px",
                          marginBottom: "0px",
                          cursor: "pointer",
                        }}
                      >
                        <span class="glyphicon glyphicon-camera"></span>
                        <span>Change Image</span>
                      </label>
                      <input
                        id="file"
                        type="file"
                        accept="image/*" // Restrict to image files
                        ref={fileInputRef}
                      onChange={loadFile} // Attach the loadFile handler
                      style={{ display: "none" }} // Hide the default file input
                        // onChange={(event) => loadFile(event)}
                      />
                      <img
                        // src={default_image}
                        src={profileImage} // Use state variable for dynamic src
                        id="output"
                        width="100"
                        style={{ width: "120px", height: "120px",objectFit: "cover" }}
                        alt="Profile Preview"
                      />
                    </div>
                    <div className="ml-3 my-3 col-md-4">
                      <span style={{ color: "#4379EE" }}>Upload Photo</span>
                    </div>
                  </div>
                  </div>

                  <div className="row ml-2 mr-2">
                    <div className="form-group col-md-4">
                      <label
                        htmlFor="userEmailInput"
                        style={{ color: "#6C757D" }}
                      >
                        Email<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        type="email"
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
                        placeholder="Employee Email"
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label
                        htmlFor="userNameInput"
                        style={{ color: "#6C757D" }}
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
                        placeholder="Employee User Name"
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label
                        htmlFor="firstNameInput"
                        style={{ color: "#6C757D" }}
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
                        placeholder="Employee First Name"
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label
                        htmlFor="lastNameInput"
                        style={{ color: "#6C757D" }}
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
                        placeholder="Employee Last Name"
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label
                        htmlFor="contactNumberInput"
                        style={{ color: "#6C757D" }}
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

                    <div className="form-group col-md-4 position-relative">
                      <label
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
                        placeholder="Password"
                        disabled={isEdit} // Disable password field in edit mode
                      />
                      <span
                        className={`fa fa-fw field-icon-password toggle-password ${
                          showPassword ?  "fa-eye-slash" :"fa-eye" 
                        }`}
                        onClick={() => setShowPassword(!showPassword)}
                      ></span>
                    </div>

                    <div className="form-group col-md-4 position-relative">
                      <label
                        htmlFor="passwordInput1"
                        style={{ color: "#6C757D" }}
                      >
                        Confirm Password<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control form-control-sm"
                        id="passwordInput1"
                        ref={inputConfirmPasswordReference}
                        value={passwordConfirm}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          inputConfirmPasswordReference.current.classList.remove(
                            "is-invalid"
                          );
                        }}
                        placeholder="Confirm Password"
                        disabled={isEdit} // Disable confirm password field in edit mode
                      />
                      <span
                        className={`fa fa-fw field-icon-password toggle-password ${
                          showConfirmPassword ? "fa-eye-slash" :"fa-eye" 
                        }`}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      ></span>
                    </div>

                    <div className="form-group col-md-4">
                      <label style={{ color: "#6C757D" }}>
                        Select Role<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        className="form-control form-control-sm"
                        ref={inputRoleReference}
                        value={roleId}
                        onChange={(e) => {
                          setRoleId(e.target.value);
                          inputRoleReference.current.classList.remove(
                            "is-invalid"
                          );
                        }}
                      >
                        <option value="">--Select--</option>
                        {allRolesList.map((role) => (
                          <option
                            key={`role_${role.roleID}`}
                            value={role.roleID}
                          >
                            {role.roleName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-md-4">
                      <label style={{ color: "#6C757D" }}>
                        Select Company<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        className="form-control form-control-sm"
                        ref={inputCompanyReference}
                        value={companyId}
                        onChange={(e) => {
                          const selectedCompanyId = e.target.value;
                          setCompanyId(selectedCompanyId);
                          setPlantId("");
                          inputCompanyReference.current.classList.remove(
                            "is-invalid"
                          );
                          if (selectedCompanyId) {
                            getMappedPlantsForCompany(selectedCompanyId);
                          } else {
                            setFilteredPlantList([]);
                          }
                        }}
                      >
                        <option value="">--Select--</option>
                        {allCompanyList.map((company) => (
                          <option
                            key={`company_${company.id}`}
                            value={company.id}
                          >
                            {company.companyCode} ({company.companyDescription})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-md-4">
                      <label style={{ color: "#6C757D" }}>
                        Select Plant<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        className="form-control form-control-sm"
                        ref={inputPlantReference}
                        value={plantId}
                        onChange={(e) => {
                          setPlantId(e.target.value);
                          inputPlantReference.current.classList.remove(
                            "is-invalid"
                          );
                        }}
                      >
                        <option value="">--Select--</option>
                        {filteredPlantList.map((plant) => (
                          <option key={`plant_${plant.id}`} value={plant.id}>
                            {plant.plantCode} ({plant.plantCode})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-md-4">
                      <label style={{ color: "#6C757D" }}>
                        Date Of Birth<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        ref={inputDateOfBirthReference}
                        value={dateOfBirth}
                        onChange={(e) => {
                          setDateOfBirth(e.target.value);
                          inputDateOfBirthReference.current.classList.remove(
                            "is-invalid"
                          );
                        }}
                        max={today}
                        placeholder="Date Of Birth"
                      />
                    </div>

                    <div className="form-group col-md-8">
                      <label
                        htmlFor="addressInput"
                        style={{ color: "#6C757D" }}
                      >
                        Address<sup style={{ color: "red" }}>*</sup>
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

                    <div className="form-group col-md-5">
                      <div className="custom-control custom-switch">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="customSwitch1"
                          onChange={(e) => setIsActiveUser(e.target.checked)}
                          checked={isActiveUser}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customSwitch1"
                          style={{ color: "#6C757D" }}
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
                      className="btn btn-primary float-right btn-xs ml-2 pr-4 pl-4"
                      onClick={handleUserSubmit}
                    >
                      {userID ? "Update" : "Create"}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-default float-right btn-xs pr-4 pl-4"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/* </div> */}
      </section>

      <ToastContainer position="top-center" />
    </>
  );
};

export default CreateUser;
