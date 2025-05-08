import React from "react";
import * as XLSX from "xlsx";
import "./Dealer.css"; // Custom CSS for this component
import { IoIosCloseCircleOutline } from "react-icons/io";

const Rewards = () => {
    const orderItems = [
        {
            materialCode: "30041",
            description: "A.S.V.S. 10 ml Liquid",
            hsnCode: "30021240",
            qty: "1",
            uom: "NOS",
            mrp: "480.11",
            nir: "331.27",
            reqRate: "487.00",
            cgst: "6.00",
            sgst: "6.00",
            igst: "0.00",
            amount: "331.27",
        },
        {
            materialCode: "30041",
            description: "A.S.V.S. 10 ml Liquid",
            hsnCode: "30021240",
            qty: "1",
            uom: "NOS",
            mrp: "480.11",
            nir: "331.27",
            reqRate: "487.00",
            cgst: "6.00",
            sgst: "6.00",
            igst: "0.00",
            amount: "331.27",
        },
    ];

    return (
        <section className="content rewards-container">
            <div className="container-fluid">
                <div className="col-sm-6 mb-3">
                    <h5 className="m-0 pt-3">Rewards</h5>
                </div>

                {/* Order Details Section */}
                <div className="row rewards-row "style={{height: "400px"}}>
                    <div className="col-12">
                        <div className="card rewards-card h-100">
                            <div className="card-header border-0 d-flex justify-content-between align-items-center">
                                {/* Empty header as per the provided code */}
                            </div>
                            <div className="card-body rewards-body">
                                {/* Form Fields */}
                                <div className="row">
                                    {/* Empty row as per the provided code */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Rewards;