const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    originalName:{type: String, required:true},
    cloudinaryUrl:{type: String, required: true},
    cloudinaryId:{type: String, required: true}
});

module.exports= mongoose.model("File",fileSchema);