import os
import django
import random
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Category, Product, Order, OrderItem, Customer, Cart

def seed_db():
    print("Seeding database (No images)...")
    
    # Create Admin
    admin_user, _ = User.objects.get_or_create(username='admin')
    if _:
        admin_user.set_password('admin123')
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()
        Customer.objects.create(user=admin_user, name="System Admin", email="admin@example.com")
        Cart.objects.get_or_create(user=admin_user)
        print("Admin user created (admin/admin123)")

    # Categories
    categories = ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Beauty']
    for cat_name in categories:
        Category.objects.get_or_create(
            name=cat_name, 
            slug=cat_name.lower().replace(' ', '-').replace('&', 'and')
        )
    
    # Products
    products_data = [
        ('Smartphone X', 'Latest model with 8GB RAM', 799.99, 50.00, 'Electronics'),
        ('Laptop Pro', 'High performance laptop for creators', 1299.00, 100.00, 'Electronics'),
        ('Cotton T-Shirt', '100% organic cotton, various colors', 25.00, 0, 'Clothing'),
        ('Denim Jeans', 'Classic fit blue jeans', 59.99, 10.00, 'Clothing'),
        ('Coffee Maker', 'Programmable coffee maker with grinder', 89.00, 5.00, 'Home & Garden'),
        ('Garden Tools Set', 'Durable stainless steel tools', 45.00, 0, 'Home & Garden'),
        ('Mystery Novel', 'Bestselling crime thriller', 15.99, 0, 'Books'),
        ('Code Mastery', 'Learn programming from scratch', 45.00, 10.00, 'Books'),
        ('Organic Face Cream', 'Natural ingredients for glowing skin', 32.00, 2.00, 'Beauty'),
        ('Wireless Earbuds', 'Noise cancelling with long battery', 120.00, 15.00, 'Electronics'),
    ]
    
    for name, desc, price, discount, cat_name in products_data:
        cat = Category.objects.get(name=cat_name)
        Product.objects.get_or_create(
            name=name,
            description=desc,
            price=price,
            discount=discount,
            stock=random.randint(20, 100),
            category=cat
        )
    
    # Create some test customers
    customer_list = [
        ('john_user', 'John Doe', 'john@example.com'),
        ('jane_user', 'Jane Smith', 'jane@example.com'),
    ]
    for username, name, email in customer_list:
        user, created = User.objects.get_or_create(username=username, email=email)
        if created:
            user.set_password('pass123')
            user.save()
            Customer.objects.create(user=user, name=name, email=email, phone="1234567890")
            Cart.objects.get_or_create(user=user)

    # Orders
    customers = Customer.objects.all()
    products = Product.objects.all()
    statuses = ['Pending', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled']
    
    for _ in range(15):
        customer = random.choice(customers)
        status = random.choice(statuses)
        payment_status = 'Paid' if status == 'Delivered' else random.choice(['Paid', 'Unpaid'])
        
        order = Order.objects.create(
            customer=customer,
            shipping_address=f"{random.randint(1, 999)} Street, City",
            status=status,
            payment_status=payment_status,
            payment_method='COD',
        )
        
        total = 0
        for _ in range(random.randint(1, 3)):
            prod = random.choice(products)
            qty = random.randint(1, 2)
            price = prod.price - prod.discount
            OrderItem.objects.create(order=order, product=prod, quantity=qty, price=price)
            total += price * qty
        
        order.total_amount = total
        order.save()

    print("Seeding complete!")

if __name__ == '__main__':
    seed_db()
