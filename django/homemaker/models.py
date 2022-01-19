from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.utils.text import slugify


class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=5, decimal_places=2)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    modified = models.DateTimeField(auto_now=True, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ingredients')

    UNIT_CHOICES = [
        ('mg', 'milligram'),
        ('g', 'gram'),
        ('kg', 'kilogram'),
        ('ml', 'millilitre'),
        ('l', 'litre'),
        ('tsp', 'teaspoon'),
        ('tblsp', 'tablespoon'),
        ('cp', 'cup'),
        ('pcs', 'piece'),
    ]
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES)

    def __str__(self):
        return f"{self.name}"
    
    class Meta:
        ordering = ['name']


class Recipe(models.Model):
    name = models.CharField(max_length=100)
    ingredients = models.ManyToManyField(Ingredient)
    description = models.CharField(max_length=300)
    instructions = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    modified = models.DateTimeField(auto_now=True, editable=False)
    slug = models.SlugField(max_length=200, null=True, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recipes')

    RATING_CHOICES = [
        (i, i) for i in range(1, 11)
    ]
    rating = models.IntegerField(
        blank=True, null=True, choices=RATING_CHOICES)

    def save(self, *args, **kwargs):

        self.slug = f'{slugify(self.name)}'

        return super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}"
    
    class Meta:
        ordering = ['name']


class Meal(models.Model):
    MEAL_CHOICES = [
        ('Breakfast', 'Breakfast'),
        ('Lunch', 'Lunch'),
        ('Dinner', 'Dinner'),
        ('Snack', 'Snack')
    ]
    meal_type = models.CharField(max_length=10, choices=MEAL_CHOICES)
    date = models.DateField()
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    modified = models.DateTimeField(auto_now=True, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, default=None, related_name='meals')

    def __str__(self):
        return f"{self.date}: {self.meal_type} - {self.recipe}"


class MealPlan(models.Model):
    date = models.DateField()
    created = models.DateTimeField(auto_now_add=True, editable=False)
    modified = models.DateTimeField(auto_now=True, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mealplans')

    meals = models.ManyToManyField(Meal)

    def __str__(self):
        return f"{self.date}"
    
    class Meta:
        ordering = ['date']


# Add Meal to MealPlan after a new Meal is saved
@receiver(post_save, sender=Meal)
def meal_handler(sender, instance, **kwargs):
    # print('post save callback', sender, instance)
    date = instance.date
    user = instance.user
    mealplan = MealPlan.objects.filter(date=date, user=user)
    if mealplan.count():
        mealplan[0].meals.add(instance)
    else:
        new_mealplan = MealPlan(date=instance.date, user=user)
        new_mealplan.save()
        new_mealplan.meals.add(instance)
