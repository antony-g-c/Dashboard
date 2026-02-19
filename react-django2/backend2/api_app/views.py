# api_app/views.py

from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Customer, Order, OrderItem, Vendor, Product, ProductType
from .serializers import CustomerSerializer, OrderSerializer, OrderItemSerializer, VendorSerializer, ProductSerializer, ProductTypeSerializer
from django.db.models import Sum
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth
from django.http import JsonResponse

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

class ProductTypeViewSet(viewsets.ModelViewSet):
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer



@api_view(['GET'])
def processing_time_report(request):
    shipped_orders = Order.objects.filter(status='Shipped', shipped_at__isnull=False)

    data = []
    for order in shipped_orders:
        processing_time = order.processing_time()
        if processing_time is not None:
            data.append({
                "order_id": order.id,
                "created_at": order.created_at.isoformat(),
                "shipped_at": order.shipped_at.isoformat(),
                "processing_time": processing_time
            })

    avg_time = (
        sum(d["processing_time"] for d in data) / len(data)
        if data else 0
    )

    return JsonResponse({
        "total_shipped_orders": len(data),
        "average_processing_time_days": avg_time,
        "individual_orders": data
    })

@api_view(['GET'])
def sales_summary(request):
    period = request.GET.get('period', 'day')
    start = request.GET.get('start')
    end = request.GET.get('end')

    # Select truncation type
    if period == 'day':
        trunc = TruncDay('created_at')
    elif period == 'week':
        trunc = TruncDay('created_at')
    elif period == 'month':
        trunc = TruncDay('created_at')
    elif period == 'custom':
        trunc = TruncDay('created_at')
    else:
        return Response({"error": "Invalid period"}, status=400)

    # Sales is represented as order value grouped by created date.
    # Cash received should be tracked separately from sales.
    qs = Order.objects.exclude(total_amount__isnull=True)

    if start and end:
        qs = qs.filter(created_at__range=[start, end])

    # Grouped data for the chart
    data = list(
        qs.annotate(period=trunc)
        .values('period')
        .annotate(total=Sum('total_amount'))
        .order_by('period')
    )

    # Extra: list of individual shipped orders and their processing time
    shipped_orders = Order.objects.filter(status="Shipped", shipped_at__isnull=False)

    individual_times = []
    for order in shipped_orders:
        days = order.processing_time()
        individual_times.append({
            "order_id": order.id,
            "created_at": order.created_at,
            "shipped_at": order.shipped_at,
            "processing_time": days
        })

    return Response({
        "summary": data,
        "individual_times": individual_times
    })

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def update(self, request, *args, **kwargs):
        print("=== Incoming UPDATE ===")
        print("Payload:", request.data)
        response = super().update(request, *args, **kwargs)
        print("=== Updated object ===")
        print(response.data)
        return response

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

@api_view(['GET'])
def delinquent_customers(request):
    customers = Customer.objects.filter(
        orders__status='Shipped',
        orders__is_paid=False
    ).distinct()
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data)
