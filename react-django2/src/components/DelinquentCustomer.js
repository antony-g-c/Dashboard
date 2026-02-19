import { useEffect, useState } from "react";
import axios from "axios";

const DelinquentCustomers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/delinquent-customers/")
      .then(res => setCustomers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="mt-4">
      <h4>Delinquent Customers</h4>
      {customers.length === 0 ? (
        <p className="text-success">No delinquent customers! 🎉</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {/* Add any other fields you want */}
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DelinquentCustomers;
