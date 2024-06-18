module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/email',
      handler: 'email.exampleAction',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
