const FeaturedEvent = require('../models/featured_events_model');
const Event = require('../models/event_model');


const AppError = require('../utils/AppError')

exports.createFeaturedEvent = async (req, res, next) => {
    try {
        if (!req.body.eventId)
            return next(new AppError('Provide eventId', 400))

        const checkEvent = await Event.findByPk(req.body.eventId)

        if (!checkEvent)
            return next(new AppError('Event Not Found', 404));

        const FeaturedEvents = await FeaturedEvent.create(req.body);

        res.status(200).json({
            status: "success",
            message: 'FeaturedEvents created',
            data: {
                FeaturedEvents
            }
        })
    } catch (err) {
        next(err)
        console.log(err)
    }
}

exports.getAllFeaturedEvents = async (req, res, next) => {
    try {

        const featuredEvents = await FeaturedEvent.findAll({
            include: [
                {
                    model: Event,
                    // attributes: {exclude:['featuredEvents']}
                },
            ],
            // attribute: {exclude:['']}
        });

        res.status(200).json({
            status: 'success',
            message: '',
            data: {
                no_of_featuredEvents: featuredEvents.length,
                featuredEvents
            }
        })
    } catch (err) {
        next(err)
    }
}

exports.getOneFeaturedEvent = async (req, res, next) => {
    try {

        const featuredEvent = await FeaturedEvent.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    // attribute: {exclude:['']}
                }
            ],
        });

        if (!featuredEvent)
            return next(new AppError('FeaturedEvent not found', 404))

        res.status(200).json({
            status: 'success',
            message: '',
            data: {
                featuredEvent
            }
        })
    } catch (err) {
        next(err)
    }
}

exports.updateFeaturedEvent = async (req, res, next) => {
    try {
        const updateFeaturedEvent = await FeaturedEvent.update(req.body, { where: { id: req.params.id } });

        res.status(200).json({
            status: 'success',
            message: 'FeaturedEvent Updated',
            data: null
        })

    } catch (err) {
        next(err)
    }
}

exports.deleteFeaturedEvent = async (req, res, next) => {
    try {

        const featuredEvent = await FeaturedEvent.findByPk(req.params.id)

        if (!featuredEvent)
            return next(new AppError('FeaturedEvent Not Found', 404))

        await featuredEvent.destroy();

        res.status(200).json({
            status: 'success',
            message: 'featuredEvent Deleted',
            data: null
        })

    } catch (err) {
        next(err)
    }
}