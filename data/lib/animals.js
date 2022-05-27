const fs = require('fs');
const path = require('path');


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
            //?any possible to happen?
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
};

function createNewAnimal(body, animalsArray){
    // console.log(body);
    // our function's main code will go here!
    const animal =body;
    animalsArray.push(animal);

    fs.writeFileSync(
        path.join(__dirname, '../animals.json'),
        //?why animals:animalsArray? what's that meaning?
        JSON.stringify({animals:animalsArray}, null, 2)
    );

    // return finished code to post route for response
    return animal;
};

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
};

module.exports={
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};