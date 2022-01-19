from string import ascii_letters, digits
from random import choices
from datetime import datetime
from django.test import TestCase
from django.db.models import signals
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from homemaker_api.urls import DateConverter
from homemaker.models import Ingredient, Recipe, Meal
from users.models import NewUser


AVAILABLE_CHARS = ascii_letters + digits
unique_str = choices(AVAILABLE_CHARS, k=8)


class DateConverterTests(TestCase):
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

    def setUp(self):
        self.user = NewUser.objects.create(email=f"{unique_str}@g.com", user_name=f"{unique_str}", first_name=f"{unique_str}", password="aaa11223344")
        self.token = RefreshToken.for_user(self.user)
        self.client.force_authenticate(user=self.user, token=self.token.access_token)

    def test_view_ingredients(self):

        url = reverse('homemaker_api:pantry-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_ingredient(self):
        data1 = {"name": "Onion", "amount": 999.99, "unit": "mg", "user": self.user.id}
        data2 = {"name": "Potato", "amount": 999.999, "unit": "mg"}
        data3 = {"name": "Potato", "amount": 999.999, "unit": "lbs", "user": self.user.id}
        url = reverse('homemaker_api:ingredient-create')
        response1 = self.client.post(url, data1, format='json')
        response2 = self.client.post(url, data2, format='json')
        response3 = self.client.post(url, data3, format='json')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response3.status_code, status.HTTP_400_BAD_REQUEST)

class RecipeAPITests(APITestCase):

    def setUp(self):
        self.user = NewUser.objects.create(email=f"{unique_str}@g.com", user_name=f"{unique_str}", first_name=f"{unique_str}", password="aaa11223344")
        self.token = RefreshToken.for_user(self.user)
        self.client.force_authenticate(user=self.user, token=self.token.access_token)

    def test_view_recipes(self):
        url = reverse('homemaker_api:cookbook-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_recipe(self):
        self.test_ingredient = Ingredient.objects.create(name="Onion", amount=999.99, unit='mg', user=self.user)
        data1 = {"name": "Test Recipe", "ingredients": [1], "description": "test", "instructions": "test", "rating": 5, "user": self.user.id}
        data2 = {"name": "Test Recipe", "ingredients": [1], "description": "test", "instructions": "test", "rating": 5}
        url = reverse('homemaker_api:recipe-create')
        response1 = self.client.post(url, data1, format='json')
        response2 = self.client.post(url, data2, format='json')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)


class MealPlanAPITests(APITestCase):

    def setUp(self):
        self.user = NewUser.objects.create(email=f"{unique_str}@g.com", user_name=f"{unique_str}", first_name=f"{unique_str}", password="aaa11223344")
        self.token = RefreshToken.for_user(self.user)
        self.client.force_authenticate(user=self.user, token=self.token.access_token)

    def test_view_mealplan(self):
        url = reverse('homemaker_api:mealplan-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_meal(self):
        self.test_ingredient = Ingredient.objects.create(name="Onion", amount=999.99, unit='mg', user=self.user)
        self.test_recipe = Recipe.objects.create(name="Test Recipe", instructions="test", user=self.user)
        self.test_recipe.ingredients.add(self.test_ingredient)
        data1 = {"date": "2021-08-12", "recipe": 1, "meal_type": "Breakfast", "user": self.user.id}
        data2 = {"date": "2021-08-12", "recipe": 1, "meal_type": "Brunch", "user": self.user.id}
        data3 = {"date": "2021-08/12", "recipe": 1, "meal_type": "Breakfast", "user": self.user.id}
        url = reverse('homemaker_api:meal-create')
        response1 = self.client.post(url, data1, format='json')
        response2 = self.client.post(url, data2, format='json')
        response3 = self.client.post(url, data3, format='json')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response3.status_code, status.HTTP_400_BAD_REQUEST)
