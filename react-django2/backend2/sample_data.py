# api_app/sample_data.py
import os
import django
import random
from datetime import timedelta
from django.utils import timezone

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend2.settings")
django.setup()

from api_app.models import Customer, Product, Vendor, ProductType, Order, OrderItem

# Clear all data
OrderItem.objects.all().delete()
Order.objects.all().delete()
Customer.objects.all().delete()
Product.objects.all().delete()
Vendor.objects.all().delete()
ProductType.objects.all().delete()

# Create Vendors
vendors = [
    Vendor.objects.create(name="Acme Corp", contact_email="acme@example.com", phone_number="1234567890"),
    Vendor.objects.create(name="Global Supplies", contact_email="global@example.com", phone_number="0987654321"),
]

# Create Product Types
types = [
    ProductType.objects.create(name="Electronics", description="Electronic gadgets and devices"),
    ProductType.objects.create(name="Office Supplies", description="Office materials and accessories"),
]

# Create Products
products = [
    Product.objects.create(
        name="Laptop", vendor=random.choice(vendors), product_type=types[0],
        quantity_in_stock=50, reorder_level=10, price=1200.00
    ),
    Product.objects.create(
        name="Printer", vendor=random.choice(vendors), product_type=types[0],
        quantity_in_stock=20, reorder_level=5, price=300.00
    ),
    Product.objects.create(
        name="Notebook", vendor=random.choice(vendors), product_type=types[1],
        quantity_in_stock=200, reorder_level=30, price=5.00
    ),
    Product.objects.create(
        name="Pen Set", vendor=random.choice(vendors), product_type=types[1],
        quantity_in_stock=100, reorder_level=20, price=12.00
    ),
]

# Create Customers
customers = [
    Customer.objects.create(name=f"Customer {i}", email=f"cust{i}@example.com", address=f"{i} Main St")
    for i in range(1, 6)
]

# Create Orders and Items
for i in range(1, 16):
    cust = random.choice(customers)
    status = random.choice(["Pending", "Backorder", "Shipped"])
    created_days_ago = random.randint(10, 30)
    created_at = timezone.now().date() - timedelta(days=created_days_ago)
    shipped_at = None
    if status == "Shipped":
        processing_days = random.randint(1, 7)
        shipped_at = created_at + timedelta(days=processing_days)
        if shipped_at > timezone.now().date():
            shipped_at = timezone.now().date()
    order = Order(
        customer=cust,
        status=status,
        created_at=created_at,
        shipped_at=shipped_at,
        is_paid=random.choice([True, False])
    )
    order.save()
    for _ in range(random.randint(1, 3)):
        prod = random.choice(products)
        qty = random.randint(1, 5)
        OrderItem.objects.create(order=order, product=prod, quantity=qty, price=prod.price)

print("✅ Sample data loaded: 15 orders, customers, products, and items.")