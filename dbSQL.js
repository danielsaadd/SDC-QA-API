

const { Pool } = require('pg')
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS
})

// let client;
const initalizeDB = async() => {
  const client = await pool.connect()
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
  client?.release()
}
initalizeDB()

module.exports.pool = pool

// COPY "questions"("question_id","product_id","question_body","question_date","questionasker_name","questionasker_email","question_reported","question_helpfulness") FROM '/Users/danielsaad/Documents/seip2303/SDC-API/questions.csv' DELIMITER','CSV HEADER;

// COPY "answers"("answer_id","question_id","answer_body","answer_date","answerer_name","answerer_email","answer_reported","answer_helpfulness") FROM '/Users/danielsaad/Documents/seip2303/SDC-API/answers.csv' DELIMITER','CSV HEADER;

// COPY "photos"("photo_id","answer_id","photo_url") FROM '/Users/danielsaad/Documents/seip2303/SDC-API/answers_photos.csv' DELIMITER','CSV HEADER;


// scp -i ./AWS-launch/sdc-db-key-pair.pem ./AWS-launch/onlineproducts.pgsql ubuntu@18.117.157.110:/home/ubuntu/

// psql yelp < /home/ubuntu/yelp.pgsql

// CREATE INDEX idx_feature_id ON "Features" (feature_id);

// CREATE INDEX idx_question_product_id ON "questions" (product_id);

// CREATE INDEX idx_answers_question_id ON "answers" (question_id);

// CREATE INDEX idx_photos_answer_id ON "answers" (answer_id);

// 4.2 sec -> 2.6 sec -> 201 milsec -> 178 milsec