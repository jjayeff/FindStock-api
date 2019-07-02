var pool = require('../database');

function format(date) {
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

module.exports = {
  async stock(req, res) {
    var result;
    var sql = 'SELECT * FROM stock ORDER BY Score DESC';
    try {
      result = await pool.query(sql);
    } catch (err) {
      res.status(404).send({ error: err });
    }
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    for (var i = 0; i < result.length; i++) {
      // GrowthStock
      var sql = `SELECT * FROM growth_stock WHERE Symbol = '${
        result[i].Symbol
      }'`;
      result[i]['GrowthStock'] = await pool.query(sql);
      // StockDividend
      var sql = `SELECT * FROM stock_dividend WHERE Symbol = '${
        result[i].Symbol
      }'`;
      result[i]['StockDividend'] = await pool.query(sql);
      // Finance
      var sql = `SELECT * FROM finance_stat_daily WHERE Symbol = '${
        result[i].Symbol
      }' AND Date IN (SELECT max(Date) FROM finance_stat_daily WHERE Symbol = '${
        result[i].Symbol
      }')`;
      var FinanceStatDaily = await pool.query(sql);
      result[i]['Finance'] = {
        FinanceStatDaily
      };
      // HistoryFinanceStat
      var sql = `SELECT * FROM finance_stat_daily WHERE Symbol = '${
        result[i].Symbol
      }' AND LastUpdate >= '${format(
        yesterday
      )}' ORDER BY LastUpdate DESC LIMIT 2`;
      result[i]['HistoryFinanceStat'] = await pool.query(sql);
    }

    res.send(result);
  },

  async stockfast(req, res) {
    var result;
    var sql = 'SELECT * FROM stock ORDER BY Score DESC LIMIT 10';
    try {
      result = await pool.query(sql);
    } catch (err) {
      res.status(404).send({ error: err });
    }
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    for (var i = 0; i < result.length; i++) {
      // GrowthStock
      var sql = `SELECT * FROM growth_stock WHERE Symbol = '${
        result[i].Symbol
      }'`;
      result[i]['GrowthStock'] = await pool.query(sql);
      // StockDividend
      var sql = `SELECT * FROM stock_dividend WHERE Symbol = '${
        result[i].Symbol
      }'`;
      result[i]['StockDividend'] = await pool.query(sql);
      // Finance
      var sql = `SELECT * FROM finance_stat_daily WHERE Symbol = '${
        result[i].Symbol
      }' AND Date IN (SELECT max(Date) FROM finance_stat_daily WHERE Symbol = '${
        result[i].Symbol
      }')`;
      var FinanceStatDaily = await pool.query(sql);
      result[i]['Finance'] = {
        FinanceStatDaily
      };
      // HistoryFinanceStat
      var sql = `SELECT * FROM finance_stat_daily WHERE Symbol = '${
        result[i].Symbol
      }' AND LastUpdate >= '${format(
        yesterday
      )}' ORDER BY LastUpdate DESC LIMIT 2`;
      result[i]['HistoryFinanceStat'] = await pool.query(sql);
    }

    res.send(result);
  },

  async stockBySymbol(req, res) {
    var result;
    var sql = `SELECT * FROM stock WHERE Symbol = '${req.params.symbol}'`;
    try {
      result = await pool.query(sql);
    } catch (err) {
      res.status(404).send({ error: err });
    }
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var this_year = new Date();
    this_year.setMonth(1);
    this_year.setDate(1);
    var year = new Date();
    year.setFullYear(yesterday.getFullYear() - 4);
    year.setMonth(1);
    year.setDate(1);
    for (var i = 0; i < result.length; i++) {
      // GrowthStock
      var sql = `SELECT * FROM growth_stock WHERE Symbol = '${
        result[i].Symbol
      }'`;
      result[i]['GrowthStock'] = await pool.query(sql);
      // StockDividend
      var sql = `SELECT * FROM stock_dividend WHERE Symbol = '${
        result[i].Symbol
      }'`;
      result[i]['StockDividend'] = await pool.query(sql);
      // Finance
      var sql = `SELECT * FROM finance_stat_daily WHERE Symbol = '${
        result[i].Symbol
      }' AND Date IN (SELECT max(Date) FROM finance_stat_daily WHERE Symbol = '${
        result[i].Symbol
      }')`;
      var FinanceStatDaily = await pool.query(sql);
      var sql = `SELECT * FROM finance_info_yearly WHERE Symbol = '${
        result[i].Symbol
      }' AND Date >= '${format(year)}' ORDER BY Date`;
      var FinanceInfoYearly = await pool.query(sql);
      var sql = `SELECT * FROM finance_stat_yearly WHERE Symbol = '${
        result[i].Symbol
      }' AND Date >= '${format(year)}' ORDER BY Date`;
      var FinanceStatYearly = await pool.query(sql);
      var sql = `SELECT * FROM finance_info_quarter WHERE Symbol = '${
        result[i].Symbol
      }' AND Date IN (SELECT max(Date) FROM finance_info_quarter WHERE Symbol = '${
        result[i].Symbol
      }')`;
      var FinanceInfoQuarter = await pool.query(sql);
      result[i]['Finance'] = {
        FinanceInfoYearly,
        FinanceStatYearly,
        FinanceInfoQuarter,
        FinanceStatDaily
      };
      // HistoryFinanceStat
      var sql = `SELECT * FROM finance_stat_daily WHERE Symbol = '${
        result[i].Symbol
      }' AND Date >= '${format(this_year)}' ORDER BY Date`;
      result[i]['HistoryFinanceStat'] = await pool.query(sql);
    }
    res.send(result);
  },

  async stockBySector(req, res) {
    var result;
    var sql = `SELECT stock.Symbol, stock.Industry, stock.Sector, finance_stat_daily.Lastprice, finance_stat_daily.PE, finance_stat_daily.PBV, finance_stat_daily.Dvd_Yield, stock.Market_cap, stock.LastUpdate 
    FROM stock INNER JOIN finance_stat_daily ON application.stock.Symbol = finance_stat_daily.Symbol 
    WHERE stock.Sector = '${
      req.params.sector
    }' AND finance_stat_daily.LastUpdate = (SELECT MAX(LastUpdate) FROM finance_stat_daily) `;
    try {
      result = await pool.query(sql);
    } catch (err) {
      res.status(404).send({ error: err });
    }
    res.send(result);
  }
};
