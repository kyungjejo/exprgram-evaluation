from django.conf.urls import url

from . import views

urlpatterns = [
    url('Expression', views.Expression, name='Expression'),
    url('expressionSave', views.ExpressionSave, name='ExpressionSave'),
]
