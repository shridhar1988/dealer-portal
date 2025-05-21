import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import PleaseWaitButton from '../../shared/PleaseWaitButton';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import $, { get } from "jquery";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
 
 
const config = require('../../config/config.json');
 
const CompanyPlantMapping = () => {
  const UserId = localStorage.getItem('loggedUserId');
  const inputCompanyNameReference = useRef(null);
  const selectAppsReference = useRef(null);
 
  const personalInfo = useSelector((state) => state.personalInformationReducer);
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [appId, setAppId] = useState("");
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [allCompanyList, setAllCompanyList] = useState([]);
  const [allCompanyPlantList, setAllCompanyPlantList] = useState([]);
  const [allPlantList, setAllPlantList] = useState([]);
  const [updateOrDeleteId, setUpdateOrDeleteId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const rowsPerPage = 10;
 
  const filteredRoles = allCompanyPlantList.filter((role) => {
    const company = allCompanyList.find(c => c.id.toString() === role.companyId.toString());
    const companyName = company?.companyName || '';
    return companyName.toLowerCase().includes(searchText.toLowerCase());
  });
  //console.log("filteredRoles============>", filteredRoles);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRoles.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredRoles.length / rowsPerPage);
 
  const startEntry = indexOfFirstRow + 1;
  const endEntry = Math.min(indexOfLastRow, filteredRoles.length);
 
  const handlePageChange = (newPage) => {
    if(newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
 
  useEffect(() => {
    getAllCompanyList();
    getAllPlantList();
    getAllCompanyAndPlantList();
    setIsLoader(true);
    setTimeout(() => {
      setIsLoader(false);
    }, 1000);
 
    window.initMultiSelectFuncation();
  }, []);
 
  // const exportToCSV = () => {
  //   let csvContent = "Company Name,Plant Names\n";
  //     allCompanyPlantList.forEach((row) => {
  //     const company = allCompanyList.find(c => c.id == row.companyId);
      
  //     const plant = allPlantList.find(p => p.id == row.plantId);  
  //     const companyCode = company ? company.companyCode : row.companyId;
  //        const companyDescritpion = company ? company.companyDescription : row.companyId;
  //     const plantCode = plant ? plant.plantCode : row.plantId;  
  //      const plantDescription = plant ? plant.plantDescription : row.plantId;  
  //     csvContent += `"${companyCode}","${plantCode}"\n`;
  //   });
  
  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //   saveAs(blob, "CompanyPlantList.csv");
  // };
 
  // const exportToExcel = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(
  //     allCompanyPlantList.map((row) => {
  //       const company = allCompanyList.find(c => c.id === row.companyId);
  //       console.log('cm',allCompanyList)
  //       const plant = allPlantList.find(p => p.id === row.plantId); 
  //               console.log('pt',allPlantList) 
  //       return {
  //         "Company Name": company ? company.companyCode : row.companyId,
  //         // "Company Description": company ? company.companyDescription : row.companyId,
  //         "Plant Name": plant ? plant.plantCode : row.plantId,
  //         // "Plant Description": plant ? plant.plantDescription : row.plantId,
  //       };
  //     })
  //   );
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "CompanyPlant");
  //   const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  //   const data = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   saveAs(data, "CompanyPlantList.xlsx");
  // };
 const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(
    allCompanyPlantList.map((row) => {
      const company = allCompanyList.find(c => Number(c.id) === Number(row.companyId));
      const plant = allPlantList.find(p => Number(p.id) === Number(row.plantId)); 

      return {
        "Company Name": company ? company.companyCode : row.companyId,
        "Company Description": company ? company.companyDescription : row.companyId,
        "Plant Name": plant ? plant.plantCode : row.plantId,
        "Plant Description": plant ? plant.plantDescription : row.plantId
      };
    })
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "CompanyPlant");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(data, "CompanyPlantList.xlsx");
};
const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text("Company Plant List", 14, 10);

  autoTable(doc, {
    head: [["Company Name", "Company Description", "Plant Name", "Plant Description"]],
    body: allCompanyPlantList.map((row) => {
      const company = allCompanyList.find(c => c.id == row.companyId);
      const plant = allPlantList.find(p => p.id == row.plantId);
      return [
        company ? company.companyCode : row.companyId,
        company ? company.companyDescription : "",
        plant ? plant.plantCode : row.plantId,
        plant ? plant.plantDescription : ""
      ];
    }),
    startY: 20,
  });

  doc.save("CompanyPlantList.pdf");
};
const printTable = () => {
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.write("<html><head><title>Print Company Plant</title></head><body>");
  printWindow.document.write("<h3>Company Plant List</h3>");
  printWindow.document.write("<table border='1' cellspacing='0' cellpadding='5'>");
  printWindow.document.write("<thead><tr><th>Company Name</th><th>Company Description</th><th>Plant Name</th><th>Plant Description</th></tr></thead><tbody>");

  allCompanyPlantList.forEach((role) => {
    const company = allCompanyList.find(c => c.id == role.companyId);
    const plant = allPlantList.find(p => p.id == role.plantId);

    const companyName = company ? company.companyCode : role.companyId;
    const companyDesc = company ? company.companyDescription : "";
    const plantName = plant ? plant.plantCode : role.plantId;
    const plantDesc = plant ? plant.plantDescription : "";

    printWindow.document.write(`<tr>
      <td>${companyName}</td>
      <td>${companyDesc}</td>
      <td>${plantName}</td>
      <td>${plantDesc}</td>
    </tr>`);
  });

  printWindow.document.write("</tbody></table></body></html>");
  printWindow.document.close();
  printWindow.print();
};const exportToCSV = () => {
  let csvContent = "Company Code,Company Description,Plant Code,Plant Description\n";

  allCompanyPlantList.forEach((row) => {
    const company = allCompanyList.find(c => c.id == row.companyId);
    const plant = allPlantList.find(p => p.id == row.plantId);

    const companyCode = company ? company.companyCode : row.companyId;
    const companyDescription = company ? company.companyDescription : "";
    const plantCode = plant ? plant.plantCode : row.plantId;
    const plantDescription = plant ? plant.plantDescription : "";

    // Properly format and escape fields
    const line = `"${companyCode}","${companyDescription}","${plantCode}","${plantDescription}"\n`;
    csvContent += line;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "CompanyPlantList.csv");
};


  // const exportToPDF = () => {
  //   const doc = new jsPDF();
  //   doc.text("Company Plant List", 14, 10);
  //   autoTable(doc, {
  //     head: [["Company Name", "Plant Names"]],
  //     body:  allCompanyPlantList.map((row) => {
  //       const company = allCompanyList.find(c => c.id == row.companyId);
  //       const plant = allPlantList.find(p => p.id == row.plantId);  
  //       return [
  //         company ? company.companyCodee : row.companyId,
  //         plant ? plant.plantCodee : row.plantId
  //       ];
  //     }),
  //   });
  //   doc.save("CompanyPlantList.pdf");
  // };
 
  // const printTable = () => {
  //   const printWindow = window.open("", "", "width=800,height=600");
  //   printWindow.document.write("<html><head><title>Print Company Plant</title></head><body>");
  //   printWindow.document.write("<h3>Company Plant List</h3>");
  //   printWindow.document.write("<table border='1' cellspacing='0' cellpadding='5'><thead><tr><th>Company Name</th><th>Plant Names</th></tr></thead><tbody>");
  //   allCompanyPlantList.forEach((role) => {
  //     const apps = role.appIDList.map(id => {
  //       const app = allPlantList.find(app => app.appID === id);
  //       return app ? app.appName : '';
  //     }).join(" | ");
  //     printWindow.document.write(`<tr><td>${role.companyName}</td><td>${apps}</td></tr>`);
  //   });
  //   printWindow.document.write("</tbody></table></body></html>");
  //   printWindow.document.close();
  //   printWindow.print();
  // };
 
  const getAllPlantList = () => {
    setIsLoaderActive(true); 
    axios.get(config.API_URL + 'PlantMaster/GetAllPlants').then((response) => {
      if(response.status == 200) {
         console.log("response.data.data Get All Plants============>", response.data)
        if(response.data.success == "True") {
         
          if(response.data.data.length > 0) {
            setAllPlantList(response.data.data);
            getAllCompanyList();
          }
        } else {
          toast.error(response.data.message, config.tostar_config);
        }
      } else if(response.data.status.status == 500) {
        toast.error("Invalid username or password", config.tostar_config);
      }
    }).catch((error) => {
      toast.error("Please try again later.", config.tostar_config);
    }).finally(() => {
      setIsLoaderActive(false);
    })
  }
 
  const getAllCompanyList = () => {
    setIsLoaderActive(true);
    window.initDestroyDataTableFuncation();
    axios.get(config.API_URL + 'CompanyMaster/GetAllCompany').then((response) => {
      if(response.status == 200) {
        if(response.data.success == "True") {
          if(response.data.data.length > 0) {           
            setAllCompanyList(response.data.data);
            setTimeout(() => {
              window.initDataTableFuncation();
            }, 1000)
          }
        } else {
          toast.error(response.data.message, config.tostar_config);
          setTimeout(() => {
            window.initDataTableFuncation();
          }, 1000)
        }
      } else if(response.data.status.status == 500) {
        toast.error("Invalid username or password", config.tostar_config);
      }
    }).catch((error) => {
      toast.error("Please try again later.", config.tostar_config);
    }).finally(() => {
      setIsLoaderActive(false);
    })
  }

  const getAllCompanyAndPlantList = () => {    
    setIsLoaderActive(true);
    window.initDestroyDataTableFuncation();
    axios.get(config.API_URL + 'CompanyPlantMappingMaster/GetAllCompanyPlantMappings').then((response) => {
     console.log("response.data.data Get All Company Plant Mappings============>", response.data)
      if(response.status == 200) {
        if(response.data.success == "True") {
          if(response.data.data.length > 0) {       
            setAllCompanyPlantList(response.data.data);
            setTimeout(() => {
              window.initDataTableFuncation();
            }, 1000)
          }
        } else {
          toast.error(response.data.message, config.tostar_config);
          setTimeout(() => {
            window.initDataTableFuncation();
          }, 1000)
        }
      } else if(response.data.status.status == 500) {
        toast.error("Invalid username or password", config.tostar_config);
      }
    }).catch((error) => {
      toast.error("Please try again later.", config.tostar_config);
    }).finally(() => {
      setIsLoaderActive(false);
    })
  }
 
  const handleEditRoleDetails = (roleObj) => {
    debugger
    setUpdateOrDeleteId(roleObj.id);
    let getAppListArray = roleObj.appIDList
    //setCompanyName(roleObj.companyName);
    //setAppId(getAppListArray);    
    setCompanyName(roleObj.companyId);
    setAppId(roleObj.plantId);
    window.assignValueToSelect2(getAppListArray);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  const handleRemoveRole = (roleObj) => {
    setUpdateOrDeleteId(roleObj.id);
    window.confirmModalShow();
  }
 
  const yesConfirmSubmitRequest = () => {
    setIsLoaderActive(true);
    let APIMethodName = 'CompanyPlantMappingMaster/deleteCompanyPlantMapping?id=' + updateOrDeleteId+'&modifiedBy='+UserId
    axios.post(config.API_URL + APIMethodName, {
      headers: config.headers2,
    }).then((response) => {
      console.log(response);
      debugger
      if(response.data.success == "True") {
        toast.success("Company Plant mapping deleted successfully...", config.tostar_config);
        window.confirmModalHide();
        clearAllFields();
        getAllPlantList();
        getAllCompanyAndPlantList();
        getAllCompanyList();
        setIsLoaderActive(false);
      } else {
        setIsLoaderActive(false);
        toast.error(response.data.message, config.tostar_config);
      }
    }).catch((error) => {
      if(!error.response.data.success) {
        toast.error(error.response.data.message, config.tostar_config);
      } else {
        toast.error("oops something went wrong. please try again later.", config.tostar_config);
      }
      setIsLoaderActive(false);
    })
  }
 
  const handleCancelClick = () => {
    clearAllFields();
  }
 
  const clearAllFields = () => {
    setCompanyName("");    
    setAppId("");
    $(".select2").val("");
    window.assignValueToSelect2([]);
    setUpdateOrDeleteId('');
  }
 
  const handleCompanyPlantSubmit = (e) => {
    debugger
    //let getAllSelectedApps = $(".select2").val();
    let getAllSelectedApps = appId;
    if(companyName) {
      if(getAllSelectedApps) {
        setIsLoaderActive(true);
        let APIMethodName = ''
        if(updateOrDeleteId != "") {
          APIMethodName = 'CompanyPlantMappingMaster/updateCompanyPlantMapping?Id='+updateOrDeleteId
        } else {
          APIMethodName = 'CompanyPlantMappingMaster/addCompanyPlantMapping'
        }
 
        axios.post(`${config.API_URL}${APIMethodName}`, {
          "roleID": updateOrDeleteId,
          "PlantId": getAllSelectedApps,
          "CompanyId": companyName,
          "createdBy": personalInfo.userID,
          "clientId": config.ClientId,
          "modifiedBy": personalInfo.userID,
          "companyName": companyName,
          "appIDList": getAllSelectedApps,
          "isActive": true
        }, {
          headers: config.headers2,
        }).then((response) => {
          console.log("API Response",response);
          if(response.data.success == "True") {
            debugger
            if(APIMethodName == 'CompanyPlantMappingMaster/updateCompanyPlantMapping') {
              toast.success("Company & Plant Updated Successfully...", config.tostar_config);
            } else {
              toast.success("Company & Plant Created Successfully...", config.tostar_config);
            }
            clearAllFields();
            getAllCompanyList();
            getAllCompanyAndPlantList();
            setIsLoaderActive(false);
          } else {
            setIsLoaderActive(false);
            toast.error(response.data.message, config.tostar_config);
          }
        }).catch((error) => {
          if(!error.response.data.success) {
            toast.error(error.response.data.message, config.tostar_config);
          } else {
            toast.error("oops something went wrong. please try again later.", config.tostar_config);
          }
          setIsLoaderActive(false);
        })
 
      } else {
        toast.error("Select plant.", config.tostar_config);
        selectAppsReference.current.focus();
        selectAppsReference.current.classList.add('is-invalid');
      }
    } else {
      //toast.error("Please enter role name.");
      toast.error('Please enter company name.', config.tostar_config);
      inputCompanyNameReference.current.focus();
      inputCompanyNameReference.current.classList.add('is-invalid');
    }
 
  }
 
  // const cteateAttachmentHTML = (appArray) => {   
  //   if(appArray.length > 0) {
  //     return appArray.map((appID, index) => {
  //       let getEmaployeeName = allAppsList.find(x => x.appID == appID);
  //       console.log("getEmaployeeName============>", getEmaployeeName);        
  //       return (<small key={index}className="badge badge-primary p-1 mt-1 ml-1"> {getEmaployeeName?.appName||""}</small>)
  //     })
  //   } 
  // }
 
  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Manage Company and Plant Mapping<span
                hover-tooltip='In this you can manage the roles by giving the role name with the apps need to be accessed. You create a new, edit and delete the roles.'
                tooltip-position="bottom"
              >
                <i
                  className="fas fa-info-circle my-1 ml-2"
                  style={{ color: "rgb(0 0 0 / 51%)" }}
                ></i>
              </span></h1>
              {/* <ol className="breadcrumb float-sm-left mt-1">
                <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/masters">Masters</Link></li>
                <li className="breadcrumb-item active">Manage Company & Plant Mapping</li>
              </ol> */}
            </div>
            <div className="col-sm-6">
            </div>
          </div>
        </div>
      </div>
 
      <section className="content">
        <div className="container-fluid">
          <div className='row'>
            <div className="col-md-12">
              <div className="card  position-relative">
              {isLoader && (
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
                <div className="card-header">
                  <h3 className="card-title text-sm"><i className='fas fa-arrow-left mr-2' style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/masters')} /> Manage Company & Plant Mapping<span
                      hover-tooltip='In this you can create the Mapping by giving the Company name with Plants need to be accessed. You create a new and edit the Mapping with accessible Company and Plant.'
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
                <div className="card-body text-sm ">
                  
                  <div className='row'>
                    <div className="form-group col-md-4">
                      <label className='labelStyle' for="usercompanyNameInput" >Select Comany<sup style={{ color: "red" }}>*</sup></label>
                      <select
                        className="form-control form-control-sm"
                        id="usercompanyNameInput"
                        ref={inputCompanyNameReference}
                        value={companyName}
                     
                        onChange={(e) => setCompanyName(e.target.value)}
                      >
                        <option value="" disabled>Select Company</option>
                        {allCompanyList.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.companyCode } ({role.companyDescription})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-md-4">
                      <label className='labelStyle' >Select Plant <sup style={{ color: "red" }}>*</sup></label>
                      
                      <select
                          className="form-control form-control-sm"
                          id="usercompanyNameInput"
                          ref={selectAppsReference}
                          value={appId}
                          onChange={(e) => setAppId(e.target.value)}
                        >
                          <option value="" disabled>--Select--</option>
                          {allPlantList.map((app) => (
                            <option key={app.id} value={app.id}>
                              {app.plantCode} ({app.plantDescription})
                            </option>
                          ))}
                      </select>
                    </div>
 
                  </div>
                </div>
                <div className="card-footer text-sm">
                  {isLoaderActive ? <PleaseWaitButton className='float-right btn-xs ml-2 font-weight-medium auth-form-btn' /> :
                    <button type="submit" className="btn btn-primary float-right btn-xs ml-2" onClick={(e) => { handleCompanyPlantSubmit(e) }}>Save & Submit</button>
                  }
                  <button type="submit" className="btn btn-default float-right btn-xs" onClick={(e) => { handleCancelClick(e) }}>Clear
                  </button>
                </div>
              </div>
 
            </div>
          </div>
 
          <div className='row'>
            <div className="col-md-12">
              <div className="card ">
                <div className="card-header">
                  <h3 className="card-title text-sm">Company & Plant List ( {allCompanyPlantList.length} )<span
                    hover-tooltip='In this you can see the list of Company & Plant and mapp those in the table and edit, delete the mapping with selected mapping record by using the action buttons.'
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
                      <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={exportToCSV}>Export CSV</button>
                      <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={exportToExcel}>Export Excel</button>
                      <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={exportToPDF}>Export PDF</button>
                      <button className="btn btn-default btn-sm mr-1 exportBtn" onClick={printTable}>Print</button>
                    </div>
                    <input
                      type="text"
                      className="form-control form-control-sm w-25"
                      placeholder="Search by Company Name..."
                      onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
 <table className="table table-bordered table-sm table-striped">
  <thead>
    <tr>
      <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }} className="text-center">Sr. No.</th>
      <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Company</th>
      {/* <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Company Description</th> */}
      <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Plant</th>
       {/* <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Plant Description</th> */}
      <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }}>Action</th>
    </tr>
  </thead>
  <tbody>
    {allCompanyPlantList && allCompanyPlantList.length > 0 ? (
      allCompanyPlantList.map((roleObj, index) => (
        <tr key={`${roleObj.companyId}-${roleObj.plantId}`}>
          <td className="text-center text-sm">{index + 1}</td>
          {/* <td>
            {
              allCompanyList.find(c => c.id.toString() === roleObj.companyId.toString())?.companyCode({companyDescription}) ||
              roleObj.companyId
            }
          </td> */}
          <td >
  {
    allCompanyList.find(c => c.id.toString() === roleObj.companyId.toString())
      ? `${allCompanyList.find(c => c.id.toString() === roleObj.companyId.toString()).companyCode} (${allCompanyList.find(c => c.id.toString() === roleObj.companyId.toString()).companyDescription})`
      : roleObj.companyId
  }
</td>

            {/* <td>
            {
              allCompanyList.find(c => c.id.toString() === roleObj.companyId.toString())?.companyDescription ||
              roleObj.companyId
            }
          </td> */}
       <td >   {
    allPlantList.find(c => c.id.toString() === roleObj.plantId.toString())
      ? `${allPlantList.find(c => c.id.toString() === roleObj.plantId.toString()).plantCode} (${allPlantList.find(c => c.id.toString() === roleObj.plantId.toString()).plantDescription})`
      : roleObj.plantId
  }</td> 
          {/* <td>
            {
              allPlantList.find(c => c.id.toString() === roleObj.plantId.toString())?.plantDescription ||
              roleObj.plantId
            }
          </td> */}
          <td className="text-center text-sm">
            <button
              type="button"
              className="btn btn-outline-primary btn-xs"
              onClick={() => handleEditRoleDetails(roleObj)}
            >
              <i className="fas fa-pen"></i>
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-xs ml-2"
              onClick={() => handleRemoveRole(roleObj)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="4" className="text-center text-muted">No data found</td>
      </tr>
    )}
  </tbody>
</table>

                  {/* <table class="table table-bordered table-sm table-striped">
                    <thead>
                      <tr>
                        <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }} className='text-center'>Sr. No.</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Company</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Plant</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                       {allCompanyPlantList.length > 0 ? (
                        allCompanyPlantList.map((roleObj, index) => (                         
                          <tr>      
                            <td>{index+1}</td>                     
                          
                            <td>
                              {
                                allCompanyList.find(c => c.id.toString() === roleObj.companyId.toString())?.companyCode || roleObj.companyId
                              }
                            </td>
                            <td>
                              {
                                allPlantList.find(c => c.id.toString() === roleObj.plantId.toString())?.plantCode || roleObj.plantId
                              }
                            </td>
                            <td className="text-center text-sm">
                              <button type="button" className="btn btn-outline-primary btn-xs"onClick={() => handleEditRoleDetails(roleObj)}>
                                <i className="fas fa-pen"></i>
                              </button>
                              <button type="button" className="btn btn-outline-danger btn-xs ml-2"onClick={() => handleRemoveRole(roleObj)}>
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4" className="text-center">No Company & Plant found</td></tr>
                      )}
                    </tbody>
                  </table> */}
                  <div className="d-flex justify-content-between mt-2">
                    <div>
                      Showing {startEntry} to {endEntry} of {filteredRoles.length} entries
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
      </section>
 
      <div id="confirmCommonModal" class="modal fade confirmCommonModal" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-confirm">
          <div class="modal-content">
            <div class="modal-header">
              <div class="icon-box">
                <i class="fas fa-info"></i>
              </div>
              <h5 class="modal-title w-100 text-center">Are you sure ?</h5>
            </div>
            <div class="modal-body">
              <p class="text-center">By clicking on Yes delete all the Company & Plant mapping details. Once you deleted it can not be recovered.</p>
            </div>
            <div class="modal-footer col-md-12">
              <button class="btn btn-default btn-sm" data-dismiss="modal">Cancel</button>
              {isLoaderActive ? <PleaseWaitButton className='btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn' /> :
                <button class="btn btn-warning btn-sm pl-3 pr-3 ml-2" onClick={(e) => { yesConfirmSubmitRequest(e) }}>Yes</button>
              }
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
 
    </>
 
  );
}
 
export default CompanyPlantMapping;