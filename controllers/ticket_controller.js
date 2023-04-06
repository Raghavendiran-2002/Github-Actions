const Ticket = require("../models/ticket_model");
const Event = require("../models/event_model");
const User = require("../models/user");
const { Op } = require("sequelize");
const TeamRegister = require("../models/team_event_model");
const Refund = require("../models/refund_model");
const College = require("../models/college");
const AppError = require("../utils/AppError");

exports.createTicket = async (req, res, next) => {
  try {
    if (!req.body.eventId) return next(new AppError("Provide eventId", 400));

    const checkEvent = await Event.findByPk(req.body.eventId);

    // console

    if (!checkEvent) return next(new AppError("Event Not Found", 404));

    if (!req.body.userId) return next(new AppError("Provide userId", 400));

    const checkUser = await User.findByPk(req.body.userId);

    if (!checkUser) return next(new AppError("User Not Found", 404));

    const tickets = await Ticket.create(req.body);

    res.status(200).json({
      status: "success",
      message: "tickets created",
      data: {
        tickets,
      },
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.getAllTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        {
          model: Event,
          // attributes: {exclude:['tickets']}
        },
        {
          model: User,
          // attributes: {exclude:['tickets']}
        },
      ],
      // attribute: {exclude:['']}
    });

    res.status(200).json({
      status: "success",
      message: "",
      data: {
        no_of_tickets: tickets.length,
        tickets,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllTicketOfEvent = async (req, res, next) => {
  try {
    const id = req.params.id;

    const tickets = await Ticket.findAll({
      where: {
        eventId: id,
      },
    });

    res.status(200).json({
      status: "success",
      message: "tickets of one event",
      data: {
        no_of_tickets: tickets.length,
        tickets,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.generateTicket = async (id, no, next) => {
  try {
    const arr = [];

    for (let i = 0; i < no; ++i) {
      arr.push({
        eventId: id,
        ticketType: 2,
      });
    }

    const ticket = await Ticket.bulkCreate(arr);

    return ticket;
  } catch (err) {
    next(err);
  }
};

exports.getOneTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [
        {
          model: Event,
          // attribute: {exclude:['']}
        },
        {
          model: User,
          // attributes: {exclude:['tickets']}
        },
      ],
    });

    if (!ticket) return next(new AppError("Ticket Not Found", 404));

    res.status(200).json({
      status: "success",
      message: "",
      data: {
        ticket,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTicket = async (req, res, next) => {
  try {
    const updateTicket = await Ticket.update(req.body, {
      where: { id: req.params.id },
    });

    res.status(200).json({
      status: "success",
      message: "ticket Updated",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) return next(new AppError("Ticket Not Found", 404));

    await TeamRegister.destroy({
      where : {
        ticketId : ticket.id
      }
    })

    await ticket.destroy();

    res.status(200).json({
      status: "success",
      message: "ticket Deleted",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.bookTicketedEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;

    await Ticket.update(
      {
        status: "available",
        userId: null,
      },
      {
        where: {
          status: "blocked",
          exp: { [Op.lte]: Date.now() },
        },
      }
    );
    // console.log(Date.now());
    const checkevent = await Event.findOne({
      where: {
        id: eventId,
        event_type: 2,
      },
    });

    const checkTicket = await Ticket.findOne({
      where: { eventId: eventId, userId: req.user.id },
    });

    if (checkTicket) return next(new AppError("User Has Already Registered", 409));

    if (!checkevent) return next(new AppError("Ticketed Event Not Found", 404));

    const ticket = await Ticket.findOne({
      where: {
        eventId: eventId,
        status: "available",
      },
    });

    if (!ticket) return next(new AppError("Ticket Not Available", 404));

    ticket.userId = req.user.id;
    ticket.status = "blocked";
    ticket.exp = Date.now() + 1000 * 60 * 0.5; // 1 min

    await ticket.save();

    //Generate Payment

    res.status(200).json({
      status: "success",
      message: "ticket blocked pay to book",
      data: {
        ticket,
      },
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.bookTicketWebhook = async (req, res, next) => {
  try {
    // Hash validate after redirect

    const ticketId = req.query.id;
    const userId = req.query.userId;
    const eventId = req.query.eventId;

    const ticket = await Ticket.findOne({
      where: {
        id: ticketId,
        userId: userId,
        status: "blocked",
      },
    });

    // console.log(ticket);

    if (!ticket) {
      const newTicket = await Ticket.findOne({
        where: { status: "available" },
      });
      console.log(newTicket);

      if (!newTicket) {
        const refund = await Refund.create({
          tnxId: "paymentID",
          amount: 10, // get amount from webhook
          userId: userId,
          eventId: eventId,
        });

        return res.status(200).json({
          status: "success",
          message: "refund will be provided",
          data: {
            refund,
          },
        });
      }

      newTicket.userId = userId;
      newTicket.ticketType = 2;
      newTicket.status = "booked";

      await newTicket.save();

      return res.status(200).json({
        status: "success",
        message: "ticket booked",
        data: {
          ticket: newTicket,
        },
      });
    }

    ticket.userId = userId;
    ticket.ticketType = 2;
    ticket.status = "booked";

    await ticket.save();

    return res.status(200).json({
      status: "success",
      message: "ticket booked",
      data: {
        ticket: ticket,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllRefunds = async (req, res, next) => {
  try {
    const refunds = await Refund.findAll({});

    res.status(200).json({
      status: "success",
      message: "all refunds",
      data: {
        no_of_refunds: refunds.length,
        refunds,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.myTickets = async (req, res, next) => {
  try {
    const tickets = await TeamRegister.findAll({
      include: [
        {
          model: Event,
        },
      ],
      where: {
        user_email: req.user.email,
      },
      order: [["updatedAt", "DESC"]],
    });

    // console.log(members)

    var members = []


    // tickets.forEach( async (el) => {
    //   const mem = await TeamRegister.findAll({
    //     ticketId : el.ticketId
    //   })

    //   const team = mem.map(el2 => {
    //     return el2.userEmail
    //   })

    //   console.log({
    //     ticketId : el.ticketId,
    //     team
    //   });

    //   // members.push({
    //   //   ticketId : el.ticketId,
    //   //   team
    //   // })

    //   members = [...members,"testStr"]
    // })

    // console.log(members)

    res.status(200).json({
      status: "success",
      message: "user tickets",
      data: {
        no_of_tickets: tickets.length,
        tickets,members
      },
    });
  } catch (err) {
    next(err);
  }
};


exports.getTeamOfTicket = async (req,res,next) => {
  try {
    const ticketId = req.params.ticketId;

    const team = await TeamRegister.findAll({
      where : {
        ticket_id : ticketId
      }
    })

    const teamEmail = team.map(el => {
      return el.user_email
    })

    const users = await User.findAll({where : {
      email : {
        [Op.in] : teamEmail
      }
    },
    include : College
  })


    const fulldetails = team.map(el => users.find(el2 => el.user_email == el2.email))

    res.status(200).json({
      status : 'success',
      message : 'team members',
      data : {
        team : fulldetails
      }
    })
  } catch(err) {
    next(err)
  }
}

exports.userTicket = async (req, res, next) => {
  try {
    // console.log(req.params.id)

    const tickets = await Ticket.findAll({
      where: {
        userId: req.params.id,
      },
      order: [["updatedAt", "DESC"]],
    });

    res.status(200).json({
      status: "success",
      message: "user tickets",
      data: {
        no_of_tickets: tickets.length,
        tickets,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.myTeamTickets = async (req, res, next) => {
  try {
    if (req.user.teamId == null)
      throw new AppError("User Does Not Have Team", 400);

    const ticket = await Ticket.findAll({
      where: {
        teamId: req.user.teamId,
      },
      include: [
        {
          model: Event,
        },
      ],
    });

    ticket


    res.status(200).json({
      status: "success",
      message: "your team tickets",
      data: {
        no_of_tickets: ticket.length,
        ticket,
      },
    });
  } catch (err) {
    next(err);
  }
};
