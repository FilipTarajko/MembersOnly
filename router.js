var express = require('express');
var router = express.Router();
var controller = require('./controller');

// user create get
router.get('/register', controller.register_get);

// user create post
router.post('/register', controller.register_post);

// logout get
router.get('/logout', controller.logout_get);

// login get
router.get('/login', controller.login_get);

// login post
router.post('/login', controller.login_post);

// membership get
router.get('/membership', controller.membership_get);

// membership post
router.post('/membership', controller.membership_post);

// message create post
router.post('/sendmessage', controller.message_create_post);

// message delete post
router.post('/deletemessage', controller.message_delete_post);

// messages get
router.get('/', controller.messages_get);

module.exports = router;