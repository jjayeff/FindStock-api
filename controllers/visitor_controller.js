var pool = require('../database');

module.exports = {
  async createVisitor(req, res) {
    var result;
    var sql =
      `INSERT INTO visitor (IP_Address, Continent, Country, Region, Org, Latitude, Longitude, Path_To, Path_From) ` +
      `VALUES ` +
      `('${req.body.IP_Address}', ` +
      `'${req.body.Continent}', ` +
      `'${req.body.Country}', ` +
      `'${req.body.Region}', ` +
      `'${req.body.Org}', ` +
      `'${req.body.Latitude}', ` +
      `'${req.body.Longitude}', ` +
      `'${req.body.Path_To}', ` +
      `'${req.body.Path_From}') `;
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
