const mongo = require('mongoose');

mongo.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongo.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    type: mongo.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  color: {
    type: String,
    default: '#55acee',
    set: setName,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

DomoSchema.statics.findByOwner = (id, cb) => DomoModel.find({ owner: mongo.Types.ObjectId(id) })
  .lean()
  .exec(cb);

DomoModel = mongo.model('Domo', DomoSchema);

// Update existing documents in the collection with the added color field
DomoModel.updateMany({ color: { $exists: false } }, { color: '#55acee' }, (err, res) => console.log(`Domos matched:${res.n}   Domos modified:${res.nModified}`));

module.exports = {
  DomoModel,
  DomoSchema,
};
