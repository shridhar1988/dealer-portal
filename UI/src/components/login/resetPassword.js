import React, { useState, useRef, useEffect } from "react";
import "./employee-login.css";
import { ToastContainer, toast } from "react-toastify";
import ilogo from "../../assets/images/Hlogo.png";
import fImageFirst from "../../assets/images/eLoginImageFisrt.svg";
import fImageSecond from "../../assets/images/eLoginImageSecond.svg";
import fImageThird from "../../assets/images/eLoginImageThird.svg";
import axios from "axios";
import config from "../../config/config.json";
import { useLocation, useNavigate } from 'react-router-dom';
import PleaseWaitButton from "../../shared/PleaseWaitButton";

function ForgotPassword() {
    const confirmPasswordRef = useRef(null);
    const passwordRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showconfirmPassword, setShowconfirmPassword] = useState(false);
    const [isLoaderActive, setIsLoaderActive] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search)


    const handleSubmit = (event) => {
        event.preventDefault();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        const password = passwordRef.current.value.trim();
        const confirmPassword = confirmPasswordRef.current.value.trim();
        const Id = params.get('Id');
        const token = new URLSearchParams(location.search).get('token');


        if (!password) {
            toast.error("Password is required.", { toastId: "password-error" });
            passwordRef.current.focus();
            passwordRef.current.classList.add("is-invalid");
            return;
        }
        if (!confirmPassword) {
            toast.error("confirm Password is required.", { toastId: "password-error" });
            confirmPasswordRef.current.focus();
            confirmPasswordRef.current.classList.add("is-invalid");
            return;
        }
        if (!passwordRegex.test(password)) {
            toast.error(
                'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.'
            )
            return;
        }
        if (!passwordRegex.test(confirmPassword)) {
            toast.error(
                'Confirm password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.'
            )
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Password and confirm password do not match.')
            return
        }

        AuthenticateUser(confirmPassword, Id, token);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowconfirmPassword(!showconfirmPassword);
    };

    const AuthenticateUser = async (token, Id, confirmPassword) => {
        setIsLoaderActive(true);
        try {
            const response = await axios.post(
                `${config.apiEndPoint}/AuthMaster/ForgotPassword`, {
                userID: Id, newPassword: token, token: confirmPassword
            });

            if (response.data.success === "success") {
                toast.success(response.data.message, { toastId: "login-success" });
                passwordRef.current.value = "";
                confirmPasswordRef.current.value = "";

                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else {
                // console.log(response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error during authentication:", error);
            toast.error("Error while resetting password");
        } finally {
            setIsLoaderActive(false);
        }
    };

    const [activeIndex, setActiveIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState("slide-in-right");
    const images = [
        {
            src: fImageFirst,
            label: "Employee Leave Requests",
            description:
                "Streamline leave requests and approvals with our intuitive system.",
        },
        {
            src: fImageSecond,
            label: "Employee Self-Service Portal",
            description:
                "Empower employees to manage their leave requests and view balances independently",
        },
        {
            src: fImageThird,
            label: "Integration and Customization",
            description:
                "Customize leave types, approval workflows, and notifications to fit your company's unique needs.",
        },
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
            <div className="row ">
                <div className="left col-lg-6 col-md-12 col-sm-12">
                    <div className="login-form">
                        <div className="inside mt-4">
                            <div className="text-center welcome-slogan">
                                <img src={ilogo} className="img-fluid ilogo" alt="logo" />

                                <h5>Hi, Welcome To Dealer Portal</h5>
                                <p>Forgot Password? That's okay! Lets change it...<br /> Please enter the new password and confirm password</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="loginf">
                                    <div className="form-group" style={{ marginBottom: '0rem' }}>
                                        <div className="input-group">
                                            <div class="did-floating-label-content" style={{ width: '100%' }}>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    id="password"
                                                    ref={passwordRef}
                                                    placeholder=""
                                                    className="did-floating-input"
                                                />
                                                <label class="did-floating-label">Enter your password</label>
                                            </div>


                                            <div className="input-group-append" style={{ position: 'absolute', right: '0', bottom: '20px', height: '69.5%' }}>
                                                <div
                                                    className="input-group-text"
                                                    onClick={() => togglePasswordVisibility()}
                                                    style={{ cursor: 'pointer' }}
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

                                    <div className="form-group" style={{ marginBottom: '0rem' }}>
                                        <div className="input-group">
                                            <div class="did-floating-label-content" style={{ width: '100%' }}>
                                                <input
                                                    type={showconfirmPassword ? "text" : "password"}
                                                    id="confirmPassword"
                                                    ref={confirmPasswordRef}
                                                    placeholder=""
                                                    className="did-floating-input"
                                                />
                                                <label class="did-floating-label">Confirm your password</label>
                                            </div>


                                            <div className="input-group-append" style={{ position: 'absolute', right: '0', bottom: '20px', height: '69.5%' }}>
                                                <div
                                                    className="input-group-text"
                                                    onClick={() => toggleConfirmPasswordVisibility()}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {showconfirmPassword ? (
                                                        <i className="fa fa-eye" />
                                                    ) : (
                                                        <i className="fa fa-eye-slash" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {isLoaderActive ? (
                                    <PleaseWaitButton className="mt-4 btn-sm font-weight-medium auth-form-btn" />
                                ) : (
                                    <button type="submit" className="mt-4">Submit</button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
                <div className="right col-lg-6 col-md-12 col-sm-12">
                    <div className="carousel slide">
                        <div className="carousel-inner p-3">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`carousel-item ${index === activeIndex ? `active ${slideDirection}` : ""
                                        }`}
                                >
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
            <ToastContainer position="top-center" />
        </div>
    );
}

export default ForgotPassword;
