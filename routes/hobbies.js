const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Hobby Model
require('../models/Hobby');
const Hobby = mongoose.model('hobbies');

// Hobby Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Hobby.find({user: req.user.id})
    .sort({date:'desc'})
    .then(res => {
      res.json();
      });
    });

// Add Hobby Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('hobbies/add');
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if(!req.body.name){
    errors.push({text:'Please add a hobby'});
  }

  if(errors.length > 0){
    res.render('/add', {
      errors: errors,
      hobbyname: req.body.name,
    });
  } else {
    const newUser = {
      name: req.body.name,
      user: req.user.id
    }
    new Hobby(newUser)
      .save()
      .then(hobby => {
        req.flash('success_msg', 'Hobby added');
        res.redirect('/hobbies');
      })
  }
});

// Delete Hobby
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Hobby.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Hobby removed');
      res.redirect('/hobbies');
    });
});

module.exports = router;