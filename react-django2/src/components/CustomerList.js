import { useEffect, useState } from "react";
import { getCustomers } from "../services/ApiService";

const CustomerList = ({ onSelectCustomer }) => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers().then(res => setCustomers(res.data));
  }, []);

  return (
    <div>
      <h3>Customers</h3>
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