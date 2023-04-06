const router = require('express').Router();

const college = require('./college');
const team = require('./team');
const user = require('./user');
const accomodation = require('./accomodation_route');
const answer = require('./answer_route');
const event = require('./event_route');
const featuredEvent = require('./featured_events_route');
const question = require('./question_route');
const admin = require('./admin');
const ticket = require('./ticket_route');
const transaction = require('./transaction_route');

router.use('/college', college);
router.use('/team',team);
router.use('/user',user);
router.use('/accomodation',accomodation);
router.use('/answer',answer);
router.use('/event',event);
router.use('/featuredEvents',featuredEvent);
router.use('/question',question);
router.use('/ticket',ticket);
router.use('/transaction',transaction);
router.use('/admin',admin);

module.exports = router;