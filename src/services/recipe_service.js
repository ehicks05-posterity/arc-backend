const { PrismaClient } = require("@prisma/client");

const {
  getFakeRecipe,
  getFakeUser,
  getFakeIngredients,
  getFakeDirections,
} = require("./utils");

const prisma = new PrismaClient();

const findAllRecipes = async () => {
  return prisma.recipe.findMany({
    include: { ingredients: true, directions: true, author: true },
  });
};

const deleteAllRecipes = async () => {
  const recipes = await prisma.recipe.findMany();

  await Promise.all(
    recipes.map(async (recipe) => {
      await prisma.ingredient.deleteMany({ where: { recipeId: recipe.id } });
      await prisma.direction.deleteMany({ where: { recipeId: recipe.id } });
    })
  );

  return prisma.recipe.deleteMany();
};

const createRecipe = async () => {
  const recipe = await prisma.recipe.create({
    data: {
      ...getFakeRecipe(),
      ingredients: { create: [...getFakeIngredients()] },
      directions: { create: [...getFakeDirections()] },
      author: { create: getFakeUser() },
    },
  });

  return recipe;
};

module.exports = { findAllRecipes, deleteAllRecipes, createRecipe };
