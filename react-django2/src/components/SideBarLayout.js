import { useState } from "react";
import OrderManager from "./OrderManager";
import WarehouseManager from "./WarehouseManager";
import DelinquentCustomers from "./DelinquentCustomer";
import ProcessingTime from "./ProcessingTime";
import SalesChart from "./SalesChart";
import { FaBoxes, FaWarehouse, FaChartBar } from "react-icons/fa";

const SidebarLayout = () => {
  const [activeSection, setActiveSection] = useState("orders");

  const renderContent = () => {
  switch (activeSection) {
    case "orders":
      return <OrderManager />;
    case "warehouse":
      return <WarehouseManager />;
    case "analytics":
      return (
        <>
          <DelinquentCustomers />

          <div className="row mt-4">
            <div className="col-md-6">
              <ProcessingTime />
            </div>
            <div className="col-md-6">
              <SalesChart />
            </div>
          </div>
        </>
      );
    default:
      return <p>Unknown section</p>;
  }
};

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3"
        style={{
          width: "220px",
          minHeight: "100vh",
          position: "sticky",
          top: 0,
          alignSelf: "flex-start"
        }}
      >
        <h4 className="mb-4">Dashboard</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <button
              className={`btn btn-sm w-100 ${
                activeSection === "orders"
                  ? "btn-light text-dark"
                  : "btn-outline-light"
              }`}
              onClick={() => setActiveSection("orders")}
            >
              <FaBoxes className="me-2" />
              Order Management
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn btn-sm w-100 ${
                activeSection === "warehouse"
                  ? "btn-light text-dark"
                  : "btn-outline-light"
              }`}
              onClick={() => setActiveSection("warehouse")}
            >
              <FaWarehouse className="me-2" />
              Warehouse
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`btn btn-sm w-100 ${
                activeSection === "analytics"
                  ? "btn-light text-dark"
                  : "btn-outline-light"
              }`}
              onClick={() => setActiveSection("analytics")}
            >
              <FaChartBar className="me-2" />
              Analytics
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="p-4 flex-grow-1" style={{ width: "100%" }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default SidebarLayout;
