from django.contrib import admin

from .models import *

# Register your models here.
# admin.site.register(userInfo)
# admin.site.register(Progress)
# admin.site.register(confidenceLabels)
# admin.site.register(similarExpression)
# admin.site.register(relationshipLables)
# admin.site.register(locationLables)
# admin.site.register(emotionLables)
# admin.site.register(intentionLables)

admin.site.register(expressionEvaluationCount)
admin.site.register(expressionEvaluationResult)