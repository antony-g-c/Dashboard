import { useEffect, useState } from "react";
import axios from "axios";

const ProductTypeList = ({ onEditType }) => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/product-types/").then(res => setTypes(res.data));
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/product-types/${id}/`);
    setTypes(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div>
      <h5>Product Types</h5>
      <ul className="list-group mb-2">
        {types.map(t => (
          <li className="list-group-item d-flex justify-content-between">
            {t.name}
            <div>
              <button className="btn btn-sm btn-warning me-2" onClick={() => onEditType(t)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductTypeList;
