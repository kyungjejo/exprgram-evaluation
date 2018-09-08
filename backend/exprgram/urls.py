from django.conf.urls import url

from . import views

urlpatterns = [
    url('Expression', views.Expression, name='Expression'),
    url('exprexpr', views.Expression2, name='Expression2'),
    url('expressionSave', views.ExpressionSave, name='ExpressionSave'),
    url('Exprexprsave', views.Exprexprsave, name='Exprexprsave'),
]
