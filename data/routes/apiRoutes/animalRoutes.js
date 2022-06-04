const router=require('express').Router();
const {filterByQuery, findById, createNewAnimal, validateAnimal} = require('../../lib/animals');
const{animals}=require('../../animals.json');


router.get('/animals',(req,res)=>{
    //is this animals the varity of {animals} at beginning? yes
    let results=animals;
    if (req.query){
        results=filterByQuery(req.query, results);
    }
    res.json(results);
});

router.get('/animals/:id', (req, res)=>{
    //is this animals the varity of {animals} at beginning? yes
    const result = findById(req.params.id, animals);
    if (result){
        res.json(result);
    } else{
        res.send(404);
    }
});


//where is proper middleware?
router.post('/animals',(req,res)=>{
    //req.body is where our incoming content will be
    //set id based on what the next index of the array will be
    req.body.id=animals.length.toString();

    //add animal to json file and animals array in this function
    //if any data in req.body is incorrect, send 400 error back
    if(!validateAnimal(req.body)){
        res.status(400).send('The animal is not properly formatted')
    }else{
    //?is req.body represent all info in the array/object? (name, species diet ...)? body is for API POST with. 
    const animal = createNewAnimal(req.body, animals);

    res.json(animal);
    }
});

module.exports=router;