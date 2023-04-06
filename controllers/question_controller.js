const Question = require('../models/question_model');
const Event = require('../models/event_model');


const AppError = require('../utils/AppError')

exports.createQuestion = async (req, res, next) => {
    try {
        if (!req.body.eventId)
            return next(new AppError('Provide eventId', 400))

        const checkEvent = await Event.findByPk(req.body.eventId)

        if (!checkEvent)
            return next(new AppError('Event Not Found', 404));

        const questions = await Question.create(req.body);

        res.status(200).json({
            status: "success",
            message: 'questions created',
            data: {
                questions
            }
        })
    } catch (err) {
        next(err)
        console.log(err)
    }
}

exports.getAllQuestions = async (req, res, next) => {
    try {

        const questions = await Question.findAll({
            include: [
                {
                    model: Event,
                    // attributes: {exclude:['questions']}
                },
            ],
            // attribute: {exclude:['']}
        });

        res.status(200).json({
            status: 'success',
            message: '',
            data: {
                no_of_questions: questions.length,
                questions
            }
        })
    } catch (err) {
        next(err)
    }
}

exports.getOneQuestion = async (req, res, next) => {
    try {

        const question = await Question.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    // attribute: {exclude:['']}
                }
            ],
        });

        if (!question)
            return next(new AppError('Question Not Found', 404))

        res.status(200).json({
            status: 'success',
            message: '',
            data: {
                question
            }
        })
    } catch (err) {
        next(err)
    }
}

exports.updateQuestion = async (req, res, next) => {
    try {
        const updateQuestion = await Question.update(req.body, { where: { id: req.params.id } });

        res.status(200).json({
            status: 'success',
            message: 'question Updated',
            data: null
        })

    } catch (err) {
        next(err)
    }
}

exports.deleteQuestion = async (req, res, next) => {
    try {

        const question = await Question.findByPk(req.params.id)

        if (!question)
            return next(new AppError('Question Not Found', 404))

        await question.destroy();

        res.status(200).json({
            status: 'success',
            message: 'question Deleted',
            data: null
        })

    } catch (err) {
        next(err)
    }
}