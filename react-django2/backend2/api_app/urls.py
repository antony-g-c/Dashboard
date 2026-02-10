# api_app/urls.py

from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, OrderViewSet, OrderItemViewSet, delinquent_customers, sales_summary, processing_time_report, VendorViewSet, ProductViewSet,ProductTypeViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'vendors', VendorViewSet)
router.register(r'product-types', ProductTypeViewSet)
router.register(r'products', ProductViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/delinquent-customers/', delinquent_customers, name='delinquent-customers'),
    path('api/sales-summary/', sales_summary, name='sales-summary'),
    path('api/processing-time-report/', processing_time_report, name='processing_time_report'),
]