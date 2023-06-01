const mongoose = require("mongoose")

mongoose.connect('mongodb://127.0.0.1:27017')

const QuestionAnswersSchema = new mongoose.Schema({
  answer_id: {type: Number, required: true},
  body: String,
  date: String,
  answerer_name: String,
  helpfulness: Number,
  Photos: [{photo_id: Number, photo_url: String}]
})
const QuestionResultsSchema = new mongoose.Schema({
  question_id: {type: Number, required: true}
  question_body: String,
  question_date: String,
  asker_name: String,
  question_helpfulness: Number,
  reported: Boolean,
  answers: [QuestionAnswersSchema]
})
const QuestionSchema = new Schema({
  product_id: {type: Number, required: true},
  results: [QuestionResultsSchema],
})

const Questions = mongoose.model('Questions', QuestionSchema)