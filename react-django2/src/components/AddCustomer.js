import { useState } from "react";
import { addCustomer } from "../services/ApiService";

const AddCustomer = ({ onCustomerSaved, onCancel }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await addCustomer({ name, email, address });
      onCustomerSaved(response.data);
      setName("");
      setEmail("");
      setAddress("");
    } catch (err) {
      const details = err.response?.data;
      if (details) {
        setError(JSON.stringify(details));
      } else {
        setError("Failed to add customer.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <h5>Add New Customer</h5>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="mb-3">
        <label htmlFor="customerName" className="form-label">Name</label>
        <input
          id="customerName"
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="customerEmail" className="form-label">Email</label>
        <input
          id="customerEmail"
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="customerAddress" className="form-label">Address</label>
        <textarea
          id="customerAddress"
          className="form-control"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary me-2">Add Customer</button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default AddCustomer;
