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
        this.ageYear = age;
        this.ageMonth = 0;
        this.hunger = 0;
        this.sleepiness = 0;
        this.boredom = 0;
        this.state = "sitting";
    }
    age(){
        //console.log("I am aging!");
        if(this.state === "sleeping"){
            this.sleepiness = this.sleepiness-- > 0 ? 0: this.sleepiness--;
        }
        if(this.ageMonth === 11){
            this.ageMonth = 0;
            this.ageYear++;
        } else {
            this.ageMonth++;
        }
    }
    feed(){
        console.log("I'm being fed!");
        this.state = "sitting";
        this.hunger = this.hunger-- > 0 ? 0: this.hunger--;
    }
    play(){
        console.log("I'm playing");
        this.state = "standing";
        this.boredom = this.boredom-- > 0 ? 0: this.boredom--;
    }
    sleep(){
        console.log("I'm sleeping");
        this.state = "sleeping";
    }
}

const game = {
    ageRate: 200,
    timer: null,
    lightsOn: true,
    pet: null,
    ui: {
        $body: $('body'),
        $petContainer: $('.pet-container'),
        $hungerDisplay: $('#hunger-display'),
        $boredomDisplay: $('#boredom-display'),
        $sleepinessDisplay: $('#sleepiness-display'),
        $ageYear: $('#age-year-display'),
        $ageMonth: $('#age-month-display'),
    },
    start(){
        console.log('Starting game!');
        if(this.pet === null){
            this.createPet();
        }
        this.updateUI();
        this.startTimer();
    },
    createPet(){
        console.log("creating pet!");
        $pet = $("<img/>").addClass("pet");
        $pet.attr("src","img/tiger_seated.png")
        this.ui.$petContainer.append($pet);
        this.ui.$petImage = $pet;
        this.pet = new Pet("Argus",0);
    },
    startTimer(){
        this.timer = setInterval(()=>{
            this.pet.age();
            this.updateUI();
        },this.ageRate)
    },
    stopTimer(){
        clearInterval(this.timer);
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
        if(this.lightsOn){
            this.ui.$body.removeClass("dark").addClass("light");
        } else {
            this.ui.$body.removeClass("light").addClass("dark");
        }
    },
    setPetState(){

    },
    showModal(){

    },
    updateUI(){
        this.ui.$boredomDisplay.text(this.pet.boredom);
        this.ui.$sleepinessDisplay.text(this.pet.sleepiness);
        this.ui.$hungerDisplay.text(this.pet.hunger);
    },
    clearContainer(container){
        while(container.firstChild){
            container.removeChild(container.firstChild);
        }
    }
}
game.start();