from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static


def home(request):
    return HttpResponse("""
        <h1>Welcome to Kanya House of Sarees </h1>
        <p>Django backend is running successfully .</p>
    """)


urlpatterns = [

    path('', home),

    path('admin/', admin.site.urls),

    path('api/products/', include('products.urls')),

    path('api/accounts/', include('accounts.urls')),

]


if settings.DEBUG:

    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )