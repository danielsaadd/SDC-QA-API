// const mysql = require("mysql2")
// const Promise = require('bluebird')
// require("dotenv").config();

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   database: process.env.DB_NAME,
// })

// const db = Promise.promisifyAll(connection, {multiArgs: true})

// db.connectAsync()

const { Pool } = require('pg')
require("dotenv").config();
// const { Sequelize, DataTypes } = require('sequelize');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS
})

let client;
const initalizeDB = async() => {
  client = await pool.connect()
  await client.query('CREATE SCHEMA IF NOT EXISTS prodReview;');

  await client.query(`
    CREATE TABLE IF NOT EXISTS questions (
      question_id INT NOT NULL PRIMARY KEY,
      product_id INT NOT NULL,
      question_body VARCHAR(255),
      question_date VARCHAR(255),
      questionAsker_name VARCHAR(255),
      questionAsker_email VARCHAR(255),
      question_reported BOOLEAN,
      question_helpfulness INT
    );
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS answers (
      answer_id INT NOT NULL PRIMARY KEY,
      answer_body VARCHAR(255),
      answer_date VARCHAR(255),
      answerer_name VARCHAR(255),
      answerer_email VARCHAR(255),
      answer_reported VARCHAR(255),
      answer_helpfulness INT,
      question_id INT NOT NULL,
      FOREIGN KEY (question_id) REFERENCES questions(question_id)
      );
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS photos (
      photo_id INT NOT NULL PRIMARY KEY,
      answer_id INT NOT NULL,
      FOREIGN KEY (answer_id) REFERENCES answers(answer_id),
      photo_url VARCHAR(255)
      );
  `)
}
initalizeDB()

// const getRow = async () => {
//   const client = await pool.connect()
//   return client.query(`select * from "photos" WHERE "photo_id" = 29;`)
// }

module.exports.pool = pool

// COPY "questions"("question_id","product_id","question_body","question_date","questionasker_name","questionasker_email","question_reported","question_helpfulness") FROM '/Users/danielsaad/Documents/seip2303/SDC-API/questions.csv' DELIMITER','CSV HEADER;

// COPY "answers"("answer_id","question_id","answer_body","answer_date","answerer_name","answerer_email","answer_reported","answer_helpfulness") FROM '/Users/danielsaad/Documents/seip2303/SDC-API/answers.csv' DELIMITER','CSV HEADER;

// COPY "photos"("photo_id","answer_id","photo_url") FROM '/Users/danielsaad/Documents/seip2303/SDC-API/answers_photos.csv' DELIMITER','CSV HEADER;


//   .then(() => console.log(`connected to MySQL as id: ${db.threadId}`))
//   .then(() =>-
//     db.queryAsync(
//       `CREATE TABLE IF NOT EXISTS product (
//         product_id INT NOT NULL PRIMARY KEY
//       );`
//     )
//   )
//   .then(() =>
//     db.queryAsync(
//       `CREATE TABLE IF NOT EXISTS questions (
//         question_id INT NOT NULL PRIMARY KEY,
//         question_body VARCHAR(255),
//         question_date VARCHAR(255),
//         asker_name VARCHAR(255),
//         question_helpfulness INT,
//         reported BOOLEAN,
//         product_id INT NOT NULL,
//         FOREIGN KEY (product_id) REFERENCES product(product_id)
//         );`
//     )
//   )
//   .then(() =>
//     db.queryAsync(
//       `CREATE TABLE IF NOT EXISTS answers (
//         answer_id INT NOT NULL PRIMARY KEY,
//         body VARCHAR(255),
//         date VARCHAR(255),
//         answerer_name VARCHAR(255),
//         helpfulness INT,
//         question_id INT NOT NULL,
//         FOREIGN KEY (question_id) REFERENCES questions(question_id)
//         );`
//     )
//   )
//   .then(() =>
//     db.queryAsync(
//       `CREATE TABLE IF NOT EXISTS photos (
//         photo_id INT NOT NULL PRIMARY KEY,
//         photo_url VARCHAR(255),
//         answer_id INT NOT NULL,
//         FOREIGN KEY (answer_id) REFERENCES answers(answer_id)
//         );`
//     )
//   )
//   .catch((err) => console.log('this is an error', err))
// module.exports.db = db