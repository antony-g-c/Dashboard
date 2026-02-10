import OrderManager from "./OrderManager";
import WarehouseManager from "./WarehouseManager";
import DelinquentCustomers from "./DelinquentCustomer";
import ProcessingTime from "./ProcessingTime";
import SalesChart from "./SalesChart";

const FullManager = () => {
  return (
    <div className="container mt-4">
      <h2>Full Management Dashboard</h2>

      {/* Section 1: Order Management */}
      <section className="mt-4">
        <OrderManager />
      </section>

      <hr className="my-4" />

      {/* Section 2: Warehouse Management */}
      <section className="mt-4">
        <WarehouseManager />
      </section>

      <hr className="my-4" />

      {/* Section 3: Analytics */}
      <section className="mt-4">
        <DelinquentCustomers />
        <ProcessingTime />
        <SalesChart />
      </section>
    </div>
  );
};

export default FullManager;