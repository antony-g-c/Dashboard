// src/components/WarehouseManager.js
import { useState } from "react";
import VendorList from "./VendorList";
import AddVendor from "./AddVendor";

import ProductTypeList from "./ProductTypeList";
import AddProductType from "./AddProductType";

import ProductList from "./ProductList";
import AddProduct from "./AddProduct";

const WarehouseManager = () => {
  const [editingVendor, setEditingVendor] = useState(null);
  const [showVendorForm, setShowVendorForm] = useState(false);

  const [editingProductType, setEditingProductType] = useState(null);
  const [showProductTypeForm, setShowProductTypeForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);

  return (
    <div className="container mt-4">
      <h3>📦 Warehouse Management</h3>

      {/* VENDORS */}
      <div className="card p-3 mb-3">
        <h4>Vendors</h4>
        {!showVendorForm && (
          <button className="btn btn-success mb-2" onClick={() => {
            setEditingVendor(null);
            setShowVendorForm(true);
          }}>
            Add Vendor
          </button>
        )}
        {showVendorForm && (
          <AddVendor
            existingVendor={editingVendor}
            onSaved={() => {
              setEditingVendor(null);
              setShowVendorForm(false);
            }}
            onCancel={() => {
              setEditingVendor(null);
              setShowVendorForm(false);
            }}
          />
        )}
        <VendorList
          onEditVendor={(vendor) => {
            setEditingVendor(vendor);
            setShowVendorForm(true);
          }}
        />
      </div>

      {/* PRODUCT TYPES */}
      <div className="card p-3 mb-3">
        <h4>Product Types</h4>
        {!showProductTypeForm && (
          <button className="btn btn-success mb-2" onClick={() => {
            setEditingProductType(null);
            setShowProductTypeForm(true);
          }}>
            Add Product Type
          </button>
        )}
        {showProductTypeForm && (
          <AddProductType
            existingType={editingProductType}
            onSaved={() => {
              setEditingProductType(null);
              setShowProductTypeForm(false);
            }}
            onCancel={() => {
              setEditingProductType(null);
              setShowProductTypeForm(false);
            }}
          />
        )}
        <ProductTypeList
          onEditType={(type) => {
            setEditingProductType(type);
            setShowProductTypeForm(true);
          }}
        />
      </div>

      {/* PRODUCTS */}
      <div className="card p-3 mb-3">
        <h4>Products</h4>
        {!showProductForm && (
          <button className="btn btn-success mb-2" onClick={() => {
            setEditingProduct(null);
            setShowProductForm(true);
          }}>
            Add Product
          </button>
        )}
        {showProductForm && (
          <AddProduct
            existingProduct={editingProduct}
            onProductSaved={() => {
              setEditingProduct(null);
              setShowProductForm(false);
            }}
            onCancel={() => {
              setEditingProduct(null);
              setShowProductForm(false);
            }}
          />
        )}
        <ProductList
          onEditProduct={(product) => {
            setEditingProduct(product);
            setShowProductForm(true);
          }}
        />
      </div>
    </div>
  );
};

export default WarehouseManager;