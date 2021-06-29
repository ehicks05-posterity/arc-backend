const faker = require("faker");

const getFakeUser = () => ({
  username: faker.internet.userName(),
  password: faker.internet.password(),
  role: faker.datatype.string(),
});

const getFakePost = () => ({
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(),
  link: faker.internet.url(),
});

const getFakeComment = () => {
  return {
    content: faker.lorem.paragraphs(),
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
