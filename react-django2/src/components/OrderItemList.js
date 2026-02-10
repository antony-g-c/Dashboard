import { useEffect, useState } from "react";
import axios from "axios";

const OrderItemList = ({ order, onEditItem, onShowAddItem, onRefresh }) => {
  const [items, setItems] = useState([]);

  const refreshItems = () => {
    if (order) {
      axios.get("http://127.0.0.1:8000/order-items/").then(res => {
        setItems(res.data.filter(i => i.order === order.id));
      });
    }
  };

  useEffect(() => {
    refreshItems();
    if (onRefresh) {
      onRefresh(refreshItems); // ✅ Pass it up!
    }
  }, [order]);

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/order-items/${id}/`);
      refreshItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <h5>Items in Order #{order?.id}</h5>
      <ul className="list-group">
        {items.map(item => (
          <li
            key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {item.product_name} × {item.quantity} @ ₹{item.price}
            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => {
                  onEditItem(item);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteItem(item.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="btn btn-success btn-sm mb-2"
        onClick={() => {
          onEditItem(null);
          onShowAddItem(true);
        }}
      >
        + Add Item
      </button>
    </div>
  );
};

export default OrderItemList;