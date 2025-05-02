import React, { useState, useRef, useEffect } from "react";
import "./employee-login.css";
import { ToastContainer, toast } from "react-toastify";
import ilogo from "../../assets/images/DealerPortal Login logo.svg";
// import fImageFirst from "../../assets/images/eLoginImageFisrt.svg";
// import fImageSecond from "../../assets/images/eLoginImageSecond.svg";
// import fImageThird from "../../assets/images/eLoginImageThird.svg";
import axios from "axios";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import { setUserPersonalInformation } from "../../reduxStorage/personalInformation";
import { useDispatch } from "react-redux";
import config from "../../config/config.json";
import { useNavigate } from "react-router-dom";

function EmployeeLogin() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [isPopulated, setIsPopulated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedPassword = localStorage.getItem("rememberedPassword");

    if (storedEmail && storedPassword) {
      emailRef.current.value = storedEmail;
      passwordRef.current.value = storedPassword;
      setRememberMe(true);
    }
  }, []);

  const handleUsernameClick = () => {
    if (!isPopulated && rememberMe) {
      const storedEmail = localStorage.getItem("rememberedEmail");
      const storedPassword = localStorage.getItem("rememberedPassword");
      if (storedEmail && storedPassword) {
        emailRef.current.value = storedEmail;
        passwordRef.current.value = storedPassword;
        setIsPopulated(true);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('submit called');

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    if (!email) {
      toast.error("Username or email is required.", { toastId: "email-error" });
      emailRef.current.focus();
      emailRef.current.classList.add("is-invalid");
      return;
    } 
    // else if (!emailRegex.test(email) && !usernameRegex.test(email)) {
    //   toast.error("Enter a valid email or username.", {
    //     toastId: "email-invalid",
    //   });
    //   return;
    // }

    if (!password) {
      toast.error("Password is required.", { toastId: "password-error" });
      passwordRef.current.focus();
      passwordRef.current.classList.add("is-invalid");
      return;
    }

 
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedPassword", password);
    } else {
      // Clear credentials from localStorage if "Remember Me" is unchecked
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }

    AuthenticateUser(email, password);
    // console.log("Email:", email);
    // console.log("Password:", password);
  };

  const AuthenticateUser = async (UserName, Password) => {
    setIsLoaderActive(true);
    try {
     
      const response = await axios.post(`${config.API_URL}Auth/Login`, {
        userName: UserName,
        password: Password
        // clientId: config.ClientId // Uncomment if you want to send clientId
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success === "success") {
        toast.success("Logged In Successfully.");
        let responseData = response.data.data
        // console.log("login details---->",responseData);

        localStorage.setItem("isUserAuthenticated", true);
        localStorage.setItem("loggedUserId", response.data.data.userID);
        localStorage.setItem("loggedUserDisplayName", response.data.data.displayName);
        localStorage.setItem("loggedUserRole", response.data.data.userRole);
        localStorage.setItem("loggedUserName", response.data.data.userName);
        localStorage.setItem("loggedUserEmail", response.data.data.emailAddress);
        // alert("empId-->", responseData);
        dispatch(
          setUserPersonalInformation({
            userID: responseData.userID,
            empInfoId: responseData.empInfoId,
            userName: responseData.userName,
            firstName: responseData.firstName,
            lastName: responseData.lastName,
            displayName: responseData.displayName,
            userRole: responseData.userRole,
            menuItemNames: responseData.menuItemNames,
            emailAddress: responseData.emailAddress,
            token: responseData.token,
            profilePic: responseData.profilePic,
            gender: responseData.gender
          })
        );
        setTimeout(() => {
          setIsLoaderActive(false);
          switch (responseData.userRole) {

            case "Admin":
              navigate("/home", { replace: true });
              window.location.reload();
              break;
            // case "HR":
            //   navigate("/employee-dashboard", { replace: true });
            //   window.location.reload();
            //   break;
            // case "Manager":
            //   navigate("/employee-dashboard", { replace: true });
            //   window.location.reload();
            //   break;
            // case "Employee":
            //   navigate("/employee-dashboard", { replace: true });
            //   window.location.reload();
            //   break;

            default:
              navigate("/Login", { replace: true });
              break;
          }
        }, 1000);
      } else {
        toast.error(response.data.message??"Login ID and Password does not match!");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("slide-in-right");
  const images = [
    {
      src: ilogo,
     
    }
    // {
    //   src: fImageSecond,
    //   label: "Employee Self-Service Portal",
    //   description:
    //     "Empower employees to manage their leave requests and view balance independently",
    // },
    // {
    //   src: fImageThird,
    //   label: "Integration and Customization",
    //   description:
    //     "Customize leave types, approval workflows and notifications to fit your company's unique needs",
    // },
  ];

  const slideCount = images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideDirection("slide-in-right");
      setActiveIndex((prevIndex) => (prevIndex + 1) % slideCount);
    }, 3000);

    return () => clearInterval(interval);
  }, [slideCount]);


  return (
    <div className="container-fluid login-content">
  <div className="row">
    <div className="left col-lg-6 col-md-12 col-sm-12">
      <div className="login-form">
        <div className="inside mt-4">
          <div className="text-center welcome-slogan">
            <h5>Sign in</h5>
            <p className="pt-1 custom-text">Please login to continue to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="loginf">
              <div className="did-floating-label-content">
                <input
                  className="did-floating-input"
                  type="text"
                  id="email"
                  ref={emailRef}
                  placeholder=""
                  onChange={handleUsernameClick}
                />
                <label className="did-floating-label">
                  Email
                </label>
              </div>

              <div className="form-group" style={{ marginBottom: "0rem" }}>
                <div className="input-group">
                  <div className="did-floating-label-content" style={{ width: "100%" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      ref={passwordRef}
                      placeholder=""
                      className="did-floating-input"
                    />
                    <label className="did-floating-label">Password</label>
                  </div>

                  <div
                    className="input-group-append"
                    style={{
                      position: "absolute",
                      right: "0",
                      bottom: "20px",
                      height: "69.5%",
                    }}
                  >
                    <div
                      className="input-group-text"
                      onClick={() => togglePasswordVisibility()}
                      style={{ cursor: "pointer", borderRadius: "9px" }}
                    >
                      {showPassword ? (
                        <i className="fa fa-eye" />
                      ) : (
                        <i className="fa fa-eye-slash" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="forgot text-center float-right">
                <a href="/sendResetLink">Forgot Password?</a>
              </div>
            </div>

            <div className="from-check float-left mt-5">
              <input
                type="checkbox"
                className="checkb"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <span>Keep me logged in</span>
            </div>
            {isLoaderActive ? (
              <PleaseWaitButton className="mt-4 btn-sm font-weight-medium auth-form-btn" />
            ) : (
              <button type="submit" className="mt-4">
                Sign in
              </button>
            )}
          </form>
        </div>
      </div>
    </div>

    <div className="right col-lg-6 col-md-12 col-sm-12">
      <div className="carousel slide">
        <div className="carousel-inner p-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-item ${index === activeIndex ? `active ${slideDirection}` : ""}`}
              style={{ position: "relative" }}
            >
              {/* Text Over Image - Top Side */}
              <div style={{
                position: "absolute",
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                color: "blue",
                textAlign: "center",
                zIndex: 2
              }}>
                <h2 style={{ fontWeight: "bold" }}>Dealnex</h2>
                <p style={{ marginTop: "5px", color: "black" }}>Next-gen Dealer Experience</p>
              </div>

              {/* Image */}
              <img
                src={image.src}
                className="eLoginImage img-fluid"
                alt={`slide-${index}`}
              />
              <div className="carousel-caption-below text-center mt-2">
                <h5 style={{ fontSize: "21px" }}>{image.label}</h5>
                <p style={{ fontSize: "15px" }}>{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default EmployeeLogin;
