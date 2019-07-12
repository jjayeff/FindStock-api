var pool = require('../database');

module.exports = {
  async getItems(req, res) {
    var result;
    var sql = 'SELECT * FROM luss_products';
    try {
      result = await pool.query(sql);
    } catch (err) {
      res.status(404).send({ error: err });
    }
    res.send(result);
  },
  async getItemsById(req, res) {
    var result;
    var sql = `SELECT * FROM luss_products WHERE Id = '${req.params.id}'`;
    try {
      result = await pool.query(sql);
    } catch (err) {
      res.status(404).send({ error: err });
    }
    res.send(result);
  },
  async createitem(req, res) {
    var result;
    var sql =
      `INSERT INTO luss_products (name, price, color, size, type, img_0, img_1, img_2, img_3, img_4, img_5, admin) ` +
      `VALUES ` +
      `('${req.body.name}', ` +
      `'${req.body.price}', ` +
      `'${req.body.color}', ` +
      `'${req.body.size}', ` +
      `'${req.body.type}', ` +
      `'${req.body.img_0}', ` +
      `'${req.body.img_1}', ` +
      `'${req.body.img_2}', ` +
      `'${req.body.img_3}', ` +
      `'${req.body.img_4}', ` +
      `'${req.body.img_5}', ` +
      `'${req.body.admin}') `;
    try {
      result = await pool.query(sql);
      res.send({
        message: `1 record inserted, ID: ${result.insertId}`,
        result
      });
    } catch (err) {
      res.status(404).send({ error: err });
    }
  }
};
