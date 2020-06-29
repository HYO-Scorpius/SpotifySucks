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


// CRUD for specific user based on id

router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
      .then(user => res.json(user))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  

  router.route('/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
      .then(() => res.json('User detail removed.'))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  

  router.route('/update/:id').post((req, res) => {
    User.findById(req.params.id)
      .then(user => {
        user.user_id = req.body.user_id;
        user.device_id = req.body.device_id;
        user.first_name = req.body.first_name;
  
        // Save changes
        user.save()
          .then(() => res.json('The User has been updated.'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
  });

module.exports = router; 