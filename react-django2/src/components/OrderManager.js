import { useState } from "react";
import CustomerList from "./CustomerList";
import AddCustomer from "./AddCustomer";
import OrderList from "./OrderList";
import AddOrder from "./AddOrder";
import OrderItemList from "./OrderItemList";
import AddOrderItem from "./AddOrderItem";

const OrderManager = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const [showAddOrder, setShowAddOrder] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  const [showAddItem, setShowAddItem] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [refreshCustomers, setRefreshCustomers] = useState(() => () => {});
  const [refreshOrders, setRefreshOrders] = useState(() => () => {});
  const [refreshItems, setRefreshItems] = useState(() => () => {});

  return (
    <div>
      <h3>Order Management</h3>
      <div className="row">
        <div className="col-md-6">
          <CustomerList
            onSelectCustomer={(c) => {
              setSelectedCustomer(c);
              setSelectedOrder(null);
            }}
            onShowAddCustomer={(show) => setShowAddCustomer(show)}
            onRefresh={(refreshFn) => setRefreshCustomers(() => refreshFn)}
          />

          {showAddCustomer && (
            <AddCustomer
              onCustomerSaved={(createdCustomer) => {
                if (refreshCustomers) refreshCustomers();
                setSelectedCustomer(createdCustomer);
                setSelectedOrder(null);
                setShowAddCustomer(false);
              }}
              onCancel={() => setShowAddCustomer(false)}
            />
          )}
        </div>

        <div className="col-md-6">
          {selectedCustomer && (
            <OrderList
              customer={selectedCustomer}
              onSelectOrder={setSelectedOrder}
              onEditOrder={(order) => {
                setEditOrder(order);
                setShowAddOrder(true);
              }}
              onShowAddOrder={(show) => {
                setEditOrder(null);
                setShowAddOrder(show);
              }}
              onOrderDeleted={(deletedId) => {
                if (selectedOrder && selectedOrder.id === deletedId) {
                  setSelectedOrder(null);
                }
              }}
              onRefresh={(refreshFn) => setRefreshOrders(() => refreshFn)}
            />
          )}
        </div>

        {selectedCustomer && showAddOrder && (
          <AddOrder
            customer={selectedCustomer}
            existingOrder={editOrder}
            onOrderSaved={() => {
              if (refreshOrders) refreshOrders();
              setEditOrder(null);
              setShowAddOrder(false);
            }}
            onCancel={() => {
              setEditOrder(null);
              setShowAddOrder(false);
            }}
          />
        )}
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          {selectedOrder && (
            <OrderItemList
              order={selectedOrder}
              onEditItem={(item) => {
                setEditItem(item);
                setShowAddItem(true);
              }}
              onShowAddItem={(show) => {
                setEditItem(null);
                setShowAddItem(show);
              }}
              onRefresh={(refreshFn) => setRefreshItems(() => refreshFn)}
            />
          )}
        </div>

        {selectedOrder && showAddItem && (
          <AddOrderItem
            order={selectedOrder}
            existingItem={editItem}
            onItemSaved={() => {
              if (refreshItems) refreshItems();
              setEditItem(null);
              setShowAddItem(false);
            }}
            onCancel={() => {
              setEditItem(null);
              setShowAddItem(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OrderManager;
