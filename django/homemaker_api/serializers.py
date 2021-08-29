from rest_framework import serializers
from homemaker.models import Ingredient, Recipe, Meal, MealPlan


class IngredientSerializer(serializers.ModelSerializer):
    recipe_count = serializers.SerializerMethodField()

    class Meta:
        model = Ingredient
        fields = '__all__'

    def get_recipe_count(self, obj):
        return obj.recipe_count


class IngredientSerializerRelated(serializers.ModelSerializer):

    class Meta:
        model = Ingredient
        fields = '__all__'


class RecipeSerializer(serializers.ModelSerializer):
    # ingredients = serializers.HyperlinkedRelatedField(
    #     many=True,
    #     read_only=True,
    #     view_name='ingredient-detail',
    # )
    # ingredients = serializers.StringRelatedField(many=True)
    # ingredients = IngredientSerializer(many=True, read_only=False)

    class Meta:
        model = Recipe
        # fields = ('id', 'name', 'ingredients',
        #           'instructions', 'slug', 'rating')
        fields = '__all__'


class RecipeSerializerGET(serializers.ModelSerializer):
    # ingredients = serializers.HyperlinkedRelatedField(
    #     many=True,
    #     read_only=True,
    #     view_name='ingredient-detail',
    # )
    # ingredients = serializers.StringRelatedField(many=True)
    ingredients = IngredientSerializerRelated(many=True, read_only=True)

    class Meta:
        model = Recipe
        fields = '__all__'


class MealSerializer(serializers.ModelSerializer):
    # recipe = RecipeSerializerGET(read_only=True)
    class Meta:
        model = Meal
        fields = '__all__'


class MealPlanSerializer(serializers.ModelSerializer):
    # recipe = serializers.StringRelatedField()
    # recipe = serializers.HyperlinkedRelatedField(
    #     read_only=True,
    #     view_name='recipe-detail',
    #     lookup_field='pk'
    # )
    # recipe = RecipeSerializer(read_only=False)

    class Meta:
        model = MealPlan
        fields = '__all__'


class MealPlanSerializerGET(serializers.ModelSerializer):
    # recipe = RecipeSerializerGET(read_only=True)
    meals = MealSerializer(read_only=True, many=True)

    class Meta:
        model = MealPlan
        fields = '__all__'

    # def to_representation(self, instance):
    #     date = str(instance.date)
    #     # recipe = RecipeSerializerGET(read_only=True)
    #     obj = {
    #         date: {
    #             "id": instance.id,
    #             "user": instance.user.id,
    #             "recipe": {
    #                 "id": instance.recipe.id,
    #                 "name": instance.recipe.name,
    #                 # "ingredients": list(instance.recipe.ingredients.all().id),
    #                 "slug": instance.recipe.slug
    #             },
    #             "meal": instance.meal,
    #             "created": instance.created,
    #             "modified": instance.modified,
    #         }
    #     }
    #     # print(instance.recipe)
    #     return obj
