from django.db import models
from datetime import datetime  

# After you add/remove a model
# 1) python manage.py makemigrations && python manage.py migrate

# Create your models here.

class expressionEvaluationCount(models.Model):
    target=models.IntegerField()
    expression=models.TextField()
    count=models.IntegerField(default=0)
    allocated=models.IntegerField(default=0)
    last_allocated=models.DateTimeField(default=datetime.now)

    def __str__(self):
        return("Target: %d, Expression: %s, allocated to %d" %(self.target, self.expression,self.allocated))


class expressionEvaluationResult(models.Model):
    target=models.IntegerField()
    expression=models.TextField()
    meaningSimilarity=models.IntegerField()
    grammar=models.IntegerField()
    appropriateness=models.IntegerField()
    workerID=models.TextField()
    done=models.DateTimeField(default=datetime.now)

    def __str__(self):
        return("Worker: %s worked on Target: %d and Expression: %s" %(self.workerID, self.target, self.expression))

class exprExprEvaluationCount(models.Model):
    target=models.IntegerField()
    expression=models.TextField()
    count=models.IntegerField()

class exprExprEvaluationResult(models.Model):
    target=models.IntegerField()
    expression=models.TextField()
    meaningSimilarity=models.IntegerField()
    grammar=models.IntegerField()
    appropriateness1=models.IntegerField()
    appropriateness2=models.IntegerField()

