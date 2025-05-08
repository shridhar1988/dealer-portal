import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import PleaseWaitButton from '../../shared/PleaseWaitButton';
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



const config = require("../../config/config.json");

const Location = () => {
    const UserId = localStorage.getItem('loggedUserId');
    const inputAppNameReference = useRef(null);
    const inputAppAddressReference = useRef(null);
    const navigate = useNavigate();
    const [appName, setAppName] = useState('');
    const [appAddress, setAppAddress] = useState('');
    const [locations, setLocations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editAppId, setEditAppId] = useState(null);
    const [isAppNameValid, setIsAppNameValid] = useState(true);
    const [isAppAddressValid, setIsAppAddressValid] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        GetLocations();
        window.initDateTimePickerFuncation();
    }, []);

    const GetLocations = async () => {
        setIsLoaderActive(true);

        try {
            const response = await axios.get(`${config.API_URL}LocationMaster/GetAllLocations`);
            const appsArray = response.data.data || [];
            console.log('Location data:', appsArray);
            setLocations(appsArray);
        } catch(error) {
            console.error('Error fetching locations:', error);
            toast.error('Error fetching locations');
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleAppNameChange = (e) => {
        const value = e.target.value;
        setAppName(value);
        setIsAppNameValid(value !== '');
    };

    const handleAppAddressChange = (e) => {
        const value = e.target.value;
        setAppAddress(value);
        setIsAppAddressValid(value !== '');
    };

    const handleSubmit = async () => {

        inputAppNameReference.current.classList.remove('is-invalid');

        if(appName.trim() === '') {
            setIsAppNameValid(false);
            inputAppNameReference.current.focus();
            toast.error('Please Enter location Name');
            return;
        }

        inputAppAddressReference.current.classList.remove('is-invalid');

        if(appAddress.trim() === '') {
            setIsAppAddressValid(false);
            inputAppAddressReference.current.focus();
            toast.error('Please Enter location address');
            return;
        }

        setIsLoaderActive(true);
        try {
            const appData = {
                locationID: isEditMode ? editAppId : 0,
                locationName: appName,
                locationAddress: appAddress,
                createdBy: UserId,
                modifiedBy: isEditMode ? UserId : "",
            };

            const editAppData = {
                locationID: isEditMode ? editAppId : 0,
                newLocationName: appName,
                newLocationAddress: appAddress,
                createdBy: UserId,
                modifiedBy: isEditMode ? UserId : "",
            };


            const response = isEditMode
                ? await axios.put(`${config.API_URL}LocationMaster/UpdateLocationOfId`, editAppData)
                : await axios.post(`${config.API_URL}LocationMaster/CreateLocation`, appData);

            if(response.data.success) {
                toast.success(isEditMode ? 'Location updated successfully' : 'Location created successfully');
                handleCancel();
                setIsEditMode(false);
                setEditAppId('');
                GetLocations();
                // window.location.reload();
                setTimeout(() => {
                    window.initDestroyDataTableFuncation();
                }, 1000)

            } else {
                toast.error(response.data.message || 'Error processing request');
            }
        } catch(error) {
            toast.error(error.response?.data || 'An error occurred');
        } finally {
            setIsLoaderActive(false);
            GetLocations();
        }
    };

    const handleEdit = (app) => {
        setAppName(app.locationName);
        setAppAddress(app.locationAddress);
        setIsEditMode(true);
        setEditAppId(app.locationID);
        setIsAppNameValid(true);
        setIsAppAddressValid(true);
    };

    const handleDelete = (appId) => {
        setRoleToDelete(appId.locationID);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setRoleToDelete(null);
    };

    const deleteApp = async () => {
        setIsLoaderActive(true);
        try {
            const response = await axios.post(`${config.API_URL}LocationMaster/DeleteLocation/${roleToDelete}`);

            if(response.data.success) {
                toast.success('Location deleted successfully');
                // window.location.reload();
                setTimeout(() => {
                    window.initDestroyDataTableFuncation();
                }, 1000)
                GetLocations();
            } else {
                toast.error(response.data.message || 'Error deleting location');
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
        setAppAddress('');
        setIsAppNameValid(true);
        setIsAppAddressValid(true);
        setEditAppId(null);
        setIsEditMode(false);
    };


    // Table Search
    const searchedEmployees = locations.filter((row) =>
        Object.values(row).some(
            (val) =>
                val && val.toString().toLowerCase().includes(searchText.toLowerCase())
        )
    );

    // Pagination Calculation
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = searchedEmployees.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(searchedEmployees.length / rowsPerPage);

    // Calculate the range of displayed entries
    const startEntry = indexOfFirstRow + 1;
    const endEntry = Math.min(indexOfLastRow, searchedEmployees.length);

    // Page Change Handler
    const handlePageChange = (newPage) => {
        if(newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Export to CSV
    const exportToCSV = () => {
        let csvContent = "Location Name, Location Address\n";

        locations.forEach((row) => {
            csvContent += `${row.locationName}, ${row.locationAddress}\n`;
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "LocationData.csv");
    };

    // Export to Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            locations.map((row) => ({
                "Location Name": row.locationName,
                "Location Address": row.locationAddress,
            }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Locations");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const data = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        saveAs(data, "LocationData.xlsx");
    };

    // Export to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Locations List", 14, 10);

        autoTable(doc, {
            head: [["Location Name", "Location Address"]],
            body: locations.map((row) => [
                row.locationName,
                row.locationAddress,
            ]),
        });

        doc.save("LocationData.pdf");
    };

    // Print Table
    const printTable = () => {
        const printWindow = window.open("", "", "width=800,height=600");

        printWindow.document.write(
            "<html><head><title>Print Location Data</title></head><body>"
        );
        printWindow.document.write(
            "<table border='1' cellspacing='0' cellpadding='5'><tr>"
        );
        printWindow.document.write(
            "<th>Location Name</th><th>Location Address</th>"
        );
        printWindow.document.write("</tr>");

        locations.forEach((row) => {
            printWindow.document.write(
                `<tr><td>${row.locationName}</td><td>${row.locationAddress}</td></tr>`
            );
        });

        printWindow.document.write("</table></body></html>");
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
                                <h1 className="m-0">Manage Locations<span
                                    hover-tooltip='In this you can manage the locations used in the employee creation and onboarding by giving the location name. You create a new, edit and delete the locations.'
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
                                    <li className="breadcrumb-item active">Manage Locations</li>
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
                                        onClick={() => navigate('/masters')} /> Create New Location<span
                                            hover-tooltip='In this you can create a new and edit the locations by giving the location name'
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
                                                Location Name<sup style={{ color: 'red' }}>*</sup>
                                            </label>
                                            <input
                                                type='text'
                                                className={`form-control form-control-sm ${isAppNameValid ? '' : 'is-invalid'}`}
                                                value={appName}
                                                ref={inputAppNameReference}
                                                placeholder='Enter Location Name'
                                                onChange={handleAppNameChange}
                                            />
                                        </div>

                                        <div className="form-group col-md-3">
                                            <label style={{ color: "#000" }}>
                                                Location Address<sup style={{ color: 'red' }}>*</sup>
                                            </label>
                                            <textarea
                                                type='text'
                                                className={`form-control form-control-sm ${isAppAddressValid ? '' : 'is-invalid'}`}
                                                value={appAddress}
                                                ref={inputAppAddressReference}
                                                placeholder='Enter Location Address'
                                                onChange={handleAppAddressChange}
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
                                    <h3 className="card-title text-sm">Location List ( {locations.length} )<span
                                        hover-tooltip='In this you can see the list of locations in the table and edit, delete the locations by using the action buttons.'
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
                                    <div className="d-flex justify-content-between mb-2">
                                        <div>
                                            <button
                                                className="btn btn-default btn-sm mr-1 exportBtn"
                                                onClick={exportToCSV}
                                            >
                                                Export CSV
                                            </button>
                                            <button
                                                className="btn btn-default btn-sm mr-1 exportBtn"
                                                onClick={exportToExcel}
                                            >
                                                Export Excel
                                            </button>
                                            <button
                                                className="btn btn-default btn-sm mr-1 exportBtn"
                                                onClick={exportToPDF}
                                            >
                                                Export PDF
                                            </button>
                                            <button
                                                className="btn btn-default btn-sm mr-1 exportBtn"
                                                onClick={printTable}
                                            >
                                                Print
                                            </button>
                                        </div>

                                        <input
                                            type="text"
                                            className="form-control form-control-sm w-25"
                                            placeholder="Search..."
                                            onChange={(e) => setSearchText(e.target.value)}
                                        />
                                    </div>


                                    <table class="table table-bordered table-sm table-striped">
                                        <thead>
                                            <tr>
                                                <th className='text-center'>Sr. No.</th>
                                                <th>Location Name</th>
                                                <th>Location Address</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentRows.length > 0 ? (
                                                currentRows.map((roleObj, index) => (
                                                    <tr key={roleObj.id || index}>
                                                        <td className="text-center text-sm">{index + 1}</td>
                                                        <td>{roleObj.locationName}</td>
                                                        <td>{roleObj.locationAddress}</td>
                                                        <td className="text-center text-sm">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-warning btn-xs"
                                                                onClick={() => handleEdit(roleObj)}
                                                                style={{
                                                                    padding: '5px',
                                                                    fontSize: '.75rem',
                                                                    lineHeight: '0',
                                                                    borderRadius: '.15rem',
                                                                }}
                                                            >
                                                                <i className="fas fa-edit" style={{ fontSize: 'smaller' }}></i>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-danger btn-xs ml-2"
                                                                onClick={() => handleDelete(roleObj)}
                                                                style={{
                                                                    padding: '5px',
                                                                    fontSize: '.75rem',
                                                                    lineHeight: '0',
                                                                    borderRadius: '.15rem',
                                                                }}
                                                            >
                                                                <i className="fas fa-trash" style={{ fontSize: 'smaller' }}></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">
                                                        No location available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>

                                    </table>
                                    {/* Pagination */}
                                    <div className="d-flex justify-content-between mt-2">
                                        <div>
                                            Showing {startEntry} to {endEntry} of {searchedEmployees.length}{" "}
                                            entries
                                        </div>
                                        <div>
                                            <button
                                                className="btn btn-xs btn-outline-primary"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                <i className="fas fa-angle-double-left"></i>
                                            </button>
                                            <span className="m-1">
                                                Page {currentPage} of {totalPages}
                                            </span>
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
                                        Are you sure you want to delete this Location? Once deleted, it
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

export default Location;