const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();
const User = require('../server/Schema/UserSchema')
const Quiz = require('../server/Schema/QuizSchemaModel')
dotenv.config();
const Auth = require('../server/MiddleWare/Auth')
const axios = require('axios')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

//To countinue backend server dont go on downtime ---Ignore this request
const url = `https://msmayank250-gmail-com-cuvette-final.onrender.com/test`; // Replace with your Render URL
const interval = 30000; // Interval in milliseconds (30 seconds)

const reloadWebsite = async (req,res) =>{
  try{
    await axios.get(url)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
     }catch(e){
      console.log(e)
     }
  
}

setInterval(reloadWebsite, interval);

app.get('/test', (req, res) => {
  res.json({ message: 'This is a test response' });
});

const isUserLoggedin = (req, res, next) => {
    if (req.user && req.user.id) {
        next();
    } else {
        res.status(401).json({ status: 'Unauthorized' });
    }
};


const handleErrors = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ status: 'Failed', message: 'Something went wrong' });
};

// Routes

app.post('/quiz/create',Auth,isUserLoggedin, async (req, res) => {
    try {
      console.log('Request body:', req.body);
      const userId = req.user.id;
      console.log('User ID:', userId);
  
      const { quizName, selectedQuizType, questions } = req.body;
      
      if (!quizName || !selectedQuizType || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ status: 'Failed', message: 'Invalid input data' });
      }
      
      const quiz = new Quiz({ quizName, selectedQuizType, questions, userId });
      await quiz.save();
      
      res.status(201).json({ status: 'Success', message: 'Quiz created successfully', quizId: quiz._id });
    } catch (error) {
      console.error('Error creating quiz:', error);
      res.status(500).json({ status: 'Failed', message: 'Internal server error' });
    }
  });
  


app.patch('/quiz/:quizId/updateEdit', async (req, res) => {
    try {
        const { quizId } = req.params;
        const { quizName, selectedQuizType, questions } = req.body;
        if (!quizId || !quizName || !selectedQuizType || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ status: 'Failed', message: 'Invalid input data' });
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            { quizName, selectedQuizType, questions },
            { new: true, runValidators: true }
        );

        if (!updatedQuiz) {
            return res.status(404).json({ status: 'Failed', message: 'Quiz not found' });
        }

        res.status(200).json({ status: 'Success', message: 'Quiz updated successfully', quizId: updatedQuiz._id });
    } catch (error) {
        handleErrors(error, req, res);
    }
});


app.patch('/quiz/:quizID/update', async (req, res) => {
    try {
      const { questionResults } = req.body;
      const quiz = await Quiz.findById(req.params.quizID);
      
      if (!quiz) {
        return res.status(404).send('Quiz not found');
      }
  
      questionResults.forEach(result => {
        const question = quiz.questions.id(result.questionId);
        if (question) {
          question.totalRight = (question.totalRight || 0) + (result.isCorrect ? 1 : 0);
          question.totalWrong = (question.totalWrong || 0) + (result.isCorrect ? 0 : 1);
        }
      });
  
      await quiz.save();
  
      res.json({
        totalRight: quiz.questions.reduce((sum, q) => sum + (q.totalRight || 0), 0),
        totalWrong: quiz.questions.reduce((sum, q) => sum + (q.totalWrong || 0), 0),
      });
    } catch (error) {
      console.error('Error updating quiz:', error);
      res.status(500).send('Server error');
    }
  });


  app.get('/quiz/:quizId/analysis', async (req, res) => {
    const { quizId } = req.params;

    try {
        // Fetch the quiz by ID
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Prepare analysis data
        const analysis = quiz.questions.map((question) => ({
            questionNumber: question.questionNumber,
            questionText: question.questionText,
            totalRight: question.totalRight,
            totalWrong: question.totalWrong,
        }));

    

        const totalQuestions = quiz.questions.length;
        res.json({
            quizName: quiz.quizName,
            totalQuestions,
            questions: analysis,
        });
    } catch (error) {
        console.error('Error fetching quiz analysis:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/poll/:quizId/analysis', async (req, res) => {
    const { quizId } = req.params;

    try {
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const analysis = quiz.questions.map((question) => ({
            questionNumber: question.questionNumber,
            questionText: question.questionText,
            optionType :question.optionType,
            totalRight: question.totalRight,
            totalWrong: question.totalWrong,
        }));
        const pollAnalysis = quiz.questions.map((question) => 
            question.options.map((option) => ({
                text: option.text,
                imgUrl :option.imageUrl,
                pollCount: option.pollCount
            }))
        );
    



        res.json({
            quizName: quiz.quizName,
            questions: analysis,
            poll :pollAnalysis
        });
    } catch (error) {
        console.error('Error fetching quiz analysis:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
  

app.get('/quiz/getQuizData',Auth,isUserLoggedin, async (req, res) => {
    try {
        const userId = req.user.id;
        const quiz = await Quiz.find({userId})
        res.json(quiz);
    } catch (error) {
        handleErrors(error, req, res);
    }
});

app.post('/quiz/submitQuiz',Auth, async (req, res) => {
    try {
        const { answers } = req.body;
        const score = answers.length;
        res.json({ score });
    } catch (error) {
        handleErrors(error, req, res);
    }
});

app.get('/quiz/:quizId', async (req, res) => {
    const { quizId } = req.params;
    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
        return res.status(400).json({ message: 'Invalid or missing quiz ID' });
    }
    try {
        const quiz = await Quiz.findById(quizId);
        
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/quizzes',Auth,isUserLoggedin, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const quizzes = await Quiz.find({userId}).sort({ createdAt: -1 }); 
        res.status(200).json({ status: 'Success', quizzes });
    } catch (error) {
        handleErrors(error, req, res);
    }
});

app.delete('/quiz/:quizId', async (req, res) => {
    const { quizId } = req.params;
  
    try {

      const result = await Quiz.findByIdAndDelete(quizId);
  
      if (result) {

        res.status(200).json({ message: 'Quiz deleted successfully' });
      } else {

        res.status(404).json({ message: 'Quiz not found' });
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

app.patch('/quiz/:quizID/incrementViewCount', async (req, res) => {
    const { quizID } = req.params;
    try {
      const quiz = await Quiz.findById(quizID);
      if (quiz) {
        quiz.viewCount += 1;
        await quiz.save();
        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ error: 'Quiz not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get('/quiz/:quizID/viewCount', async (req, res) => {
    const { quizID } = req.params;
    try {
      const quiz = await Quiz.findById(quizID);
      if (quiz) {
        res.status(200).json({ viewCount: quiz.viewCount });
      } else {
        res.status(404).json({ error: 'Quiz not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.patch('/quiz/:quizID/questions/:questionIndex/options/:optionId/incrementCount', async (req, res) => {
    const { quizID, questionIndex, optionId } = req.params;

    try {
        const quiz = await Quiz.findById(quizID);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const question = quiz.questions[questionIndex];
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const option = question.options.id(optionId);
        if (!option) {
            return res.status(404).json({ message: 'Option not found' });
        }

        option.pollCount += 1;
        await quiz.save();

        res.status(200).json({ message: 'Option count incremented successfully', option });
    } catch (error) {
        console.error('Error incrementing option count:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/verify-token', (req, res) => {
  const { token } = req.body;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    res.json({ decoded });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token has expired.' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Invalid token.' });
    } else {
      res.status(500).json({ message: 'Token verification failed.', error: error.message });
    }
  }
});


app.post('/users/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
 
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: 'User Already Exists' });
        }

        const encryptedPass = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: encryptedPass });
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1h' });


        res.status(201).json({ status: 'Success', message: 'User signed up successfully', token });
    } catch (error) {
        handleErrors(error, req, res);
    }
});

app.post('/users/login', async (req, res) => {
    try {
         
        const { email, password } = req.body;

        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(400).json({ status: 'Failed', message: 'Incorrect credentials' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ status: 'Failed', message: 'Incorrect credentials' });
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: '1h' } 
        );



        res.json({ status: 'Success', message: 'User logged in successfully', token ,userId : user._id});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ status: 'Failed', message: 'Internal server error' });
    }
});

app.post('/dashboard', isUserLoggedin, (req, res) => {
    res.send('Dashboard');
});

app.listen(process.env.PORT, () => {
    if (!process.env.MONGO_URL) {
        throw new Error('MONGO_URL is not defined');
    }
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log(`Server is up at port ${process.env.PORT} and Mongoose is connected`))
        .catch((error) => console.error('Mongoose connection error:', error));
});

app.use(handleErrors);
