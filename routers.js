const StockController = require('./controllers/stock_controller');
const UsersController = require('./controllers/users_controller');
const VisitorController = require('./controllers/visitor_controller');

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
};
