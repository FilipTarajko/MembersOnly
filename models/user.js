var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        firstname: {type: String, required: true, minLength: 1, maxLength: 100},
        lastname: {type: String, required: true, minLength: 1, maxLength: 100},
        username: {type: String, required: true, minLength: 1, maxLength: 100},
        password: {type: String, required: true, minLength: 1, maxLength: 100},
        membership: {type: String, required: true, minLength: 1, maxLength: 100, default: 'guest'}
    }
)

UserSchema
.virtual('fullname')
.get(function(){
    return firstname+' '+lastname;
});

module.exports = mongoose.model('User', UserSchema);