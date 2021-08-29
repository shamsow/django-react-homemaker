from rest_framework import generics, filters
from homemaker.models import Ingredient, Recipe, Meal, MealPlan
from .serializers import (IngredientSerializer, RecipeSerializer,
                          MealPlanSerializer, MealSerializer,
                          RecipeSerializerGET,
                          MealPlanSerializerGET)
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count


# Ingredients
class PantryList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    # queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        user = self.request.user
        return Ingredient.objects.filter(user=user).annotate(recipe_count=Count('recipe'))


class IngredientDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    # queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    # lookup_field     = 'pk'

    # def get_queryset(self):
    #     """
    #     This view should return a list of all the purchases
    #     for the currently authenticated user.
    #     """
    #     user = self.request.user
    #     return Ingredient.objects.filter(user=user)


class IngredientCreate(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer


class IngredientDelete(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer

# Recipes


class CookbookList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    # queryset = Recipe.objects.all()
    serializer_class = RecipeSerializerGET
    # filter_backends = [DjangoFilterBackend]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    search_fields = ['^slug']
    ordering_fields = ['rating']

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        user = self.request.user
        return Recipe.objects.filter(user=user)


class RecipeDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

    # def get_queryset(self):
    #     """
    #     This view should return a list of all the purchases
    #     for the currently authenticated user.
    #     """
    #     user = self.request.user
    #     return Recipe.objects.filter(user=user)


class RecipeDetailSLUG(generics.RetrieveUpdateDestroyAPIView):
    # permission_classes = [IsAuthenticated]
    # queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        slug = self.kwargs['slug']
        return Recipe.objects.filter(slug=slug)


class RecipeCreate(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer


# MealPlans
class MealPlanList(generics.ListAPIView):
    # permission_classes = [IsAuthenticated]
    queryset = MealPlan.objects.all()
    serializer_class = MealPlanSerializerGET

    # def get_queryset(self):
    #     # slug = self.kwargs['slug']
    #     user = self.request.user
    #     return MealPlan.objects.filter(user=user)


class MealPlanDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = MealPlan.objects.all()
    serializer_class = MealPlanSerializer


class MealPlanQuery(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MealPlanSerializer
    lookup_field = 'date'

    def get_queryset(self):
        q_date = self.kwargs['date']
        user = self.request.user
        return MealPlan.objects.filter(date=q_date, user=user)


class MealCreate(generics.CreateAPIView):
    queryset = Meal.objects.all()
    serializer_class = MealSerializer
