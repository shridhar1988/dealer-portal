import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import default_image from "../../assets/images/default_img.png";
import _defaultImage from "../../assets/images/user2-160x160 1.png";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { changePersonalInfo } from "../../reduxStorage/personalInformation";
import { clearPersonalInformation } from "../../reduxStorage/personalInformation";
import { clearSelectedEmployeePersonalInformation } from "../../reduxStorage/selectedEmployeeInformation";
import axios from "axios";
import $ from "jquery";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import config from "../../config/config.json";
import { Modal } from "react-bootstrap";
import { removeExtraSpaces } from "../../common/textOperations";

import "./employeeProfile.css";
// import { set } from "react-datepicker/dist/date_utils";

const EmployeeProfile = () => {
  const inputCurrentPasswordReference = useRef(null);
  const inputNewPasswordReference = useRef(null);
  const inputConfirmPasswordReference = useRef(null);
  const [subModuleID, setSubModuleID] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [probationType, setProbationType] = useState("");
  const [probationPeriod, setProbationPeriod] = useState("");
  const toastId = React.useRef(null);
  const currentYear = new Date().getFullYear();
  let navigate = useNavigate();
  const contactNumberRef = useRef(null);
  const [showbtn, setShowbtn] = useState(false);
  const [showDepartmentModal, setDepartmentModal] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [empName, setEmpName] = useState(false);
  const [empContact, setEmpContact] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [empEmail, setEmpEmail] = useState(false);
  const [department, setDepartment] = useState("");
  const [empinfo, setEmpinfo] = useState([]);
  const [profilePath, setProfilePath] = useState(false);
  const [allManager, setAllManager] = useState([]);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const inputAccNoReference = useRef(null);
  const inputBankNameReference = useRef(null);
  const inputAccHolderNameReference = useRef(null);
  const inputBranchNameReference = useRef(null);
  // const inputBranchAddressReference = useRef(null);
  const inputConfirmAccNoReference = useRef(null);
  const inputIfscCodeReference = useRef(null);
  const [bankData, setBankData] = useState("");
  const [bankName, setBankName] = useState("");
  const [declarations, setDeclarations] = useState([]);
  const [insuranceComponentsArray, setInsuranceComponentsArray] = useState([]);
  const [accHolderName, setAccHolderName] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchName, setBranchName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  // const [branchAddress, setBranchAddress] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isModal, setIsModal] = useState(true);
  const [appendIndexId, setAppendIndexId] = useState(1);
  const personalInfo = useSelector((state) => state.personalInformationReducer);
  const gender = personalInfo.gender;
  const selectedEmployeeDetails = useSelector(
    (state) => state.selectedEmployeeInformationReducer
  );
  const [salaryComponentsArray, setSalaryComponentsArray] = useState([
    {
      componentName: "",
      percentage: "",
    },
  ]);

  const [getEditOnboardingEmployeeAccess, setGetEditOnboardingEmployeeAccess] =
    useState(false);

  const dispatch = useDispatch();

  const myName = empName;

  useEffect(() => {
    GetAllManager();
    GetEmpInfo();
    GetAllMedicalRecordsByEmpId();
    loadData(1);
    GetBankDetails();
    GetAllItDeclarations();
    const defaultYear = `${currentYear}-${currentYear + 1}`;
    GetEmpTaxComponents(defaultYear);
  }, []);

  useEffect(() => {
    if(jsonData) {
      $(document).on("click", ".add-more", function() {
        setAppendIndexId(appendIndexId + 1);
      });
      $(document).on("click", ".remove-more", function() {
        setAppendIndexId(appendIndexId - 1);
      });
      return () => {
        $(document).off("click", ".add-more");
        $(document).off("click", ".remove-more");
      };
    }
  }, [jsonData]);

  const resetChangePassword = () => {
    setConfirmPassword("");
    setCurrentPassword("");
    setNewPassword("");
  };
  const validatePasswordPolicy = (password) => {
    const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordPolicy.test(password);
  };
  const GetAllItDeclarations = async () => {
    setIsLoaderActive(true);
    try {
      const response = await axios.get(
        `${config.apiEndPoint}/ITDeclarationMaster/GetAllItDeclaration`
      );
      if(response.data.success === "True") {
        setDeclarations(response.data.data);
        // console.log("data", response.data.data);
      } else {
        setDeclarations([]);
      }
    } catch(error) {
      console.error("Error fetching declarations:", error);
      toast.error("Error fetching declarations");
    } finally {
      setIsLoaderActive(false);
    }
  };
  const handleChangePassSubmit = (e) => {
    if(removeExtraSpaces(currentPassword)) {
      if(removeExtraSpaces(newPassword)) {
        if(removeExtraSpaces(confirmPassword)) {
          if(
            removeExtraSpaces(newPassword) == removeExtraSpaces(confirmPassword)
          ) {
            if(validatePasswordPolicy(newPassword)) {
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
                  if(response.data.success == "success") {
                    toast.success(response.data.message);
                    resetChangePassword();
                    setIsLoaderActive(false);
                    handleLogout();
                  } else {
                    toast.error(response.data.message);
                  }
                })
                .catch((error) => {
                  if(!error.response.data.success) {
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
              "Please check entered new password and confirm new passowrd shouled be the same."
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
  const handleErrorToastUsingMessage = (message) => {
    if(!toast.isActive(toastId.current)) {
      toast.error(message, {
        toastId: "unique-toast-id", // A unique ID to ensure only one toast
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  const handleSuccesToastWithMessage = (message) => {
    setShowbtn(false);
    if(!toast.isActive(toastId.current)) {
      toast.success(message, {
        toastId: "unique-toast-id", // A unique ID to ensure only one toast
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  const GetAllManager = async (department) => {
    setIsLoaderActive(true);

    try {
      const response = await axios.get(
        `${config.apiEndPoint}/AuthMaster/GetAllManagers`
      );
      if(response.data.success == "success") {
        console.log("all manager--->", response.data.data);

        setAllManager(response.data.data || []);
      } else {
        console.error("Error fetching Manager:");
      }
    } catch(error) {
      console.error("Error fetching Manager:");
    } finally {
      setIsLoaderActive(false);
    }
  };
  const postImageUsingImageString = async (userId) => {
    console.log("profileImage--->", profileImage);

    var formData = new FormData();
    formData.append("UserID", userId);
    formData.append("CreatedBy", userId);
    formData.append("ProfilePic", profileImage);
    setIsLoaderActive(true);
    try {
      axios
        .post(config.API_URL + "AuthMaster/ProfileUpdateUser", formData, {
          headers: config.headers3,
        })
        .then((response) => {
          // console.log("response Profile Pic Changes", response);
          if(response.data.success == "success") {
            // toast.success(response.data.message);
            dispatch(
              changePersonalInfo({
                profilePic: response.data.data,
              })
            );
          } else {
            // setIsLoaderActive(false);
            toast.error(response.data.message, config.tostar_config);
          }
        })
        .catch((error) => {
          toast.error(
            "oops something went wrong. please try again later.",
            config.tostar_config
          );
          // setIsLoaderActive(false);
        });

      // if (response.data.success == "success") {
      //   console.log("profile image updated");
      // } else {
      //   console.log("profile image not updated");
      // }
    } catch {
      console.error("Error fetching form data:");
    } finally {
      setIsLoaderActive(false);
    }
  };
  // Get Json Data
  const getSubModuleJsonByUserId = async (empId, formId) => {
    setIsLoaderActive(true);

    try {
      const response = await axios.get(
        `${config.apiEndPoint}/AdminFormFormat/GetUserJsonDataByUserIdANDFormId`,
        {
          params: { empId, formId },
        }
      );

      if(response.data.success === "True") {
        if(response.data.data.isData === "True") {
          setJsonData(response.data.data.data.jsonData);
          // console.log("response--->", response.data.data.data.jsonData);

          return response.data.data.data.jsonData;
        } else {
          const response = await axios.get(
            `${config.apiEndPoint}/AdminFormFormat/GetFormFormatById/1/${formId}`
          );

          if(response.data.success === "True") {
            setJsonData(response.data.data.jsonData);
            setIsLoaderActive(false);
            return response.data.data.jsonData;
          } else {
            setIsLoaderActive(false);
            return false;
          }
        }
      } else {
        setIsLoaderActive(false);
        return false;
      }
    } catch(error) {
      console.error("Error fetching form data:", error);
      setIsLoaderActive(false);
      return false;
    } finally {
      setIsLoaderActive(false);
    }
  };
  const loadData = async (subModuleId) => {
    setIsModal(true);
    setSubModuleID(subModuleId);
    $("#dynamic-form-container-home").html();

    const employeeId = personalInfo.userID;
    const getResult = await getSubModuleJsonByUserId(employeeId, subModuleId);
    addDetails("dynamic-form-container-home", getResult);
  };
  const readDocumentURL = function(Input) {
    if(
      $(Input).attr("file-document-path") &&
      $(Input).attr("file-document-path") != ""
    ) {
      let getAttrId = $(Input).attr("id");

      var label = $(Input).closest("input").prev("label");

      var anchor = $("<a>", {
        text: "Download File",
        href: $(Input).attr("file-document-path"),
        target: "_blank",
      });

      var button = $("<button>", { class: "file-button" }).append(anchor);

      var container = $(".document-upload-field-label");

      if(container.length) {
        $("#" + getAttrId)
          .parent("div")
          .append(button);
      } else {
        console.error(".document-upload-field container not found");
      }
    } else {
      $(label).hide();
      $(Input).hide();
    }
  };
  function add3Dots(string, limit) {
    var dots = "...";
    if(string) {
      if(string.length > limit) {
        // you can also use substr instead of substring
        string = string.substring(0, limit) + dots;
      }
    }

    return string;
  }
  function findDocumentFilePath(jsonArray) {
    // Iterate through each item in the array
    for(let item of jsonArray) {
      if(item.fileDocumentPath) {
        console.log("Shridhar------> ", item);
        let $fileInput = $("#" + item.name);
        $fileInput.parent("div").addClass("activeB");
        $fileInput.parent("div").find(".file-select-button").addClass("active");
        // $fileInput.parent('div').append(`<div class="tick"></div>`);
        $fileInput
          .parent("div")
          .append(
            `<div class="tick"><a href="${item.fileDocumentPath}" target="_blank" title="${item.value}"><i class="fa fa-eye" aria-hidden="true"></i></a></div>`
          );
        $fileInput.parent("div").find(".noFile").text(add3Dots(item.value, 55));
        $fileInput.parent("div").find(".cross").css("display", "inline-block");
      }
    }
    return null; // Return null if filePath is not found
  }
  const addDetails = (id, getJsonData) => {
    if(getJsonData) {
      const $ = window.jQuery;
      const formContainer = document.getElementById(id);
      if(formContainer) {
        $(formContainer).formRender({ formData: getJsonData });
        fileUploadDiv();
        const filePath = findFilePath(JSON.parse(getJsonData));
        if(filePath != null) {
          const container = $(".profile-upload-field").closest(
            ".formbuilder-file"
          );
          container.find(".image-preview").remove();
          container.append(
            '<img src="' +
            filePath +
            '" class="image-preview" alt="Image Preview" />'
          );
        }

        // // // console.log("filePath----------->>>>>>>", filePath); // Output the filePath
        if(filePath != null) {
          const container = $(".profile-upload-field").closest(
            ".formbuilder-file"
          );
          container.find(".image-preview").remove();
          container.append(
            '<img src="' +
            filePath +
            '" class="image-preview" alt="Image Preview" />'
          );
        }

        const fileDocumentPath = findDocumentFilePath(JSON.parse(getJsonData));
        const containerr = $(".profile-upload-field").closest(
          ".formbuilder-file"
        );
        const script = document.createElement("script");
        script.innerHTML = `
          $(document).ready(function() {
            const formData = ${JSON.stringify(getJsonData)};
            // Apply dynamic classes for file upload fields
            $('.formbuilder-file').each(function(i, obj) {
              if($(this).find('input').attr('class') == "profile-upload-field") {
                $(this).addClass('profile-upload-field-label');
              }
            });
            $('.formbuilder-file').each(function(i, obj) {
              if($(this).find('input').attr('class') == "document-upload-field") {
                $(this).addClass('document-upload-field-label');
              }
            });
          });
        `;
        document.body.appendChild(script);

        // Apply the 'row' class to the rendered form
        const renderedForm = $(formContainer).find(".rendered-form");
        if(renderedForm.length) {
          renderedForm.addClass("row");
        }

        const uploadFields = document.querySelectorAll(
          ".document-upload-field"
        );
        if(uploadFields) {
          uploadFields.forEach((field) => {
            readDocumentURL(field);
          });
        }

        $(".Removebtn").addClass("d-none");
        $(".add-more").hide();

        // ...................... Edit Acces to HR....................................

        // if (getEditOnboardingEmployeeAccess == false) {
        document
          .querySelectorAll(
            "#dynamic-form-container-home input, #dynamic-form-container-home select, #dynamic-form-container-home textarea,#dynamic-form-container-home file"
          )
          .forEach((el) => {
            el.disabled = true;
          });

        setShowbtn(false);
        // } else if (getEditOnboardingEmployeeAccess == true) {
        //   if($("#cno")){
        //     // document
        //     // .querySelectorAll(
        //     //   "#dynamic-form-container-home input")
        //     // .forEach((el) => {
        //     //   el.disabled = false;
        //     // });
        //   }

        //   setShowbtn(true);
        // }
        // ...................... End edit acces to HR....................................

        // Select the first two div elements inside .rendered-form and hide them
        $(".rendered-form div").slice(0, 2).hide();

        // Saving employee info to states
        $(document).ready(function() {
          // Check if #fname exists and update the value if present
          if($("#fname").length > 0) {
            setEmpName($("#fname").val());
          }

          // Check if #cno exists and update the value if present
          if($("#cno").length > 0) {
            setEmpContact($("#cno").val());
          }

          // Check if #cmail exists and update the value if present
          if($("#cmail").length > 0) {
            setEmpEmail($("#cmail").val());
          }

          if($(".profile-upload-field-label").length > 0) {
            setProfilePath($(".profile-upload-field").attr("file-path"));
            console.log(
              "profilePath--->",
              $(".profile-upload-field").attr("file-path")
            );
          }
        });

        $(".rendered-form label").each(function() {
          if($(this).text().trim() === "") {
            $(this).hide(); // Hide the label if it has no text
          }
        });

        //end

        //.....hide dates
        $(document).ready(function() {
          const today = new Date().toISOString().split("T")[0];

          $("input[type='date']#dob").each(function() {
            $(this).attr("max", today);
          });
          // $("input[type='date']").each(function () {
          //   $(this).attr("max", today);
          // });
          // add below code after
          $("input[type='date'].todayDate").each(function() {
            $(this).attr("max", today);
          });
        });
      }
    }
  };
  function fileUploadDiv() {
    $("#dynamic-form-container-home")
      .find("input[type='file']")
      .each(function() {
        const $fileInput = $(this);
        if($fileInput.attr("class") == "document-upload-field") {
          $fileInput.parent("div").parent("div").addClass("file-upload");
          $fileInput.parent("div").addClass("file-select");
          $fileInput.parent("div").find("label").addClass("file-select-button");
          $fileInput.parent("div").find("label").html("Choose File");
          $fileInput
            .parent("div")
            .append(
              `<div class="file-select-name noFile">No file chosen...</div>`
            );

          let $removeButtond = $fileInput.siblings("label").find(".Removebtn");

          if(!$removeButtond.length) {
            // const newDiv = $("<div>").addClass("tickbox col-lg-2").css({
            //   display: "inline-block",
            //   marginLeft: "10px",
            // });

            $removeButtond = $("<div>")
              .addClass("cross Removebtn")
              .css("display", "none")
              .on("click", function(event) {
                event.preventDefault();
                $fileInput.val("");
                $fileInput
                  .parent("div")
                  .find(".noFile")
                  .text("No file chosen...");
                $fileInput.parent("div").removeClass("activeB");
                $fileInput
                  .parent("div")
                  .find(".file-select-button")
                  .removeClass("active");
                $fileInput.parent("div").find(".tick").remove();
                $(this).css("display", "none");
              });

            // newDiv.append($removeButtond);
            $fileInput.parent().append($removeButtond);
          }

          $fileInput.on("input change", function() {
            $fileInput.parent("div").find(".tick").remove();
            if($fileInput.val()) {
              $removeButtond.css("display", "inline-block");
              $fileInput.parent("div").addClass("activeB");
              $fileInput
                .parent("div")
                .find(".file-select-button")
                .addClass("active");
              // if ($fileInput.parent('div').hasClass('tick')) {

              // } else {
              var file = $fileInput[0].files[0];
              var fileUrl = URL.createObjectURL(file);
              $fileInput
                .parent("div")
                .append(
                  `<div class="tick"><a href="${fileUrl}" target="_blank" title="${file.name}"><i class="fa fa-eye" aria-hidden="true"></i></a></div>`
                );
              // }

              $fileInput
                .parent("div")
                .find(".noFile")
                .text(
                  add3Dots($fileInput.val().replace("C:\\fakepath\\", ""), 55)
                );
            } else {
              $removeButtond.css("display", "none");
              $fileInput
                .parent("div")
                .find(".noFile")
                .text("No file chosen...");
              $fileInput.parent("div").removeClass("activeB");
              $fileInput
                .parent("div")
                .find(".file-select-button")
                .removeClass("active");
            }
          });
        }
      });
  }
  function findFilePath(jsonArray) {
    // Iterate through each item in the array
    for(let item of jsonArray) {
      if(item.filePath) {
        return item.filePath; // Return the filePath if found
      }
    }
    return null; // Return null if filePath is not found
  }
  $(document).ready(function() {
    // Restrict contact number input to 10 digits
    $("#cno").on("input", function() {
      const value = $(this).val();

      if(value.length > 10) {
        $(this).val(value.slice(0, 10));
      }
    });
  });
  const validateForm = () => {
    const $ = window.jQuery;
    let isValid = true;
    $(".rendered-form [required]").each(function() {
      const field = $(this);
      const value = field.val();
      const type = field.attr("type");

      if(!value) {
        isValid = false;
        highlightError(field);
        toast.error(field.attr("placeholder"));
        return isValid;
      } else {
        removeHighlight(field);
      }

      if(type === "tel") {
        if(value && !validateTel(value)) {
          isValid = false;
          highlightError(field);
          toast.error("Please enter a valid contact number");
          return isValid;
        }
        if(value.length < 10) {
          isValid = false;
          highlightError(field);
          toast.error("Contact number must be exactly 10 digits");
          if(field.attr("name") === "cno") {
            contactNumberRef.current.focus();
          }
          return isValid;
        }
      }
    });

    return isValid;
  };
  const validateTel = (tel) => {
    const regex = /^[1-9][0-9]{9}$/;
    return regex.test(tel);
  };
  const highlightError = (element) => {
    element.css("border", "2px solid red");
  };
  const removeHighlight = (element) => {
    element.css("border", "");
  };
  const getNewJsonDataWithValues = () => {
    const $ = window.jQuery;
    const formContainer = document.getElementById(
      "dynamic-form-container-home"
    );
    if(!formContainer || !jsonData) {
      return null;
    }
    // Parse jsonData if it's a string
    let parsedJsonData = jsonData;
    if(typeof jsonData === "string") {
      try {
        parsedJsonData = JSON.parse(jsonData);
      } catch(error) {
        return null;
      }
    }

    // Ensure it's an array
    const jsonDataArray = Array.isArray(parsedJsonData)
      ? parsedJsonData
      : Object.values(parsedJsonData);

    // Map through the array to attach values
    const newJsonData = jsonDataArray.map((field) => {
      const fieldName = field.name;
      const fieldType = field.type;

      // Find the corresponding input element in the form
      const inputElement = $(formContainer).find(`[name="${fieldName}"]`);
      if(!inputElement.length) return field; // Skip if the field doesn't exist in the form

      let fieldValue;
      // Extract value based on field type
      if(fieldType === "checkbox") {
        fieldValue = inputElement.is(":checked");
      } else if(fieldType === "radio") {
        fieldValue = $(formContainer)
          .find(`input[name="${fieldName}"]:checked`)
          .val();
      } else if(fieldType === "file") {
        const file = inputElement[0]?.files[0];
        fieldValue = file ? file.name : null; // Get the file name or null
      } else {
        fieldValue = inputElement.val(); // Get the input value for text, email, etc.
      }

      // Return updated field object with the new value
      return { ...field, value: fieldValue };
    });

    // newJsonData.forEach((item) => {
    //   if (item.className.includes("Aadhar-Number")) {
    //     item.value = adharValue ? adharValue : "123456789876";
    //     console.log("adhar item value ----> ", item.value);
    //   }
    // });

    return newJsonData;
  };
  const handleNext = async (event) => {
    event.preventDefault();
    if(validateForm()) {
      const newJsonData = getNewJsonDataWithValues();

      if(newJsonData) {
        let tempAllDocumentNameArray = [];
        let tempAllSelectedDocumentNameArray = [];
        let tempAllGetSelectedFilesArray = [];

        $("#dynamic-form-container-home")
          .find("input:file")
          .each(function() {
            let getThis = $(this);
            let getDocumentClassName = $(this).attr("name");
            tempAllDocumentNameArray.push(getDocumentClassName);
            if($("#" + getThis.attr("id"))[0].files.length > 0) {
              tempAllSelectedDocumentNameArray.push(getDocumentClassName);
              const getSelectedFile = $("#" + getThis.attr("id"))[0].files[0];
              tempAllGetSelectedFilesArray.push(getSelectedFile);
            }
          });

        const formData = {
          empId: selectedEmployeeDetails.selectedEmployeeID,
          subModuleId: subModuleID,
          jsonData: JSON.stringify(newJsonData),
          formStatusFromUI: "completed",
          profileImage: profileImage,
          attachments: tempAllGetSelectedFilesArray,
          attachmentsNames: tempAllDocumentNameArray,
          selectedAttachmentsNames: tempAllSelectedDocumentNameArray,
          createdBy: personalInfo.UserID,
        };
        setIsLoaderActive(true);
        try {
          const check = await postFormData(formData);
          if(check === true) {
            handleSuccesToastWithMessage("Saved successfully!");

            document
              .querySelectorAll("#dynamic-form-container-home input")
              .forEach((el) => {
                el.disabled = true;
              });
            setTimeout(() => {
              setGetEditOnboardingEmployeeAccess(false);
            }, 1000);
            setShowbtn(false);
            loadData(1);
          } else {
            handleErrorToastUsingMessage("Error while storing data!");
          }
        } catch(error) {
          handleErrorToastUsingMessage("Unexpected error while storing data!");
        } finally {
          setIsLoaderActive(false);
        }
      }
    }
  };
  const postFormData = async (formData) => {
    setIsLoaderActive(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("empId", personalInfo.userID);
      formDataToSend.append("subModuleId", formData.subModuleId);
      formDataToSend.append("jsonData", formData.jsonData);
      formDataToSend.append("formStatusFromUI", formData.formStatusFromUI);
      formDataToSend.append("profileImage", formData.profileImage);

      formData.attachments.forEach((attach, index) => {
        formDataToSend.append(`docAttachments`, attach);
      });
      //formDataToSend.append(`attachments`, formData.attachments);
      formData.attachmentsNames.forEach((attachmentName, index) => {
        formDataToSend.append(`attachmentsNames[${index}]`, attachmentName);
      });

      formData.selectedAttachmentsNames.forEach(
        (attachmentSelectedName, index) => {
          formDataToSend.append(
            `selectedAttachmentsNames[${index}]`,
            attachmentSelectedName
          );
        }
      );

      formDataToSend.append("createdBy", formData.createdBy);
      const response = await axios.post(
        `${config.apiEndPoint}/AdminFormFormat/PostUserJsonFormData`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...config.header3,
          },
        }
      );

      if(response.data.success == "True") {
        if(profileImage != "") {
          postImageUsingImageString(response.data.data.empId);
          GetAllDepartments();
        }
        return true;
      } else {
        return false;
      }
    } catch(error) {
      // console.error("Error saving data:", error);
      return false;
    } finally {
      setIsLoaderActive(false);
    }
  };
  const EditAccessHandler = () => {
    if(getEditOnboardingEmployeeAccess == false) {
      // alert("false");
      document
        .querySelectorAll("#dynamic-form-container-home input")
        .forEach((el) => {
          if(el.id == "cno") {
            el.disabled = false;
          } else {
            el.disabled = true;
          }
        });
      setShowbtn(true);
    } else {
      // alert("true");

      document
        .querySelectorAll("#dynamic-form-container-home input")
        .forEach((el) => {
          el.disabled = true;
        });
      setShowbtn(false);
    }
    setGetEditOnboardingEmployeeAccess(!getEditOnboardingEmployeeAccess);
  };
  var loadFile = function(event) {
    var image = document.getElementById("output");
    image.src = URL.createObjectURL(event.target.files[0]);
    setProfileImage(event.target.files[0]);
    let getTempJsonDataArray = JSON.parse(jsonData);
    const index = getTempJsonDataArray.findIndex(
      (item) =>
        item.type === "file" && item.className === "profile-upload-field"
    );
    // getTempJsonDataArray[index]["filePath"] = "";
    setJsonData(JSON.stringify(getTempJsonDataArray));
  };
  const GetEmpInfo = async () => {
    setIsLoaderActive(true);

    try {
      const response = await axios.get(
        `${config.API_URL}AuthMaster/GetEmpInfoByEmpId?id=${personalInfo.userID}`
      );
      if(response.data.success == true) {
        setEmpinfo(response.data.data.empInfo);
        setProbationType(response.data.data.empInfo.isProbation);
        setProbationPeriod(response.data.data.empInfo.probationPeriod);
        localStorage.setItem(
          "loggedUserDepartment",
          response.data.data.empInfo.department
        );
        // console.log(response.data.data, "EmpInfo---->>>>");

        GetAllDepartments();
      } else {
        console.error("Error fetching employee info:");
      }
    } catch(error) {
      console.error("Error fetching employee info:");
    } finally {
      setIsLoaderActive(false);
    }
  };
  const GetAllDepartments = async () => {
    setIsLoaderActive(true);

    let dept = await localStorage.getItem("loggedUserDepartment");
    try {
      const response = await axios.get(
        `${config.apiEndPoint}/Department/GetDepartmentOfId/${dept}`
      );
      if(response.data.success == "True") {
        setDepartment(response.data.data);
        setTimeout(() => {
          GetAllDeptProfiles();
        }, 500);
      } else {
        console.error("Error fetching departments:");
      }
    } catch(error) {
      console.error("Error fetching departments:");
    } finally {
      setIsLoaderActive(false);
    }
  };
  const GetAllDeptProfiles = async () => {
    setIsLoaderActive(true);

    let dept = await localStorage.getItem("loggedUserDepartment");
    try {
      const response = await axios.get(
        `${config.apiEndPoint}/AuthMaster/GetAllEmpProfilePicByDept?deparmentId=${dept}`
      );
      if(response.data.success == "success") {
        setProfiles(response.data.data);
        console.log(response.data.data, "All Department Profiles---->>>>");
      } else {
        console.error("Error fetching Profiles:");
      }
    } catch(error) {
      console.error("Error fetching Profiles:");
    } finally {
      setIsLoaderActive(false);
    }
  };

  const manager = profiles.find((profile) => profile.roleId == config.ManagerRole);

  const firstFiveMembers = profiles
    .filter(profile => profile.roleId !== config.ManagerRole)
    .slice(0, 5);
  // console.log("firstFive-->", firstFiveMembers);
  // console.log("profileInfo-->", personalInfo);

  const remainingMembers = profiles.slice(0);
  console.log('====================================');
  console.log(remainingMembers, "remainingMembers");
  console.log('====================================');

  const handleIfscCodeBlur = () => {
    if(ifscCode.length === 11) {
      const ifscCodePattern = /^[a-zA-Z]{4}0[a-zA-Z0-9]{6}$/;

      if(ifscCodePattern.test(ifscCode)) {
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

      if(response.status === 200) {
        // console.log(response, 'RES');
        setBankData(response.data);
        if(response.data) {
          setBankName(response.data.BANK);
          setBranchName(response.data.BRANCH);
          // setBranchAddress(response.data.ADDRESS);
        }
      } else {
        console.error("No details found for the provided IFSC Code.");
      }
    } catch(error) {
      console.error("Error fetching IFSC Code details:", error);
      // toast.error("Failed to fetch IFSC details. Please try again.");
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleBankDetailsSubmit = async () => {
    if(!accountNumber) {
      inputAccNoReference.current.focus();
      inputAccNoReference.current.classList.add("is-invalid");
      toast.error("Please enter bank account number");
      setIsLoaderActive(false);
      return;
    }
    if(!confirmAccountNumber) {
      inputConfirmAccNoReference.current.focus();
      inputConfirmAccNoReference.current.classList.add("is-invalid");
      toast.error("Please confirm your bank account number");
      setIsLoaderActive(false);
      return;
    }
    if(accountNumber != confirmAccountNumber) {
      inputConfirmAccNoReference.current.focus();
      inputConfirmAccNoReference.current.classList.add("is-invalid");
      setIsLoaderActive(false);
      toast.error("Account number and confirm account number do not match");
      return;
    }
    if(!ifscCode) {
      inputIfscCodeReference.current.focus();
      inputIfscCodeReference.current.classList.add("is-invalid");
      setIsLoaderActive(false);
      toast.error("Please enter ifsc code of your bank");
      return;
    }
    if(!accHolderName || !empName) {
      inputAccHolderNameReference.current.focus();
      inputAccHolderNameReference.current.classList.add("is-invalid");
      toast.error("Please enter account holder name");
      setIsLoaderActive(false);
      return;
    }
    if(!bankName) {
      inputBankNameReference.current.focus();
      inputBankNameReference.current.classList.add("is-invalid");
      toast.error("Please enter bank name");
      setIsLoaderActive(false);
      return;
    }
    if(!branchName) {
      inputBranchNameReference.current.focus();
      inputBranchNameReference.current.classList.add("is-invalid");
      toast.error("Please enter your bank branch name");
      setIsLoaderActive(false);
      return;
    }
    // if (!branchAddress) {
    //   inputBranchAddressReference.current.focus();
    //   inputBranchAddressReference.current.classList.add("is-invalid");
    //   toast.error("Please enter your bank branch Address");
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
        accountHolderName: accHolderName || empName,
      };
      const response = await axios.post(
        `${config.API_URL}BankDetails/AddBankDetails`,
        bankData
      );

      if(response.data.success) {
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
      }
      setIsLoaderActive(false);
    } catch(error) {
      toast.error(error.response?.data || "An error occurred");
      setIsLoaderActive(false);
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
      if(response.data.success == "True") {
        // setBank(response.data.data);
        if(response.data.data) {
          console.log("bank details--->", response.data.data);

          setAccHolderName(response.data.data.accountHolderName);
          setAccountNumber(response.data.data.accountNumber);
          setConfirmAccountNumber(response.data.data.accountNumber);
          setBankName(response.data.data.bankName);
          setIfscCode(response.data.data.ifscCode);
          setBranchName(response.data.data.branchName);
        }
        GetIfscCode(response.data.data.ifscCode);
      } else {
        console.error("Error fetching bank details:");
        // setBank("");
      }
      setIsLoaderActive(false);
    } catch(error) {
      console.error("Error fetching bank details:");
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

      console.log("empsubmitted ===> ", componentsArray);
      if(componentsArray) {
        setSalaryComponentsArray(componentsArray);
      } else {
        setSalaryComponentsArray({});
      }
    } catch(error) {
      console.error("Error fetching employee tax details:", error);
      toast.error("Error fetching employee tax details");
    } finally {
      setIsLoaderActive(false);
    }
  };

  const joiningDate = empinfo.joiningDate; // Assuming format: "DD-MM-YYYY"
  const probationMonths = probationPeriod;

  if(joiningDate && probationMonths) {
    const [day, month, year] = joiningDate.split("-").map(Number);
    let joiningDateObj = new Date(year, month - 1, day); // Month is zero-based

    console.log("Joining Date:", joiningDateObj.toLocaleDateString("en-GB")); // "dd/mm/yyyy" format

    // Add probation period in months
    const probationEndDate = new Date(joiningDateObj);
    probationEndDate.setMonth(probationEndDate.getMonth() + probationMonths);

    // Format the date properly
    const formattedDate = probationEndDate.toLocaleDateString("en-GB"); // "dd/mm/yyyy" format

    console.log("Probation End Date:", formattedDate);
  }

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
    } catch(error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
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
              <h5 className="m-0">Employee Profile</h5>
              <ol className="breadcrumb float-sm-left mt-1">
                <li className="breadcrumb-item">
                  <Link to="/employee-dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active">Employee Profile </li>
              </ol>
            </div>
            <div className="col-sm-6">
            </div>
          </div>
        </div>
      </div>

      <section class="content">
        <div class="container-fluid">
          {/* <div class="row"> */}
          <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-12">
              <div class="card card-primary card-outline">
                <div class="card-body box-profile position-relative">
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
                  <div className="row">
                    <div className="col-md-5 py-4">
                      {showbtn == false ? (
                        <div className="imgBeforeEdit d-flex align-items-center justify-content-center mt-0">
                          <img
                            src={
                              profilePath
                                ? profilePath
                                : gender?.toLowerCase() === 'male'
                                  ? require('../../assets/images/default_img.png')
                                  : require('../../assets/images/download.jpeg')
                            }

                            id="output"
                            width="100"
                            className="img-fluid"
                            style={{ width: "160px", height: "160px" }}
                          />
                        </div>
                      ) : (
                        <div class="profile-pic d-flex align-items-center justify-content-center mt-0 mb-0">
                          <label
                            class="-label"
                            for="file"
                            style={{
                              width: "160px",
                              height: "160px",
                              marginBottom: "0px",
                            }}
                          >
                            <span class="glyphicon glyphicon-camera"></span>
                            <span>Change Image</span>
                          </label>
                          <input
                            id="file"
                            type="file"
                            onChange={(event) => loadFile(event)}
                          />
                          <img
                            src={profilePath || default_image}
                            id="output"
                            width="100"
                            style={{ width: "160px", height: "160px" }}
                          />
                        </div>
                      )}
                      <p class="text-muted text-center mt-2 mb-0">
                        <strong>{department.departmentName || "N/A"} </strong>{" "}
                        <br /> ({empinfo.designation})
                      </p>
                    </div>

                    <div className="col-md-7 d-flex justify-content-center">
                      <div className="row mt-3 w-100">
                        <div class="col-md-12">
                          <ul class="list-group list-group-unbordered mb-3">
                            <li class="list-group-item employeeDetailsList">
                              <b className="listHead">Name</b>{" "}
                              <a class="float-right text-clr ml-2">
                                {(personalInfo.firstName + " " + personalInfo.lastName) || empName || "NA"}
                              </a>
                            </li>
                            <li class="list-group-item employeeDetailsList">
                              <b className="listHead">Employee ID</b>{" "}
                              <a className="float-right text-clr ml-2">
                                {`ITS-${department.departmentName
                                  ? department.departmentName.slice(0, 3) +
                                  "-" +
                                  new Date()
                                    .getFullYear()
                                    .toString()
                                    .slice(-2)
                                  : "NA"
                                  }-${empinfo.empInfoId
                                    ? empinfo.empInfoId
                                      .toString()
                                      .padStart(3, "0")
                                    : "NA"
                                  }`}
                              </a>
                            </li>
                            <li class="list-group-item employeeDetailsList">
                              <b className="listHead">Email ID</b>{" "}
                              <a
                                class="float-right text-clr ellipsis ml-2"
                                title="abcxyz@iteos.in"
                              >
                                {empinfo.officialEmail || empEmail || personalInfo.emailAddress}
                              </a>
                            </li>

                            <li class="list-group-item employeeDetailsList">
                              <b className="listHead">Assigned Manager</b>{" "}
                              <a class="float-right text-clr ellipsis ml-2">

                                {empinfo.assignedManager && allManager != null
                                  ? (() => {
                                    const manager = allManager.find(
                                      (e) =>
                                        e.userID ===
                                        empinfo.assignedManager.toLowerCase()
                                    );
                                    return manager
                                      ? `${manager.firstName || "NA"} ${manager.lastName || "NA"
                                      }`
                                      : "NA";
                                  })()
                                  : "NA"}
                              </a>
                            </li>
                            <li class="list-group-item employeeDetailsList">
                              <b className="listHead">Employment Type</b>{" "}
                              <a class="float-right text-clr ellipsis ml-2">
                                {probationType ? "Probation" : "Permanent"}
                              </a>
                            </li>
                            {probationType ? (
                              <li class="list-group-item employeeDetailsList">
                                <b className="listHead">
                                  Probation End Date
                                </b>{" "}
                                <a class="float-right text-clr ellipsis ml-2">

                                  {probationPeriod ? (() => {
                                    try {
                                      const monthsToAdd = Number(probationPeriod);
                                      if(isNaN(monthsToAdd)) return "Invalid probation period";

                                      const [day, month, year] = empinfo.joiningDate.split("-");
                                      const joinDate = new Date(`${year}-${month}-${day}T12:00:00`);
                                      if(isNaN(joinDate.getTime())) return "Invalid joining date";

                                      const endDate = new Date(joinDate);
                                      endDate.setMonth(joinDate.getMonth() + monthsToAdd);

                                      // Handle month overflow
                                      if(endDate.getDate() !== joinDate.getDate()) {
                                        endDate.setDate(0);
                                      }

                                      // Format: Sep 13, 2025
                                      return endDate.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      });
                                    } catch {
                                      return "Calculation error";
                                    }
                                  })() : null}

                                </a>
                              </li>
                            ) : null}
                          </ul>
                          <div
                            className="col-md-12 d-flex pr-0"
                            style={{ flexDirection: "row-reverse" }}
                          >
                            {showbtn && (
                              <>
                                {isLoaderActive ? (
                                  <PleaseWaitButton className="float-right btn-sm font-weight-medium auth-form-btn" />
                                ) : (
                                  <button
                                    type="button"
                                    className="btn btn-success btn-sm saveBtn ml-2"
                                    onClick={handleNext}
                                  >
                                    Save
                                  </button>
                                )}
                              </>
                            )}
                            {subModuleID == 1 ? (
                              <button
                                type="button"
                                className="btn btn-warning btn-sm"
                                onClick={() => EditAccessHandler()}
                              >
                                { }
                                {getEditOnboardingEmployeeAccess && showbtn
                                  ? "Cancel"
                                  : "Edit"}
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class=" col-lg-6 col-md-6 col-sm-12">
              <div
                class="card card-primary card-outline"
                style={{ height: "94%" }}
              >
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
                  <div className="section mt-1">
                    <p className="section-title mb-0">
                      <strong>Department Manager</strong>
                    </p>
                    <div className="profile">
                      <div className="col-md-2 d-flex flex-column align-items-center p-1">
                        <div
                          style={{
                            border: "1px solid #f4f4f4",
                            borderRadius: "50%",
                            width: "100%",
                            aspectRatio: "1",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={manager?.picDbPath && manager.picDbPath !== "undefined" ? manager.picDbPath : default_image}
                            alt="Manager"
                            className="img-fluid w-100 rounded-circle"
                            style={{ height: '80px' }}
                          />
                        </div>
                        <a
                          className="profile-name ellipsis mb-0 text-center"
                          style={{ wordWrap: "break-word" }}
                        >
                          {manager?.empName || "Manager"}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="section mt-2">
                    <p className="section-title mb-0">
                      <strong>Department Members</strong>
                    </p>
                    <div className="row ml-1">
                      {firstFiveMembers
                        .filter(
                          (member) => member.empId !== personalInfo.userID
                        )
                        .map((member) => {
                          const picDbPath = member.picDbPath?.includes(
                            "/ProfileUploads"
                          )
                            ? member.picDbPath
                            : member.picDbPath?.replace(
                              "ProfileUploads",
                              "/ProfileUploads"
                            ) || default_image;

                          return (
                            <div
                              key={member.empId}
                              className="col-md-2 d-flex flex-column align-items-center p-1"
                            >
                              <div
                                style={{
                                  border: "1px solid #f4f4f4",
                                  borderRadius: "50%",
                                  width: "100%",
                                  aspectRatio: "1",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <img
                                  src={picDbPath === null || picDbPath === '' || picDbPath === 'undefined' ? default_image : picDbPath}
                                  alt={member.name}
                                  className="img-fluid w-100 rounded-circle"
                                  style={{ height: '80px' }}
                                />
                              </div>
                              <a
                                className="profile-name text-center text-truncate"
                                style={{
                                  wordWrap: "break-word",
                                  display: "block",
                                  maxWidth: "100%",
                                }}
                                title={member.empName}
                              >
                                {member.empName}
                              </a>
                            </div>
                          );
                        })}

                      {remainingMembers.length > 0 && (
                        <>
                          <div className="col-md-2 d-flex flex-column align-items-center p-1">
                            <div
                              style={{
                                border: "1px solid #f4f4f4",
                                borderRadius: "50%",
                                width: "100%",
                                aspectRatio: "1",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              onClick={() => setDepartmentModal(true)}
                            >
                              <i
                                className="fa fa-plus"
                                style={{ fontSize: "2rem", color: "#666", cursor: 'pointer' }}
                              ></i>
                            </div>
                            <a
                              className="profile-name ellipsis mb-0 text-center text-truncate"
                              style={{
                                wordWrap: "break-word",
                                maxWidth: "100%",
                              }}
                            >
                              View more
                            </a>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-12 px-0">
            <div class="card card-outline card-primary">
              <div class="card-header p-2">
                <ul class="nav nav-pills">
                  <li class="nav-item">
                    <a
                      class="nav-link active"
                      href="#json-information"
                      data-toggle="tab"
                      onClick={() => loadData(1)}
                    >
                      Personal Information
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="#json-information"
                      data-toggle="tab"
                      onClick={() => loadData(2)}
                    >
                      Previous Experience
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link "
                      href="#json-information"
                      data-toggle="tab"
                      onClick={() => loadData(3)}
                    >
                      Educational Details
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="#json-information"
                      data-toggle="tab"
                      onClick={() => loadData(4)}
                    >
                      Attach Documents
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="#timeline"
                      data-toggle="tab"
                      onClick={() => setIsModal(false)}
                    >
                      Change Password
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="#bankDetails"
                      data-toggle="tab"
                      onClick={() => setIsModal(false)}
                    >
                      Bank Details
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="#taxDetails"
                      data-toggle="tab"
                      onClick={() => {
                        setIsModal(false);
                        // Call the function here
                      }}
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
                </ul>
              </div>
              <div class="card-body position-relative">
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
                <div class="tab-content">
                  {isModal ? (
                    <div class="tab-pane active" id="json-information">
                      <div id="dynamic-form-container-home"></div>
                    </div>
                  ) : (
                    <>
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

                      {/* {Bank Details} */}
                      <div className="tab-pane" id="bankDetails">
                        <form className="form row">
                          <div className="col-md-3 mb-3">
                            <label
                              for="AccountNumber"
                              style={{ color: "#000" }}
                            >
                              Account Number
                              <sup style={{ color: "red" }}>*</sup>
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
                                if(/^\d{0,18}$/.test(value)) {
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
                            <label
                              for="AccountNumber"
                              style={{ color: "#000" }}
                            >
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
                                if(/^\d{0,18}$/.test(value)) {
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
                            <label
                              for="accHolderName"
                              style={{ color: "#000" }}
                            >
                              Account Holder Name
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="accHolderName"
                              placeholder="Enter Account Holder Name"
                              ref={inputAccHolderNameReference}
                              value={accHolderName || empName}
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
                          <div className="form-group row mt-3">
                            <div className="offset-sm-2 col-sm-10 form-control-sm ml-2">
                              {isLoaderActive ? (
                                <PleaseWaitButton className="btn-sm font-weight-medium auth-form-btn" />
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-success mt-2 form-control-sm"
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
                                            // data.delarationId && data.delarationId.length > 45 ? data.delarationId.substring(0, 45) + "..." : data.delarationId || ""
                                            declarations.find((item) => item.delarationId == data.delarationId)?.delarationType || ""

                                          }
                                          title={data.delarationId || "No Declaration ID"}
                                          style={{ cursor: 'help' }}
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
                                            <i className="far fa-file-alt mr-1" aria-hidden="true"></i>
                                            View
                                          </a>
                                        ) : (
                                          <p className="mb-0 pt-1">No Attchement Found</p>
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
                                          name="name"
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
        </div>

        <Modal
          show={showDepartmentModal}
          onHide={() => setDepartmentModal(false)}
        >
          <Modal.Header>
            <Modal.Title>Department Members</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              {remainingMembers
                .filter((member) => member.empName !== myName)
                .map((member) => (
                  <div
                    key={member.id}
                    className="col-md-3 p-2 m-1"
                    style={{
                      border: "1px solid #f4f4f4",
                      flexWrap: "wrap",
                      justifyContent: "space-around",
                    }}
                  >
                    <div className="d-flex flex-column align-items-center">
                      <img
                        src={member.picDbPath === null || member.picDbPath === '' || member.picDbPath === 'undefined' ? default_image : member.picDbPath}
                        alt={member.name}
                        className="img-fluid w-75 rounded-circle"
                        style={{ height: '75px' }}
                      />

                      <a className="profile-name text-clr ellipsis mb-0" title={member.empName || "Unknown User"}>
                        {member.empName || "Unknown User"}
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-warning btn-sm"
              onClick={() => setDepartmentModal(false)}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </section>
      <ToastContainer position="top-center" />
    </>
  );
};

export default EmployeeProfile;