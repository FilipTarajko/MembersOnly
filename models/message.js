var mongoose = require('mongoose');
const {DateTime} = require('luxon');

var Schema = mongoose.Schema;

var MessageSchema = new Schema(
    {
        author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        timestamp: {type: Date, default: Date.now},
        title: {type: String, required: true, minLength: 3, maxLength: 100},
        text: {type: String, required: true, minLength: 3, maxLength: 100}
    }
)

MessageSchema
.virtual('timestamp_formatted')
.get(function(){
    return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_SHORT);
})

module.exports = mongoose.model('Message', MessageSchema);