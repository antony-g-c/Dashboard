import { useCallback, useEffect, useState } from "react";
import { getCustomers } from "../services/ApiService";

const CustomerList = ({ onSelectCustomer, onShowAddCustomer, onRefresh }) => {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = useCallback(async () => {
    const response = await getCustomers();
    setCustomers(response.data);
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    if (onRefresh) {
      onRefresh(fetchCustomers);
    }
  }, [onRefresh, fetchCustomers]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="mb-0">Customers</h3>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={() => onShowAddCustomer?.(true)}
        >
          Add Customer
        </button>
      </div>

      <ul className="list-group">
        {customers.map(c => (
          <li
            key={c.id}
            className="list-group-item list-group-item-action"
            onClick={() => onSelectCustomer(c)}
          >
            {c.name} - {c.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList;
