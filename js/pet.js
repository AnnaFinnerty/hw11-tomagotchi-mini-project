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
            boredom: 1,
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
        if(this.isMoving){
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
    }
    play(){
        console.log("I'm playing");
        this.state = "playing";
        this.freeze(this.boundaries.right*.5,this.boundaries.bottom*.5);
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
        this.freeze();
        this.setImage();
    }
}