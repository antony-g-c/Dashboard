import { useState, useEffect } from "react";
import axios from "axios";

const AddOrder = ({ customer, existingOrder, onOrderSaved, onCancel }) => {
  const [status, setStatus] = useState("Pending");
  const [shippedAt, setShippedAt] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0.0);

  useEffect(() => {
    if (existingOrder) {
      console.log("Edit mode ON:", existingOrder);
      setStatus(existingOrder.status);
      setShippedAt(existingOrder.shipped_at || "");
      setIsPaid(existingOrder.is_paid);
      setTotalAmount(existingOrder.total_amount || 0.0);
    } else {
      console.log("Add mode ON");
      setStatus("Pending");
      setShippedAt("");
      setIsPaid(false);
      setTotalAmount(0.0);
    }
  }, [existingOrder]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      customer: customer.id,
      status,
      shipped_at: shippedAt || null,
      is_paid: isPaid,
      total_amount: totalAmount || 0.0
    };

    try {
      if (existingOrder?.id) {
        await axios.put(`http://127.0.0.1:8000/orders/${existingOrder.id}/`, payload);
      } else {
        await axios.post("http://127.0.0.1:8000/orders/", payload);
      }

      onOrderSaved();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <h5>{existingOrder ? "Edit Order" : "Add New Order"} for {customer.name}</h5>

      <div className="mb-3">
        <label htmlFor="status" className="form-label">Status</label>
        <select
          className="form-control"
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Backorder">Backorder</option>
          <option value="Shipped">Shipped</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="shippedAt" className="form-label">Shipped Date</label>
        <input
          type="date"
          className="form-control"
          id="shippedAt"
          value={shippedAt}
          onChange={(e) => setShippedAt(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="totalAmount" className="form-label">Total Amount</label>
        <input
          type="number"
          className="form-control"
          id="totalAmount"
          value={totalAmount}
          onChange={(e) => setTotalAmount(parseFloat(e.target.value))}
          step="0.01"
          min="0"
        />
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="isPaid"
          checked={isPaid}
          onChange={(e) => setIsPaid(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="isPaid">
          Payment Received
        </label>
      </div>

      <button type="submit" className="btn btn-primary me-2">
        {existingOrder ? "Update Order" : "Add Order"}
      </button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default AddOrder;