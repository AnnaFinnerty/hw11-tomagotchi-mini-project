console.log("app running");

$('body').css('backgroundImage','url("img/jungle_background.jpg")')

$('#feed-button').on('click', function(){
    game.feedPet();
})

$('#play-button').on('click', function(){
    game.playWithPet();
})

$('#lights-button').on('click', function(){
    game.toggleLights();
})

$('#pauase-button').on('click', function(){
    game.togglePause();
})

$('.pet-container').on('mousemove', function(e){
    game.movePet(e.clientX,e.clientY);
})

class Pet{
    constructor(name,age,$display){
        this.name = name;
        this.ageYear = age;
        this.ageMonth = 0;
        this.$display = $display;
        this.width = $display.width();
        this.height = $display.height();
        this.traits = {
            hunger: 0,
            sleepiness: 0,
            boredom: 0,
        }
        this.boundaries = {
            left: 0,
            right: $('.pet-container').width(),
            top: 0,
            bottom: $('.pet-container').height(),
        }
        this.images = {
            sitting: "img/tiger_seated.png",
            standing: "img/tiger_standing.png",
            dead: "img/tiger_standing.png",
        },
        this.state = "standing";
        this.isDead = false;
    }
    age(){
        //console.log("I am aging!");
        if(this.state === "sleeping"){
            this.traits.sleepiness = this.traits.sleepiness-- > 0 ? 0: this.traits.sleepiness--;
        }
        if(this.ageMonth === 11){
            this.ageMonth = 0;
            this.ageYear++;
        } else {
            this.ageMonth++;
        }
        this.gremlin();
    }
    gremlin(){
        const chanceSomethingHappens = Math.random();
        //mtc increase with age?
        if(chanceSomethingHappens < .5){
            const traits = Object.keys(this.traits);
            const r = Math.floor(Math.random()*traits.length);
            this.traits[traits[r]] += 1;
            if(this.traits[traits[r]] >= 10){
                this.die();
            }
        }
    }
    updatePosition(x,y){
        //prevent pet from hitting boundaries
        x = x + this.width > this.boundaries.right ? this.boundaries.right - this.width  : x;
        y = y + this.height > this.boundaries.bottom ? this.boundaries.bottom - this.height : y;
        this.$display.css("left",x+"px");
        this.$display.css("top",y+"px");
    }
    setImage(){
        const image = this.images[this.state];
        this.$display.attr("src",image)
    }
    feed(){
        console.log("I'm being fed!");
        this.state = "sitting";
        this.hunger = this.traits.hunger-- > 0 ? 0: this.traits.hunger--;
    }
    play(){
        console.log("I'm playing");
        this.state = "playing";
        this.boredom = this.traits.boredom-- > 0 ? 0: this.traits.boredom--;
    }
    sleep(){
        console.log("I'm sleeping");
        this.state = "sleeping";
    }
    die(){
        this.isDead = true;
        this.state = "dead";
    }
}

const game = {
    paused: false,
    ageRate: 1000,
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
        this.ui.$petContainer.append($pet);
        this.ui.$petImage = $pet;
        this.pet = new Pet("Argus",0, $pet);
        this.pet.setImage();
    },
    startTimer(){
        this.timer = setInterval(()=>{
            if(this.pet.isDead){
                this.stopTimer();
                //console.log("pet has died");
            } else {
                this.pet.age();
                this.updateUI();
            }
        },this.ageRate)
    },
    stopTimer(){
        clearInterval(this.timer);
    },
    movePet(x,y){
        this.pet.updatePosition(x,y);
    },
    feedPet(){
        console.log("feeding pet");
        console.log(this.pet);
        this.pet.feed();
        this.pet.setImage();
    },
    playWithPet(){
        console.log("playing with pet");
        this.pet.play();
        this.pet.setImage();
    },
    toggleLights(){
        this.lightsOn = !this.lightsOn;
        if(this.lightsOn){
            this.ui.$body.removeClass("dark").addClass("light");
        } else {
            this.ui.$body.removeClass("light").addClass("dark");
        }
    },
    togglePause(){

    },
    updateUI(){
        this.ui.$boredomDisplay.text(this.pet.traits.boredom);
        this.ui.$sleepinessDisplay.text(this.pet.traits.sleepiness);
        this.ui.$hungerDisplay.text(this.pet.traits.hunger);
        this.ui.$ageYear.text(this.pet.ageYear);
        this.ui.$ageMonth.text(this.pet.ageMonth+1);
    },
    clearContainer(container){
        while(container.firstChild){
            container.removeChild(container.firstChild);
        }
    }
}
game.start();