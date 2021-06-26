const faker = require("faker");

const getFakeUser = () => ({
  username: faker.datatype.string(),
  password: faker.datatype.string(),
  role: faker.datatype.string(),
});

const getFakePost = () => ({
  content: faker.datatype.string(),
  link: faker.datatype.string(),
});

const getFakeComment = () => {
  return {
    content: faker.datatype.string(),
  };
};

const getFakeComments = () => {
  return [...Array(3)].map(() => getFakeComment());
};

module.exports = {
  getFakeUser,
  getFakePost,
  getFakeComment,
  getFakeComments,
};
