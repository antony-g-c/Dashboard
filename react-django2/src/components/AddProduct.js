import { useEffect, useState } from "react";
import axios from "axios";

const AddProduct = ({ existingProduct, onProductSaved, onCancel }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0.0);
  const [vendor, setVendor] = useState("");
  const [productType, setProductType] = useState("");

  const [vendors, setVendors] = useState([]);
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/vendors/").then(res => setVendors(res.data));
    axios.get("http://127.0.0.1:8000/product-types/").then(res => setProductTypes(res.data));
  }, []);

  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setPrice(existingProduct.price);
      setVendor(existingProduct.vendor);
      setProductType(existingProduct.product_type);
    } else {
      setName("");
      setPrice(0.0);
      setVendor("");
      setProductType("");
    }
  }, [existingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, price, vendor, product_type: productType };
    try {
      if (existingProduct) {
        await axios.put(`http://127.0.0.1:8000/products/${existingProduct.id}/`, payload);
      } else {
        await axios.post("http://127.0.0.1:8000/products/", payload);
      }
      onProductSaved();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <h5>{existingProduct ? "Edit Product" : "Add Product"}</h5>

      <div className="mb-2">
        <label className="form-label">Name</label>
        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="mb-2">
        <label className="form-label">Price</label>
        <input type="number" step="0.01" className="form-control" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required />
      </div>

      <div className="mb-2">
        <label className="form-label">Vendor</label>
        <select className="form-select" value={vendor} onChange={(e) => setVendor(e.target.value)} required>
          <option value="">Select vendor</option>
          {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </div>

      <div className="mb-2">
        <label className="form-label">Product Type</label>
        <select className="form-select" value={productType} onChange={(e) => setProductType(e.target.value)} required>
          <option value="">Select type</option>
          {productTypes.map(pt => <option key={pt.id} value={pt.id}>{pt.name}</option>)}
        </select>
      </div>

      <button type="submit" className="btn btn-primary me-2">{existingProduct ? "Update" : "Add"}</button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default AddProduct;
