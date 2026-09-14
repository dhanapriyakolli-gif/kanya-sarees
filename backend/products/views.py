from django.db import transaction

from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Product, Order, OrderItem

# ==========================================
# PRODUCT LIST
# ==========================================

@api_view(['GET'])
def product_list(request):

    category = request.GET.get('category')

    if category:

        # Category page → show all products
        # from that category
        products = Product.objects.filter(
            category__iexact=category
        )

    else:

        # Products page → show 2 products
        # from each category
        categories = [
            'Cotton',
            'Silk',
            'Chiffon',
            'Georgette',
            'Pattu',
            'Designer'
        ]

        products = []

        for category_name in categories:

            category_products = Product.objects.filter(
                category__iexact=category_name
            )[:2]

            products.extend(category_products)

    data = []

    for product in products:

        data.append({
            'id': product.id,
            'name': product.name,
            'price': product.price,
            'category': product.category,
            'image': request.build_absolute_uri(
                product.image.url
            ),
            'description': product.description,
            'stock': product.stock,
        })

    return Response(data)

# ==========================================
# SINGLE PRODUCT
# ==========================================

@api_view(['GET'])
def product_detail(request, product_id):

    try:

        product = Product.objects.get(
            id=product_id
        )

    except Product.DoesNotExist:

        return Response(
            {
                'error':
                'Product not found'
            },
            status=404
        )

    data = {

        'id':
        product.id,

        'name':
        product.name,

        'price':
        product.price,

        'category':
        product.category,

        'image':
        request.build_absolute_uri(
            product.image.url
        ),

        'description':
        product.description,

        'stock':
        product.stock,
    }

    return Response(data)


# ==========================================
# PLACE ORDER
# ==========================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):

    customer = request.user

    
    address = request.data.get('address')
    payment_method = request.data.get('payment_method')
    items = request.data.get('items')

    # Check required order information
    if not address or not payment_method or not items:

        return Response(
            {
                'error':
                'Missing order information'
            },
            status=400
        )

    # Check items format
    if not isinstance(items, list) or len(items) == 0:

        return Response(
            {
                'error':
                'Order items are required'
            },
            status=400
        )

    # ==========================================
    # COMBINE DUPLICATE PRODUCT IDs
    # ==========================================

    requested_quantities = {}

    for item in items:

        product_id = item.get('product_id')
        quantity = item.get('quantity')

        # Check item data
        if product_id is None or quantity is None:

            return Response(
                {
                    'error':
                    'Invalid order item'
                },
                status=400
            )

        # Convert values to integers
        try:

            product_id = int(product_id)
            quantity = int(quantity)

        except (TypeError, ValueError):

            return Response(
                {
                    'error':
                    'Invalid product ID or quantity'
                },
                status=400
            )

        # Quantity must be positive
        if quantity <= 0:

            return Response(
                {
                    'error':
                    'Quantity must be at least 1'
                },
                status=400
            )

        # Combine duplicate product IDs
        requested_quantities[product_id] = (
            requested_quantities.get(product_id, 0)
            + quantity
        )

    # ==========================================
    # STOCK CHECK + ORDER CREATION
    # ==========================================

    try:

        with transaction.atomic():

            products = {}

            # ==========================================
            # CHECK STOCK
            # ==========================================

            for product_id, quantity in requested_quantities.items():

                product = Product.objects.select_for_update().get(
                    id=product_id
                )

                # Not enough stock
                if product.stock < quantity:

                    return Response(
                        {
                            'error':
                            f'Only {product.stock} item(s) of '
                            f'"{product.name}" are available.'
                        },
                        status=400
                    )

                products[product_id] = product

            # ==========================================
            # CALCULATE TOTAL
            # ==========================================

            total_amount = 0

            for product_id, quantity in requested_quantities.items():

                product = products[product_id]

                total_amount += (
                    product.price * quantity
                )

            # ==========================================
            # CREATE ORDER
            # ==========================================

            order = Order.objects.create(
                customer=customer,
                address=address,
                payment_method=payment_method,
                total_amount=total_amount
            )

            # ==========================================
            # CREATE ORDER ITEMS
            # AND REDUCE STOCK
            # ==========================================

            for product_id, quantity in requested_quantities.items():

                product = products[product_id]

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price=product.price
                )

                # Reduce stock
                product.stock -= quantity

                product.save(
                    update_fields=['stock']
                )

        # ==========================================
        # SUCCESS RESPONSE
        # ==========================================

        return Response(
            {
                'message':
                'Order placed successfully',

                'order_id':
                order.id,

                'total_amount':
                total_amount
            },
            status=201
        )

    # ==========================================
    # PRODUCT NOT FOUND
    # ==========================================

    except Product.DoesNotExist:

        return Response(
            {
                'error':
                'One or more products were not found'
            },
            status=400
        )


# ==========================================
# MY ORDERS
# ==========================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):

    customer = request.user

    # Get customer's orders
    orders = Order.objects.filter(
        customer=customer
    ).order_by('-created_at')

    data = []

    for order in orders:

        items = []

        # Get order items
        for item in order.items.all():

            items.append({
                'product_id':
                item.product.id,

                'name':
                item.product.name,

                'image':
                request.build_absolute_uri(
                    item.product.image.url
                ),

                'quantity':
                item.quantity,

                'price':
                str(item.price),

                'subtotal':
                str(
                    item.price * item.quantity
                ),
            })

        # Add order information
        data.append({

            'id':
            order.id,

            'address':
            order.address,

            'payment_method':
            order.payment_method,

            'total_amount':
            str(order.total_amount),

            'status':
            order.status,

            'created_at':
            order.created_at,

            'items':
            items,
        })

    return Response(data)