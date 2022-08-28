const express = require('express');
const router = express.Router();
const Locations = require('../models/locations.js');

//===============
//=== Show All Locations
//===============
router.get('/', (req,res) => {
    Locations.find({},(err, allLocations) => {
        res.json(allLocations);
    });
});

//===============
//=== Show One Location
//===============
router.get('/:id', (req, res) => {
    Locations.findById(req.params.id, (err,foundLocation) => {
        res.json(foundLocation)
    })
})
//===============
//=== Create New Location
//===============
router.post('/', (req,res) => {
    Locations.create(req.body, (error, newLocation) => {
        res.json(newLocation);
    });
});

//===============
//=== Edit A Location
//===============
router.put('/:id', (req,res) => {
    Locations.findByIdAndUpdate(req.params.id, req.body, (err, updatedLocation) => {
        res.json(updatedLocation);
    });
});


//===============
//=== Delete A Location
//===============
router.delete('/:id', (req, res) => {
    Locations.findByIdAndDelete(req.params.id, (err, deletedLocation) => {
        res.json(deletedLocation);
    });
});

module.exports = router;
