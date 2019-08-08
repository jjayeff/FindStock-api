const StockController = require('./controllers/stock_controller');
const UsersController = require('./controllers/users_controller');
const VisitorController = require('./controllers/visitor_controller');
const LussController = require('./controllers/luss_controller');

module.exports = app => {
  // UsersController
  app.get('/api/users', UsersController.users);
  // StockController
  app.get('/api/stock', StockController.stock);
  app.get('/api/stockfast', StockController.stockfast);
  app.get('/api/stock/:symbol', StockController.stockBySymbol);
  app.get('/api/sector/:sector', StockController.stockBySector);
  // VisitorController
  app.post('/api/visitor', VisitorController.createVisitor);
  // LussController
  app.get('/api/luss', LussController.getItems);
  app.get('/api/luss/:id', LussController.getItemsById);
  app.post('/api/luss', LussController.createitem);
  app.post('/api/luss/users/create', LussController.createUser);
  app.post('/api/luss/users/login', LussController.Login);
  app.get('/api/luss/user/:accessToken', LussController.getUserByAccessToken);
  app.get('/api/luss/user/check/:email', LussController.findUserEmail);
  app.post('/api/luss/carts/create', LussController.createCart);
  app.put('/api/luss/carts/edit', LussController.editCart);
  app.delete('/api/luss/carts/delete/:id', LussController.deleteCart);
  app.get('/api/luss/carts/:id', LussController.getCartById);
};
