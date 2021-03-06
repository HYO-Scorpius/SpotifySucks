const router = require('express').Router();
let Queue = require('../models/queue.model');

router.route('/').get((req, res) => {
  Queue.find()
    .then(queue => res.json(queue))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const user_id = req.body.user_id;
  const track_id = req.body.track_id;
  const device_id = req.body.device_id;
  const date = Date.parse(req.body.date);

  const newQueue = new Queue({
    user_id,
    track_id,
    device_id,
    date,
  });

  newQueue.save()
  .then(() => res.json('Track added to the Queue!'))
  .catch(err => res.status(400).json('Error: ' + err));
});


// Returns item based on id value
router.route('/:id').get((req, res) => {
  Queue.findById(req.params.id)
    .then(queue => res.json(queue))
    .catch(err => res.status(400).json('Error: ' + err));
});

// removes item 
router.route('/:id').delete((req, res) => {
  Queue.findByIdAndDelete(req.params.id)
    .then(() => res.json('Queue detail removed.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// edits item and saves changes
router.route('/update/:id').post((req, res) => {
  Queue.findById(req.params.id)
    .then(queue => {
      queue.user_id = req.body.user_id;
      queue.track_id = req.body.track_id;
      queue.device_id = req.body.device_id;
      queue.date = Date.parse(req.body.date);

      queue.save()
        .then(() => res.json('Queue has been updated.'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;