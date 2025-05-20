import React, { useState, useRef, useEffect } from "react";
import "./employee-login.css";
import { ToastContainer, toast } from "react-toastify";
import ilogo from "../../assets/images/Hlogo.png";
import fImageFirst from "../../assets/images/eLoginImageFisrt.svg";
import fImageSecond from "../../assets/images/eLoginImageSecond.svg";
import fImageThird from "../../assets/images/eLoginImageThird.svg";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import config from "../../config/config.json";
import PleaseWaitButton from "../../shared/PleaseWaitButton";

function Login() {
    const emailRef = useRef(null);
    const [isLoaderActive, setIsLoaderActive] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const email = emailRef.current.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            toast.error("Username or email is required.", { toastId: "email-error" });
            emailRef.current.focus();
            emailRef.current.classList.add("is-invalid");
            return;
        } else if (!emailRegex.test(email)) {
            toast.error("Enter a valid email or username.", {
                toastId: "email-invalid",
            });
            return;
        }
        AuthenticateUser(email);
    };

    const AuthenticateUser = async (UserName) => {
        setIsLoaderActive(true);
        try {
            const response = await axios.post(
                `${config.apiEndPoint}/AuthMaster/SendResetLinkToMail`, { emailAddress: UserName });

            if (response.data.success === "success") {
                toast.success(response.data.message, { toastId: "login-success" });
                emailRef.current.value = "";
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                // console.log(response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error during authentication:", error);
            toast.error("Error while sending resetpassword link ");
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
                        <div className="inside mt-5">
                            <div className="text-center welcome-slogan">
                                <img src={ilogo} className="img-fluid ilogo" alt="logo" />

                                <h5 className="ml-4">Hi, Welcome To Dealer Portal</h5>
                                <p className="pt-2">Forgot Password?<br /> Enter your email to get a reset link</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="loginf">
                                    <div class="did-floating-label-content">
                                        <input class="did-floating-input" type="text"
                                            id="email"
                                            ref={emailRef}
                                            placeholder=""
                                        />
                                        <label class="did-floating-label">Enter your email</label>
                                    </div>

                                    <div className="forgot text-center float-right">
                                        <a href="/Login"><i className="fas fa-arrow-right mr-2"></i>Back to login?</a>
                                    </div>
                                </div>

                                {isLoaderActive ? (
                                    <PleaseWaitButton className="mt-4 btn-sm font-weight-medium auth-form-btn" />
                                ) : (
                                    <button type="submit" className="mt-4">Send Reset Password Link</button>
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

export default Login;