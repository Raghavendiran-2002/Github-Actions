const Team = require('../models/team');

const AppError = require('../utils/AppError')

exports.createTeam = async (req,res,next) => {
	try {

		function randomNumber(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}

		let new_team_id = randomNumber(20,500)
		let team_unique_id = await Team.findOne({
			where:{id:new_team_id}
		});

		while(team_unique_id)
		{
			new_team_id = randomNumber(20,500)
			team_unique_id = await Team.findOne({
				where:{id:new_team_id}
			});
		}

		req.body.id = new_team_id
		const team = await Team.create(req.body);

		res.status(200).json({
			status : "success",
			message : 'Team created',
			data : {
				team
			}
		})
	} catch(err) {
		next(err)
	}
}

exports.getAllTeams = async (req,res,next) => {
	try {

		const teams = await Team.findAll({        
		order:
          [
            ['team_name', 'ASC']
          ]});

		res.status(200).json({
			status : 'success',
			message : '',
			data : {
				no_of_Teams : teams.length,
				teams
			}
		})
	} catch(err) {
		next(err)
	}
}

exports.getOneTeams = async (req,res,next) => {
	try {

		const team = await Team.findByPk(req.params.id)

		if(!team)
			return next(new AppError('Team Not Found',404))

		res.status(200).json({
			status : 'success',
			message : '',
			data : {
				team
			}
		})
	} catch(err) {
		next(err)
	}
}

exports.updateTeam = async (req,res,next) => {
	try {
		const updatedTeam = await Team.update(req.body,{where : {id : req.params.id}})

		// if(!updatedTeam[0])
		// 	return next(new AppError('Team not found',404));

		res.status(200).json({
			status : 'success',
			message : 'Team Updated',
			data : null
		})

	} catch(err) {
		next(err)
	}
}

exports.deleteTeam = async (req,res,next) => {
	try {

		const team = await Team.findByPk(req.params.id)

		if(!team)
			return next(new AppError('Team Not Found',404))

		await team.destroy();

		res.status(200).json({
			status : 'success',
			message : 'Team Deleted',
			data : null
		})

	} catch(err) {
		next(err)
	}
}