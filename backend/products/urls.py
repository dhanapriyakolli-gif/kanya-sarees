from django.urls import path

from .views import (
    product_list,
    product_detail,
    place_order,
    my_orders
)

urlpatterns = [

    path(
        '',
        product_list,
        name='product-list'
    ),

    # Single product
    path(
        '<int:product_id>/',
        product_detail,
        name='product-detail'
    ),

    # Place order
    path(
        'place-order/',
        place_order,
        name='place-order'
    ),

    # My orders
    path(
        'my-orders/',
        my_orders,
        name='my-orders'
    ),

]