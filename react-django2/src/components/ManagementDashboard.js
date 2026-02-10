import DelinquentCustomers from "./DelinquentCustomer";
import SalesChart from "./SalesChart";
import ProcessingTime from "./ProcessingTime";

const ManagementDashboard = () => {
  return (
    <div className="container mt-4">
      <h2>📊 Management Dashboard</h2>

      <hr />
      <SalesChart />

      <hr />
      <ProcessingTime />

      <hr />
      <DelinquentCustomers />
    </div>
  );
};

export default ManagementDashboard;