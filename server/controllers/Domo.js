const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const maker = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const savePromise = new Domo.DomoModel({
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
    color: req.body.color,
  }).save();

  savePromise.then(() => res.json({ redirect: '/maker' }));

  savePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return savePromise;
};

const getDomos = (req, res) => Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }
  return res.json({ domos: docs });
});

const domoPage = (req, res) => Domo.DomoModel.find({}).lean().exec((err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }

  // Form a "join" on the domos with the usernames of their respective owners
  const jd = [];

  docs.forEach((d) => models.Account.AccountModel.findOne({ _id: d.owner }, (e, doc) => jd.push({
    name: d.name,
    age: d.age,
    color: d.color,
    owner: doc.username,
  })));

  return res.render('domos', { domos: jd });
});

module.exports = {
  makerPage,
  maker,
  getDomos,
  domoPage,
};
