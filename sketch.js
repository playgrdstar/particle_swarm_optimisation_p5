var origin, ub, lb, global_best_result, global_pos_best, swarm;

var margin = 20;

var num_particles;

var target;

var w, c1, c2;

function setup(){

    w = 0.5;
    c1 = 1;
    c2 = 2;

    //Attaching the canvas created to the dom with the id p5canvas
    var c = createCanvas(500,500);
    c.parent('p5canvas');

    background(222,60,75);
    // Starting point, not used
    origin = createVector(width/2,height/2);
    // Upper and lower bounds
    ub = createVector(500,500);
    lb = createVector(0,0);

    // Initialise variable that will store best result at each run - smaller the better
    global_best_result= Infinity;

    // Variable to store best minimized position thus far
    global_pos_best = createVector(0.0,0.0);

    // Swarm of particles
    swarm = [];

    num_particles = 300;
    
    // Initialise
    for (var i=0; i<num_particles; i++){
        var newPos = createVector(random(margin,random(width-margin)),random(margin,random(height-margin)));
        var particle = new Particle(newPos);
        swarm.push(particle);
    }
}

var frameCount = 0;

function draw(){


    frameRate(10);
    background(222,60,75,255);

    // Evaluate the function by passing in the current position to function
    // Then compare and update global_pos_best if the result is < global_best_result so far
    for (var j=0; j<num_particles; j++){
        swarm[j].eval(f1);

        if (swarm[j].result<global_best_result){
            global_pos_best = swarm[j].position;
            global_best_result = swarm[j].result;
        }
    }

    // Update velocity, position and display circles 

    for (var j=0; j<num_particles; j++){
        swarm[j].updateVelocity(global_pos_best);
        swarm[j].updatePosition(lb,ub);
        swarm[j].display();
    }

    frameCount++;

    // Show results and Reset after 120 frames
    // I've randomised the main constants for the PSO formula to vary the outcome

    if(frameCount%120==0){
        console.log('Results');
        console.log(global_pos_best);
        console.log(global_best_result);  
        background(222,60,75,200);
        w = random();
        c1 = random(1,4);
        c2 = random(1,4);
        swarm = [];
        for (var i=0; i<num_particles; i++){
            var newPos = createVector(random(margin,random(width-margin)),random(margin,random(height-margin)));
            var particle = new Particle(newPos);
            swarm.push(particle);
        }
    }
}


function Particle(origin){

    // Initialise
    this.position = createVector(origin.x, origin.y);
    this.velocity = createVector(random(),random());
    this.position_best = createVector(origin.x, origin.y);

    // Set best position for the particle to infinity, i.e. the largest possible
    this.result_best = Infinity;
    this.result = Infinity;

    this.eval = function(func){
        this.result = func(this.position);

        if (this.result < this.result_best){
            this.position_best = this.position
            this.result_best = this.result;
        }

    }

    this.updateVelocity = function(global_pos_best){

        // Update using the PSO formula
        // var w = 0.5;
        // var c1 = 1;
        // var c2 = 2;

        r1 = random();
        r2 = random();

        var c = c1*r1*(this.position_best.x-this.position.x);
        var s = c2*r2*(global_pos_best.x-this.position.x);
        this.velocity.x = w*this.velocity.x+c+s;

        r1 = random();
        r2 = random();

        var c = c1*r1*(this.position_best.y-this.position.y);
        var s = c2*r2*(global_pos_best.y-this.position.y);
        this.velocity.y = w*this.velocity.y+c+s;
    }

    this.updatePosition = function(bounds){

        // Keep solution, and hence positions of particles within bounds

        this.position.add(this.velocity);

        if (this.position.x>ub.x){
            this.position.x=ub.x;
        }
        if (this.position.x<lb.x){
            this.position.x=lb.x;
        }

        if (this.position.y>ub.y){
            this.position.y=ub.y;
        }
        if (this.position.y<lb.y){
            this.position.y=lb.y;
        }
    }

    // Display!
    this.display = function() {
        stroke(255,5);
        strokeWeight(8);
        fill(255,119,51,100);
        // console.log('Radius', size);
        ellipse(this.position.x, this.position.y, 8, 8);
    };

}

// Function to optimise (minimise)

function f1(pos){
    // Scale the position so we can see on the screen
    var tempx = pos.x/100;
    var tempy = pos.y/100;
    var out = 100 * (tempy - tempx * tempx) * (tempy - tempx * tempx) + (1 - tempx) * (1 - tempx);
    return out;

}