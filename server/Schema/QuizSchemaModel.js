const mongoose = require('mongoose')

const optionSchema = new mongoose.Schema({
  text: String,
  imageUrl:String,
  isCorrect: Boolean,
  pollCount :{
      type :Number,
      default :0
  }
});

const questionSchema = new mongoose.Schema({
  questionNumber: Number,
  questionText: String,
  timer: String,
  optionType: {
      type: String,
      required: true,
  },
  options: [optionSchema],
  totalRight:{
      type:Number,
      default :0,
  },
  totalWrong: {
          type: Number,
          default : 0,
      }
  
  

});

const quizSchema = new mongoose.Schema({
  quizName: {
      type: String,
      required: true,
  },
  selectedQuizType: {
      type: String,
      required: true,
  },
  questions: [questionSchema],
  impressions:{
      type:Number,
      default :0,
  },
  viewCount:{
      type:Number,
      default :0,
  },
  createdAt: {
      type: Date,
      default: Date.now,
  },
  updatedAt: {
      type: Date,
      default: Date.now,
  },
  userId :{
    type :mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
});


module.exports = mongoose.model('Quiz', quizSchema);