const router = require('express').Router();
let User = require('../models/user.model');

// Handles GET requests  
// Users.find() gets list of all users in database
// Returns JSON using res.json
router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Handles POST requests
// Once username retrieved, create User object and save
router.route('/add').post((req, res) => {
  const user_id = req.body.user_id;
  const device_id = req.body.device_id;
  const first_name = req.body.first_name;

  const newUser = new User({
    user_id,
    device_id,
    first_name,
  });

  newUser.save()
    .then(() => res.json('Added a user!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router; 