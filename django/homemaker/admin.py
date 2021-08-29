from django.contrib import admin
from .models import Ingredient, Recipe, Meal, MealPlan
# Register your models here.


class RecipeAdmin(admin.ModelAdmin):
    readonly_fields = ('slug',)
    filter_horizontal = ('ingredients',)


admin.site.register(Ingredient)
admin.site.register(Recipe, RecipeAdmin)
# admin.site.register(Recipe)
admin.site.register(Meal)
admin.site.register(MealPlan)
