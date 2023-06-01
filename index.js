require("dotenv").config();
const express = require('express')
const {pool} = require("./dbSQL");
// const { Sequelize, DataTypes } = require('sequelize');

const app = express();

app.use(express.json())

app.get('/qa/questions', async (request, response) => {
  try {
    const client = await pool.connect();
    const questionQuery = `
      SELECT * FROM questions
      WHERE product_id = ${request.query.product_id}
      LIMIT ${request.query.count ? request.query.count : 5} OFFSET ${request.query.page ? request.query.page : 1};
    `;
    const questions = await client.query(questionQuery);
    const questionIds = questions.rows.map((question) => question.question_id);
    const answersQuery = `
      SELECT
        a.answer_id,
        a.answer_body,
        a.answer_date,
        a.answerer_name,
        a.answerer_email,
        a.answer_reported,
        a.answer_helpfulness,
        a.question_id,
        p.photo_id,
        p.photo_url
      FROM answers a
      LEFT JOIN photos p ON a.answer_id = p.answer_id
      WHERE a.question_id IN (${questionIds.join(', ')})
    `;
    const answers = await client.query(answersQuery);
    // Combine questions and answers based on question_id
    const combinedData = questions.rows.map((question) => {
      const questionId = question.question_id;
      const relatedAnswers = answers.rows.filter((answer) => answer.question_id === questionId);
      const formattedAnswers = relatedAnswers.map((answer) => {
        return {
          id: answer.answer_id,
          body: answer.answer_body,
          date: answer.answer_date,
          answerer_name: answer.answerer_name,
          helpfulness: answer.answer_helpfulness,
          photos: relatedAnswers
            .filter((a) => a.answer_id === answer.answer_id)
            .map((a) => ({ photo_id: a.photo_id, photo_url: a.photo_url })),
        };
      });

      return {
        ...question,
        answers: formattedAnswers,
      };
    });

    let resultData = {
      product_id: undefined,
      results: []
    }

    combinedData.map(data => {
      resultData.product_id = data.product_id
      let question = {
        "question_id": data.question_id,
        "question_body": data.question_body,
        "question_date": data.question_date,
        "asker_name": data.questionasker_name,
        "question_helpfulness": data.question_helpfulness,
        "reported": data.question_reported,
        "answers": {}
      }
      let mapAnswers = data.answers.map(answer => {
        console.log('this is answer', answer)
        question.answers[answer.id] = answer
        if (answer.photos[0].photo_id === null) {
          answer.photos = []
        }
      })
      resultData.results.push(question)
    })

    response.json(resultData);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(process.env.PORT);
console.log(`Listening at http://localhost:${process.env.PORT}`);
