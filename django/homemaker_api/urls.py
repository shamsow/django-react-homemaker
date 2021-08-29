from django.urls import path
from django.urls import register_converter
from datetime import datetime
from .views import (PantryList, CookbookList, IngredientDetail,
                    IngredientCreate, IngredientDelete, RecipeDetail,
                    RecipeDetailSLUG, RecipeCreate, MealPlanList,
                    MealPlanQuery, MealPlanDetail, MealCreate)


class DateConverter:
    regex = '\d{4}-\d{2}-\d{2}'

    def to_python(self, value):
        return datetime.strptime(value, '%Y-%m-%d').date()

    def to_url(self, value):
        return value


register_converter(DateConverter, 'yyyy')

app_name = 'homemaker_api'

urlpatterns = [
    path('pantry/all', PantryList.as_view(), name='pantry-list'),
    path('pantry/ingredient/<int:pk>', IngredientDetail.as_view(), name='ingredient-detail'),
    path('pantry/ingredient/create', IngredientCreate.as_view(), name='ingredient-create'),
    path('pantry/ingredient/delete/<int:pk>/', IngredientDelete.as_view(), name='ingredient-delete'),
    path('cookbook/all', CookbookList.as_view(), name='cookbook-list'),
    path('cookbook/recipe/<int:pk>', RecipeDetail.as_view(), name='recipe-detail'),
    path('cookbook/recipe/<slug:slug>', RecipeDetailSLUG.as_view(), name='recipe-detail'),
    path('cookbook/recipe/create', RecipeCreate.as_view(), name='recipe-create'),
    path('mealplan/all', MealPlanList.as_view(), name='mealplan-list'),
    path('mealplan/<yyyy:date>', MealPlanQuery.as_view(), name='mealplan-query'),
    path('mealplan/<int:pk>', MealPlanDetail.as_view(), name='mealplan-detail'),
    path('mealplan/create', MealCreate.as_view(), name='meal-create')
]
