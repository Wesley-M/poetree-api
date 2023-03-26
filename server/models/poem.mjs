import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const poemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        unique: true,
        required: true
    },
    author: {
        type: String,
        required: true
    }
});

poemSchema.plugin(mongoosePaginate);

export default mongoose.model('Poem', poemSchema);