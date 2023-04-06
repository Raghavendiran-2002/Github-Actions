const Transaction = require('../models/transaction_model');
const Event = require('../models/transaction_model');
const User = require('../models/user');

const AppError = require('../utils/AppError')

exports.createTransaction = async (req, res, next) => {
    try {
        if (!req.body.eventId)
            return next(new AppError('Provide eventId', 400))

        const checkEvent = await Event.findByPk(req.body.eventId)

        if (!checkEvent)
            return next(new AppError('Event Not Found', 404));
        
        if (!req.body.userId)
            return next(new AppError('Provide userId', 400))

        const checkUser = await Event.findByPk(req.body.userId)

        if (!checkUser)
            return next(new AppError('User Not Found', 404));

        const transactions = await Transaction.create(req.body);

        res.status(200).json({
            status: "success",
            message: 'transactions created',
            data: {
                transactions
            }
        })
    } catch (err) {
        next(err)
        console.log(err)
    }
}

exports.getAllTransactions = async (req, res, next) => {
    try {

        const transactions = await Transaction.findAll({
            include: [
                {
                    model: Event,
                    // attributes: {exclude:['transactions']}
                },
                {
                    model: User,
                    // attributes: {exclude:['transactions']}
                }
            ],
            // attribute: {exclude:['']}
        });

        res.status(200).json({
            status: 'success',
            message: '',
            data: {
                no_of_transactions: transactions.length,
                transactions
            }
        })
    } catch (err) {
        next(err)
    }
}

exports.getOneTransaction = async (req, res, next) => {
    try {

        const transaction = await Transaction.findByPk(req.params.id, {
            include: [
                {
                    model: Event,
                    // attribute: {exclude:['']}
                },
                {
                    model: User,
                    // attributes: {exclude:['transactions']}
                }
            ],
        });

        if (!transaction)
            return next(new AppError('Transaction Not Found', 404))

        res.status(200).json({
            status: 'success',
            message: '',
            data: {
                transaction
            }
        })
    } catch (err) {
        next(err)
    }
}

exports.updateTransaction = async (req, res, next) => {
    try {
        const updateTransaction = await Transaction.update(req.body, { where: { id: req.params.id } });

        res.status(200).json({
            status: 'success',
            message: 'transaction Updated',
            data: null
        })

    } catch (err) {
        next(err)
    }
}

exports.deleteTransaction = async (req, res, next) => {
    try {

        const transaction = await Transaction.findByPk(req.params.id)

        if (!transaction)
            return next(new AppError('Transaction Not Found', 404))

        await transaction.destroy();

        res.status(200).json({
            status: 'success',
            message: 'transaction Deleted',
            data: null
        })

    } catch (err) {
        next(err)
    }
}