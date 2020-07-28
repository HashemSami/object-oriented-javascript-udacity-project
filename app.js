
// function for loading JSON file
function readTextFile(file, callback) {
    const rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

// Create Dino Constructor
function Dino ({species, weight, height, diet, where, when, fact}) {
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.where = where;
    this.when = when;
    this.fact = fact;
    this.facts = [];
}

// method for loading object image
Dino.prototype.loadImage = function(){
    const image = document.createElement("img");
    image.src = `images/${this.species.toLowerCase()}.png`;
    return image;
}

// method for fetching facts
Dino.prototype.getFacts = function(){

    const where = `Was found in ${this.where}`;
    const when = `Was leveing in ${this.when} time`;

    this.facts.push(where, when, this.fact);
    
    return this.facts;
}

// Create Pigeon constructor
// inherit properies from Dino constructor
function Pigeon({species, weight, height}){
    Dino.call(this, {species, weight, height})
    this.fact = 'All birds are dinosaurs.';
}
Pigeon.prototype = Object.create(Dino.prototype);
Pigeon.prototype.constructor = Pigeon;


// Create Dino Objects
// Create Pigeon object
let pigeon;
const dinos = [];
readTextFile("dino.json", function(text){
    const data = JSON.parse(text);
    data.Dinos.forEach((dino)=>{
        if(!(dino.species === "Pigeon")){
            dinos.push(new Dino(dino));
        }else{
            pigeon = new Pigeon(dino);
        }
    })
});



// Create Human Object
const human = (function(){

    let privateName = '';
    let privateHeight = 0;
    let privateWeight = 0;
    let privateDiet = '';

    function privateCreateHuman(name, height, weight, diet){
        privateName = name;
        privateHeight = height;
        privateWeight = weight;
        privateDiet = diet;
    }

    function publicLaodImage(){
        const image = document.createElement("img");
        image.src = `images/human.png`;
        return image;
    }

    function publicGetHuman(){
        return{
            name: privateName,
            height: privateHeight,
            weight: privateWeight,
            diet: privateDiet
        }
    }

    function publicCreateHuman(name, height, weight, diet){
        privateCreateHuman(name, height, weight, diet);
    }

    return{
        getHumanObject : publicGetHuman,
        createHumanObject : publicCreateHuman,
        loadImage : publicLaodImage
    }
}())

// Use IIFE to get human data from form
const getHumanData = (function(){
    // grab elements
    const form = document.getElementById('dino-compare');
    const nameInput = document.getElementById('name');
    const heightInput = document.getElementById('inches');
    const weightInput = document.getElementById('weight');
    const dietInput = document.getElementById('diet');
    form.addEventListener('submit', function(e){
        e.preventDefault();
        human.createHumanObject(nameInput.value, heightInput.value, weightInput.value, dietInput.value.toLowerCase());
        form.style.display = "none";
        generateTiles();
    })
}())

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches. 
Dino.prototype.compareHeight = function(humanHeight){
    let result = "";
    if(!humanHeight) result = "Please provide a height to compare your heights.";
    if(!(this.height === humanHeight)){
        result = this.height > humanHeight?
                `It is ${this.height - humanHeight} inches taller than you.`:
                `It is ${humanHeight - this.height} inches shorter than you.`;
    }else{
        result = `You both have the same height of ${this.height} inches.`;
    }
    this.facts.push(result);
}

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareWeight = function(humanWeight){
    let result = "";
    if(!humanWeight) result = "please provide a weight to compare your weights.";
    if(!(this.weight === humanWeight)){
        result = this.weight > humanWeight? 
                `It is ${this.weight - humanWeight} pounds heavier than you.`:
                `It is ${humanWeight - this.weight} pounds lighter than you.`;
    }else {
        result = `you both have the same weight of ${this.weight} pounds.`;
    }
    this.facts.push(result);
}

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareDiet = function(humanDiet){
    let result = "";
    if(!humanDiet) result = "please provide a diet to compare your dietes.";
    if(this.diet === humanDiet){
        result = `You both have the same ${this.diet} diet.`;
    } else {
        result = `It is ${this.diet} and you are a ${humanDiet}.`;
    }
    this.facts.push(result);
}

// comparing users with dinos
const compare = () => {
    const {height, weight, diet} = human.getHumanObject();
    dinos.forEach((dino) => {
        dino.compareHeight(height);
        dino.compareWeight(weight);
        dino.compareDiet(diet);
    })

}

// get random fact
const getRandomFact = (facts) => {
    const randomNumber = Math.floor(Math.random() * 6);
    switch(randomNumber){
        case 0:
            return facts[0];
        case 1:
            return facts[1];
        case 2:
            return facts[2];
        case 3:
            return facts[3];
        case 4:
            return facts[4];
        case 5:
            return facts[5];
        default:
            return facts[0];
    };
}

// Generate Tiles for each Dino in Array
const generateTiles = () =>{
    const grid = document.getElementById('grid');
    compare()

    for(let i=0 ; i<=8 ; i++){
        // create tile element
        const tile = document.createElement("div");
        // add class name to element
        const gridItem = "grid-item";
        const arr = tile.className.split(" ");
        if (arr.indexOf(gridItem) == -1) {
            tile.className += " " + gridItem;
        }

        const title = document.createElement("h3");
        const p = document.createElement("p");
         
        grid.appendChild(tile)
        tile.appendChild(title)
        tile.appendChild(p)

        if(i === 4){
            const {name} = human.getHumanObject();
            title.innerHTML = name;
            const img = human.loadImage();
            tile.appendChild(img);
        }else if(i === 7){
            const dino = dinos[4];
            title.innerHTML = dino.species;
            p.innerHTML = getRandomFact(dino.getFacts());
            const img = dino.loadImage();
            tile.appendChild(img);
        }else if(i === 8){
            const dino = pigeon;
            title.innerHTML = dino.species;
            p.innerHTML = dino.fact;
            const img = dino.loadImage();
            tile.appendChild(img);
        }else{
            const dino = dinos[i];
            title.innerHTML = dino.species;
            p.innerHTML = getRandomFact(dino.getFacts());
            const img = dino.loadImage();
            tile.appendChild(img);
        }
    }
}
