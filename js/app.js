console.log("app running");

$('#feed-button').on('click', function(){
    game.feedPet();
})

$('#play-button').on('click', function(){
    game.playWithPet();
})

$('#lights-button').on('click', function(){
    game.toggleLights();
})

class Pet{
    constructor(name,age){
        this.name = name;
        this.age = age;
        this.hunger = 0;
        this.sleepiness = 0;
        this.boredom = 0;
        this.ui = {
            $petContainer: $('.pet-container'),
        }
    }
    feed(){
        console.log("I'm being fed!");
    }
    play(){
        console.log("I'm playing");
    }
    sleep(){
        console.log("I'm sleeping");
    }
}

const game = {
    lightsOn: false,
    pet: null,
    start(){
        console.log('Starting game!');
        if(this.pet === null){
            this.createPet();
        }
    },
    createPet(){
        console.log("creating pet!");
        this.pet = new Pet("Argus",13);
        $pet = $("<div/>").addClass("pet");
    },
    feedPet(){
        console.log("feeding pet");
        console.log(this.pet);
        this.pet.feed();
    },
    playWithPet(){
        console.log("playing with pet");
        this.playWithPet();
    },
    toggleLights(){
        this.lightsOn = !this.lightsOn;

    },
    showModal(){

    },
    clearContainer(container){
        while(container.firstChild){
            container.removeChild(container.firstChild);
        }
    }
}
game.start();