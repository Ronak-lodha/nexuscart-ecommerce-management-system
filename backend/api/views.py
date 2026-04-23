from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.db.models import Sum, Count, F
from django.db.models.functions import TruncDate
from django.http import HttpResponse
from .models import *
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import *
# import csv

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filterset_fields = ['category']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['post'])
    def toggle_block(self, request, pk=None):
        customer = self.get_object()
        customer.is_blocked = not customer.is_blocked
        customer.save()
        return Response({'status': 'Customer status updated', 'is_blocked': customer.is_blocked})

    @action(detail=True, methods=['get'])
    def orders(self, request, pk=None):
        customer = self.get_object()
        orders = customer.orders.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        product = Product.objects.get(id=product_id)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            item.quantity += quantity
        else:
            item.quantity = quantity
        item.save()
        
        return Response({'status': 'Item added to cart'})

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        cart = Cart.objects.get(user=request.user)
        item_id = request.data.get('item_id')
        CartItem.objects.filter(cart=cart, id=item_id).delete()
        return Response({'status': 'Item removed'})

    @action(detail=False, methods=['post'])
    def clear(self, request):
        cart = Cart.objects.get(user=request.user)
        cart.items.all().delete()
        return Response({'status': 'Cart cleared'})

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(customer__user=self.request.user)

    def get_permissions(self):
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        user = request.user
        customer = user.customer_profile
        cart = user.cart
        
        if cart.items.count() == 0:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            customer=customer,
            shipping_address=request.data.get('shipping_address'),
            payment_method=request.data.get('payment_method', 'COD'),
            total_amount=cart.total_price
        )

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price - item.product.discount
            )
            item.product.stock -= item.quantity
            item.product.save()

        cart.items.all().delete()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def stats(self, request):
        total_orders = Order.objects.count()
        delivered = Order.objects.filter(status='Delivered').count()
        pending = Order.objects.filter(status='Pending').count()
        processing = Order.objects.filter(status='Processing').count()
        out_for_delivery = Order.objects.filter(status='Out for Delivery').count()
        cancelled = Order.objects.filter(status='Cancelled').count()
        returned = Order.objects.filter(status='Returned').count()
        
        total_revenue = Order.objects.aggregate(total=Sum('total_amount'))['total'] or 0
        total_customers = Customer.objects.count()
        total_products = Product.objects.count()

        sales_data = Order.objects.annotate(date=TruncDate('created_at')).values('date').annotate(
            total=Sum('total_amount'),
            count=Count('id')
        ).order_by('date')

        return Response({
            'total_orders': total_orders,
            'delivered_orders': delivered,
            'pending_orders': pending,
            'processing_orders': processing,
            'out_for_delivery_orders': out_for_delivery,
            'cancelled_orders': cancelled,
            'returned_orders': returned,
            'total_revenue': total_revenue,
            'total_customers': total_customers,
            'total_products': total_products,
            'sales_chart': list(sales_data)
        })

class ReturnRequestViewSet(viewsets.ModelViewSet):
    queryset = ReturnRequest.objects.all()
    serializer_class = ReturnRequestSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def create(self, request, *args, **kwargs):
        order_id = request.data.get('order')
        order = Order.objects.get(id=order_id, customer__user=request.user)
        
        if ReturnRequest.objects.filter(order=order, status='Pending').exists():
            return Response({'error': 'Return request already pending'}, status=status.HTTP_400_BAD_REQUEST)
            
        return super().create(request, *args, **kwargs)
