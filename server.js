const express = require ('express');
const { animals }=require('./data/animals.json');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app=express();

//parse incoming string or array data
app.use(express.urlencoded({extended:true}));
//parse incoming JSON data
app.use(express.json());

app.use(express.static('public'));

function filterByQuery(query,animalsArray){
    let personalityTraitArray=[];
    //note that we save the animalArray as filteredResult here
    let filteredResults=animalsArray;

    if (query.personalityTraits){
        //Save personality Traits as a dedicated array
        //if personalityTraits is a string, place it into a new array and save.
        //typeof is the operator rteturns a string indicating the type of the unevaluated operand. 
        if(typeof query.personalityTraits === "string"){
            personalityTraitArray=[query.personalityTraits];
        }else{
            personalityTraitArray=query.personalityTraits;
        }

        //loop through each trait in the personalityTraits array:
        personalityTraitArray.forEach(trait=>{
            //check the trait against each animal in the filteredResults array.
            //Remember, it is initially a copy of the animalsArray,
            //but here we're updating it for each trait in the .forEach() loop.
            //for each trait being targed by the filter, the filteredResults array will then contain only the entries that contain the trait,
            //so at the end we'll have an array of animals that have every one 
            //of the traits when the .forEach() loop is finished.
            filteredResults=filteredResults.filter(
                //what's this?
                animal=>animal.personalityTraits.indexOf(trait) !== -1
            );
        });

    }
    if (query.diet){
        filteredResults=filteredResults.filter(animal => animal.diet === query.diet);

    }
    if (query.species){
        filteredResults=filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name){
        filteredResults=filteredResults.filter(animal=>animal.name === query.name);
    }
    return filteredResults;
};

function findById(id,animalsArray){
    //?why use [0]?
    const result=animalsArray.filter(animal=>animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray){
    // console.log(body);
    // our function's main code will go here!
    const animal =body;
    animalsArray.push(animal);

    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        //?why animals:animalsArray? what's that meaning?
        JSON.stringify({animals:animalsArray}, null, 2)
    );

    // return finished code to post route for response
    return animal;
}

function validateAnimal(animal){
    if(!animal.name || typeof animal.name !== 'string'){
        return false;
    }
    if(!animal.species || typeof animal.species !== 'string'){
        return false;
    }
    if(!animal.diet || typeof animal.diet !== 'string'){
        return false;
    }
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)){
        return false;
    }

    return true;
}

app.get('/api/animals',(req,res)=>{
    //is this animals the varity of {animals} at beginning? 
    let results=animals;
    if (req.query){
        results=filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res)=>{
    //is this animals the varity of {animals} at beginning? 
    const result = findById(req.params.id, animals);
    if (result){
        res.json(result);
    } else{
        res.send(404);
    }
});


//where is proper middleware?
app.post('/api/animals',(req,res)=>{
    //req.body is where our incoming content will be
    //set id based on what the next index of the array will be
    req.body.id=animals.length.toString();

    //add animal to json file and animals array in this function
    //if any data in req.body is incorrect, send 400 error back
    if(!validateAnimal(req.body)){
        res.status(400).send('The animal is not properly formatted')
    }else{
    //?is req.body represent all info in the array/object? (name, species diet ...)?
    const animal = createNewAnimal(req.body, animals);

    res.json(animal);
    }
});

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/animals',(req,res)=>{
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
  });
//need to be on this order. otherwise it will take precedence over named routes.
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/index.html'));
});

app.listen(PORT, ()=>{
    console.log(`API server now on port ${PORT}!`);
});

