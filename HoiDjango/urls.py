from django.contrib import admin
from django.urls import path, include
from . import views
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('hoi/', include('api.urls')),
    path('', TemplateView.as_view(template_name='index.html'))
]
