import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const OrderList = ({ customer, onSelectOrder, onEditOrder, onShowAddOrder, onRefresh, onOrderDeleted }) => {
  const [orders, setOrders] = useState([]);

  const refreshOrders = useCallback(() => {
    if (customer) {
      axios.get("http://127.0.0.1:8000/orders/").then(res => {
        setOrders(res.data.filter(o => o.customer === customer.id));
      });
    }
  }, [customer]);

  useEffect(() => {
    refreshOrders();
    if (onRefresh) onRefresh(refreshOrders);
  }, [refreshOrders, onRefresh]);

  const handleDeleteOrder = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/orders/${id}/`);
    setOrders(prev => prev.filter(o => o.id !== id));
    if (onOrderDeleted) onOrderDeleted(id);
  };

  return (
    <div>
      <h4>Orders for {customer?.name}</h4>
      <ul className="list-group">
        {orders.map(order => (
          <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span onClick={() => onSelectOrder(order)}>
              Order #{order.id} - {order.status}
            </span>
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => {
                  onEditOrder(order);   // ✅ pass order to edit
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteOrder(order.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        className="btn btn-success btn-sm mt-2"
        onClick={() => {
          onEditOrder(null);    // ✅ clear edit
          onShowAddOrder(true); // ✅ show add form
        }}
      >
        + Add Order
      </button>
    </div>
  );
};

export default OrderList;