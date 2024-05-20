
import mysql from 'mysql2';


const dbConfig = {
  host: 'mysql-2bec05d6-doctoras.k.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_8G5_fS6gUVDiuIexwFB',
  database: 'defaultdb',
  port: 28266
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL successfully!');
  
  connection.end((endErr) => {
    if (endErr) {
      console.error('Error closing MySQL connection:', endErr);
      return;
    }
    console.log('MySQL connection closed.');
  });
});
