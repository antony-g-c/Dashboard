import { useEffect, useState } from "react";
import axios from "axios";

const AddProductType = ({ existingType, onSaved, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (existingType) {
      setName(existingType.name);
      setDescription(existingType.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [existingType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, description };
    if (existingType) {
      await axios.put(`http://localhost:8000/product-types/${existingType.id}/`, payload);
    } else {
      await axios.post("http://localhost:8000/product-types/", payload);
    }
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h6>{existingType ? "Edit Product Type" : "Add Product Type"}</h6>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="form-control mb-2" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="form-control mb-2" />
      <button type="submit" className="btn btn-primary me-2">Save</button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default AddProductType;
