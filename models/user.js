import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  identification: {type: String, required: [true, 'Identification mandatory']},
  name: {type: String, required: [true, 'Name mandatory']},
  country: {type: String, required: [true, 'Country mandatory']},
  date:{type: Date, default: Date.now},
});

const User = mongoose.model('User', userSchema);

export default User;
