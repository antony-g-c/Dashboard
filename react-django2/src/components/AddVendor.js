import { useEffect, useState } from "react";
import axios from "axios";

const AddVendor = ({ existingVendor, onSaved, onCancel }) => {
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  useEffect(() => {
    if (existingVendor) {
      setName(existingVendor.name);
      setContactInfo(existingVendor.contact_info);
    } else {
      setName("");
      setContactInfo("");
    }
  }, [existingVendor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, contact_info: contactInfo };
    if (existingVendor) {
      await axios.put(`http://localhost:8000/vendors/${existingVendor.id}/`, payload);
    } else {
      await axios.post("http://localhost:8000/vendors/", payload);
    }
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h6>{existingVendor ? "Edit Vendor" : "Add Vendor"}</h6>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="form-control mb-2" required />
      <textarea value={contactInfo} onChange={e => setContactInfo(e.target.value)} placeholder="Contact Info" className="form-control mb-2" />
      <button type="submit" className="btn btn-primary me-2">Save</button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default AddVendor;
