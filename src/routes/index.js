// import postRoutes from './posts.js';

const constructorMethod = (app) => {
  //   app.use('/posts', postRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
