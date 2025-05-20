import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { removeExtraSpaces } from "../../common/textOperations";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import { changePersonalInfo } from "../../reduxStorage/personalInformation";
import { clearPersonalInformation } from "../../reduxStorage/personalInformation";
import { clearSelectedEmployeePersonalInformation } from "../../reduxStorage/selectedEmployeeInformation";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./employeeProfile.css";
import axios from "axios";
import $ from "jquery";
const config = require("../../config/config.json");

const Profile = () => {
  const inputCurrentPasswordReference = useRef(null);
  const inputNewPasswordReference = useRef(null);
  const inputConfirmPasswordReference = useRef(null);
  let navigate = useNavigate();
  const LoggedRole = localStorage.getItem("loggedUserRole");

  const personalInfo = useSelector((state) => state.personalInformationReducer);
  const [insuranceComponentsArray, setInsuranceComponentsArray] = useState([]);
  const [homeRoute, setHomeRoute] = useState("");
  const profileImg = personalInfo.profilePic;
  const [probationType, setProbationType] = useState("");
  const [probationPeriod, setProbationPeriod] = useState("");
  const [gender, setGender] = useState("");
  const [lastName, setLastName] = useState("");
  const [PImg, setPImg] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [departmentID, setDepartmentID] = useState([]);
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileDetails, setProfileDetails] = useState([]);
  const [locationId, setlocationId] = useState("");
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [isModal, setIsModal] = useState(true);
  
  const [filteredLocation, setFilteredLocation] = useState(null);
  console.log(filteredLocation, "Location");

  const inputAccNoReference = useRef(null);
  const inputBankNameReference = useRef(null);
  const inputAccHolderNameReference = useRef(null);
  const inputBranchNameReference = useRef(null);
  // const inputBranchAddressReference = useRef(null);
  const inputConfirmAccNoReference = useRef(null);
  const inputIfscCodeReference = useRef(null);
  const [declarations, setDeclarations] = useState([]);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [salaryComponentsArray, setSalaryComponentsArray] = useState([
    {
      componentName: "",
      percentage: "",
    },
  ]);

  const [bankData, setBankData] = useState("");
  const [bank, setBank] = useState("");
  const [bankName, setBankName] = useState("");
  const [accHolderName, setAccHolderName] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchName, setBranchName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  // const [branchAddress, setBranchAddress] = useState("");
  const [hasError, setHasError] = useState(false);
  const currentYear = new Date().getFullYear();
  const [allDepartment, setAllDepartment] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (personalInfo.userRole == "Administrator") {
      setHomeRoute("/form-builder");
    } else {
      setHomeRoute("/manage-employee");
    }
    getProfileDetails();
    GetAllDepartments();
    GetBankDetails();
    GetAllMedicalRecordsByEmpId();
    GetAllItDeclarations();
    window.initDatePickerFuncation();
    const defaultYear = `${currentYear}-${currentYear + 1}`;
    GetEmpTaxComponents(defaultYear);
  }, []);

  useEffect(() => {
    if (profileDetails.department) {
      GetAllDepartmentID();
    }
  }, [profileDetails.department]);

  useEffect(() => {
    if (profileDetails.locationId) {
      GetAllLocations();
    }
  }, [profileDetails.locationId]);

  const resetChangePassword = () => {
    setConfirmPassword("");
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleLogout = async () => {
    const userId = localStorage.getItem("loggedUserId");
    try {
      const response = await axios.post(`${config.API_URL}AuthMaster/SignOut`, {
        params: { userID: userId },
      });

      localStorage.clear();

      dispatch(clearPersonalInformation());
      dispatch(clearSelectedEmployeePersonalInformation());
      navigate("/Login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  };

  const resetProfileUpdate = () => {
    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setMobileNumber("");
    setAddress("");
  };
  const GetAllItDeclarations = async () => {
    setIsLoaderActive(true);
    try {
      const response = await axios.get(
        `${config.apiEndPoint}/ITDeclarationMaster/GetAllItDeclaration`
      );
      if (response.data.success === "True") {
        setDeclarations(response.data.data);
        // console.log("data", response.data.data);
      } else {
        setDeclarations([]);
      }
    } catch (error) {
      console.error("Error fetching declarations:", error);
      toast.error("Error fetching declarations");
    } finally {
      setIsLoaderActive(false);
    }
  };
  const GetAllDepartments = async () => {
    setIsLoaderActive(true);

    try {
      const response = await axios.get(
        `${config.apiEndPoint}/Department/GetAllDepartments`
      );
      if (response.data.success == "True") {
        setAllDepartment(response.data.data || []); // Store data in state
      } else {
        console.error("Error fetching departments:");
        setAllDepartment([]);
      }
    } catch (error) {
      console.error("Error fetching departments:");
    } finally {
      setIsLoaderActive(false);
    }
  };

  const GetAllLocations = async () => {
    try {
      const response = await axios.get(
        `${config.apiEndPoint}/LocationMaster/GetAllLocations`
      );
      // console.log("All Locations:", response.data);

      if (response.data.success === "True") {
        const allLocations = response.data.data;

        if (profileDetails.locationId) {
          const matchedLocation = allLocations.find(
            (location) => location.locationID === Number(profileDetails.locationId)
          );

          if (matchedLocation) {
            // console.log("Matched Location:", matchedLocation);
            setFilteredLocation(matchedLocation);
          } else {
            console.warn("No location matched the given locationId.");
          }
        } else {
          console.error("Location ID not available yet.");
        }
      } else {
        console.error("Failed to fetch locations.");
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };


  const getProfileDetails = () => {
    setIsLoaderActive(true);

    axios
      .get(
        `${config.API_URL}AuthMaster/GetEmpInfoByEmpId?id=${personalInfo.userID}`,
        {
          headers: config.headers2,
        }
      )
      .then((response) => {
        if (response.status == 200) {
          if (response.data.success == true) {
            if (response.data.data != 0) {
              // console.log("User Details---->", response.data.data);
              setPImg(response.data.data.userInfo.picDbPath);
              setGender(response.data.data.userInfo.gender);
              // personalInfo
              const formattedProfileDetails = {
                ...response.data.data.empInfo,
                dateOfBirth: response.data.data.empInfo.dateOfBirth,
                joiningDate: response.data.data.empInfo.joiningDate,
                address: response.data.data.empInfo.address,
              };
              setProbationType(response.data.data.empInfo.isProbation);
              setProbationPeriod(response.data.data.empInfo.probationPeriod);
              setProfileDetails(response.data.data.empInfo);
              setlocationId(
                response.data.data.userInfo.locationId);
              // console.log('====================================');
              // console.log(response.data.data.empInfo, "esponse.data.data.empInfo");
              // console.log('====================================');
              setOfficialEmail(response.data.data.userInfo.officialEmail);
              setTimeout(() => {
                window.initDataTableFuncation();
              }, 3000);
            } else {
              setProfileDetails([]);
              setTimeout(() => {
                window.initDataTableFuncation();
              }, 3000);
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

  const validatePasswordPolicy = (password) => {
    const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    return passwordPolicy.test(password);
  };

  const GetAllDepartmentID = async () => {
    setIsLoaderActive(true);
    // let departmentID = profileDetails?.department;

    // console.log('====================================');
    // console.log(profileDetails, " profileDetails");
    // console.log('====================================');
    try {
      const response = await axios.get(
        `${config.apiEndPoint}/Department/GetDepartmentOfId/${profileDetails.department}`
      );
      if (response.data.success == "True") {
        setDepartmentID(response.data.data);
      } else {
        console.error("Error fetching departments:");
      }
    } catch (error) {
      console.error("Error fetching departments:");
    } finally {
      setIsLoaderActive(false);
    }
  };
  const handleChangePassSubmit = (e) => {
    if (removeExtraSpaces(currentPassword)) {
      if (removeExtraSpaces(newPassword)) {
        if (removeExtraSpaces(confirmPassword)) {
          if (
            removeExtraSpaces(newPassword) == removeExtraSpaces(confirmPassword)
          ) {
            if (validatePasswordPolicy(newPassword)) {
              var formData = new FormData();
              formData.append("UserID", personalInfo.userID);
              formData.append("CurrentPassword", currentPassword);
              formData.append("NewPassword", newPassword);
              formData.append("UserName", personalInfo.userName);
              setIsLoaderActive(true);
              axios
                .post(config.API_URL + "AuthMaster/ChangePassword", formData, {
                  headers: config.headers3,
                })
                .then((response) => {
                  if (response.data.success == "success") {
                    toast.success(response.data.message);
                    resetChangePassword();
                    setIsLoaderActive(false);
                    handleLogout();
                  } else {
                    toast.error(response.data.message);
                  }
                })
                .catch((error) => {
                  if (!error.response.data.success) {
                    toast.error(error.response.data.message);
                  } else {
                    toast.error("Please try again later.");
                  }
                });
              setIsLoaderActive(false);
            } else {
              toast.error(
                "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.Only contain characters from this set: A-Z, a-z, 0-9, and @$!%*?&#"
              );
              inputNewPasswordReference.current.focus();
              inputConfirmPasswordReference.current.focus();
            }
          } else {
            toast.error(
              "Please check entered new password and confirm new password should be the same."
            );
            inputConfirmPasswordReference.current.focus();
            //inputConfirmPasswordReference.current.classNameList.add("is-invalid");
          }
        } else {
          toast.error("Please enter confirm password.");
          inputConfirmPasswordReference.current.focus();
          //inputConfirmPasswordReference.current.classNameList.add("is-invalid");
        }
      } else {
        toast.error("Please enter new password.");
        inputNewPasswordReference.current.focus();
        //inputNewPasswordReference.current.classNameList.add("is-invalid");
      }
    } else {
      toast.error("Please enter current password.");
      inputCurrentPasswordReference.current.focus();
      //  inputCurrentPasswordReference.current.classNameList.add("is-invalid");
    }
  };

  const handleEditProfileDetails = (e) => {
    e.preventDefault();
    let getDob = $("#projectStartDateV").val();
    let getDatebirth = $("#projectStartDateV").val();
    setDateOfBirth(getDob);
    let getFirstName = $("#FirstName").val();
    let getLastName = $("#LastName").val();
    let getMobileNumber = $("#mobileNumber").val();
    let getAddress = $("#address").val();

    const updatedProfileData = {
      firstName,
      lastName,
      mobileNumber,
      address,
      dateOfBirth,
    };

    var formData = new FormData();
    formData.append("empId", personalInfo.userID);
    if (getFirstName === "") {
      formData.append("firstName", profileDetails.firstName);
    } else {
      formData.append("firstName", getFirstName);
    }
    if (getLastName == "") {
      formData.append("lastName", profileDetails.lastName);
    } else {
      formData.append("lastName", lastName);
    }
    if (getAddress == "") {
      formData.append("address", profileDetails.address);
    } else {
      formData.append("address", address);
    }
    if (getMobileNumber == "") {
      formData.append("mobile", profileDetails.mobile);
    } else {
      formData.append("mobile", mobileNumber);
    }
    if (getDatebirth == "") {
      formData.append("dateOfBirth", profileDetails.dateOfBirth);
      // console.log("DOb ----if", profileDetails.dateOfBirth);
    } else {
      formData.append("dateOfBirth", getDob);
      // console.log("DOb ---elseee", getDob);
    }
    setIsLoaderActive(true);
    axios
      .put(config.API_URL + "AuthMaster/UpdateFromEmployeeEmpInfo", formData, {
        headers: config.headers2,
      })
      .then((response) => {
        if (response.data.success == true) {
          toast.success(response.data.message);
          resetProfileUpdate();
          getProfileDetails();
          setIsLoaderActive(false);
        } else {
          resetProfileUpdate();
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        if (!error.response.data.success) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Please try again later.");
        }
      });
    setIsLoaderActive(false);
  };

  const loadFile = (event) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size > 8 * 1000 * 1024) {
        toast.error("File with maximum size of 8MB is allowed");
        return false;
      }
      var fileName = event.target.files[0].name;
      var fileNameExt = fileName.substr(fileName.lastIndexOf(".") + 1);
      if (!config._validImageFileExtensions.includes(fileNameExt)) {
        toast.error(
          "Please upload files having extensions: " +
          config._validImageFileExtensions.join(", ") +
          " only."
        );
        $(event).val("");
        setIsLoaderActive(false);
        return false;
      }
      var image = document.getElementById("output");
      image.src = URL.createObjectURL(event.target.files[0]);
      // debugger
      var formData = new FormData();
      formData.append("UserID", personalInfo.userID);
      formData.append("CreatedBy", personalInfo.userID);
      formData.append("ProfilePic", event.target.files[0]);

      axios
        .post(config.API_URL + "AuthMaster/ProfileUpdateUser", formData, {
          headers: config.headers3,
        })
        .then((response) => {
          // console.log("response Profile Pic Changes", response);
          if (response.data.success == "success") {
            // toast.success(response.data.message);
            dispatch(
              changePersonalInfo({
                profilePic: response.data.data,
              })
            );
          } else {
            setIsLoaderActive(false);
            toast.error(response.data.message);
          }
        })
        .catch((error) => {
          toast.error("oops something went wrong. please try again later.");
          setIsLoaderActive(false);
        });
    }
  };

  const handleIfscCodeBlur = () => {
    if (ifscCode.length === 11) {
      const ifscCodePattern = /^[a-zA-Z]{4}0[a-zA-Z0-9]{6}$/;

      if (ifscCodePattern.test(ifscCode)) {
        setHasError(false);
        GetIfscCode(ifscCode);
      } else {
        setHasError(true);
        toast.error("Invalid IFSC Code format.");
      }
    }
  };

  const GetIfscCode = async (ifscCode) => {
    setIsLoaderActive(true);

    try {
      const response = await axios.get(
        `https://bank-apis.justinclicks.com/API/V1/IFSC/${ifscCode}/`
      );

      if (response.status === 200) {
        // console.log(response, 'RES');
        setBankData(response.data);
        if (response.data) {
          setBankName(response.data.BANK);
          setBranchName(response.data.BRANCH);
          // setBranchAddress(response.data.ADDRESS);
        }
      } else {
        console.error("No details found for the provided IFSC Code.");
        setIsLoaderActive(false);
      }
    } catch (error) {
      console.error("Error fetching IFSC Code details:", error);
      // toast.error("Failed to fetch IFSC details. Please try again.");
    } finally {
      setIsLoaderActive(false);
    }
  };

  const GetEmpTaxComponents = async (year) => {
    setIsLoaderActive(true);
    try {
      const response = await axios.get(
        `${config.apiEndPoint}/ITDeclarationMaster/GetAllEmplyeeSubmittedITDeclarationByEmpIdAndYear?FinancialYear=${year}&EmpID=${personalInfo.userID}`
      );
      const componentsArray = response.data.data;

      // console.log("empsubmitted ===> ", componentsArray);
      if (componentsArray) {
        setSalaryComponentsArray(componentsArray);
      } else {
        setSalaryComponentsArray({});
      }
    } catch (error) {
      console.error("Error fetching employee tax details:", error);
      toast.error("Error fetching employee tax details");
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleBankDetailsSubmit = async () => {
    if (!accountNumber) {
      inputAccNoReference.current.focus();
      inputAccNoReference.current.classList.add("is-invalid");
      toast.error("Please enter bank account number");
      setIsLoaderActive(false);
      return;
    }
    if (!confirmAccountNumber) {
      inputConfirmAccNoReference.current.focus();
      inputConfirmAccNoReference.current.classList.add("is-invalid");
      toast.error("Please confirm your bank account number");
      setIsLoaderActive(false);
      return;
    }
    if (accountNumber != confirmAccountNumber) {
      inputConfirmAccNoReference.current.focus();
      inputConfirmAccNoReference.current.classList.add("is-invalid");
      toast.error("Account number and confirm account number do not match");
      setIsLoaderActive(false);
      return;
    }
    if (!ifscCode) {
      inputIfscCodeReference.current.focus();
      inputIfscCodeReference.current.classList.add("is-invalid");
      toast.error("Please enter ifsc code of your bank");
      setIsLoaderActive(false);
      return;
    }
    if (!accHolderName || !(profileDetails.firstName + " " + profileDetails.lastName)) {
      inputAccHolderNameReference.current.focus();
      inputAccHolderNameReference.current.classList.add("is-invalid");
      toast.error("Please enter account holder name");
      setIsLoaderActive(false);
      return;
    }
    if (!bankName) {
      inputBankNameReference.current.focus();
      inputBankNameReference.current.classList.add("is-invalid");
      toast.error("Please enter bank name");
      setIsLoaderActive(false);
      return;
    }
    if (!branchName) {
      inputBranchNameReference.current.focus();
      inputBranchNameReference.current.classList.add("is-invalid");
      toast.error("Please enter your bank branch name");
      setIsLoaderActive(false);
      return;
    }
    // if (!branchAddress) {
    //   // inputBranchAddressReference.current.focus();
    //   // inputBranchAddressReference.current.classList.add("is-invalid");
    //   // toast.error("Please enter your bank branch Address");
    //   setIsLoaderActive(false);
    //   return;
    // }

    setIsLoaderActive(true);

    try {
      const bankData = {
        empId: personalInfo.userID,
        bankName: bankName,
        accountNumber: confirmAccountNumber,
        ifscCode: ifscCode,
        branchName: branchName,
        createdBy: personalInfo.userID,
        accountHolderName: accHolderName || profileDetails.firstName + " " + profileDetails.lastName,
      };

      const response = await axios.post(
        `${config.API_URL}BankDetails/AddBankDetails`,
        bankData
      );

      if (response.data.success) {
        toast.success("Bank details updated successfully.");
        setAccHolderName("");
        setAccountNumber("");
        setBankName("");
        // setBranchAddress("");
        setBranchName("");
        setIfscCode("");
        setConfirmAccountNumber("");
        GetBankDetails();
      } else {
        toast.error(response.data.message || "Error processing request");
        setIsLoaderActive(false);
      }
    } catch (error) {
      toast.error(error.response?.data || "An error occurred");
    } finally {
      setIsLoaderActive(false);
    }
  };

  const GetBankDetails = async () => {
    setIsLoaderActive(true);

    try {
      const response = await axios.get(
        `${config.apiEndPoint}/BankDetails/GetBankDetailsId?empId=${personalInfo.userID}`
      );
      if (response.data.success == "True") {
        // setBank(response.data.data);
        if (response.data.data) {
          setAccHolderName(response.data.data.accountHolderName);
          setAccountNumber(response.data.data.accountNumber);
          setConfirmAccountNumber(response.data.data.accountNumber);
          setBankName(response.data.data.bankName);
          setIfscCode(response.data.data.ifscCode);
          // setBranchName(response.data.data.branchName);
        }
        GetIfscCode(response.data.data.ifscCode);
        setIsLoaderActive(false);
      } else {
        console.error("Error fetching bank details:");
        setIsLoaderActive(false);
        // setBank('');
      }
    } catch (error) {
      console.error("Error fetching bank details:");
    } finally {
      setIsLoaderActive(false);
    }
  };


  const GetAllMedicalRecordsByEmpId = async () => {
      
      try {
        const response = await axios.get(
          `${config.apiEndPoint}/MedicalInsurance/GetByEmpId/${personalInfo.userID}`
        );
  
        if (Array.isArray(response.data)) {
          console.log("Medical Records:", response.data);
          
          const mappedData = response.data.map(item => ({
            name: item.familyName,
            relation: item.relation,
            dob: item.dob,
            age: item.age,
            amount: item.amount
          }));
          
          setInsuranceComponentsArray(mappedData); // Uncomment if using state
        } else {
          toast.error("No medical records found.");
        }
  
      } catch(error) {
        toast.error("Error fetching medical records:");
      } 
    }

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Profile</h1>
              <ol className="breadcrumb float-sm-left mt-1">
                <li className="breadcrumb-item">
                  {LoggedRole === "Administrator" ? (
                    <Link to="/dashboard">Home</Link>
                  ) : (
                    <Link to="/employee-dashboard">Home</Link>
                  )}
                </li>
                <li className="breadcrumb-item active">Profile</li>
              </ol>
            </div>
            <div className="col-sm-6">
            </div>
          </div>
        </div>
      </div>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <div className="card card-outline card-primary">
                {/* {Profile} */}
                <div className="card-body box-profile position-relative">
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
                  <div className="text-center">
                    <div
                      className="profile-pic"
                      style={{
                        position: "relative",
                        display: "d-flex",
                        height: "200px",
                      }}
                    >
                      {/* Profile Image */}
                      <img
                        src={
                          !PImg
                            ? gender === 'Male'
                              ? require('../../assets/images/default_img.png')
                              : require('../../assets/images/download.jpeg')
                            : PImg
                        }
                        id="output"
                        width="200"
                        height="190"
                        alt="Profile"
                        style={{ borderRadius: "50%" }}
                      />

                      {/* Plus Icon for Upload */}
                      <label
                        htmlFor="file"
                        className="bg-gradient-warning"
                        style={{
                          position: "absolute",
                          width: 30,
                          bottom: -12,
                          right: -8,
                          backgroundColor: "#fff",
                          padding: "6px",
                          boxShadow: "0 2px 2px rgba(0,0,0,0.2)",
                          cursor: "pointer",
                          borderRadius: "50%",
                        }}
                      >
                        <i
                          className="fas fa-pen"
                          style={{ color: "#000", marginLeft: "2px" }}
                        ></i>
                      </label>

                      {/* Hidden File Input */}
                      <input
                        id="file"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => loadFile(e)}
                      />
                    </div>
                  </div>

                  <h3 className="profile-username text-center">
                    {" "}
                    {profileDetails.firstName} {profileDetails.lastName}
                  </h3>

                  <p className="text-muted text-center mb-0">
                    [{" "}
                    {profileDetails.department
                      ? allDepartment.find(
                        (dep) => dep.departmentID == profileDetails.department
                      )?.departmentName
                      : "NA"}{" "}
                    ]
                  </p>
                </div>
              </div>

              <div className="card card-danger">
                <div className="card-header">
                  <h3 className="card-title">ITeos LLP</h3>
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
                  <strong>
                    <i className="fas fa-map-marker-alt mr-1"></i> Location
                  </strong>

                  <p className="text-muted">
                    {filteredLocation?.address || "Not Found"}
                  </p>

                  <hr />

                  <strong>
                    <i className="fa fa-globe mr-2"></i>
                    <span className="text-muted">
                      <a href="https://www.iteos.in/">https://www.iteos.in/</a>
                    </span>
                  </strong>
                </div>
              </div>
            </div>

            <div className="col-md-9">
              <div className="card card-outline card-primary">
                <div className="card-header p-2">
                  {/* {3 buttons} */}
                  <ul className="nav nav-pills">
                    <li className="nav-item">
                      <a
                        className="nav-link active btn-sm"
                        href="#activity"
                        data-toggle="tab"
                      >
                        Overview
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link btn-sm"
                        href="#timeline"
                        data-toggle="tab"
                      >
                        Change Password
                      </a>
                    </li>
                    <li className="nav-item ">
                      <a
                        className="nav-link btn-sm"
                        href="#settings"
                        data-toggle="tab"
                      >
                        Profile Update
                      </a>
                    </li>
                    {personalInfo.userRole !== "Administrator" && (
                      <>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            href="#bankDetails"
                            data-toggle="tab"
                          >
                            Bank Details
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            href="#taxDetails"
                            data-toggle="tab"
                          // onClick={() => {
                          //   setIsModal(false);
                          // }}
                          >
                            Tax Details
                          </a>
                        </li>
                        <li class="nav-item">
                          <a
                            class="nav-link"
                            href="#medicalInsurance"
                            data-toggle="tab"
                            onClick={() => setIsModal(false)}
                          >
                            Medical Insurance
                          </a>
                        </li>
                      </>
                    )}
                  </ul>
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

                  <div className="tab-content">
                    <div className="active tab-pane" id="activity">

                      <div className="tab-pane" id="activity">
                        <div className="from-group row">
                          <div className="col-sm-6">
                            <h4 className="m-20">Profile Details</h4>
                          </div>
                        </div>

                        <div className="table-responsive">
                          <table className="table table-bordered table-striped">
                            <tbody>
                              <tr>
                                <th className="w-25">Employee Name</th>
                                <td>{profileDetails.firstName}</td>
                              </tr>
                              {personalInfo.userRole !== "Administrator" && (
                                <tr>
                                  <th>Employee ID</th>
                                  <td>{`ITS-${departmentID.departmentName
                                    ? departmentID.departmentName.slice(0, 3) +
                                    "-" +
                                    new Date().getFullYear().toString().slice(-2)
                                    : "NA"
                                    }-${profileDetails.empInfoId
                                      ? profileDetails.empInfoId.toString().padStart(3, "0")
                                      : "NA"
                                    }`}</td>
                                </tr>
                              )}
                              <tr>
                                <th>Mobile No.</th>
                                <td>{profileDetails.mobile}</td>
                              </tr>
                              <tr>
                                <th>Department</th>
                                <td>
                                  {profileDetails.department
                                    ? allDepartment.find(
                                      (dep) => dep.departmentID == profileDetails.department
                                    )?.departmentName
                                    : "NA"}
                                </td>
                              </tr>
                              <tr>
                                <th>Address</th>
                                <td>{profileDetails.address}</td>
                              </tr>
                              <tr>
                                <th>Date of Birth</th>
                                <td>
                                  {new Date(profileDetails.dateOfBirth)
                                    .toLocaleDateString("en-GB")
                                    .replace(/\//g, "-")}
                                </td>
                              </tr>
                              <tr>
                                <th>Personal Email</th>
                                <td>{personalInfo.emailAddress}</td>
                              </tr>
                              <tr>
                                <th>Official Email</th>
                                <td>{officialEmail}</td>
                              </tr>
                              <tr>
                                <th>Employment Type</th>
                                <td>{probationType ? "Probation" : "Permanent"}</td>
                              </tr>
                              {probationType && (
                                <tr>
                                  <th>Probation End Date</th>
                                  <td>
                                    {probationPeriod
                                      ? (() => {
                                        try {
                                          const monthsToAdd = Number(probationPeriod);
                                          if (isNaN(monthsToAdd)) return "Invalid probation period";

                                          const [day, month, year] = profileDetails.joiningDate.split("-");
                                          const joinDate = new Date(`${year}-${month}-${day}T12:00:00`);
                                          if (isNaN(joinDate.getTime())) return "Invalid joining date";

                                          const endDate = new Date(joinDate);
                                          endDate.setMonth(joinDate.getMonth() + monthsToAdd);

                                          if (endDate.getDate() !== joinDate.getDate()) {
                                            endDate.setDate(0);
                                          }

                                          return endDate.toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                          });
                                        } catch {
                                          return "Calculation error";
                                        }
                                      })()
                                      : null}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                    {/* {Change Password} */}
                    <div className="tab-pane" id="timeline">
                      {/* Your Timeline content here */}
                      <form className="form-horizontal">
                        <div className="form-group row">
                          <label htmlFor="currentPassword" className="col-sm-3 col-form-label" style={{ color: "#000" }}>
                            Current Password
                          </label>
                          <div className="col-sm-9 position-relative">
                            <input
                              type={showCurrent ? "text" : "password"}
                              className="form-control form-control-sm"
                              id="currentPassword"
                              ref={inputCurrentPasswordReference}
                              placeholder="Enter Current Password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <span
                              onClick={() => setShowCurrent(!showCurrent)}
                              style={{
                                position: "absolute",
                                right: "20px",
                                top: "45%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#666"
                              }}
                            >
                              {showCurrent ? <i className="fas fa-eye" /> : <i className="fas fa-eye-slash" />}
                            </span>
                          </div>
                        </div>

                        <div className="form-group row">
                          <label htmlFor="newPassword" className="col-sm-3 col-form-label" style={{ color: "#000" }}>
                            New Password
                          </label>
                          <div className="col-sm-9 position-relative">
                            <input
                              type={showNew ? "text" : "password"}
                              className="form-control form-control-sm"
                              id="newPassword"
                              ref={inputNewPasswordReference}
                              placeholder="Enter New Password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <span
                              onClick={() => setShowNew(!showNew)}
                              style={{
                                position: "absolute",
                                right: "20px",
                                top: "45%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#666"
                              }}
                            >
                              {showNew ? <i className="fas fa-eye" /> : <i className="fas fa-eye-slash" />}
                            </span>
                          </div>
                        </div>

                        <div className="form-group row">
                          <label htmlFor="confirmPassword" className="col-sm-3 col-form-label" style={{ color: "#000" }}>
                            Confirm Password
                          </label>
                          <div className="col-sm-9 position-relative">
                            <input
                              type={showConfirm ? "text" : "password"}
                              className="form-control form-control-sm"
                              id="confirmPassword"
                              ref={inputConfirmPasswordReference}
                              placeholder="Enter Confirm Password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <span
                              onClick={() => setShowConfirm(!showConfirm)}
                              style={{
                                position: "absolute",
                                right: "20px",
                                top: "45%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#666"
                              }}
                            >
                              {showConfirm ? <i className="fas fa-eye" /> : <i className="fas fa-eye-slash" />}
                            </span>
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="offset-sm-2 col-sm-12 form-control-sm ml-0">
                            {isLoaderActive ? (
                              <PleaseWaitButton className="float-right btn-sm font-weight-medium auth-form-btn" />
                            ) : (
                              <button
                                type="button"
                                className="btn btn-primary form-control-sm float-right"
                                onClick={(e) => {
                                  handleChangePassSubmit(e);
                                }}
                              >
                                Submit
                              </button>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                    {/* Profile Update  */}
                    <div className="tab-pane" id="settings">
                      {/* Your Settings content here */}
                      <form className="form-horizontal">
                        {/* {First name} */}
                        <div className="form-group row">
                          <label
                            for="FirstName"
                            className="col-sm-2 col-form-label"
                            style={{ color: "#000" }}
                          >
                            Name
                          </label>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="FirstName"
                              placeholder={profileDetails.firstName}
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              disabled
                            />
                          </div>
                        </div>
                        {/* {Last Name} */}
                        {/* <div className="form-group row">
                          <label
                            for="LastName"
                            className="col-sm-2 col-form-label"
                            style={{ color: "#000" }}
                          >
                            Last Name
                          </label>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="LastName"
                              placeholder={profileDetails.lastName}
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              disabled
                            />
                          </div>
                        </div> */}
                        {/* {Mobile Number} */}
                        <div className="form-group row">
                          <label
                            for="mobileNumber"
                            className="col-sm-2 col-form-label"
                            style={{ color: "#000" }}
                          >
                            Mobile Number
                          </label>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="mobileNumber"
                              placeholder={profileDetails.mobile}
                              value={mobileNumber}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,10}$/.test(value)) {
                                  setMobileNumber(value);
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            for="address"
                            className="col-sm-2 col-form-label"
                            style={{ color: "#000" }}
                          >
                            Address
                          </label>
                          <div className="col-sm-10">
                            <input
                              className="form-control form-control-sm"
                              id="address"
                              placeholder={profileDetails.address}
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              disabled
                            ></input>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label
                            for="dob"
                            className="col-sm-2 col-form-label"
                            style={{ color: "#000" }}
                          >
                            Date Of Birth
                          </label>
                          <div className="col-sm-10">
                            <div
                              className="input-group"
                              id="projectStartDate"
                              data-target-input="nearest"
                            >
                              <input
                                type="text"
                                className="form-control custDatePicker form-control-sm"
                                id="projectStartDateV"
                                value={dateOfBirth}
                                onSelect={(e) => setDateOfBirth(e.target.value)}
                                placeholder={profileDetails.dateOfBirth}
                                data-target="#projectStartDate"
                                disabled
                              />
                              {/* <div
                                className="input-group-append"
                                data-target="#projectStartDate"
                                data-toggle="datetimepicker"
                              >
                                <div className="input-group-text">
                                  <i className="fa fa-calendar"></i>
                                </div>
                              </div> */}
                            </div>
                          </div>
                        </div>

                        <div className="form-group row">
                          <div className="offset-sm-2 col-sm-10">
                            {isLoaderActive ? (
                              <PleaseWaitButton className="float-right btn-sm font-weight-medium auth-form-btn" />
                            ) : (
                              <button
                                type="submit"
                                className="btn btn-primary form-control-sm float-right"
                                // onClick={(e) => {
                                //   handleEditProfileDetails();
                                // }}
                                onClick={handleEditProfileDetails}
                              >
                                Update
                              </button>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* {Bank Details} */}
                    <div className="tab-pane" id="bankDetails">
                      <form className="form row">
                        <div className="col-md-3 mb-3">
                          <label for="AccountNumber" style={{ color: "#000" }}>
                            Account Number<sup style={{ color: "red" }}>*</sup>
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            id="accountNumber"
                            placeholder="Enter Account Number"
                            ref={inputAccNoReference}
                            value={accountNumber}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,18}$/.test(value)) {
                                setAccountNumber(value);
                              }
                              inputAccNoReference.current.classList.remove(
                                "is-invalid"
                              );
                            }}
                            onPaste={(e) => e.preventDefault()}
                            onCopy={(e) => e.preventDefault()}
                          />
                        </div>
                        <div className="col-md-3">
                          <label for="AccountNumber" style={{ color: "#000" }}>
                            Confirm Account Number
                            <sup style={{ color: "red" }}>*</sup>
                          </label>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            id="accountNumber"
                            placeholder="Confirm Account Number"
                            ref={inputConfirmAccNoReference}
                            value={confirmAccountNumber}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,18}$/.test(value)) {
                                setConfirmAccountNumber(value);
                              }
                              inputConfirmAccNoReference.current.classList.remove(
                                "is-invalid"
                              );
                            }}
                            onPaste={(e) => e.preventDefault()}
                          />
                        </div>
                        <div className="col-md-3">
                          <label for="ifscCode" style={{ color: "#000" }}>
                            IFSC Code<sup style={{ color: "red" }}>*</sup>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="ifscCode"
                            placeholder="Enter IFSC Code"
                            ref={inputIfscCodeReference}
                            value={ifscCode}
                            onChange={(e) => {
                              setIfscCode(e.target.value);
                              inputIfscCodeReference.current.classList.remove(
                                "is-invalid"
                              );
                            }}
                            onBlur={handleIfscCodeBlur}
                          />
                        </div>
                        <div className="col-md-3">
                          <label for="accHolderName" style={{ color: "#000" }}>
                            Account Holder Name
                            <sup style={{ color: "red" }}>*</sup>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="accHolderName"
                            placeholder="Enter Account Holder Name"
                            ref={inputAccHolderNameReference}
                            value={
                              accHolderName ||
                              profileDetails.firstName +
                              " " +
                              profileDetails.lastName
                            }
                            onChange={(e) => {
                              setAccHolderName(e.target.value);
                              inputAccHolderNameReference.current.classList.remove(
                                "is-invalid"
                              );
                            }}
                          />
                        </div>
                        <div className="col-md-3">
                          <label for="bankName" style={{ color: "#000" }}>
                            Bank Name<sup style={{ color: "red" }}>*</sup>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="bankName"
                            placeholder="Enter Bank Name"
                            ref={inputBankNameReference}
                            value={bankName}
                            onChange={(e) => {
                              setBankName(e.target.value);
                              inputBankNameReference.current.classList.remove(
                                "is-invalid"
                              );
                            }}
                          />
                        </div>
                        <div className="col-md-3">
                          <label for="branchName" style={{ color: "#000" }}>
                            Branch Name<sup style={{ color: "red" }}>*</sup>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="branchName"
                            placeholder="Enter Branch Name"
                            ref={inputBranchNameReference}
                            value={branchName}
                            onChange={(e) => {
                              setBranchName(e.target.value);
                              inputBranchNameReference.current.classList.remove(
                                "is-invalid"
                              );
                            }}
                          />
                        </div>
                        {/* <div className="col-md-6">
                          <label for="branchAddress" style={{ color: "#000" }}>
                            Branch Address
                          </label>
                          <textarea
                            className="form-control form-control-sm"
                            id="branchAddress"
                            placeholder="Enter Branch Address"
                            ref={inputBranchAddressReference}
                            value={branchAddress}
                            onChange={(e) => {
                              setBranchAddress(e.target.value);
                              inputBranchAddressReference.current.classList.remove(
                                "is-invalid"
                              );
                            }}
                          />
                        </div> */}
                        <div className="form-group row mt-3">
                          <div className="offset-sm-2 col-sm-10 form-control-sm ml-2">
                            {isLoaderActive ? (
                              <PleaseWaitButton className="btn-sm font-weight-medium auth-form-btn" />
                            ) : (
                              <button
                                type="button"
                                className="btn btn-success mt-2  form-control-sm"
                                onClick={(e) => {
                                  handleBankDetailsSubmit(e);
                                }}
                              >
                                Submit
                              </button>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* {Medical Insurance Details} */}
                    <div className="tab-pane" id="medicalInsurance">
                        <div className="col-md-12 mt-3">
                          <div className="table-responsive">
                            <table
                              id="faqs"
                              className="table table-bordered table-sm "
                            >
                              <thead>
                                <tr className="text-sm">
                                  <th className="text-nowrap">Sr. No.</th>
                                  <th >Name</th>
                                  <th >Relation</th>
                                  <th className="text-nowrap">Date Of Birth</th>
                                  <th >Age</th>
                                  <th >Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {insuranceComponentsArray.length > 0 ? (
                                  insuranceComponentsArray.map((data, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>
                                        <input
                                          type="text"
                                          name="name"
                                          className="form-control form-control-sm"
                                          value={data.name || ""}
                                          placeholder="Enter Name"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          name="relation"
                                          className="form-control form-control-sm"
                                          value={data.relation || ""}
                                          placeholder="Enter Name"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          name="dob"
                                          className="form-control form-control-sm"
                                          value={data.dob || ""}
                                          placeholder="Date of Birth"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          name="age"
                                          className="form-control form-control-sm"
                                          value={data.age || ""}
                                          placeholder="Age"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          name="amount"
                                          className="form-control form-control-sm"
                                          value={data.amount || ""}
                                          placeholder="Enter Amount"
                                        />
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="6" className="text-center">
                                      No data found
                                    </td>
                                  </tr>
                                )}
                              </tbody>

                            </table>
                          </div>
                        </div>
                      </div>

                    {/* {Tax Details} */}
                    <div className="tab-pane" id="taxDetails">
                      <div className="col-md-12 mt-3">
                        <div className="table-responsive">
                          <table
                            id="faqs"
                            className="table table-bordered table-sm"
                          >
                            <thead>
                              <tr className="text-sm">
                                <th>Sr. No.</th>
                                <th>Tax Name</th>
                                <th>Amount</th>
                                <th>Attachment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {salaryComponentsArray.length > 0 ? (
                                salaryComponentsArray.map((data, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                      <input
                                        className="form-control form-control-sm disable"
                                        value={
                                          declarations.find(
                                            (item) =>
                                              item.delarationId ==
                                              data.delarationId
                                          )?.delarationType || ""
                                        }
                                        // value={data.delarationId && data.delarationId.length > 45 ? data.delarationId.substring(0, 45) + "..." : data.delarationId || ""}
                                        title={
                                          data.delarationId ||
                                          "No Declaration ID"
                                        }
                                        style={{ cursor: "help" }}
                                        disabled
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control form-control-sm disable"
                                        value={data.amount || ""}
                                        disabled
                                      />
                                    </td>
                                    <td className="text-center">
                                      {data.prevAttachment ? (
                                        <a
                                          href={`${config.file_URL}${data.prevAttachment}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <i
                                            className="far fa-file-alt mr-1"
                                            aria-hidden="true"
                                          ></i>
                                          View
                                        </a>
                                      ) : (
                                        <p className="mb-0 pt-1">
                                          No Attchement Found
                                        </p>
                                      )}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" className="text-center">
                                    No data available
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
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer position="top-center" />
    </>
  );
};

export default Profile;