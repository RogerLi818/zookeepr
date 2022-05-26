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

