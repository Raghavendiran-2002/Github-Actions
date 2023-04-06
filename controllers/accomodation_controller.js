const Accomodation = require('../models/accomodation_model');
const User = require('../models/user');

const AppError = require('../utils/AppError')

exports.createAccomodation = async (req,res,next) => {
	try {
		if(!req.body.userId)
			return next(new AppError('Please Provide UserId',400))

			// check the field name is equal to teh col name in DB
		const checkUser = await User.findByPk(req.body.userId)

		if(!checkUser)
			return next(new AppError('User Not Found',404));

		const accomodation = await Accomodation.create(req.body);

		res.status(200).json({
			status : "success",
			message : 'Accomodation Created',
			data : {
				accomodation
			}
		})
	} catch(err) {
		next(err)
		console.log(err)
	}
}

exports.getAllAccomodations = async (req, res, next) => {
	try {

		const accomodations = await Accomodation.findAll({include:User});

		res.status(200).json({
			status : 'success',
			message : '',
			data : {
				no_of_accomodations : accomodations.length,
				accomodations
			}
		})
	} catch(err) {
		next(err)
	}
}

exports.getOneAccomodation = async (req,res,next) => {
	try {

		const accomodation = await Accomodation.findByPk(req.params.id,
            {
                include:User
            });

		if(!accomodation)
			return next(new AppError('Accomodation Not Found',404))

		res.status(200).json({
			status : 'success',
			message : '',
			data : {
				accomodation
			}
		})
	} catch(err) {
		next(err)
	}
}

exports.updateAccomodation = async (req,res,next) => {
	try {
		const updatedAccomodation = await Accomodation.update(req.body,{where : {id : req.params.id}});

		res.status(200).json({
			status : 'success',
			message : 'Accomodation Updated',
			data : null
		})

	} catch(err) {
		next(err)
	}
}

exports.deleteAccomodation = async (req,res,next) => {
	try {

		const accomodation = await Accomodation.findByPk(req.params.id)

		if(!accomodation)
			return next(new AppError('Accomodation Not Found',404))

		await aollege.destroy();

		res.status(200).json({
			status : 'success',
			message : 'Accomodation Deleted',
			data : null
		})

	} catch(err) {
		next(err)
	}
}