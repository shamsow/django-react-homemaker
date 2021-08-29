from django.test import TestCase
from homemaker_api.urls import DateConverter
from datetime import datetime
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from homemaker.models import Ingredient, Recipe


# Permissons must be changed before running these tests, or they will always fail


class DateConverterTestCase(TestCase):
    d = DateConverter()
    test_date = '2021-08-12'

    def test_date_python_conversion(self):
        converted_date = self.d.to_python(self.test_date)
        date_object = datetime.strptime(self.test_date, '%Y-%m-%d').date()
        self.assertEqual(date_object, converted_date)

    def test_date_url_conversion(self):
        converted_date = self.d.to_url(self.test_date)
        self.assertEqual(self.test_date, converted_date)


class IngredientAPITests(APITestCase):

    def test_view_ingredients(self):
        url = reverse('homemaker_api:pantry-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def create_ingredient(self):
        data1 = {"name": "Onion", "amount": 999.99, "unit": "mg"}
        data2 = {"name": "Potato", "amount": 999.999, "unit": "mg"}
        url = reverse('homemaker_api:ingredient-create')
        response1 = self.client.post(url, data1, format='json')
        response2 = self.client.post(url, data2, format='json')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)


class RecipeAPITests(APITestCase):

    def test_view_recipes(self):
        url = reverse('homemaker_api:cookbook-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def create_recipe(self):
        self.test_ingredient = Ingredient.objects.create(name="Onion", amount=999.99, unit='mg')
        data = {"name": "Test Recipe", "ingredients": [1], "instructions": "test", "rating": 5}
        url = reverse('homemaker_api:recipe-create')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class MealPlanAPITests(APITestCase):

    def test_view_mealplan(self):
        url = reverse('homemaker_api:mealplan-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def create_meal(self):
        self.test_ingredient = Ingredient.objects.create(name="Onion", amount=999.99, unit='mg')
        self.test_recipe = Recipe.objects.create(name="Test Recipe", instructions="test")
        self.test_recipe.ingredients.add(self.test_ingredient)
        data = {"date": "2021-08-12", "recipe": 1, "meal": 1}
        url = reverse('homemaker_api:meal-create')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
