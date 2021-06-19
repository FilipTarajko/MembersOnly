var User = require('./models/user');
var Message = require('./models/message');
var async = require('async');
const bcrypt = require("bcryptjs");
const {body, validationResult} = require('express-validator');
const passport = require('passport');
require('dotenv').config()

exports.register_get = function(req, res, next) {
    res.render('register', {title: 'Register'});
};

exports.register_post = [
    body('firstname', 'First name must be specified').trim().isLength({min:1, max:100}).escape(),
    body('lastname', 'Last name must be specified').trim().isLength({min:1, max:100}).escape(),
    body('username', 'Username  must be specified').trim().isLength({min:1, max:100}).escape(),
    body('password', 'Password must be specified').trim().isLength({min:1, max:100}).escape(),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    (req, res, next)=>{
        User.find({username: req.body.username})
        .exec(function (err, searchedUsername){
            if(err){return next(err);}
            if(searchedUsername.length){
                res.render('register', {title: 'Register', message: 'Username is already taken!'});
            }
            else{
                const errors = validationResult(req);
                bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                    if(err) {return next(err);}
                    const user = new User({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        username: req.body.username,
                        password: hashedPassword
                    });
                    if(!errors.isEmpty()){
                        res.render('register', {title: 'Register', errors: errors.array()});
                    }
                    else
                    {
                        user.save(function(err){
                            if(err) {return next(err);}
                            res.redirect('/login');
                        })
                    }
                });
            }
        })
    }
]

exports.login_get = function(req, res, next){
    res.render('login', {title: 'Log in'});
};

exports.login_post = passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/register"
})

exports.messages_get = function(req,res,next){
    Message.find()
    .populate('author')
    .exec(function (err, list_messages){
        if(err){return next(err);}
        res.render('index', {messages: list_messages});
    });
};

exports.logout_get = function(req,res,next){
    req.logout();
    res.redirect('/login');
}

exports.membership_get = function(req,res,next){
    if(req.user){res.render('membership');}
    res.redirect('/login');
}

exports.membership_post = [
    body('membershippassword', 'You have to enter membership password first!').trim().isLength({min:1, max:100}).escape(),
    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('membership', {message: 'You have to enter membership password first!'});
        }
        var role='';
        if(req.body.membershippassword == process.env.ADMIN_PASSWORD){role='admin'}
        else if(req.body.membershippassword == process.env.MEMBER_PASSWORD){role='member'}
        else if(req.body.membershippassword == process.env.GUEST_PASSWORD){role='guest'}
        if(role)
        {
            var user = new User(
                {
                    firstname: req.user.firstname,
                    lastname: req.user.lastname,
                    username: req.user.username,
                    password: req.user.passport,
                    membership: role,
                    _id: req.user._id
                })
            User.findByIdAndUpdate(req.user._id, user, {}, function(err, updateduser){
                if(err) {return next(err);}
                res.redirect('/');
            });
        }
        else{
            res.render('membership', {message: 'Wrong membership password!'});
        }
    }
]

exports.message_create_post = [
    body('title', 'Title must be specified and at most 100 characters long').trim().isLength({min:1, max:100}).escape(),
    body('text', 'Text must be specified and at most 100 characters long').trim().isLength({min:1, max:100}).escape(),
    (req,res,next)=>{
        const errors=validationResult(req);
        var message = new Message(
            {
                title: req.body.title,
                text: req.body.text,
                author: req.user._id
            });
        if(!errors.isEmpty()){
            res.render('index', {errors: errors.array()});
        }
        else{
            message.save(function(err){
                if(err){return next(err);}
                res.redirect('/')
            });
        }
    }
]

exports.message_delete_post = function(req,res,next){
    Message.findByIdAndRemove(req.body.messageid, function deleteMeessage(err){
        if(err){return next(err);}
        res.redirect('/');
    });
}