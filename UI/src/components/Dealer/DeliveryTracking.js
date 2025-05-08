import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "./Dealer.css"; // Assuming the same CSS file as PlaceOrder for consistent styling

const OrderHistory = () => {
    // Sample data based on the image
    const orders = [
        { sno: 1, salesOrderNo: "262427", deliveryNo: "80321204", invoiceNo: "9001020390", invoiceDate: "28.12.2024", lrNo: "6797", lrDate: "28.12.2024", transp: "DIVYA P" },
        { sno: 2, salesOrderNo: "262427", deliveryNo: "80321204", invoiceNo: "9001020390", invoiceDate: "28.12.2024", lrNo: "6797", lrDate: "28.12.2024", transp: "DIVYA P" },
        { sno: 3, salesOrderNo: "262427", deliveryNo: "80321204", invoiceNo: "9001020390", invoiceDate: "28.12.2024", lrNo: "6797", lrDate: "28.12.2024", transp: "DIVYA P" },
        { sno: 4, salesOrderNo: "262427", deliveryNo: "80321204", invoiceNo: "9001020390", invoiceDate: "28.12.2024", lrNo: "6797", lrDate: "28.12.2024", transp: "DIVYA P" },
        { sno: 5, salesOrderNo: "262427", deliveryNo: "80321204", invoiceNo: "9001020390", invoiceDate: "28.12.2024", lrNo: "6797", lrDate: "28.12.2024", transp: "DIVYA P" },
        { sno: 6, salesOrderNo: "262427", deliveryNo: "80321204", invoiceNo: "9001020390", invoiceDate: "28.12.2024", lrNo: "6797", lrDate: "28.12.2024", transp: "DIVYA P" },
        { sno: 7, salesOrderNo: "262427", deliveryNo: "80321204", invoiceNo: "9001020390", invoiceDate: "28.12.2024", lrNo: "6797", lrDate: "28.12.2024", transp: "DIVYA P" },
        { sno: 8, salesOrderNo: "262427", deliveryNo: "80321204", invoiceNo: "9001020390", invoiceDate: "28.12.2024", lrNo: "6797", lrDate: "28.12.2024", transp: "DIVYA P" },
        { sno: 9, salesOrderNo: "262427", deliveryNo: "80321204", invoiceNo: "9001020390", invoiceDate: "28.12.2024", lrNo: "6797", lrDate: "28.12.2024", transp: "DIVYA P" },
    ];

    return (
        <section className="content">
            <div className="container-fluid">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="m-0 p-2">Order History</h5>
                                <p className="text-muted">Total Entries ({orders.length})</p>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="form-group mb-0 mr-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by Transporter, Sales Order No, Delivery No"
                                    />
                                </div>
                                <div className="form-group mb-0 mr-2">
                                    <label className="mr-2">Filter:</label>
                                    <select className="form-control d-inline-block" style={{ width: "auto" }}>
                                        <option>ALL</option>
                                        <option>Filter 1</option>
                                        <option>Filter 2</option>
                                    </select>
                                </div>
                                <button className="btn btn-sm btn-outline-secondary">
                                    <IoIosCloseCircleOutline size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Details Section */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header border-0">
                                <h6 className="card-title">Order Details</h6>
                            </div>
                            <div className="card-body">
                                {/* Table */}
                                <div className="table-responsive">
                                    <table className="table table-hover table-striped">
                                        <thead>
                                            <tr>
                                                <th>Sno</th>
                                                <th>Sales Order No</th>
                                                <th>Delivery No</th>
                                                <th>Invoice No</th>
                                                <th>Invoice Date</th>
                                                <th>LR No</th>
                                                <th>LR Date</th>
                                                <th>Transp</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order.sno}>
                                                    <td>{order.sno}</td>
                                                    <td>{order.salesOrderNo}</td>
                                                    <td>{order.deliveryNo}</td>
                                                    <td>{order.invoiceNo}</td>
                                                    <td>{order.invoiceDate}</td>
                                                    <td>{order.lrNo}</td>
                                                    <td>{order.lrDate}</td>
                                                    <td>{order.transp}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderHistory;