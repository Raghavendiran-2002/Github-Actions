const Answer = require('../models/answer_model');
const User = require('../models/user');
const Question = require('../models/question_model');

const AppError = require('../utils/AppError')

exports.createAnswer = async (req,res,next) => {
	try {
        if(!req.body.userId)
			return next(new AppError('Please Provide UserId',400))

		const checkUser = await User.findByPk(req.body.userId)

		if(!checkUser)
			return next(new AppError('User Not Found',404));
        
        if(!req.body.questionId)
			return next(new AppError('Provide QuestionId',400))

		const checkQuestion = await Question.findByPk(req.body.questionId)

		if(!checkQuestion)
			return next(new AppError('Question Not Found',404));

		const answer = await Answer.create(req.body);

		res.status(200).json({
			status : "success",
			message : 'Answer created',
			data : {
				answer
			}
		})
	} catch(err) {
		next(err)
		console.log(err)
	}
}

exports.getAllAnswers = async (req, res, next) => {
	try {

		const answers = await Answer.findAll({include:[
            {
                model:User
            },
            {
                model:Question,
                // attributes: {exclude:['answer']}
            }],
            // attribute: {exclude:['']}
        });

		res.status(200).json({
			status : 'success',
			message : '',
			data : {
				no_of_answers : answers.length,
				answers
			}
		})
	} catch(err) {
		next(err)
	}
}

exports.getOneAnswer = async (req,res,next) => {
	try {

		const answer = await Answer.findByPk(req.params.id,{include:[
            {
                model:User
            },
            {
                model:Question,
                // attributes: {exclude:['answer']}
            }],
            // attribute: {exclude:['']}
        });

		if(!answer)
			return next(new AppError('Answer Not Found',404))

		res.status(200).json({
			status : 'success',
			message : '',
			data : {
				answer
			}
		})
	} catch(err) {
		next(err)
	}
}

exports.updateAnswer = async (req,res,next) => {
	try {
		const updateAnswer = await Answer.update(req.body,{where : {id : req.params.id}});

		res.status(200).json({
			status : 'success',
			message : 'Answer Updated',
			data : null
		})

	} catch(err) {
		next(err)
	}
}

exports.deleteAnswer = async (req,res,next) => {
	try {

		const answer = await Answer.findByPk(req.params.id)

		if(!answer)
			return next(new AppError('Answer Not Found',404))

		await answer.destroy();

		res.status(200).json({
			status : 'success',
			message : 'Answer Deleted',
			data : null
		})

	} catch(err) {
		next(err)
	}
}