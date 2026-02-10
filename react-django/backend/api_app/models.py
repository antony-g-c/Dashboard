from django.db import models

class Patient(models.Model):
    patient_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    blood = models.CharField(max_length=50)

    def __str__(self):
        return self.first_name + " " + self.last_name