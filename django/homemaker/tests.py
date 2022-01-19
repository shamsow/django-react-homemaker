from django.test import TestCase
from homemaker.models import Ingredient, Recipe, MealPlan, Meal
from users.models import NewUser
from datetime import datetime
# Create your tests here.

class IngredientTestCase(TestCase):
    def setUp(self):
        user = NewUser.objects.create(email="a@a.com", user_name="a", first_name="aaa", password="aaa11223344")
        Ingredient.objects.create(name="Onion", amount=999.99, unit='mg', user=user)
        self.test_object = Ingredient.objects.get(id=1)
    
    def test_ingredient_fields(self):
        expected_fields = (
            'name', 'amount', 'created', 'modified', 'user'
        )
        # The first field spot is occupied by the M2M relation with Recipe, so skip it
        model_fields = [f.name for f in Ingredient._meta.get_fields()[1:]]
        for name in expected_fields:
            self.assertIn(name, model_fields)

    def test_ingredient_string_representation(self):
        ingredient = self.test_object
        string_repr = ingredient.__str__()
        self.assertEqual(string_repr, 'Onion')

    def test_ingredient_values(self):
        ingredient = self.test_object
        name = f"{ingredient.name}"
        amount = float(ingredient.amount)
        unit = f"{ingredient.unit}"

        self.assertEqual(name, 'Onion')
        self.assertEqual(amount, 999.99)
        self.assertEqual(unit, 'mg')


class RecipeTestCase(TestCase):
    def setUp(self):
        user = NewUser.objects.create(email="a@a.com", user_name="a", first_name="aaa", password="aaa11223344")
        Ingredient.objects.create(name="Onion", amount=999.99, unit='mg', user=user)
        Ingredient.objects.create(name="Potato", amount=15.99, unit='kg', user=user)
        ing1, ing2 = Ingredient.objects.get(id=1), Ingredient.objects.get(id=2)
        r = Recipe(name="Spicy curry",
                   instructions="Throw into pot with water and spices. Cook.", user=user)
        r.save()
        r.ingredients.add(ing1, ing2)
        self.test_object = Recipe.objects.get(id=1)
        self.ingredient_objects = (ing1, ing2)
    
    def test_recipe_fields(self):
        expected_fields = (
            'name', 'ingredients', 'description', 'instructions', 'created',
            'modified', 'slug', 'user',
        )
        model_fields = [f.name for f in Recipe._meta.get_fields()]
        for name in expected_fields:
            self.assertIn(name, model_fields)

    def test_recipe_ingredients_relation(self):
        recipe = self.test_object
        ingredients = tuple(recipe.ingredients.all())
        self.assertEqual(self.ingredient_objects, ingredients)

    def test_recipe_string_representation(self):
        recipe = self.test_object
        string_repr = recipe.__str__()
        self.assertEqual(string_repr, 'Spicy curry')

    def test_recipe_field_values(self):
        recipe = self.test_object
        name = f"{recipe.name}"
        instructions = f"{recipe.instructions}"
        slug = f"{recipe.slug}"
        ingredients = recipe.ingredients.all()
        ing1, ing2 = f"{ingredients[0].name}", f"{ingredients[1].name}"

        self.assertEqual(name, 'Spicy curry')
        self.assertEqual(ing1, 'Onion')
        self.assertEqual(ing2, 'Potato')
        self.assertEqual(
            instructions, 'Throw into pot with water and spices. Cook.')
        self.assertEqual(slug, 'spicy-curry')


class MealTestCase(TestCase):
    def setUp(self):
        user = NewUser.objects.create(email="z@z.com", user_name="z", first_name="z", password="aaa11223344")
        
        Ingredient.objects.create(name="Onion", amount=999.99, unit='mg', user=user)
        Ingredient.objects.create(name="Potato", amount=15.99, unit='kg', user=user)
        ing1, ing2 = Ingredient.objects.get(id=1), Ingredient.objects.get(id=2)
        r = Recipe(name="Spicy Curry",
                   instructions="Throw into pot with water and spices. Cook.", user=user)
        r.save()
        r.ingredients.add(ing1, ing2)

        date = datetime.strptime('2021-08-12', '%Y-%m-%d').date()
        Meal.objects.create(meal_type="Breakfast", date=date, recipe=r, user=user)

        self.test_object = Meal.objects.get(id=1)

    def test_meal_fields(self):
        expected_fields = (
            'id', 'meal_type', 'date', 
            'recipe', 'created', 'modified', 'user'
        )
        # The first field spot is occupied by the M2M relation with MealPlan, so skip it
        model_fields = [f.name for f in Meal._meta.get_fields()[1:]]
        for name in expected_fields:
            self.assertIn(name, model_fields), f"{name} is not a field in Meal"
    
    def test_meal_string_representation(self):
        meal = self.test_object
        string_repr = meal.__str__()
        self.assertEqual(string_repr, '2021-08-12: Breakfast - Spicy Curry')
    
    def test_mealplan_fields(self):
        expected_fields = (
            'date', 'created', 'modified', 'user', 'meals'
        )
        model_fields = [f.name for f in MealPlan._meta.get_fields()]
        for name in expected_fields:
            self.assertIn(name, model_fields)
    
    def test_mealplan_string_representation(self):
        self.assertEqual(MealPlan.objects.get(id=1).__str__(), '2021-08-12')
