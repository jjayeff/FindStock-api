var pool = require('../database');

module.exports = {
  async getItems(req, res) {
    var result;
    var sql = 'SELECT * FROM luss_items';
    try {
      result = await pool.query(sql);
    } catch (err) {
      res.status(404).send({ error: err });
    }
    res.send(result);
  },
  async getItemsById(req, res) {
    var result;
    var sql = `SELECT * FROM luss_items WHERE Id = '${req.params.id}'`;
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
      `INSERT INTO luss_items (Name, Price, Color, Size, Img_main, Img_1, Img_2, Img_3, Img_4, Img_5) ` +
      `VALUES ` +
      `('${req.body.Name}', ` +
      `'${req.body.Price}', ` +
      `'${req.body.Color}', ` +
      `'${req.body.Size}', ` +
      `'${req.body.Img_main}', ` +
      `'${req.body.Img_1}', ` +
      `'${req.body.Img_2}', ` +
      `'${req.body.Img_3}', ` +
      `'${req.body.Img_4}', ` +
      `'${req.body.Img_5}') `;
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
