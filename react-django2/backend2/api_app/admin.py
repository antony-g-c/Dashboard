from django.contrib import admin

from api_app.models import Customer, Order, OrderItem, Vendor, Product, ProductType

# Register your models here.
admin.site.register(Customer)

admin.site.register(Order)

admin.site.register(OrderItem)

admin.site.register(Vendor)
admin.site.register(ProductType)
admin.site.register(Product)