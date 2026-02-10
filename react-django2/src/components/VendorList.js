import { useEffect, useState } from "react";
import axios from "axios";

const VendorList = ({ onEditVendor }) => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/vendors/").then(res => setVendors(res.data));
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/vendors/${id}/`);
    setVendors(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div>
      <h5>Vendors</h5>
      <ul className="list-group mb-2">
        {vendors.map(v => (
          <li className="list-group-item d-flex justify-content-between">
            {v.name}
            <div>
              <button className="btn btn-sm btn-warning me-2" onClick={() => onEditVendor(v)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(v.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VendorList;
