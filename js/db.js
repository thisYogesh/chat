const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yogesh@001',
  database: 'chatbase',
});

const db = {
  init: function () {
    connection.connect(function (error) {
      if (error) {
        console.log('Error in database connection', error);
        return;
      }

      console.log('Database is connected successfully!');
    });
  },

  create: function (table, config) {
    const fields = Object.keys(config);
    const values = Object.values(config).reduce(function (values, value) {
      if (values) values += ',';

      if (typeof value === 'string') values += `'${value}'`;
      else values += value;

      return values;
    }, '');

    const sql = `insert into ${table}(${fields.join(',')}) values(${values})`;

    return new Promise(function (resolve, reject) {
      connection.query(sql, function (error) {
        if (error) {
          console.log('Error in executing sql query', error);
          reject(false);
          return;
        } else {
          resolve(true);
          return;
        }
      });
    });
  },

  update: function () {},

  delete: function () {},
};

module.exports = db;
