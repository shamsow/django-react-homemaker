from django.urls import path
from django.urls import register_converter
from datetime import datetime
from .views import (PantryList, CookbookList, IngredientDetail,
                    IngredientCreate, IngredientDelete, RecipeDetailREADONLY, UnitList, RecipeDetail,
                    RecipeDetailSLUG, RecipeCreate, MealPlanList,
                    MealPlanQuery, MealPlanDetail, MealPlanDelete, MealCreate)


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
    path('pantry/units', UnitList.as_view(), name='unit-list'),
    path('cookbook/all', CookbookList.as_view(), name='cookbook-list'),
    path('cookbook/recipe/<int:pk>', RecipeDetail.as_view(), name='recipe-detail'),
    path('cookbook/recipe/get/<int:pk>', RecipeDetailREADONLY.as_view(), name='recipe-detail-readonly'),
    path('cookbook/recipe/create', RecipeCreate.as_view(), name='recipe-create'),
    path('cookbook/recipe/<slug:slug>', RecipeDetailSLUG.as_view(), name='recipe-detail'),
    path('mealplan/all', MealPlanList.as_view(), name='mealplan-list'),
    path('mealplan/<yyyy:date>', MealPlanQuery.as_view(), name='mealplan-query'),
    path('mealplan/<int:pk>', MealPlanDelete.as_view(), name='mealplan-delete'),
    path('mealplan/meal/<int:pk>', MealPlanDetail.as_view(), name='mealplan-detail'),
    path('mealplan/meal/create', MealCreate.as_view(), name='meal-create')
]
