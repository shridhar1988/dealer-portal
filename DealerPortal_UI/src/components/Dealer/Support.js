import React, { useState } from "react";
// import { IoIosSend } from "react-icons/io";
// import { FaArrowLeft } from "react-icons/fa";
import "./Chat.css"; // Custom CSS for additional styling
// import { registerLocale } from "react-datepicker";
import profile from "../../assets/images/profilepic.png";
const Chat = () => {
  const voice = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Example: Upload file to a server
      const formData = new FormData();
      formData.append("voiceFile", file);
      // fetch("/upload", { method: "POST", body: formData });
      console.log("Uploading file:", file.name);
    }
  };
  // Sample contacts data
  const contacts = [
    {
      id: 1,
      name: "V. G. Raja",
      lastMessage: "Can you confirm the order?",
      time: "10:30 AM",
      unread: 2,
    },
    {
      id: 2,
      name: "Divya P",
      lastMessage: "Invoice has been sent",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: 3,
      name: "Ahmedabad CFA",
      lastMessage: "Shipment delayed",
      time: "Yesterday",
      unread: 1,
    },
    {
      id: 4,
      name: "Tilak",
      lastMessage: "Can you confirm the order?",
      time: "10:30 AM",
      unread: 2,
    },
    {
      id: 5,
      name: "sai",
      lastMessage: "Invoice has been sent",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: 6,
      name: "madhu",
      lastMessage: "Shipment delayed",
      time: "Yesterday",
      unread: 1,
    },
    {
      id: 7,
      name: "jipson",
      lastMessage: "Shipment delayed",
      time: "Yesterday",
      unread: 1,
    },
  ];

  // Sample messages data for the selected contact
  const messages = [
    {
      id: 1,
      sender: "V. G. Raja",
      text: "Can you confirm the order?",
      time: "10:30 AM",
      isSent: false,
    },
    {
      id: 2,
      sender: "You",
      text: "Yes, the order is confirmed.",
      time: "10:32 AM",
      isSent: true,
    },
    {
      id: 3,
      sender: "V. G. Raja",
      text: "Thanks for the update!",
      time: "10:33 AM",
      isSent: false,
    },
  ];

  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState(messages);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: "You",
      text: messageInput,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isSent: true,
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessageInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  const chatback = (sno) => {
    alert(`Download action for payment #${sno}`);
  };

  return (
    <section className="content">
     
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-1 pt-2">
          <div className="col-12">
            <h5 className="m-0 p-2">
            Chat
            </h5>
          </div>
        </div>
       
        <div className="row">
          <div className="col-md-4 col-lg-5 mb-0">
            <div className="card">
              <div className="d-flex align-items-center m-0 pt-2 px-2">
                <div
                  className="input-group"
                  style={{
                    border: "1px solid lightgray",
                    borderRadius: "15px",
                    overflow: "auto",
                  }}
                >
                  <div className="input-group-append">
                    <span
                      className="input-group-text"
                      style={{ backgroundColor: "white", border: "none" }}
                    >
                      <i className="fas fa-search"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search"
                    className="form-control"
                    style={{ border: "none" }}
                  />
                </div>
              </div>
              <hr
                className="color-lightgray"
                style={{ marginBottom: "10px" }}
              />
              <div
                className="card-body1 p-0"
                style={{ height: "360px", overflowY: "auto" }}
              >
                <ul className="list-group list-group-flush">
                  {contacts.map((contact) => (
                    <li
                      key={contact.id}
                      className={`list-group-item d-flex justify-content-between align-items-center ${
                        selectedContact.id === contact.id ? "active" : ""
                      }`}
                      onClick={() => setSelectedContact(contact)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center mr-3">
                          {/* {contact.name.charAt(0)} */}
                          <img
                            className="rounded-circle"
                            src={profile}
                            style={{ width: "40px", height: "40px" }}
                          />
                        </div>
                        <div>
                          <h6 className="mb-0">{contact.name}</h6>
                          <small className="text-muted">
                            {contact.lastMessage}
                          </small>
                        </div>
                      </div>
                      <div className="text-right">
                        <small className="text-muted">{contact.time}</small>
                        {contact.unread > 0 && (
                          <span className="badge bg-primary rounded-pill ml-2">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="col-md-8 col-lg-7">
            <div className="card">
              <div className="card-header border-0 d-flex  align-items-center pl-2">
                {/* <FaArrowLeft
                  className="mt-1 cursor-pointer"
                  style={{ cursor: "pointer" }}
                  onClick={chatback}
                /> */}
                <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center mr-3">
                  {/* {contact.name.charAt(0)} */}
                  <img
                    className="rounded-circle"
                    src={profile}
                    style={{ width: "40px", height: "40px" }}
                  />
                </div>
                <div></div>
                <h6 className="card-title pl-2 fw-bold">
                  {selectedContact.name}
                </h6>
                <div>
                  <span className="text-muted mr-3">
                    {/* {selectedContact.time} */}
                  </span>
                  {selectedContact.unread > 0 && (
                    <span className="badge bg-danger rounded-pill">
                      {/* {selectedContact.unread} New */}
                    </span>
                  )}
                </div>
              </div>
              <div
                className="card-body1"
                style={{
                  height: "310px",
                  overflowY: "auto",
                  borderRadius: "12px",
                }}
              >
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`d-flex ${
                      message.isSent
                        ? "justify-content-end px-2"
                        : "justify-content-start px-2 pt-2"
                    } mb-3`}
                    style={{ borderRadius: "12px" }}
                  >
                    <div
                      className={`p-2 rounded ${
                        message.isSent ? "bg-primary text-white" : "bg-light"
                      }`}
                      style={{ maxWidth: "70%", borderRadius: "12px" }}
                    >
                      <p className="mb-0">{message.text}</p>
                      <small
                        className={`d-block ${
                          message.isSent ? "text-white" : "text-muted"
                        }`}
                        style={{ fontSize: "0.75rem", borderRadius: "12px" }}
                      >
                        {/* {message.time} */}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card-footer border-0">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-white">
                      <button
                        className="border-0 bg-white"
                        style={{ borderRadius: "0 0 0 0" }}
                        onClick={() =>
                          document.getElementById("voiceInput").click()
                        }
                      >
                        <i className="fas fa-microphone fa-lg text-muted"></i>
                      </button>
                      <input
                        type="file"
                        id="voiceInput"
                        accept="audio/*"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          console.log("File selected:", e.target.files[0])
                        }
                      />
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type a message..."
                  />
                  <div className="input-group-append">
                    <span className="input-group-text bg-white">
                      <button
                        className="border-0 bg-white"
                        style={{ borderRadius: "0 0 0 0" }}
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
                      >
                        <i className="fas fa-paperclip fa-lg text-muted"></i>
                      </button>
                      <input
                        type="file"
                        id="fileInput"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          console.log("File selected:", e.target.files[0])
                        }
                      />
                    </span>
                    <button className="btn btn-primary">
                      <i className="fas fa-paper-plane fa-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        {/* Zoom Controls */}
      </div>
      
    </section>
  );
};

export default Chat;
