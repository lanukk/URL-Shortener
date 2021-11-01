const mongoose = require('mongoose');


const URLSchema = new mongoose.Schema({
    original_url:{
        type: String,
        required: true
    },
    short_url:{
      type: Number
    }
});


const URL = mongoose.model('URL', URLSchema);

module.exports = URL;