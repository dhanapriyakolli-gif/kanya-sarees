from django.urls import path

from .views import (
    signup,
    login,
    update_profile,
    get_profile,
    forgot_password,
    reset_password
)

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('update-profile/', update_profile, name='update-profile'),
    path('profile/', get_profile, name='get-profile'),

    path(
        'forgot-password/',
        forgot_password,
        name='forgot-password'
    ),

    path(
        'reset-password/',
        reset_password,
        name='reset-password'
    ),
]