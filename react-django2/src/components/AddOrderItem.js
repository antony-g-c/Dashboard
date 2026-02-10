import { useState, useEffect } from "react";
import axios from "axios";

const AddOrderItem = ({ order, existingItem, onItemSaved, onCancel, refreshItems }) => {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0.0);

  useEffect(() => {
    if (existingItem) {
      setProductName(existingItem.product_name);
      setQuantity(existingItem.quantity);
      setPrice(existingItem.price);
    } else {
      setProductName("");
      setQuantity(1);
      setPrice(0.0);
    }
  }, [existingItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      order: order.id,
      product_name: productName,
      quantity: quantity,
      price: price,
    };

    try {
      if (existingItem) {
        await axios.put(
          `http://127.0.0.1:8000/order-items/${existingItem.id}/`,
          payload
        );
      } else {
        await axios.post("http://127.0.0.1:8000/order-items/", payload);
      }

      onItemSaved();

      // Clear fields
      setProductName("");
      setQuantity(1);
      setPrice(0.0);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <h5>{existingItem ? "Edit Item" : "Add New Item"} for Order #{order.id}</h5>

      <div className="mb-3">
        <label htmlFor="productName" className="form-label">Product Name</label>
        <input
          type="text"
          className="form-control"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="quantity" className="form-label">Quantity</label>
        <input
          type="number"
          className="form-control"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="price" className="form-label">Price</label>
        <input
          type="number"
          className="form-control"
          id="price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          step="0.01"
          min="0"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary me-2">
        {existingItem ? "Update Item" : "Add Item"}
      </button>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  );
};

export default AddOrderItem;