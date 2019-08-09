const jwt = require('jwt-simple');
var pool = require('../database');

module.exports = {
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // | Get /api/luss                                                   |
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
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
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // | Get /api/luss/:id                                               |
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
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
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // | Post /api/luss                                                  |
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
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
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // | Post /api/luss/users/create                                     |
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  async createUser(req, res) {
    var result;
    const accessToken = getNewAccessToken(req.body.email, 'LUSS_OFFICIAL_KEY');

    var sql =
      `INSERT INTO luss_users (firstName, lastName, email, password, gender, address, tel, dob, province, district, postalcode, accessToken ) ` +
      `VALUES ` +
      `(${req.body.firstName ? `'${req.body.firstName}'` : 'null'}, ` +
      `${req.body.lastName ? `'${req.body.lastName}'` : 'null'}, ` +
      `${req.body.email ? `'${req.body.email}'` : 'null'}, ` +
      `${req.body.password ? `'${req.body.password}'` : 'null'}, ` +
      `${req.body.gender ? `'${req.body.gender}'` : 'null'}, ` +
      `${req.body.address ? `'${req.body.address}'` : 'null'}, ` +
      `${req.body.tel ? `'${req.body.tel}'` : 'null'}, ` +
      `${req.body.dob ? `'${req.body.dob}'` : 'null'}, ` +
      `${req.body.province ? `'${req.body.province}'` : 'null'}, ` +
      `${req.body.district ? `'${req.body.district}'` : 'null'}, ` +
      `${req.body.postalcode ? `'${req.body.postalcode}'` : 'null'}, ` +
      `${`'${accessToken}'`}) `;
    try {
      result = await pool.query(sql);
      var sql = `SELECT accessToken FROM luss_users WHERE email = '${
        req.body.email
      }'`;
      result = await pool.query(sql);
      res.send(result[0]);
    } catch (err) {
      res.status(404).send({ error: err });
    }
  },
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // | Post /api/luss/users/login                                      |
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  async Login(req, res) {
    var result;
    var sql = `SELECT accessToken FROM luss_users WHERE email = '${
      req.body.email
    }' AND password = '${req.body.password}' `;
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
  },
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // | Get /api/luss/user/:accessToken                                 |
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  async getUserByAccessToken(req, res) {
    var result;
    var sql = `SELECT id,firstName,lastName,email,gender,address,tel,dob,province,district,postalcode FROM luss_users WHERE accessToken = '${
      req.params.accessToken
    }'`;
    try {
      result = await pool.query(sql);
    } catch (err) {
      res.status(404).send({ error: err });
    }
    res.send(result);
  },
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // | Get /api/luss/user/check/:email                                 |
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  async findUserEmail(req, res) {
    var result;
    var sql = `SELECT * FROM luss_users WHERE email = '${req.params.email}'`;
    try {
      result = await pool.query(sql);
      result = result.length > 0 ? { isUnique: 1 } : { isUnique: 0 };
    } catch (err) {
      res.status(404).send({ error: err });
    }
    res.send(result);
  },
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // | Put /api/luss/user/profile                                      |
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  async editUserProfile(req, res) {
    var result;
    var sql =
      `UPDATE luss_users SET ` +
      `dob = '${req.body.dob}', ` +
      `firstName = '${req.body.firstName}', ` +
      `lastName = '${req.body.lastName}', ` +
      `email = '${req.body.email}', ` +
      `gender = '${req.body.gender}', ` +
      `tel = '${req.body.tel}' ` +
      `WHERE email = '${req.params.email}'`;
    try {
      result = await pool.query(sql);
      res.send({
        message: result.message,
        result
      });
    } catch (err) {
      res.status(404).send({ error: err });
    }
  },
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // | Put /api/luss/user/address                                      |
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  async editUserAddress(req, res) {
    var result;
    var sql =
      `UPDATE luss_users SET ` +
      `address = '${req.body.address}', ` +
      `district = '${req.body.district}', ` +
      `postalcode = '${req.body.postalcode}', ` +
      `province = '${req.body.province}' ` +
      `WHERE email = '${req.params.email}'`;
    try {
      result = await pool.query(sql);
      res.send({
        message: result.message,
        result
      });
    } catch (err) {
      res.status(404).send({ error: err });
    }
  },
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // | Put /api/luss/user/password                                     |
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  async editUserPassword(req, res) {
    var result;
    var sql =
      `UPDATE luss_users SET ` +
      `password = '${req.body.password}' ` +
      `WHERE email = '${req.params.email}'`;
    try {
      result = await pool.query(sql);
      res.send({
        message: result.message,
        result
      });
    } catch (err) {
      res.status(404).send({ error: err });
    }
  },
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // | Get /api/luss/user/check/:email/:password                       |
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  async findUserPassword(req, res) {
    var result;
    var sql = `SELECT * FROM luss_users WHERE email = '${
      req.params.email
    }' AND password = '${req.params.password}'`;
    try {
      result = await pool.query(sql);
      result = result.length > 0 ? { isCorrect: 1 } : { isCorrect: 0 };
    } catch (err) {
      res.status(404).send({ error: err });
    }
    res.send(result);
  },
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // | Get '/api/luss/carts/:id'                                       |
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  async getCartById(req, res) {
    var result;
    var sql = `SELECT * FROM luss_carts WHERE user_id = ${req.params.id}`;
    try {
      result = await pool.query(sql);
    } catch (err) {
      res.status(404).send({ error: err });
    }
    res.send(result);
  },
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // | Post /api/luss/carts/create                                     |
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  async createCart(req, res) {
    var result;
    var sql =
      `INSERT INTO luss_carts (color, complete, delivery, id, quantity, size, detail_id, user_id) ` +
      `VALUES ` +
      `(${req.body.color ? `'${req.body.color}'` : 'null'}, ` +
      `${req.body.complete ? `'${req.body.complete}'` : 'null'}, ` +
      `${req.body.delivery ? `'${req.body.delivery}'` : 'null'}, ` +
      `${req.body.id ? `'${req.body.id}'` : 'null'}, ` +
      `${req.body.quantity ? `'${req.body.quantity}'` : 'null'}, ` +
      `${req.body.size ? `'${req.body.size}'` : 'null'}, ` +
      `${req.body.detail_id ? `'${req.body.detail_id}'` : 'null'}, ` +
      `${req.body.user_id ? `'${req.body.user_id}'` : 'null'}) `;
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
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // | Put /api/luss/carts/edit                                        |
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  async editCart(req, res) {
    var result;
    var sql =
      `UPDATE luss_carts SET ` +
      `quantity = ${req.body.quantity}, ` +
      `size = '${req.body.size}', ` +
      `complete = ${req.body.complete} ` +
      `WHERE id = '${req.body.id}'`;
    try {
      result = await pool.query(sql);
      res.send({
        message: `update row, ID: ${req.body.id}`,
        result
      });
    } catch (err) {
      res.status(404).send({ error: err });
    }
  },
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  // | Delete /api/luss/carts/delete/:id                               |
  // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  async deleteCart(req, res) {
    var result;
    var sql = `DELETE FROM  luss_carts WHERE id = '${req.params.id}'  `;
    try {
      result = await pool.query(sql);
      res.send({
        message: `delete row, ID: ${req.params.id}`,
        result
      });
    } catch (err) {
      res.status(404).send({ error: err });
    }
  }
};
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
// | Other Function                                                  |
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
const getNewAccessToken = (sub, key) => {
  const payload = {
    sub,
    iat: new Date().getTime() //มาจากคำว่า issued at time (สร้างเมื่อ)
  };
  const SECRET = key; //ในการใช้งานจริง คีย์นี้ให้เก็บเป็นความลับ
  const accessToken = jwt.encode(payload, SECRET);
  return accessToken;
};
