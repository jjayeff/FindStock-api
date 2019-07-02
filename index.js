const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routers');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get('/', (req, res) => res.send({ message: 'Hello World' }));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

routes(app);
