// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";

// import config from "../../config/config.json";

// const EmailConfiguration = () => {
//     const [mailID, setmailID] = useState("");
//     const [mailPassword, setmailPassword] = useState("");
//     const [smtpServer, setSmtpServer] = useState("");
//     const [smtpPort, setSmtpPort] = useState("");
//     const [isLoaderActive, setIsLoaderActive] = useState(false);
//     const mailIDRef = useRef(null);
//     const mailPasswordRef = useRef(null);
//     const smtpServerRef = useRef(null);
//     const smtpPortRef = useRef(null);
//     const [userName, setUsername] = useState("");
//     const [isSSL, setSsl] = useState("");
//     const usernameRef = useRef(null);
//     const sslRef = useRef(null);

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const fetchData = () => {
//         axios
//             .get(
//                 `${config.API_URL}EmailConfigure/GetMailConfiguration`
//             )
//             .then((response) => {
//                 if(response.data.success === "success") {
//                     const { data } = response.data;
//                     // console.log("Shridhar ---", data);
//                     setmailID(data.mailID || "");
//                     setmailPassword(data.mailPassword || "");
//                     setSmtpServer(data.smtpServer || "");
//                     setSmtpPort(data.smtpPort || "");
//                     setUsername(data.userName || "");
//                     setSsl(data.isSSL === "True" ? "true" : "false");

//                 } else {
//                     toast.error(response.data.message);
//                 }
//             })
//             .catch((error) => {
//                 const errorMessage =
//                     error.response?.data?.message ||
//                     "Oops, something went wrong. Please try again later.";
//                 toast.error(errorMessage);
//             });
//     };

//     const handleSave = () => {
//         mailIDRef.current?.classList.remove("is-invalid");
//         mailPasswordRef.current?.classList.remove("is-invalid");
//         smtpServerRef.current?.classList.remove("is-invalid");
//         smtpPortRef.current?.classList.remove("is-invalid");
//         mailIDSubjectRef.current?.classList.remove("is-invalid");

//         const validateFields = () => {
//             if(!mailID.trim()) {
//                 toast.error("Please enter mailID.");
//                 mailIDRef.current?.classList.add("is-invalid");
//                 mailIDRef.current?.focus();
//                 return false;
//             }
//             if(!isValidEmail(mailID)) {
//                 toast.error("Please enter a valid mailID.");
//                 mailIDRef.current?.classList.add("is-invalid");
//                 mailIDRef.current?.focus();
//                 return false;
//             }
//             if(!mailPassword.trim()) {
//                 toast.error("Please enter mailPassword.");
//                 mailPasswordRef.current?.classList.add("is-invalid");
//                 mailPasswordRef.current?.focus();
//                 return false;
//             }
//             if(!smtpServer.trim()) {
//                 toast.error("Please enter SMTP server.");
//                 smtpServerRef.current?.classList.add("is-invalid");
//                 smtpServerRef.current?.focus();
//                 return false;
//             }
//             if(!smtpPort.trim()) {
//                 toast.error("Please enter SMTP port.");
//                 smtpPortRef.current?.classList.add("is-invalid");
//                 smtpPortRef.current?.focus();
//                 return false;
//             }
//             if(!userName.trim()) {
//                 toast.error("Please enter userName.");
//                 usernameRef.current?.classList.add("is-invalid");
//                 usernameRef.current?.focus();
//                 return false;
//             }
//             if(!isSSL.trim()) {
//                 toast.error("Please select SSL option.");
//                 sslRef.current?.classList.add("is-invalid");
//                 sslRef.current?.focus();
//                 return false;
//             }

//             return true;
//         };

//         if(!validateFields()) return;

//         setIsLoaderActive(true);

//         const postData = {
//             id: emailConfigId,
//             mailID: mailID,
//             mailPassword: mailPassword,
//             userName: userName,
//             smtpServer: smtpServer,
//             smtpPort: smtpPort,
//             isSSL: isSSL.toString()
//         };
//         axios
//             .post(
//                 `${config.API_URL}EmailConfigure/UpdateMailConfiguration`,
//                 postData,
//                 {
//                     headers: {
//                         ...config.headers3,
//                         "Content-Type": "application/json-patch+json",
//                     },
//                 }
//             )

//             // axios
//             //     .post(
//             //         `${config.API_URL}EmailConfigure/UpdateMailConfiguration`,
//             //         {
//             //             "id": 1,
//             //             "mailID": mailID,
//             //             "mailPassword": mailPassword,
//             //             "userName": userName,
//             //             "smtpServer": smtpServer,
//             //             "smtpPort": smtpPort,
//             //             "isSSL": isSSL == false ? 0 : 1
//             //         }
//             //     )
//             .then((response) => {
//                 if(response.data.success === "success") {
//                     toast.success("Configuration saved successfully.");
//                     fetchData();
//                 } else {
//                     toast.error(response.data.message);
//                 }
//                 setIsLoaderActive(false);
//             })
//             .catch((error) => {
//                 const errorMessage =
//                     error.response?.data?.message ||
//                     "Oops, something went wrong. Please try again later.";
//                 toast.error(errorMessage);
//                 setIsLoaderActive(false);
//             });
//     };

//     const handleCancel = () => {
//         setmailID("");
//         setmailPassword("");
//         setSmtpServer("");
//         setSmtpPort("");

//     };

//     const isValidEmail = (mailID) => {
//         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailID);
//     };

//     const [mailIDSubject, setMailIDSubject] = useState("");
//     const [allEmailConfigurationList, setAllEmailConfigurationList] = useState(
//         []
//     );
//     const [emailTypes, setEmailTypes] = useState([]);
//     const [selectedEmailType, setSelectedEmailType] = useState("");
//     const mailIDSubjectRef = useRef(null);
//     const [emailConfigId, setEmailConfigId] = useState(null);
//     const inputEmailBodyReference = useRef(null);

//     // useEffect(() => {
//     //     window.initSummernoteFuncation();
//     // }, []);

//     useEffect(() => {
//         fetchEmailTypes();

//     }, []);

//     const fetchEmailTypes = () => {
//         axios
//             .get(
//                 `${config.API_URL}EmailConfigure/GetAllMailBodyConfigurations`,
//                 {
//                     headers: config.headers2,
//                 }
//             )
//             .then((response) => {
//                 if(response.status === 200 && response.data.success) {
//                     const emailConfigurations = response.data.data;
//                     console.log(emailConfigurations);
//                     const emailTypes = emailConfigurations.map(
//                         (config) => config.mailType
//                     );
//                     setEmailTypes(emailTypes);
//                     window.initSummernoteFuncation();
//                     setTimeout(() => {
//                         window.$('#buttonCust0').click();
//                     }, 1000);
//                 } else {
//                     toast.error("Failed to load email configurations.");
//                 }
//             })
//             .catch(() => {
//                 toast.error(
//                     "Oops, something went wrong while fetching email configurations."
//                 );
//             });
//     };

//     const getAllEmailConfigList = (emailType) => {
//         axios
//             .get(
//                 `${config.API_URL
//                 }EmailConfigure/GetMailBodyConfigurationByEmailType?emailType=${encodeURIComponent(
//                     emailType
//                 )}`,
//                 {
//                     headers: config.headers2,
//                 }
//             )
//             .then((response) => {
//                 if(response.status === 200) {
//                     if(response.data.success) {
//                         const data = response.data.data;
//                         if(data) {
//                             setAllEmailConfigurationList(data);
//                             setMailIDSubject(data.mailSubject);
//                             setSelectedEmailType(emailType);
//                             setEmailConfigId(data.id);
//                             window.setSummerNoteValueFuncation(data.mailBody);
//                         }
//                     } else {
//                         toast.error(response.data.message);
//                     }
//                 } else if(response.data.status.status === 500) {
//                     toast.error("Invalid userName or password");
//                 }
//             })
//             .catch((error) => {
//                 toast.error("Oops, something went wrong. Please try again later.");
//             });
//     };

//     const handleButtonClick = (emailType) => {
//         getAllEmailConfigList(emailType);
//     };

//     const handleEmailSubmit = () => {
//         const textareaValue = window.getSummerNoteValueFuncation();

//         if(!mailIDSubject) {
//             toast.error("Please enter email subject.");
//             mailIDSubjectRef.current.focus();
//             mailIDSubjectRef.current.classList.add("is-invalid");
//             return;
//         }

//         if(!textareaValue) {
//             toast.error("Please enter email body.");
//             document.getElementById("summernote").focus();
//             return;
//         }

//         const postData = {
//             id: emailConfigId,
//             mailType: selectedEmailType,
//             mailBody: textareaValue,
//             mailSubject: mailIDSubject,
//         };
//         axios
//             .post(
//                 `${config.API_URL}EmailConfigure/UpdateMailBodyConfiguration`,
//                 postData,
//                 {
//                     headers: {
//                         ...config.headers3,
//                         "Content-Type": "application/json-patch+json",
//                     },
//                 }
//             )
//             .then((response) => {
//                 if(response.data.success) {
//                     toast.success("Email configuration saved successfully.");

//                 } else {
//                     toast.error(response.data.message);
//                 }
//             })
//             .catch((error) => {
//                 toast.error(
//                     error.response?.data?.message ||
//                     "Oops, something went wrong. Please try again later."
//                 );
//             });
//     };

//     return (
//         <>
//             <div className="content-header">
//                 <div className="container-fluid">
//                     <div className="row mb-2">
//                         <div className="col-sm-6">
//                             <h5 className="m-0">Email Configurations </h5>
//                             <ol className="breadcrumb float-sm-left mt-1">
//                                 <li className="breadcrumb-item">
//                                     <Link to="/manage-employee">Home</Link>
//                                 </li>
//                                 <li className="breadcrumb-item active">Email Configurations </li>
//                             </ol>
//                         </div>
//                         <div className="col-sm-6">
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <section className="content scroll-content">
//                 <div className="container-fluid">
//                     <div className="row">
//                         <div className="col-md-12">
//                             <div className="card card-primary collapsed-card card-outline">
//                                 <div className="card-header">
//                                     <h3 className="card-title text-sm">Email Configuration</h3>
//                                     <div className="card-tools">
//                                         <button
//                                             type="button"
//                                             className="btn btn-tool"
//                                             data-card-widget="maximize"
//                                         >
//                                             <i className="fas fa-expand"></i>
//                                         </button>
//                                         <button type="button" class="btn btn-tool" data-card-widget="collapse">
//                                             <i class="fas fa-plus"></i>
//                                         </button>
//                                     </div>
//                                 </div>
//                                 <div className="card-body collapse text-sm">
//                                     <div className="row">
//                                         <div className="form-group col-md-6">
//                                             <label htmlFor="mailID">
//                                                 Email
//                                                 <sup style={{ color: "red" }}>*</sup>
//                                             </label>
//                                             <input
//                                                 type="mailID"
//                                                 id="mailID"
//                                                 value={mailID}
//                                                 onChange={(e) => setmailID(e.target.value)}
//                                                 ref={mailIDRef}
//                                                 className="form-control form-control-sm"
//                                                 placeholder="Enter your mailID"
//                                             />
//                                         </div>
//                                         <div className="form-group col-md-6">
//                                             <label htmlFor="mailPasswordInput">
//                                                 Password<sup style={{ color: "red" }}>*</sup>
//                                             </label>
//                                             <input
//                                                 type="password"
//                                                 id="passwordInput"
//                                                 value={mailPassword}
//                                                 onChange={(e) => setmailPassword(e.target.value)}
//                                                 ref={mailPasswordRef}
//                                                 className="form-control form-control-sm"
//                                                 placeholder="Enter your mailPassword"
//                                             />
//                                             <span
//                                                 toggle="#passwordInput"
//                                                 class="fa fa-fw fa-eye field-icon-password toggle-password"
//                                             ></span>
//                                         </div>

//                                         <div className="form-group col-md-6">
//                                             <label htmlFor="smtpServer">
//                                                 SMTP Server
//                                                 <sup style={{ color: "red" }}>*</sup>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 id="smtpServer"
//                                                 value={smtpServer}
//                                                 onChange={(e) => setSmtpServer(e.target.value)}
//                                                 ref={smtpServerRef}
//                                                 className="form-control form-control-sm"
//                                                 placeholder="Enter SMTP server"
//                                             />
//                                         </div>
//                                         <div className="form-group col-md-6">
//                                             <label htmlFor="smtpPort">
//                                                 SMTP Port
//                                                 <sup style={{ color: "red" }}>*</sup>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 id="smtpPort"
//                                                 value={smtpPort}
//                                                 onChange={(e) => setSmtpPort(e.target.value)}
//                                                 ref={smtpPortRef}
//                                                 className="form-control form-control-sm"
//                                                 placeholder="Enter SMTP port"
//                                             />
//                                         </div>
//                                         <div className="form-group col-md-6">
//                                             <label htmlFor="userName">
//                                                 Username
//                                                 <sup style={{ color: "red" }}>*</sup>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 id="userName"
//                                                 value={userName}
//                                                 onChange={(e) => setUsername(e.target.value)}
//                                                 ref={usernameRef}
//                                                 className="form-control form-control-sm"
//                                                 placeholder="Enter userName"
//                                             />
//                                         </div>

//                                         <div className="form-group col-md-6">
//                                             <label htmlFor="isSSL">
//                                                 SSL
//                                                 <sup style={{ color: "red" }}>*</sup>
//                                             </label>
//                                             <select
//                                                 id="isSSL"
//                                                 value={isSSL}
//                                                 onChange={(e) => setSsl(e.target.value)}
//                                                 ref={sslRef}
//                                                 className="form-control form-control-sm"
//                                             >
//                                                 <option value="">Select SSL option</option>
//                                                 <option value="true">Yes</option>
//                                                 <option value="false">No</option>
//                                             </select>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="card-footer" style={{ textAlign: "right" }}>
//                                     <button
//                                         type="button"
//                                         className="btn btn-primary float-right btn-xs ml-2"
//                                         onClick={handleSave}
//                                         disabled={isLoaderActive}
//                                     >
//                                         {isLoaderActive ? "Saving..." : "Save & Submit"}
//                                     </button>
//                                     {/* <button
//                                         type="button"
//                                         className="btn btn-default float-right btn-xs"
//                                         onClick={handleCancel}
//                                     >
//                                         Cancel
//                                     </button> */}
//                                 </div>
//                             </div>
//                             <div className="card card-primary card-outline ">
//                                 <div className="card-header">
//                                     <h3 className="card-title text-sm">Manage Mail Content</h3>
//                                     <div className="card-tools">
//                                         <button
//                                             type="button"
//                                             className="btn btn-tool"
//                                             data-card-widget="maximize"
//                                         >
//                                             <i className="fas fa-expand"></i>
//                                         </button>
//                                         <button
//                                             type="button"
//                                             className="btn btn-tool"
//                                             data-card-widget="collapse"
//                                         >
//                                             <i className="fas fa-minus"></i> {/* Change icon to plus for collapsed state */}
//                                         </button>
//                                     </div>
//                                 </div>

//                                 <div className="card-body  text-sm">
//                                     <div className="mb-3">
//                                         {emailTypes.map((type, index) => (
//                                             <button
//                                                 key={index}
//                                                 id={"buttonCust" + index}
//                                                 className={`btn btn-sm m-1 ${selectedEmailType === type
//                                                     ? "btn-primary"
//                                                     : "btn-outline-primary"
//                                                     }`}
//                                                 onClick={() => handleButtonClick(type)}
//                                             >
//                                                 {type}
//                                             </button>
//                                         ))}
//                                     </div>

//                                     <div className="form-group">
//                                         <label htmlFor="mailIDSubject">
//                                             Mail Subject
//                                             <sup style={{ color: "red" }}>*</sup>
//                                         </label>
//                                         <textarea
//                                             id="mailIDSubject"
//                                             value={mailIDSubject}
//                                             onChange={(e) => setMailIDSubject(e.target.value)}
//                                             ref={mailIDSubjectRef}
//                                             className="form-control form-control-sm"
//                                             placeholder="Enter mail subject"
//                                         />
//                                     </div>

//                                     <div className="form-group">
//                                         <label>
//                                             Email Body Message
//                                             <sup style={{ color: "red" }}>*</sup>
//                                         </label>
//                                         <textarea
//                                             id="summernote"
//                                             ref={inputEmailBodyReference}
//                                         ></textarea>
//                                     </div>

//                                     <button
//                                         className="btn btn-xs btn-primary float-right"
//                                         onClick={handleEmailSubmit}
//                                     >
//                                         Save Email Configuration
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <ToastContainer position="top-center" />

//         </>
//     );
// };

// export default EmailConfiguration;
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import config from "../../config/config.json";

const EmailConfiguration = () => {
  const [mailID, setmailID] = useState("");
  const [mailPassword, setmailPassword] = useState("");
  const [smtpServer, setSmtpServer] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const mailIDRef = useRef(null);
  const mailPasswordRef = useRef(null);
  const smtpServerRef = useRef(null);
  const smtpPortRef = useRef(null);
  const [userName, setUsername] = useState("");
  const [isSSL, setSsl] = useState("");
  const usernameRef = useRef(null);
  const sslRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(`${config.API_URL}EmailConfigure/GetMailConfiguration`)
      .then((response) => {
        if (response.data.success === "success") {
          const { data } = response.data;
          // console.log("Shridhar ---", data);
          setmailID(data.mailID || "");
          setmailPassword(data.mailPassword || "");
          setSmtpServer(data.smtpServer || "");
          setSmtpPort(data.smtpPort || "");
          setUsername(data.userName || "");
          setSsl(data.isSSL === "True" ? "true" : "false");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message ||
          "Oops, something went wrong. Please try again later.";
        toast.error(errorMessage);
      });
  };

  const handleSave = () => {
    mailIDRef.current?.classList.remove("is-invalid");
    mailPasswordRef.current?.classList.remove("is-invalid");
    smtpServerRef.current?.classList.remove("is-invalid");
    smtpPortRef.current?.classList.remove("is-invalid");
    mailIDSubjectRef.current?.classList.remove("is-invalid");

    const validateFields = () => {
      if (!mailID.trim()) {
        toast.error("Please enter mailID.");
        mailIDRef.current?.classList.add("is-invalid");
        mailIDRef.current?.focus();
        return false;
      }
      if (!isValidEmail(mailID)) {
        toast.error("Please enter a valid mailID.");
        mailIDRef.current?.classList.add("is-invalid");
        mailIDRef.current?.focus();
        return false;
      }
      if (!mailPassword.trim()) {
        toast.error("Please enter mailPassword.");
        mailPasswordRef.current?.classList.add("is-invalid");
        mailPasswordRef.current?.focus();
        return false;
      }
      if (!smtpServer.trim()) {
        toast.error("Please enter SMTP server.");
        smtpServerRef.current?.classList.add("is-invalid");
        smtpServerRef.current?.focus();
        return false;
      }
      if (!smtpPort.trim()) {
        toast.error("Please enter SMTP port.");
        smtpPortRef.current?.classList.add("is-invalid");
        smtpPortRef.current?.focus();
        return false;
      }
      if (!userName.trim()) {
        toast.error("Please enter userName.");
        usernameRef.current?.classList.add("is-invalid");
        usernameRef.current?.focus();
        return false;
      }
      if (!isSSL.trim()) {
        toast.error("Please select SSL option.");
        sslRef.current?.classList.add("is-invalid");
        sslRef.current?.focus();
        return false;
      }

      return true;
    };

    if (!validateFields()) return;

    setIsLoaderActive(true);

    const postData = {
      id: emailConfigId,
      mailID: mailID,
      mailPassword: mailPassword,
      userName: userName,
      smtpServer: smtpServer,
      smtpPort: smtpPort,
      isSSL: isSSL.toString(),
    };
    axios
      .post(
        `${config.API_URL}EmailConfigure/UpdateMailConfiguration`,
        postData,
        {
          headers: {
            ...config.headers3,
            "Content-Type": "application/json-patch+json",
          },
        }
      )

      // axios
      //     .post(
      //         `${config.API_URL}EmailConfigure/UpdateMailConfiguration`,
      //         {
      //             "id": 1,
      //             "mailID": mailID,
      //             "mailPassword": mailPassword,
      //             "userName": userName,
      //             "smtpServer": smtpServer,
      //             "smtpPort": smtpPort,
      //             "isSSL": isSSL == false ? 0 : 1
      //         }
      //     )
      .then((response) => {
        if (response.data.success === "success") {
          toast.success("Configuration saved successfully.");
          fetchData();
        } else {
          toast.error(response.data.message);
        }
        setIsLoaderActive(false);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message ||
          "Oops, something went wrong. Please try again later.";
        toast.error(errorMessage);
        setIsLoaderActive(false);
      });
  };

  const handleCancel = () => {
    setmailID("");
    setmailPassword("");
    setSmtpServer("");
    setSmtpPort("");
  };

  const isValidEmail = (mailID) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailID);
  };

  const [mailIDSubject, setMailIDSubject] = useState("");
  const [allEmailConfigurationList, setAllEmailConfigurationList] = useState(
    []
  );
  const [emailTypes, setEmailTypes] = useState([]);
  const [selectedEmailType, setSelectedEmailType] = useState("");
  const mailIDSubjectRef = useRef(null);
  const [emailConfigId, setEmailConfigId] = useState(null);
  const inputEmailBodyReference = useRef(null);

  // useEffect(() => {
  //     window.initSummernoteFuncation();
  // }, []);

  useEffect(() => {
    fetchEmailTypes();
  }, []);

  const fetchEmailTypes = () => {
    axios
      .get(`${config.API_URL}EmailConfigure/GetAllMailBodyConfigurations`, {
        headers: config.headers2,
      })
      .then((response) => {
        if (response.status === 200 && response.data.success) {
          const emailConfigurations = response.data.data;
          console.log(emailConfigurations);
          const emailTypes = emailConfigurations.map(
            (config) => config.mailType
          );
          setEmailTypes(emailTypes);
          window.initSummernoteFuncation();
          setTimeout(() => {
            window.$("#buttonCust0").click();
          }, 1000);
        } else {
          toast.error("Failed to load email configurations.");
        }
      })
      .catch(() => {
        toast.error(
          "Oops, something went wrong while fetching email configurations."
        );
      });
  };

  const getAllEmailConfigList = (emailType) => {
    axios
      .get(
        `${
          config.API_URL
        }EmailConfigure/GetMailBodyConfigurationByEmailType?emailType=${encodeURIComponent(
          emailType
        )}`,
        {
          headers: config.headers2,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          if (response.data.success) {
            const data = response.data.data;
            if (data) {
              setAllEmailConfigurationList(data);
              setMailIDSubject(data.mailSubject);
              setSelectedEmailType(emailType);
              setEmailConfigId(data.id);
              window.setSummerNoteValueFuncation(data.mailBody);
            }
          } else {
            toast.error(response.data.message);
          }
        } else if (response.data.status.status === 500) {
          toast.error("Invalid userName or password");
        }
      })
      .catch((error) => {
        toast.error("Oops, something went wrong. Please try again later.");
      });
  };

  const handleButtonClick = (emailType) => {
    getAllEmailConfigList(emailType);
  };

  const handleEmailSubmit = () => {
    const textareaValue = window.getSummerNoteValueFuncation();

    if (!mailIDSubject) {
      toast.error("Please enter email subject.");
      mailIDSubjectRef.current.focus();
      mailIDSubjectRef.current.classList.add("is-invalid");
      return;
    }

    if (!textareaValue) {
      toast.error("Please enter email body.");
      document.getElementById("summernote").focus();
      return;
    }

    const postData = {
      id: emailConfigId,
      mailType: selectedEmailType,
      mailBody: textareaValue,
      mailSubject: mailIDSubject,
    };
    axios
      .post(
        `${config.API_URL}EmailConfigure/UpdateMailBodyConfiguration`,
        postData,
        {
          headers: {
            ...config.headers3,
            "Content-Type": "application/json-patch+json",
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Email configuration saved successfully.");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            "Oops, something went wrong. Please try again later."
        );
      });
  };

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h5 className="m-0">Email Configurations </h5>
              <ol className="breadcrumb float-sm-left mt-1">
                <li className="breadcrumb-item">
                  <Link to="/manage-employee">Home</Link>
                </li>
                <li className="breadcrumb-item active">
                  Email Configurations{" "}
                </li>
              </ol>
            </div>
            <div className="col-sm-6"></div>
          </div>
        </div>
      </div>
      <section className="content scroll-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary collapsed-card card-outline">
                <div className="card-header">
                  <h3 className="card-title text-sm">Email Configuration</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="maximize"
                    >
                      <i className="fas fa-expand"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-tool"
                      data-card-widget="collapse"
                    >
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body collapse text-sm">
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="mailID">
                        Email
                        <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        type="mailID"
                        id="mailID"
                        value={mailID}
                        onChange={(e) => setmailID(e.target.value)}
                        ref={mailIDRef}
                        className="form-control form-control-sm"
                        placeholder="Enter your mailID"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="mailPasswordInput">
                        Password<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        type="password"
                        id="passwordInput"
                        value={mailPassword}
                        onChange={(e) => setmailPassword(e.target.value)}
                        ref={mailPasswordRef}
                        className="form-control form-control-sm"
                        placeholder="Enter your mailPassword"
                      />
                      <span
                        toggle="#passwordInput"
                        class="fa fa-fw fa-eye-slash field-icon-password toggle-password"
                      ></span>
                    </div>

                    <div className="form-group col-md-6">
                      <label htmlFor="smtpServer">
                        SMTP Server
                        <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        type="text"
                        id="smtpServer"
                        value={smtpServer}
                        onChange={(e) => setSmtpServer(e.target.value)}
                        ref={smtpServerRef}
                        className="form-control form-control-sm"
                        placeholder="Enter SMTP server"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="smtpPort">
                        SMTP Port
                        <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        type="text"
                        id="smtpPort"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        ref={smtpPortRef}
                        className="form-control form-control-sm"
                        placeholder="Enter SMTP port"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="userName">
                        Username
                        <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUsername(e.target.value)}
                        ref={usernameRef}
                        className="form-control form-control-sm"
                        placeholder="Enter userName"
                      />
                    </div>

                    <div className="form-group col-md-6">
                      <label htmlFor="isSSL">
                        SSL
                        <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        id="isSSL"
                        value={isSSL}
                        onChange={(e) => setSsl(e.target.value)}
                        ref={sslRef}
                        className="form-control form-control-sm"
                      >
                        <option value="">Select SSL option</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="card-footer" style={{ textAlign: "right" }}>
                  <button
                    type="button"
                    className="btn btn-primary float-right btn-xs ml-2"
                    onClick={handleSave}
                    disabled={isLoaderActive}
                  >
                    {isLoaderActive ? "Saving..." : "Save & Submit"}
                  </button>
                  {/* <button
                                        type="button"
                                        className="btn btn-default float-right btn-xs"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button> */}
                </div>
              </div>
              <div className="card card-primary card-outline ">
                <div className="card-header">
                  <h3 className="card-title text-sm">Manage Mail Content</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="maximize"
                    >
                      <i className="fas fa-expand"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-minus"></i>{" "}
                      {/* Change icon to plus for collapsed state */}
                    </button>
                  </div>
                </div>

                <div className="card-body  text-sm">
                  <div className="mb-3">
                    {emailTypes.map((type, index) => (
                      <button
                        key={index}
                        id={"buttonCust" + index}
                        className={`btn btn-sm m-1 ${
                          selectedEmailType === type
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => handleButtonClick(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="form-group">
                    <label htmlFor="mailIDSubject">
                      Mail Subject
                      <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <textarea
                      id="mailIDSubject"
                      value={mailIDSubject}
                      onChange={(e) => setMailIDSubject(e.target.value)}
                      ref={mailIDSubjectRef}
                      className="form-control form-control-sm"
                      placeholder="Enter mail subject"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Email Body Message
                      <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <textarea
                      id="summernote"
                      ref={inputEmailBodyReference}
                    ></textarea>
                  </div>

                  <button
                    className="btn btn-xs btn-primary float-right"
                    onClick={handleEmailSubmit}
                  >
                    Save Email Configuration
                  </button>
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

export default EmailConfiguration;
