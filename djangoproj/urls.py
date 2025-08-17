"""
djangoproj URL Configuration

The `urlpatterns` list routes URLs to views. For more information see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
"""

from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path(
        "register/",
        TemplateView.as_view(template_name="index.html"),
    ),
    path("admin/", admin.site.urls),
    path("djangoapp/", include("djangoapp.urls")),
    path(
        "login/",
        TemplateView.as_view(template_name="index.html"),
    ),
    path(
        "",
        TemplateView.as_view(template_name="Home.html"),
    ),
    path(
        "about/",
        TemplateView.as_view(template_name="About.html"),
    ),
    path(
        "contact/",
        TemplateView.as_view(template_name="Contact.html"),
    ),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
