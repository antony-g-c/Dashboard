# Create your models here.
from django.db import models

class Vendor(models.Model):
    name = models.CharField(max_length=100)
    address1 = models.CharField(max_length=200)
    address2 = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    country = models.CharField(max_length=100)
    contact_name = models.CharField(max_length=100)
    mobile1 =  models.CharField(max_length=20)
    mobile2 = models.CharField(max_length=20)
    email = models.EmailField

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    unit = models.IntegerField()
    price = models.FloatField()
    quantity = models.IntegerField()
    threshold = models.IntegerField()
    update_date = models.DateField()

    def __str__(self):
        return self.name

class Customer(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    address1 = models.CharField(max_length=100)
    address2 = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    Mobile = models.CharField(max_length=20)
    email = models.EmailField(max_length=100)

    def __str__(self):
        return self.first_name + self.last_name

class Status(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Sales_Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_date = models.DateField()
    order_status = models.ForeignKey(Status, on_delete=models.CASCADE)

class Order_Item(models.Model):
    order = models.ForeignKey(Sales_Order, on_delete=models.CASCADE)
    order_item = models.ForeignKey(Product, on_delete=models.CASCADE)
    order_item_qty = models.IntegerField()
    order_item_status = models.ForeignKey(Status, on_delete=models.CASCADE)

class Order_Item_Shipped(models.Model):
    order_item = models.ForeignKey(Order_Item, on_delete=models.CASCADE)
    shipped_date = models.DateField()
    shipped_qty = models.IntegerField()