# api_app/models.py
from datetime import timezone

from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Sum



class Vendor(models.Model):
    name = models.CharField(max_length=255)
    contact_email = models.EmailField()
    phone_number = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.name


class ProductType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    product_type = models.ForeignKey(ProductType, on_delete=models.CASCADE)
    quantity_in_stock = models.PositiveIntegerField(default=0)
    reorder_level = models.PositiveIntegerField(default=10)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    address = models.TextField()

    def __str__(self):
        return self.name

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="orders")
    status = models.CharField(
        max_length=20,
        choices=[('Pending', 'Pending'), ('Backorder', 'Backorder'), ('Shipped', 'Shipped')],
        default='Pending'
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # ✅ so it's optional
    created_at = models.DateField(auto_now_add=False)
    shipped_at = models.DateField(null=True, blank=True)
    is_paid = models.BooleanField(default=False)

    def processing_time(self):
        if self.shipped_at:
            return (self.shipped_at - self.created_at).days
        return None

    def update_total_amount(self):
        total = self.items.aggregate(
            total=Sum(models.F('price') * models.F('quantity'))
        )['total'] or 0
        self.total_amount = total
        self.save()

    def save(self, *args, **kwargs):
        if self.status == 'Shipped' and self.shipped_at is None:
            self.shipped_at = timezone.now().date()  # auto-set if not already provided

        if self.shipped_at and self.created_at and self.shipped_at < self.created_at:
            raise ValueError("Shipped date cannot be before created date.")

        super().save(*args, **kwargs)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} (x{self.quantity})"


@receiver(post_save, sender=OrderItem)
def update_order_total_on_save(sender, instance, **kwargs):
    instance.order.update_total_amount()

@receiver(post_delete, sender=OrderItem)
def update_order_total_on_delete(sender, instance, **kwargs):
    instance.order.update_total_amount()
