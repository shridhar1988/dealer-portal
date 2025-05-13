
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import PleaseWaitButton from '../../shared/PleaseWaitButton';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const config = require("../../config/config.json");

const Designation = () => {
    const UserId = localStorage.getItem('loggedUserId');
    const inputAppNameReference = useRef(null);
    const navigate = useNavigate();
    const [appName, setAppName] = useState('');
    const [roles, setRoles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editAppId, setEditAppId] = useState(null);
    const [isAppNameValid, setIsAppNameValid] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const filteredDesignations = roles.filter((item) =>
        item.designationName.toLowerCase().includes(searchText.toLowerCase())
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredDesignations.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredDesignations.length / rowsPerPage);

    const startEntry = indexOfFirstRow + 1;
    const endEntry = Math.min(indexOfLastRow, filteredDesignations.length);

    const handlePageChange = (newPage) => {
        if(newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    useEffect(() => {
        GetRoles();
        window.initDatePickerFuncation();
    }, []);

    const GetRoles = async () => {
        setIsLoaderActive(true);

        try {
            const response = await axios.get(`${config.API_URL}Designation/GetAllDesignations`);
            const appsArray = response.data.data || [];
            setRoles(appsArray);
        } catch(error) {
            console.error('Error fetching designations:', error);
            toast.error('Error fetching designations');
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleAppNameChange = (e) => {
        const value = e.target.value;
        setAppName(value);
        setIsAppNameValid(value !== '');
    };

    const handleSubmit = async () => {

        inputAppNameReference.current.classList.remove('is-invalid');

        if(appName.trim() === '') {
            setIsAppNameValid(false);
            inputAppNameReference.current.focus();
            toast.error('Please Enter Designation');
            return;
        }

        setIsLoaderActive(true);
        try {
            const appData = {
                designationID: isEditMode ? editAppId : 0,
                designationName: appName,
                createdBy: UserId,
                modifiedBy: isEditMode ? UserId : "",
            };

            const editAppData = {
                designationID: isEditMode ? editAppId : 0,
                newDesignationName: appName,
                modifiedBy: isEditMode ? UserId : "",
            };



            const response = isEditMode
                ? await axios.put(`${config.API_URL}Designation/UpdateDesignationOfId`, editAppData)
                : await axios.post(`${config.API_URL}Designation/CreateDesignation`, appData);

            if(response.data.success) {
                toast.success(isEditMode ? 'Designation updated successfully' : 'Designation created successfully');
                handleCancel();
                setIsEditMode(false);
                setEditAppId('');
            } else {
                toast.error(response.data.message || 'Error processing request');
            }
        } catch(error) {
            toast.error(error.response?.data || 'An error occurred');
        } finally {
            setIsLoaderActive(false);
            GetRoles();
        }
    };

    const handleEdit = (app) => {
        setAppName(app.designationName);
        setIsEditMode(true);
        setEditAppId(app.designationID);
        setIsAppNameValid(true);
    };

    const handleDelete = (appId) => {
        setRoleToDelete(appId.designationID);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setRoleToDelete(null);
    };

    const deleteApp = async () => {
        setIsLoaderActive(true);
        try {
            const response = await axios.delete(`${config.API_URL}Designation/DeleteDesignation/${roleToDelete}/${UserId}`);

            if(response.data.success) {
                toast.success('Designation deleted successfully');
                GetRoles();
            } else {
                toast.error(response.data.message || 'Error deleting designation');
            }
        } catch(error) {
            toast.error(error.message);
        } finally {
            setIsLoaderActive(false);
            handleCloseModal();
        }
    };

    const handleCancel = () => {
        setAppName('');
        setIsAppNameValid(true);
        setEditAppId(null);
        setIsEditMode(false);
    };

    const exportToCSV = () => {
        let csvContent = "Designation\n";
        filteredDesignations.forEach((item) => {
            csvContent += `${item.designationName}\n`;
        });
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "DesignationList.csv");
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredDesignations.map((item) => ({
                Designation: item.designationName,
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Designations");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(data, "DesignationList.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Designation List", 14, 10);
        autoTable(doc, {
            head: [["Designation"]],
            body: filteredDesignations.map((item) => [item.designationName]),
        });
        doc.save("DesignationList.pdf");
    };

    const printTable = () => {
        const printWindow = window.open("", "", "width=800,height=600");
        printWindow.document.write("<html><head><title>Print Designations</title></head><body>");
        printWindow.document.write("<h3>Designation List</h3>");
        printWindow.document.write("<table border='1' cellspacing='0' cellpadding='5'><thead><tr><th>Designation</th></tr></thead><tbody>");
        filteredDesignations.forEach((item) => {
            printWindow.document.write(`<tr><td>${item.designationName}</td></tr>`);
        });
        printWindow.document.write("</tbody></table></body></html>");
        printWindow.document.close();
        printWindow.print();
    };


    return (
        <>
            <main id='main' className='addAssignee'>
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Manage Designations<span
                                    hover-tooltip='In this you can manage the designations used in the employee creation and onboarding by giving the designation name. You create a new, edit and delete the designations.'
                                    tooltip-position="bottom"
                                >
                                    <i
                                        className="fas fa-info-circle my-1 ml-2"
                                        style={{ color: "rgb(0 0 0 / 51%)" }}
                                    ></i>
                                </span></h1>
                                <ol className="breadcrumb float-sm-left mt-1">
                                    <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
                                    <li className="breadcrumb-item"><Link to="/masters">Masters</Link></li>
                                    <li className="breadcrumb-item active">Manage Designations</li>
                                </ol>
                            </div>
                            <div className="col-sm-6">
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className='row'>
                        <div className="col-md-12">
                            <div className="card card-outline card-primary">
                                <div className="card-header">
                                    <h3 className="card-title text-sm"><i className='fas fa-arrow-left mr-2' style={{ cursor: 'pointer' }}
                                        onClick={() => navigate('/masters')} />Create New Designation<span
                                            hover-tooltip='In this you can create a new and edit the designations by giving the designation name'
                                            tooltip-position="bottom"
                                        >
                                            <i
                                                className="fas fa-info-circle ml-2"
                                                style={{ color: "rgb(0 0 0 / 51%)" }}
                                            ></i>
                                        </span></h3>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="maximize">
                                            <i className="fas fa-expand"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className='card-body text-sm'>
                                    <div className='row'>
                                        <div className="form-group col-md-3">
                                            <label style={{ color: "#000" }}>
                                                Designation<sup style={{ color: 'red' }}>*</sup>
                                            </label>
                                            <input
                                                type='text'
                                                className={`form-control form-control-sm ${isAppNameValid ? '' : 'is-invalid'}`}
                                                value={appName}
                                                ref={inputAppNameReference}
                                                placeholder='Enter Designations'
                                                onChange={handleAppNameChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer text-sm">
                                    {isLoaderActive ? <PleaseWaitButton className='float-right btn-xs ml-2 font-weight-medium auth-form-btn' /> :
                                        <button type="submit" className="btn btn-primary float-right btn-xs ml-2" onClick={handleSubmit}>Save & Submit</button>
                                    }
                                    <button type="submit" className="btn btn-default float-right btn-xs" onClick={handleCancel}>Clear</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className='row'>
                        <div className="col-md-12">
                            <div className="card card-outline card-primary">
                                <div className="card-header">
                                    <h3 className="card-title text-sm">Designations List ( {roles.length} )<span
                                        hover-tooltip='In this you can see the list of designations in the table and edit, delete the designations by using the action buttons.'
                                        tooltip-position="bottom"
                                    >
                                        <i
                                            className="fas fa-info-circle ml-2"
                                            style={{ color: "rgb(0 0 0 / 51%)" }}
                                        ></i>
                                    </span></h3>
                                    <div className="card-tools">
                                        <button type="button" className="btn btn-tool" data-card-widget="maximize">
                                            <i className="fas fa-expand"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body text-sm position-relative" >
                                    <div className="d-flex justify-content-between mb-2">
                                        <div>
                                            <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={exportToCSV}>Export CSV</button>
                                            <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={exportToExcel}>Export Excel</button>
                                            <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={exportToPDF}>Export PDF</button>
                                            <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={printTable}>Print</button>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm w-25"
                                            placeholder="Search..."
                                            onChange={(e) => {
                                                setSearchText(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                    </div>

                                    <table class="table table-bordered table-sm table-striped">
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
                                        <thead>
                                            <tr>
                                                <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }} className='text-center'>Sr. No.</th>
                                                <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Designation</th>
                                                <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }}>Action</th>
                                            </tr>
                                        </thead>
                                        {/* <tbody>
                                            {roles.length > 0 ?
                                                roles.map((roleObj, index) => {
                                                    return (
                                                        <tr>
                                                            <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>{index + 1}</td>
                                                            <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{roleObj.designationName}</td>
                                                            <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>
                                                                <button type="button" class="btn btn-outline-warning btn-xs" onClick={(e) => { handleEdit(roleObj) }} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                                                                    <i class="fas fa-edit" style={{ fontSize: 'smaller' }}></i>
                                                                </button>
                                                                <button type="button" class="btn btn-outline-danger btn-xs ml-2" onClick={(e) => { handleDelete(roleObj) }} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                                                                    <i class="fas fa-trash" style={{ fontSize: 'smaller' }}></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                : ""
                                            }
                                        </tbody> */}
                                        <tbody>
                                            {currentRows.length > 0 ? (
                                                currentRows.map((roleObj, index) => (
                                                    <tr key={roleObj.designationID}>
                                                        <td className='text-center text-sm'>{indexOfFirstRow + index + 1}</td>
                                                        <td>{roleObj.designationName}</td>
                                                        <td className='text-center text-sm'>
                                                            <button type="button" className="btn btn-outline-warning btn-xs" onClick={() => handleEdit(roleObj)}>
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button type="button" className="btn btn-outline-danger btn-xs ml-2" onClick={() => handleDelete(roleObj)}>
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="3" className="text-center">No records found</td></tr>
                                            )}
                                        </tbody>

                                    </table>
                                    <div className="d-flex justify-content-between mt-2">
                                        <div>
                                            Showing {startEntry} to {endEntry} of {filteredDesignations.length} entries
                                        </div>
                                        <div>
                                            <button
                                                className="btn btn-xs btn-outline-primary"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                <i className="fas fa-angle-double-left"></i>
                                            </button>
                                            <span className="mx-2">Page {currentPage} of {totalPages}</span>
                                            <button
                                                className="btn btn-xs btn-outline-primary"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                <i className="fas fa-angle-double-right"></i>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {showModal && (
                    <div
                        className='modal fade show d-flex pt-5'
                        tabIndex='-1'
                        role='dialog'
                        style={{ backgroundColor: '#5d5858b8', boxShadow: '#5d5858b 8' }}
                    >
                        <div className='modal-dialog modal-lg' role='document'>
                            <div className='modal-content'>
                                <div className="col-md-12">
                                    <i className="bi bi-x-lg mt-3 float-right" onClick={handleCloseModal} style={{ cursor: "pointer" }} ></i>
                                </div>
                                <div className='modal-body px-5'>
                                    <h5 className='modal-title w-100 text-center'>
                                        Are you sure?
                                    </h5>
                                </div>
                                <div className='modal-body'>
                                    <p className='text-center'>
                                        Are you sure you want to delete this designation? Once deleted, it
                                        cannot be recovered.
                                    </p>
                                </div>
                                <div className='d-flex justify-content-center pb-4'>
                                    <button
                                        type='button'
                                        className='btn btn-default btn-sm'
                                        onClick={handleCloseModal}
                                    >
                                        Cancel
                                    </button>
                                    {isLoaderActive ? (
                                        <PleaseWaitButton className="btn btn-warning btn-sm ml-2" />
                                    ) : (
                                        <button
                                            type='button'
                                            className='btn btn-success btn-sm ml-2'
                                            onClick={deleteApp}
                                        >
                                            Yes
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main >
            <ToastContainer position="top-center" />

        </>
    );
};

export default Designation;