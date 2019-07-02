var pool = require('../database');

module.exports = {
  async users(req, res) {
    var result;
    var sql = 'SELECT * FROM users';
    try {
      result = await pool.query(sql);
    } catch (err) {
      res.status(404).send({ error: err });
    }
    res.send(result);
  }
};
