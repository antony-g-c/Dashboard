import { useEffect, useState } from "react";
import axios from "axios";

const ProductList = ({ onEditProduct }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await axios.get("http://127.0.0.1:8000/products/");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/products/${id}/`);
    fetchProducts();
  };

  return (
    <div>
      <h4>Products</h4>
      <ul className="list-group">
        {products.map(product => (
          <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
            {product.name} - ₹{product.price} ({product.vendor_name}, {product.product_type_name})
            <div>
              <button className="btn btn-sm btn-warning me-2" onClick={() => onEditProduct(product)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;