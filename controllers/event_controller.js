const Event = require("../models/event_model");
const Team = require("../models/team");
const Ticket = require("../models/ticket_model");
const Qn = require("../models/question_model");
const Ans = require("../models/answer_model");
const User = require("../models/user");
const TeamRegister = require("../models/team_event_model");
const { Op } = require("sequelize");
const { generateTicket } = require("./ticket_controller");
const Sequelize = require('sequelize')
const AppError = require("../utils/AppError");

exports.createEvent = async (req, res, next) => {
  try {
    if (!req.body.teamId) throw new AppError("Provide TeamId", 400);

    const checkTeam = await Team.findByPk(req.body.teamId);

    if (!checkTeam) throw new AppError("Team Not Found", 404);

    if (req.body.event_type == 2 && !req.body.capacity)
      throw new AppError("Provide Capacity", 400);

    const event = await Event.create(req.body);

    if (event.event_type == 2) {
      await generateTicket(event.id, event.capacity, next);
    }

    let question;

    if (req.body.question) {
      const qn = req.body.question.map((el) => {
        return {
          question: el,
          eventId: event.id,
        };
      });

      question = await Qn.bulkCreate(qn);

      // console.log(question)
    }

    res.status(200).json({
      status: "success",
      message: "Event created",
      data: {
        event,
        question,
      },
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.getEventCategory = async (req,res,next) => {
  try {
    const cat = await Event.findAll({
      attributes: [
        // specify an array where the first element is the SQL function and the second is the alias
        [Sequelize.fn('DISTINCT', Sequelize.col('category')) ,'category'],

        // specify any additional columns, e.g. country_code
        // 'country_code
    ],
    where:{is_deleted : false,
      [Op.or]: [{ event_status: 1 }, { event_status: 3 }, { event_status: 4 }]
    }
    })

    const category = cat.map(el => {
      return el["category"]
    })

    res.status(200).json({
      status : 'success',
      message : "categorys",
      data : {
        category 
      }
    })
  } catch(err) {
    next(err)
  }
}

exports.getAllEvents = async (req, res, next) => {
  try {
    const queryObj = { ...req.query }
    console.log(queryObj)
    // 1) filter
    // 2) paging
    // 3) sorting
    let limit = req.query.limit || 10;
    let page = req.query.page || 1
    let offset = (page - 1) * limit;
    let events;

      events = await Event.findAndCountAll({ include: [
        {
          model: Team,
          // attributes: {exclude:['event']}
        },
      ],
      where: {
        is_deleted: false,
        // category : category_string,
        [Op.or]: [{ event_status: 1 }, { event_status: 3 }, { event_status: 4 }],
      },
        
        offset: offset,
        limit: limit,
        order:
          [
            ['start_date', 'ASC'],
            ['event_name', 'ASC']
          ],
      })
  
    

    // if(req.params.category)
    // {
    //   events = await Event.findAndCountAll({ include: [
    //     {
    //       model: Team,
    //       // attributes: {exclude:['event']}
    //     },
    //   ],

    //   offset: offset,
    //     limit: limit,
    //     order:
    //       [
    //         ['start_date', 'ASC'],
    //         ['event_name', 'ASC']
    //       ],
          
    //   where: {
    //     is_deleted: false,
    //     category : req.params.category,
    //     [Op.or]: [{ event_status: 1 }, { event_status: 3 }, { event_status: 4 }],
    //   },
        
        
    //   })
  
    // }

    res.status(200).json({
      status: "success",
      message: "",
      data: {
        no_of_events: events.rows.length,
        total_events : events.count,
        events : events.rows,
      },
    });
  } catch (err) {
    next(err);
    console.log(err)
  }
};

exports.getEventByCategory = async (req, res, next) => {
  try {
    const queryObj = { ...req.query }
    console.log(queryObj)
    
    let limit = req.query.limit || 10;
    let page = req.query.page || 1
    let offset = (page - 1) * limit;
    // let events;

    const events = await Event.findAndCountAll({ include: [
      {
        model: Team,
        // attributes: {exclude:['event']}
      },
    ],
    where: {
      is_deleted: false,
      category : req.params.category,
      [Op.or]: [{ event_status: 1 }, { event_status: 3 }, { event_status: 4 }],
    },
    offset: offset,
        limit: limit,
        order:
          [
            ['start_date', 'ASC'],
            ['event_name', 'ASC']
          ],
      
    })


    res.status(200).json({
      status: "success",
      message: "",
      data: {
        no_of_events: events.rows.length,
        total_events : events.count,
        events : events.rows,
      },
    });
  } catch (err) {
    next(err);
    console.log(err)
  }
};

exports.getOneEvent = async (req, res, next) => {
  try {
    const event = await Event.findOne({
      include: [
        {
          model: Team,
          // attribute: {exclude:['']}
        },
      ],
      where:{
        id: req.params.id,
        is_deleted : false}
    });

    if (!event) return next(new AppError("Event Not Found", 404));

    const question = await Qn.findAll({
      where: {
        eventId: event.id,
      },
    });

    res.status(200).json({
      status: "success",
      message: "",
      data: {
        event,
        question,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const updateevent = await Event.update(req.body, {
      where: { 
        is_deleted: false,
        id: req.params.id}
    });

    res.status(200).json({
      status: "success",
      message: "Event Updated",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) return next(new AppError("Event Not Found", 404));

    event.is_deleted = true;

    await event.save();

    res.status(200).json({
      status: "success",
      message: "Event Deleted",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.registerEvent = async (req, res, next) => {
  try {
    const eventId = req.body.eventId;
    const userId = req.user.id;
    const ticketType = req.body.ticketType;

    if (!eventId) return next(new AppError("Provide EventId", 400));

    if (ticketType == null)
      return next(new AppError("Provide TicketType", 400));

    const event = await Event.findOne({
      where: {
        id: eventId,
        is_deleted: false,
        event_status: 1,
      },
    });

    if (!event) return next(new AppError("Event Not Found", 404));

    const question = await Qn.findAll({
      where: {
        eventId: event.id,
      },
    });

    if (question.length && !req.body.answers.length)
      throw new AppError("Please Provide Answers", 400);

    if (event.event_type == 2)
      return next(new AppError("This is a Ticketed Event", 400));

    if (event.event_type == 1 && req.user.teamId == null)
      throw new AppError("This is a Team Event Please Add Team Members", 400);
    // const user = await User.findByPk(eventId);

    // if(!user)
    //     return next(new AppError('user not found',404));

    const checkTicket = await TeamRegister.findOne({
      where: { eventId: eventId, user_email: req.user.email },
    });

    if (checkTicket)
      return next(new AppError("You Have Already Registered For This Event", 409));

    // if (ticketType == 0 && !req.user.is_paid && !(req.user.personType ==0)) {
    //   // if(req.user.is_paid)
    //   return next(new AppError("user not paid to participate", 400));
    // }

    //Chech for ticketed event (ticketType == 2)

    // console.log(eventId)

    const ticket = await Ticket.create({
      eventId: eventId,
      // userId: userId,
      ticketType: ticketType,
      status: "booked",
    });

    await TeamRegister.create({
      user_email: req.user.email,
      ticket_id : ticket.id,
      eventId : event.id
    })

    if (event.event_type == 1) {
      ticket.teamId = req.user.teamId;
    } else if (event.event_type == 0) {
      ticket.userId = userId;
    }

    await ticket.save();

    let ans;

    if (req.body.answers.length) {
      ans = req.body.answers.map((el) => {
        return {
          eventId: event.id,
          userId: req.user.id,
          questionId: el.questionId,
          answer: el.answer,
        };
      });

      console.log(ans)

      await Ans.bulkCreate(ans);
    }

    // await Ans.

    res.status(200).json({
      status: "success",
      message: "ticket created",
      data: {
        ticket,
        ans,
      },
    });
  } catch (err) {
    console.log(err)
    next(err);
  }
};

exports.teamEventRegister = async (req, res, next) => {
  try {
    const eventId = req.body.eventId;
    const ticketType = req.body.ticketType;
    const team = req.body.teamMembers;
    console.log(req.body)

    if (!eventId || (ticketType==null))
      throw new AppError("Please Provide eventId , ticketType");
    
    const event = await Event.findByPk(eventId);
    // console.log(event)

    if (event.event_type == 1 && !team)
      throw new AppError("This is a Team Event Please Provide teamMembers");


    if (ticketType == 0 && !req.user.is_paid) {
      // if(req.user.is_paid)
      return next(new AppError("Please Make the Payment to Participate", 400));
    }


    if (!event) throw new AppError("Event Not Found", 404);

    const question = await Qn.findAll({
      where: {
        eventId: event.id,
      },
    });

    if (question.length !=0  && !req.body.answers)
      throw new AppError("Provide Answers", 400);
    
    if (team.length == 0 && event.event_type == 1)
      throw new AppError("This is a Team Event Please Provide teamMembers", 400);

    let regTeam = [];
    let ticket;

    if(team.length != 0){
      const userIds = team.map((el) => {
        regTeam.push({
          user_email: el.email,
          eventId: event.id,
        });
        return el.email;
      });
      // let userIds = [];
      userIds.push(req.user.email);
      console.log(userIds)
      regTeam.push({
        user_email: req.user.email,
        eventId: event.id,
      });
  
      const checkUser = await TeamRegister.findAll({
        where: {
          eventId: event.id,
          user_email: {
            [Op.in]: userIds,
          },
        },
      });
  
      // console.log(checkUser);
  
      if (checkUser.length)
        throw new AppError(checkUser, 4090);
  
      ticket = await Ticket.create({
        eventId: event.id,
        teamEmails: userIds,
        status: "booked",
        ticketType: ticketType,
      });
  
      regTeam = regTeam.map(el => {
        el.ticket_id = ticket.id
        return el;
      })
      // console.log(regTeam)
      await TeamRegister.bulkCreate(regTeam);
    }
    
    if(team.length == 0){
      ticket = await Ticket.create({
        eventId: event.id,
        status: "booked",
        ticketType: ticketType,
      });
    }
    


    let ans;

    if (req.body.answers.length) {
      ans = req.body.answers.map((el) => {
        return {
          eventId: event.id,
          userId: req.user.id,
          questionId: el.questionId,
          answer: el.answer,
        };
      });

      await Ans.bulkCreate(ans);
    }

    res.status(200).json({
      status: "success",
      message: "team register success",
      data: {
        ticket,
      },
    });
    // const teamId = crypto.randomBytes(20).toString("hex");
  } catch (err) {
    next(err);
  }
};

