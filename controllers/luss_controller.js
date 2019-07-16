const jwt = require('jwt-simple');
const md5 = require('md5');
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
      `(${req.body.name ? `'${req.body.name}'` : 'null'}, ` +
      `${req.body.price ? `'${req.body.price}'` : 'null'}, ` +
      `${req.body.color ? `'${req.body.color}'` : 'null'}, ` +
      `${req.body.size ? `'${req.body.size}'` : 'null'}, ` +
      `${req.body.type ? `'${req.body.type}'` : 'null'}, ` +
      `${req.body.img_0 ? `'${req.body.img_0}'` : 'null'}, ` +
      `${req.body.img_1 ? `'${req.body.img_1}'` : 'null'}, ` +
      `${req.body.img_2 ? `'${req.body.img_2}'` : 'null'}, ` +
      `${req.body.img_3 ? `'${req.body.img_3}'` : 'null'}, ` +
      `${req.body.img_4 ? `'${req.body.img_4}'` : 'null'}, ` +
      `${req.body.img_5 ? `'${req.body.img_5}'` : 'null'}, ` +
      `${
        req.body.admin || req.body.admin === 0 ? `'${req.body.admin}'` : 'null'
      }) `;
    try {
      result = await pool.query(sql);
      res.send({
        message: `1 record inserted, ID: ${result.insertId}`,
        result
      });
    } catch (err) {
      res.status(404).send({ error: err });
    }
  },

  async createUser(req, res) {
    var result;
    const accessToken = getNewAccessToken(req.body.email, 'LUSS_OFFICIAL_KEY');

    var sql =
      `INSERT INTO luss_users (firstName, lastName, email, password, gender, address, tel, dob, accessToken) ` +
      `VALUES ` +
      `(${req.body.firstName ? `'${req.body.firstName}'` : 'null'}, ` +
      `${req.body.lastName ? `'${req.body.lastName}'` : 'null'}, ` +
      `${req.body.email ? `'${req.body.email}'` : 'null'}, ` +
      `${req.body.password ? `'${md5(req.body.password)}'` : 'null'}, ` +
      `${req.body.gender ? `'${req.body.gender}'` : 'null'}, ` +
      `${req.body.address ? `'${req.body.address}'` : 'null'}, ` +
      `${req.body.tel ? `'${req.body.tel}'` : 'null'}, ` +
      `${req.body.dob ? `'${req.body.dob}'` : 'null'}, ` +
      `${`'${accessToken}'`}) `;
    try {
      result = await pool.query(sql);
      res.send({
        message: `1 record inserted, ID: ${result.insertId}`,
        result
      });
    } catch (err) {
      res.status(404).send({ error: err });
    }
  },

  async Login(req, res) {
    var result;
    var sql = `SELECT accessToken FROM luss_users WHERE email = '${
      req.body.email
    }' AND password = '${md5(req.body.password)}' `;
    try {
      result = await pool.query(sql);
      if (result.length) {
        const newAccessToken = getNewAccessToken(
          req.body.email,
          'LUSS_OFFICIAL_KEY'
        );
        sql = `UPDATE luss_users SET accessToken = '${newAccessToken}' WHERE email = '${
          req.body.email
        }'`;
        try {
          result = await pool.query(sql);
        } catch (err) {
          res.status(404).send({ error: err });
        }
        res.send({
          accessToken: newAccessToken
        });
      } else {
        res.status(401).send({ error: 'Wrong Username or Password' });
      }
    } catch (err) {
      res.status(404).send({ error: err });
    }
  }
};

const getNewAccessToken = (sub, key) => {
  const payload = {
    sub,
    iat: new Date().getTime() //มาจากคำว่า issued at time (สร้างเมื่อ)
  };
  const SECRET = key; //ในการใช้งานจริง คีย์นี้ให้เก็บเป็นความลับ
  const accessToken = jwt.encode(payload, SECRET);
  return accessToken;
};
