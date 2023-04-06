const College = require('../models/college');

const AppError = require('../utils/AppError');

exports.createCollege = async (req, res, next) => {
	try {

		function randomNumber(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}

		let new_college_id = randomNumber(2407, 9999).toString()
		let college_unique_id = await College.findOne({
			where: { id: new_college_id }
		});

		while (college_unique_id) {
			new_college_id = randomNumber(2407, 30000).toString()
			college_unique_id = await College.findOne({
				where: { id: new_college_id }
			});
		}

		const college = await College.create({
			id: new_college_id,
			college_name: req.body.college_name,
			points: req.body.points
		});

		res.status(200).json({
			status: "success",
			message: 'college created',
			data: {
				college
			}
		})
	} catch (err) {
		next(err)
		console.log(err)
	}
}

exports.getAllColleges = async (req, res, next) => {
	try {

		const colleges = await College.findAll({
			order:
				[
					['college_name', 'ASC']
				],
		});

		res.status(200).json({
			status: 'success',
			message: '',
			data: {
				no_of_colleges: colleges.length,
				colleges
			}
		})
	} catch (err) {
		next(err)
	}
}

exports.getOneColleges = async (req, res, next) => {
	try {

		const college = await College.findByPk(req.params.id)

		if (!college)
			return next(new AppError('College Not Found', 404))

		res.status(200).json({
			status: 'success',
			message: '',
			data: {
				college
			}
		})
	} catch (err) {
		next(err)
	}
}

exports.updateCollege = async (req, res, next) => {
	try {
		const updatedCollege = await College.update(req.body, { where: { collegeId: req.params.id } })

		// if(!updatedCollege[0])
		// 	return next(new AppError('college not found',404));

		res.status(200).json({
			status: 'success',
			message: 'college Updated',
			data: null
		})

	} catch (err) {
		next(err)
	}
}

exports.deleteCollege = async (req, res, next) => {
	try {

		const college = await College.findByPk(req.params.id)

		if (!college)
			return next(new AppError('College Not Found', 404))

		await college.destroy();

		res.status(200).json({
			status: 'success',
			message: 'College Deleted',
			data: null
		})

	} catch (err) {
		next(err)
	}
}