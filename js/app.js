console.log("app running");

$('#feed-button').on('click', function(){
    game.feedPet();
})

$('#play-button').on('click', function(){
    game.playWithPet();
})

$('#lights-button').on('click', function(){
    game.letPetSleep();
})

$('#pause-button').on('click', function(){
    game.togglePause();
})

$('.pet-container').on('mousemove', function(e){
    //console.log('test: eventlistener');
    game.movePet(e.clientX,e.clientY);
})

$('#close-pop').on('click',function(){
    game.togglePop();
})



const game = {
    paused: false,
    ageRate: 1000,
    timer: null,
    feedDelay: 1000,
    sleepDelay: 1000,
    playDelay: 1000,
    lightsOn: true,
    isPopUpShowing: false,
    testMode: true,
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
        $popup: $('.pop-up'),
        $message: $('#message'),
    },
    start(){
        console.log('Starting game!');
        this.ui.$bowl.attr("src","img/bowl_empty.png");
        
        if(this.pet === null){
            if(this.testMode){
                this.createPet("Argus");
            } else {
                this.requestNamePrompt();
            }
        } else {
            this.startTimer();
            this.updateUI();
        }
    },
    requestNamePrompt(){
        $('#close-pop').addClass("hidden");
        this.message("What is your new pet's name?");
        console.log(this.ui.$popup);
        const $input = $('<input/>');
        this.ui.$popup.append($input);
        const $button = $('<button/>');
              $button.text("LET\'S GO!");
        this.ui.$popup.append($button);
        const $checkbox = $('<input type="checkbox">');
        this.ui.$popup.append($checkbox);
        
        
        $button.on("click",()=> {
            const name = $input.val();
            const testMode = $checkbox.val();
            this.submitName(name,testMode);
        })
    },
    submitName(name,testMode){
        console.log("name submitted");
        if(name !== ""){
            this.createPet(name);
            $('.pop-up button').remove();
            $('.pop-up input').remove();
            this.togglePop();
            $('#name-row').text(name);
            this.testMode = testMode;
        }
    },
    createPet(name){
        console.log("creating pet!");
        //const $petShell 
        const $petShell = $("<div/>").addClass("pet-shell");
        const $pet = $("<img/>").addClass("pet");
        $petShell.append($pet);
        this.ui.$petContainer.append($petShell);
        this.ui.$petImage = $pet;
        this.ui.$petShell = $petShell;
        this.pet = new Pet(name,0, $pet, this.feedDelay, this.sleepDelay, this.playDelay,this.testMode);
        this.pet.setImage();
        this.startTimer();
    },
    startTimer(){
        this.timer = setInterval(()=>{
            if(this.pet.isDead){
                this.stopTimer();
                this.petDeathRestart();
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
        if(this.pet !== null){
            this.pet.updatePosition(x,y);
        }
    },
    feedPet(){
        console.log("feeding pet");
        if(true){
            this.haveBirthday();
        } else {
            if(this.pet.traits.hunger < 1){
                this.message(this.pet.name + " isn't hungry right now");
            } else {
                this.ui.$bowl.attr("src","img/bowl_full.png");
                this.pet.feed();
                setTimeout(()=>{
                    this.ui.$bowl.attr("src","img/bowl_empty.png");
                },this.feedDelay*this.pet.traits.hunger)
            }
        }
        
    },
    playWithPet(){
        console.log("playing with pet");
        if(this.pet.traits.boredom < 1){
            this.message(this.pet.name + " isn't bored right now");
        } else {
            const $mouseTail = $('<div/>').addClass('mouse-tail');
            const $mouse = $('<img/>').addClass('mouse');
                  $mouse.attr('src',"img/mouse.png");
            $mouseTail.append($mouse);
            this.ui.$petContainer.append($mouseTail);
            this.pet.play();
            setTimeout(()=>{
                $mouseTail.remove();
            },this.playDelay*this.pet.traits.boredom)
        }
    },
    haveBirthday(){
        for(let i = 0; i < this.pet.ageYear; i++){
            const $cake = $("<img/>").addClass("cake");
                  $cake.attr("src","img/cake_candles.png");
            this.ui.$bowl.append($cake);
        }
    },
    letPetSleep(){
        if(this.pet.traits.sleepiness < 1){
            this.message(this.pet.name + " isn't sleepy right now");
        } else {
            console.log("time to sleep!");
            this.toggleLights();
            this.pet.sleep();
            setTimeout(()=>{
                this.toggleLights();
                this.pet.neutral();
            },this.sleepDelay*this.pet.traits.sleepiness)
        }
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
        this.paused = !this.paused;
    },
    petDeathRestart(){
        $('#close-pop').addClass("hidden");
        this.message("Your pet has died. Try again!");
        $(".pet").remove();
        this.pet = null;
        const $button = $('<button/>');
              $button.text("LET\'S GO!");
        this.ui.$popup.append($button);
        $button.on("click",()=> {
            $('.pop-up button').remove();
            $('.pop-up input').remove();
            this.togglePop();
            this.start();
        })
    },
    togglePop(){
        /*
        this.ui.$popup.toggleClass(function(){
            console.log("sending message");
            return this.isPopUpShowing ? "hidden" : "   ";
        });
        //this.ui.$popup.toggleClass("hidden",this.isPopUpShowing);
        */
        if(this.isPopUpShowing){ 
            this.ui.$popup.addClass("hidden");
        } else {
            this.ui.$popup.removeClass("hidden");
        }
        this.isPopUpShowing = !this.isPopUpShowing;
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