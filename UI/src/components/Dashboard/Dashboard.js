import React from 'react';
import "./Dashboard.css";

const Header = () => (
 <div className='row col-md-12'>
  <div className="content-header">
  <div className="container-fluid">
    <div className="row mb-0">
      <div className="col-sm-6">
        <h1 className="m-0">
          Dashboard
        
        </h1>
        <ol className="breadcrumb float-sm-left mt-0">
        
        </ol>
      </div>
      {/* <div className="col-sm-6"></div> */}
    </div>
  </div>
</div>
</div>
);

const OutstandingTile = () => (
 
  <div className="col-12 col-md-6 col-lg-3 mb-2 mt-2 ">
  
  <div className="tile updates-tile ">

      <span className="updates-label mt-4">Updates</span>
      <h6 className="tile-header">Stock List Outstanding Data</h6>
      <hr className='bar mx-3'/>
      <p className="tile-text px-3">
  Outstanding <br />
  Amount <br />
  <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>19,654.00 ₹</span>
</p>

    </div></div>
  

);

const CircleTile = ({ label, percentage, color, value }) => (
  <div className="col-6 col-md-3 col-lg-2 mb-2 mt-2">
    <div className="tile card card-outline card-light py-0">
      <div className="card-body text-center p-3">
        <div className="position-relative d-inline-block mb-4">
          <svg className="progress-circle" width="80" height="80" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeDasharray={`${percentage}, 100`}
            />
          </svg>

          {/* Centered percentage */}
          <div
            className="position-absolute top-50 start-50 translate-middle"
            style={{ fontWeight: "bold", fontSize: "0.9rem" }}
          >
            {percentage}%
          </div>
        </div>

        <p className="text-sm text-muted mb-1">{label}</p>
        <p className="font-weight-bold">{value}</p>
      </div>
    </div>
  </div>
);


const LatestOrders = () => {
  const orders = [
    { number: "1000000048", date: "12/03/2025", status: "Order Approved By Iteos" },
    { number: "1000000047", date: "12/03/2025", status: "Order Under Process" },
    { number: "1000000046", date: "12/03/2025", status: "Order Approved By Iteos" },
    { number: "1000000046", date: "12/03/2025", status: "Order Under Process" },
    { number: "1000000048", date: "12/03/2025", status: "Order Approved By Iteos" },
    { number: "1000000047", date: "12/03/2025", status: "Order Under Process" },
    { number: "1000000046", date: "12/03/2025", status: "Order Approved By Iteos" },
    { number: "1000000046", date: "12/03/2025", status: "Order Under Process" },
  ];

  return (
    <div className="col-12 col-lg-8 mb-4">
      <div className="card card-primary card-outline">
        <div className="card-header border-0">
          <h6 className="card-title">Latest Orders</h6>
        </div>
        <div className="card-body p-0 ">
          <div className="p-3">
            <input
              type="text"
              placeholder="Search"
              className="form-control form-control-sm"
            />
          </div>
          <div className="table-responsive "style={{ height: "290px", overflowY: "auto" }}>
            <table className="table ">
              <thead>
                <tr>
                  <th>Sales Order Number</th>
                  <th>Order Date</th>
                  <th>Order Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.number}</td>
                    <td>{order.date}</td>
                    <td>
                      <span
                        className={`badge ${
                          order.status === "Order Approved By Iteos"
                            ? "bg-success"
                            : "bg-warning"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-primary">Reorder</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderTrends = () => {
  const trends = [
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
    { name: "A.S.V.S. 10 ml Liquid", quantity: "25 Box", amount: "6,000 ₹" },
  ];

  return (
    <div className="col-12 col-lg-4">
      <div className="card card-primary card-outline  ">
        <div className="card-header border-0 d-flex justify-content-between align-items-center">
          <h6 className="card-title">Order Trends</h6>
          <select className="form-control form-control-sm w-auto">
            <option>7 Days</option>
          </select>
        </div>
        <div className="card-body" style={{ height: "339px", overflowY: "auto" }}>
          {trends.map((trend, index) => (
            <div key={index} className="Orders d-flex justify-content-between align-items-center mb-3">
              <div>
                <p className="mb-0 font-weight-bold">{trend.name}</p>
                <small className="text-muted">{trend.quantity}</small>
              </div>
              <div className="d-flex align-items-center">
                <p className="mb-0 font-weight-bold mr-2">{trend.amount}</p>
                <i className="fas fa-arrow-up text-success"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => (
  <section className="content">
    <div className="container-fluid">
      <div className="row">
        <Header />
        <OutstandingTile />
        <CircleTile label="Credit Limit" percentage={90} color="#28a745" value="15,51,089.00 ₹" />
        <CircleTile label="Exposure" percentage={75} color="#6f42c1" value="19,645.00 ₹" />
        <CircleTile label="Utilization" percentage={65} color="#fd7e14" value="1.30%" />
        <CircleTile label="Credit Exposure" percentage={90} color="#007bff" value="19,645.00 ₹" />
      </div>
      <div className="row">
        <LatestOrders className = "Orders" />
        <OrderTrends className = "Orders"/>
      </div>
    </div>
  </section>
);

export default Dashboard;