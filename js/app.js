console.log("app running");

//$('body').css('backgroundImage','url("img/jungle_background.jpg")')

$('#feed-button').on('click', function(){
    game.feedPet();
})

$('#play-button').on('click', function(){
    game.playWithPet();
})

$('#lights-button').on('click', function(){
    game.toggleLights();
})

$('#pause-button').on('click', function(){
    game.togglePause();
})

$('.pet-container').on('mousemove', function(e){
    //console.log('test: eventlistener');
    game.movePet(e.clientX,e.clientY);
})

class Pet{
    constructor(name,age,$display, feedDelay, sleepDelay, playDelay){
        this.name = name;
        this.ageYear = age;
        this.ageMonth = 0;
        this.feedDelay = feedDelay;
        this.sleepDelay = sleepDelay;
        this.playDelay = playDelay;
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
            playing: "img/tiger_seated.png",
            sleeping:"img/tiger_sleeping.png",
            standing: "img/tiger_standing.png",
            dead: "img/tiger_dead.png",
        },
        this.state = "standing";
        this.isMoving = true;
        this.isDead = false;
    }
    age(){
        //console.log("I am aging!");
        if(this.state === "sleeping"){
            if(this.traits.sleepiness > 0){
                this.traits.sleepiness--;
            } else {
                this.neutral();
            }
        }
        if(this.ageMonth === 11){
            this.ageMonth = 0;
            this.ageYear++;
            //increase size as tiger ages up to max size
        } else {
            this.ageMonth++;
        }
        if(this.state !== "sleeping"){
            this.gremlin();
        }
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
        if(this.isMoving){
            x = x + this.width > this.boundaries.right ? this.boundaries.right - this.width  : x;
            y = y + this.height > this.boundaries.bottom ? this.boundaries.bottom - this.height : y;
            this.$display.css("left", x+"px");
            this.$display.css("top", y+"px");
        }
    }
    setImage(){
        const image = this.images[this.state];
        this.$display.attr("src",image)
    }
    neutral(){
        this.state = "standing";
        this.setImage();
    }
    feed(){
        console.log("I'm being fed!");
        this.state = "sitting";
        this.freeze(this.boundaries.right*.38,this.boundaries.bottom*.8)
        setTimeout(()=>{
            this.traits.hunger = this.traits.hunger-- < 0 ? 0: this.traits.hunger--;
            this.unfreeze();
        },this.feedDelay*this.traits.hunger)   
        //this.moving = true;
    }
    play(){
        console.log("I'm playing");
        this.state = "playing";
        this.freeze(this.boundaries.right*.5,this.boundaries.bottom*.5)
        setTimeout(()=>{
            this.traits.boredom = this.traits.boredom-- < 0 ? 0: this.traits.boredom--;
            this.unfreeze();
        },this.playDelay*this.traits.boredom)  
    }
    sleep(){
        console.log("I'm sleeping");
        this.state = "sleeping";
        this.freeze(this.boundaries.right*.5,this.boundaries.bottom*.5)
        setTimeout(()=>{
            this.traits.sleep = this.traits.sleepiness-- < 0 ? 0: this.traits.sleepiness--;
            this.unfreeze();
        },this.playDelay*this.traits.sleepiness) 
    }
    freeze(x,y){
        this.updatePosition(x,y);
        this.isMoving = false;
        this.setImage();
    }
    unfreeze(){
        this.state = "standing";
        this.setImage();
        this.isMoving = true;
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
    feedDelay: 1000,
    sleepDelay: 1000,
    playDelay: 1000,
    lightsOn: true,
    isPopUpShowing: false,
    pet: null,
    ui: {
        $body: $('body'),
        $petContainer: $('.pet-container'),
        $hungerDisplay: $('#hunger-display'),
        $boredomDisplay: $('#boredom-display'),
        $sleepinessDisplay: $('#sleepiness-display'),
        $ageYear: $('#age-year-display'),
        $ageMonth: $('#age-month-display'),
        $bowl: $('#bowl'),
        $popup: $('#pop-up'),
        $message: $('#message'),
    },
    start(){
        console.log('Starting game!');
        if(this.pet === null){
            this.createPet();
        }
        console.log(this.ui.$bowl);
        this.ui.$bowl.attr("src","img/bowl_empty.png");
        this.updateUI();
        this.startTimer();
    },
    createPet(){
        console.log("creating pet!");
        $pet = $("<img/>").addClass("pet");
        this.ui.$petContainer.append($pet);
        this.ui.$petImage = $pet;
        this.pet = new Pet("Argus",0, $pet, this.feedDelay, this.sleepDelay, this.playDelay);
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
        console.log("test: movePet()")
        this.pet.updatePosition(x,y);
    },
    feedPet(){
        console.log("feeding pet");
        console.log(this.pet);
        this.pet.feed();
        this.ui.$bowl.attr("src","img/bowl_full.png");
        setTimeout(()=>{
            this.ui.$bowl.attr("src","img/bowl_empty.png");
        },this.feedDelay)
    },
    playWithPet(){
        console.log("playing with pet");
        this.pet.play();
    },
    toggleLights(){
        this.lightsOn = !this.lightsOn;
        if(this.lightsOn){
            this.ui.$body.removeClass("dark").addClass("light");
            this.pet.neutral();
        } else {
            this.ui.$body.removeClass("light").addClass("dark");
            this.pet.sleep();
        }
    },
    togglePause(){
        this.paused = !this.paused;
    },
    togglePop(){
        this.isPopUpShowing = !this.isPopUpShowing;
        this.ui.$popup.toggleClass(function(){
            return this.isPopUpShowing ? "" : "hidden";
        });
    },
    updateUI(){
        this.ui.$boredomDisplay.text(this.pet.traits.boredom);
        this.ui.$sleepinessDisplay.text(this.pet.traits.sleepiness);
        this.ui.$hungerDisplay.text(this.pet.traits.hunger);
        this.ui.$ageYear.text(this.pet.ageYear);
        this.ui.$ageMonth.text(this.pet.ageMonth+1);
    },
    message(text){
        if(!this.isPopUpShowing){
            this.togglePop();
        }
        this.ui.$message.text(text);
    },
    clearContainer(container){
        while(container.firstChild){
            container.removeChild(container.firstChild);
        }
    }
}
game.start();