const Event = require("../models/event_model");
const Team = require("../models/team");
const Ticket = require("../models/ticket_model");
const User = require("../models/user");
const Qn = require("../models/question_model");
const Ans = require("../models/answer_model");
const { Op } = require("sequelize");

const AppError = require("../utils/AppError");

exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: Team,
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    res.status(200).json({
      status: "success",
      message: "All events",
      data: {
        no_of_events: events.length,
        events,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllPendingEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: Team,
        },
      ],
      where: {
        event_status: 0,
      },
      order: [["updatedAt", "ASC"]],
    });

    res.status(200).json({
      status: "success",
      message: "pending events",
      data: {
        no_of_events: events.length,
        events,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllApprovedEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: Team,
        },
      ],
      where: {
        event_status: 1,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Approved events",
      data: {
        no_of_events: events.length,
        events,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllRejectedEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: Team,
        },
      ],
      where: {
        event_status: 2,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Rejected events",
      data: {
        no_of_events: events.length,
        events,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllCommingSoonEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: Team,
        },
      ],
      where: {
        event_status: 3,
      },
    });

    res.status(200).json({
      status: "success",
      message: "CommingSoon events",
      data: {
        no_of_events: events.length,
        events,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllClosedEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: Team,
        },
      ],
      where: {
        event_status: 4,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Closed events",
      data: {
        no_of_events: events.length,
        events,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.eventStatusChange = async (req, res, next) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    if (status == null) return next(new AppError("Please Provide Status", 400));

    const event = await Event.findByPk(id);

    if (!event) return next(new AppError("Event Not Found", 404));

    if ((status == 3 || status == 4) && !event.event_status)
      return next(
        new AppError(
          "Event is in pending so status cannot changed to type 3 or 4",
          400
        )
      );

    event.event_status = status;

    await event.save();

    res.status(200).json({
      status: "success",
      message: "updated event",
      data: {
        event,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserAnsForEvent = async (req,res,next) => {
  try {
    const eventId = req.body.eventId;
    const userId = req.body.userId;

    if(!eventId || !userId)
      throw new AppError('Provide EventId and UserId',400);

    const qn =  await Qn.findAll({where : {eventId : eventId}})

    if(!qn)
      throw new AppError('No Questions Found For This Event',404);

    const ans = await Ans.findAll({where : {
      eventId : eventId,
      userId : userId
    }});

    // console.log(await Ans.findAll())

    if(!ans)
      throw new AppError('No Answer Provided By The User',404)

    res.status(200).json({
      status : 'success',
      message : "user questions and answers",
      data : {
        questions : qn,
        answers : ans
      }
    })
  } catch(err)  {
    next(err)
  }
}

