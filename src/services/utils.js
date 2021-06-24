const faker = require("faker");

const getFakeRecipe = () => ({
  name: faker.datatype.string(),
  emoji: faker.datatype.string(),
  description: faker.datatype.string(),
  difficulty: faker.datatype.number(),
  cookingTime: faker.datatype.string(),
  servings: faker.datatype.number(),
  course: faker.datatype.string(),
  ingredients: getFakeIngredients(),
});

const getFakeUser = () => ({
  email: faker.datatype.string(),
  username: faker.datatype.string(),
  password: faker.datatype.string(),
  role: faker.datatype.string(),
});

const getFakeIngredients = () => {
  return [...Array(3)].map(() => ({
    name: faker.datatype.string(),
    quantity: faker.datatype.number(),
    unit: faker.datatype.string(),
  }));
};

const getFakeDirections = () => {
  return [...Array(3)].map(() => ({
    text: faker.datatype.string(),
  }));
};

module.exports = {
  getFakeRecipe,
  getFakeUser,
  getFakeIngredients,
  getFakeDirections,
};
