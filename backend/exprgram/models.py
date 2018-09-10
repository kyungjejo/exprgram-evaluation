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
        return("Worker: %s Target: %d Expression: %s Similarity: %d grammar: %d appropriateness: %d done: %s" %(self.workerID, self.target, self.expression, self.meaningSimilarity, self.grammar, self.appropriateness, str(self.done)))

class exprExprEvaluationCount(models.Model):
    target=models.IntegerField()
    expression=models.TextField()
    count=models.IntegerField(default=0)
    allocated=models.IntegerField(default=0)
    last_allocated=models.DateTimeField(default=datetime.now)
    
    def __str__(self):
        return("Target: %d, Expression: %s, allocated to %d, done: %d, last allocated: %s" %(self.target, self.expression,self.allocated, self.count, str(self.last_allocated)))
        

class exprExprEvaluationResult(models.Model):
    target=models.IntegerField()
    expression=models.TextField()
    meaningSimilarity=models.IntegerField()
    appropriateness1=models.IntegerField()
    appropriateness2=models.IntegerField()
    workerID=models.TextField()
    done=models.DateTimeField(default=datetime.now)

    def __str__(self):
        return("Worker: %s Target: %d Expression: %s Similarity: %d appropriateness1: %d appropriateness2: %d done: %s" %(self.workerID, self.target, self.expression, self.meaningSimilarity, self.appropriateness1, self.appropriateness2, str(self.done)))

class contextEvaluationCount(models.Model):
    target=models.IntegerField()
    _type=models.TextField()
    label=models.TextField()
    count=models.IntegerField(default=0)
    allocated=models.IntegerField(default=0)
    last_allocated=models.DateTimeField(default=datetime.now)

    def __str__(self):
        return("Target: %d, Label: %s, allocated to %d" %(self.target, self.label,self._type,self.allocated))


class contextEvaluationResult(models.Model):
    target=models.IntegerField()
    _type=models.TextField()
    label=models.TextField()
    appropriateness=models.IntegerField()
    workerID=models.TextField()
    done=models.DateTimeField(default=datetime.now)

    def __str__(self):
        return("Worker: %s Target: %d Label: %s type: %s appropriateness: %d done: %s" %(self.workerID, self.target, self.label, self._type, self.appropriateness, str(self.done)))

