from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import os
import requests

from django.utils.http import (
    urlsafe_base64_encode,
    urlsafe_base64_decode
)
from django.utils.encoding import force_bytes

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import Profile


@api_view(['POST'])
def signup(request):

    name = request.data.get('name')
    email = request.data.get('email')
    phone = request.data.get('phone')
    password = request.data.get('password')
  
    # Check required fields
    if not name or not email or not phone or not password:
        return Response(
            {'error': 'Name, email, phone and password are required'},
            status=400
        )

    # Check phone
    if not phone.isdigit() or len(phone) != 10:
        return Response(
            {'error': 'Phone number must be exactly 10 digits'},
            status=400
        )

    # Check existing username
    if User.objects.filter(username=email).exists():
        return Response(
            {'error': 'Email already registered'},
            status=400
        )
            # Validate password
    try:
        validate_password(password)
    except ValidationError as e:
        return Response(
            {'error': e.messages},
            status=400
        )

    # Create Django User
    user = User.objects.create_user(
        username=email,
        email=email,
        password=password
    )

    # Create Profile
    Profile.objects.create(
        user=user,
        name=name,
        phone=phone
    )

    return Response(
        {
            'message': 'Account created successfully',
            'user_id': user.id
        },
        status=201
    )


@api_view(['POST'])
def login(request):

    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=400
        )

    user = authenticate(
        username=username,
        password=password
    )

    if user is None:
        return Response(
            {'error': 'Invalid username or password'},
            status=401
        )

    # Get existing token or create a new one
    token, created = Token.objects.get_or_create(
        user=user
    )

    return Response(
        {
            'message': 'Login successful',
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'token': token.key
        },
        status=200
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):

    user = request.user

    name = request.data.get('name')
    phone = request.data.get('phone')
    address = request.data.get('address')
    city = request.data.get('city')
    pincode = request.data.get('pincode')

    if not name or not phone:
        return Response(
            {'error': 'Name and phone are required'},
            status=400
        )

    if not phone.isdigit() or len(phone) != 10:
        return Response(
            {'error': 'Phone number must be exactly 10 digits'},
            status=400
        )

    # Get existing profile or create one if missing
    profile, created = Profile.objects.get_or_create(
        user=user,
        defaults={
            'name': user.username,
            'phone': '',
        }
    )

    profile.name = name
    profile.phone = phone
    profile.address = address or ''
    profile.city = city or ''
    profile.pincode = pincode or ''

    profile.save()

    return Response(
        {
            'message': 'Profile updated successfully'
        },
        status=200
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):

    user = request.user

    # Get existing profile or create one if missing
    profile, created = Profile.objects.get_or_create(
        user=user,
        defaults={
            'name': user.username,
            'phone': '',
        }
    )

    return Response(
        {
            'name': profile.name,
            'email': user.email,
            'phone': profile.phone,
            'address': profile.address,
            'city': profile.city,
            'pincode': profile.pincode
        },
        status=200
    )
@api_view(['POST'])
def forgot_password(request):

    email = request.data.get('email')

    if not email:
        return Response(
            {'error': 'Email is required'},
            status=400
        )

    user = User.objects.filter(
        email=email
    ).first()

    # Don't reveal whether the email exists
    if user:

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = default_token_generator.make_token(user)

        reset_link = (
            f"https://kanya-sarees-frontend.onrender.com/reset-password.html"
            f"?uid={uid}&token={token}"
        )

        brevo_api_key = os.getenv('BREVO_API_KEY')

        email_data = {
            "sender": {
                "name": "Kanya House of Sarees",
                "email": "support.kanyahousesarees@gmail.com"
            },
            "to": [
                {
                    "email": user.email
                }
            ],
            "subject": "Kanya House of Sarees - Password Reset",
            "htmlContent": (
                "<p>Hello,</p>"
                "<p>You requested to reset your password.</p>"
                f"<p><a href='{reset_link}'>"
                "Click here to reset your password"
                "</a></p>"
                "<p>If you did not request this, you can ignore this email.</p>"
                "<p>Regards,<br>Kanya House of Sarees</p>"
            ),
            "textContent": (
                "Hello,\n\n"
                "You requested to reset your password.\n\n"
                f"Reset your password using this link:\n{reset_link}\n\n"
                "If you did not request this, you can ignore this email.\n\n"
                "Regards,\n"
                "Kanya House of Sarees"
            )
        }

        response = requests.post(
            "https://api.brevo.com/v3/smtp/email",
            headers={
                "accept": "application/json",
                "api-key": brevo_api_key,
                "content-type": "application/json"
            },
            json=email_data,
            timeout=10
        )

        if not response.ok:
            print(
                "Brevo email error:",
                response.status_code,
                response.text
            )

    return Response(
        {
            'message': (
                'If an account with that email exists, '
                'a password reset link has been sent.'
            )
        },
        status=200
    )

@api_view(['POST'])
def reset_password(request):

    uid = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')

    if not uid or not token or not new_password:
        return Response(
            {
                'error': (
                    'UID, token and new password are required'
                )
            },
            status=400
        )

    try:

        user_id = urlsafe_base64_decode(
            uid
        ).decode()

        user = User.objects.get(
            pk=user_id
        )

    except (
        TypeError,
        ValueError,
        OverflowError,
        User.DoesNotExist
    ):

        return Response(
            {
                'error': 'Invalid reset link'
            },
            status=400
        )

    # Check whether the reset token is valid
    if not default_token_generator.check_token(
        user,
        token
    ):
        return Response(
            {
                'error': 'Invalid or expired reset link'
            },
            status=400
        )

    # Validate the new password using Django's validators
    try:
        validate_password(
            new_password,
            user
        )
    except ValidationError as error:
        return Response(
            {
                'error': error.messages
            },
            status=400
        )

    # Securely hash and save the new password
    user.set_password(new_password)
    user.save()

    return Response(
        {
            'message': 'Password reset successfully'
        },
        status=200
    )