const express = require('express');

const router = express.Router();
const User = require('../models/user');

router.post('/', (req, res, next) => {
  const user = new User({
    name: req.body.name,
    city: req.body.city,
    email: req.body.email,
  })
  user.save()
    .then((result) => {
      res.send(result)
    })
    .catch(next)
})

router.get('/all', (req, res, next) => {
  User.find()
    .then((result) => {
      res.send(result);
    })
    .catch(next)
})

router.get('/:id', (req, res, next) => {
  User.findOne({_id: req.params.id})
    .then((result) => {
      res.send(result)
    })
    .catch(next);
})

router.delete('/:id', (req, res, next) => {
  User.findOneAndDelete({_id: req.params.id})
    .then((result) => {
      res.send(result)
    })
    .catch(next)
})

router.put('/:id', (req, res, next) => {
  console.log(req.body)
  User.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true,
  })
    .then((result) => {
      res.send(result)
    })
    .catch((err) => console.log(err))
})

module.exports = router;