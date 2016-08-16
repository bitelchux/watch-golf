window.onload = function () {
	// Set the name of the hidden property and the change event for visibility
	var hidden, visibilityChange; 
	if (typeof document.hidden !== "undefined") {
	  hidden = "hidden";
	  visibilityChange = "visibilitychange";
	} else if (typeof document.mozHidden !== "undefined") {
	  hidden = "mozHidden";
	  visibilityChange = "mozvisibilitychange";
	} else if (typeof document.msHidden !== "undefined") {
	  hidden = "msHidden";
	  visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") {
	  hidden = "webkitHidden";
	  visibilityChange = "webkitvisibilitychange";
	}

	// Back key event listener
	document.addEventListener('tizenhwkey', function(e) {
	  if (e.keyName === "back") {
	      try {
	          tizen.application.getCurrentApplication().exit();
	      } catch (ignore) {}
	  }
	});

	// Visibility change event listener
	document.addEventListener(visibilityChange, function () {
	  if (document[hidden]){
	  	pause = true;
	    document.removeEventListener('click', action);
	    document.removeEventListener('rotarydetent', move);
        document.removeEventListener('touchstart', move);
        document.removeEventListener('touchend', move);
	  } else {
	    pause = false;
	    countP = 0;
	    if (starting || gameOver) {
	    	document.addEventListener('click', action);
	    } else if (playing) {
	    	document.addEventListener('rotarydetent', move);
	    	document.addEventListener('touchstart', move);
	    	document.addEventListener('touchend', move);
	    }
	  }
	}, false);
	// tap event
	document.addEventListener('click', action);
    
    // Setting up the canvas
    var canvas = document.getElementById('canvas'),
        ctx    = canvas.getContext('2d'),
        cH     = ctx.canvas.height = 360,
        cW     = ctx.canvas.width  = 360;

    //General sprite load
    var imgHeart = new Image();
    imgHeart.src = 'images/heart.png';
    var imgRefresh = new Image();
    imgRefresh.src = 'images/refresh.png';
    var imgFlagIcon = new Image();
    imgFlagIcon.src = 'images/flag_icon.png';
    var imgCoin = new Image();
    imgCoin.src = 'images/coin.png';
    var imgBall = new Image();
    imgBall.src = 'images/ball.png';
    var imgArrow = new Image();
    imgArrow.src = 'images/arrow.png';
    var imgFlag = new Image();
    imgFlag.src = 'images/flag.png';

    //Game
    var attempts   = 0,
        count      = 0,
        pause      = false,
        countP     = 0,
        playing    = false,
        gameOver   = false,
    	starting = true,
        levels = [],
        frame = 0;

    var record = localStorage.getItem("record");
    record = record === null ? 0 : record;

    var currentLevel = localStorage.getItem("currentLevel");
    currentLevel = currentLevel === null ? 0 : parseInt(currentLevel);

    var points = localStorage.getItem("points");
    points = points === null ? 0 : parseInt(points);    
    
    //Player
    var player = new _player();

    createLevels();

    var coin = new _coin();
    coin.x = levels[currentLevel].target.x;
    coin.y = levels[currentLevel].target.y;

    player.x = levels[currentLevel].start.x;
    player.y = levels[currentLevel].start.y;

    function createLevels() {
        // 1st level
        var newLevel = new _level(cW/2, 70, cW/2, 310);
        levels.push(newLevel);

        // 2nd level
        newLevel = new _level(cW/2, 70, cW/2, 310);
        newLevel.addObsticle(new _obsticle(150, 180, 210, 180, "horizontal"));
        levels.push(newLevel);

        // 2nd level
        newLevel = new _level(120,80, cW/2, 310);
        newLevel.addObsticle(new _obsticle(0, 150, 200, 150, "horizontal"));
        newLevel.addObsticle(new _obsticle(300, 0, 300, cH, "vertical"));
        levels.push(newLevel);

        // 3rd level
        newLevel = new _level(270,200, cW/2, 310);
        newLevel.addObsticle(new _obsticle(100, 0, 100, 180, "vertical"));
        newLevel.addObsticle(new _obsticle(220, 110, 220, cH, "vertical"));
        levels.push(newLevel);

        // 4th level
        newLevel = new _level(270,200, cW/2, 310);
        newLevel.addObsticle(new _obsticle(140, 0, 140, 180, "vertical"));
        newLevel.addObsticle(new _obsticle(220, 110, 220, cH, "vertical"));
        newLevel.addObsticle(new _obsticle(320, 0, 320, cH, "vertical"));
        levels.push(newLevel);

        // 5th level
        newLevel = new _level(55,180, cW/2, 310);
        newLevel.addObsticle(new _obsticle(0, 230, 200, 230, "horizontal"));
        newLevel.addObsticle(new _obsticle(140, 0, 140, 180, "vertical"));
        newLevel.addObsticle(new _obsticle(320, 0, 320, cH, "vertical"));
        levels.push(newLevel);

        // 6th level
        newLevel = new _level(120,290, 120, 50);
        newLevel.addObsticle(new _obsticle(90, 230, 200, 230, "horizontal"));
        newLevel.addObsticle(new _obsticle(140, 0, 140, 180, "vertical"));
        newLevel.addObsticle(new _obsticle(90, 0, 90, cH, "vertical"));
        newLevel.addObsticle(new _obsticle(300, 0, 300, cH, "vertical"));
        levels.push(newLevel);

        // 7th level
        newLevel = new _level(300,270, 70, 160);
        newLevel.addObsticle(new _obsticle(200, 230, cW, 230, "horizontal"));
        newLevel.addObsticle(new _obsticle(0, 230, 120, 230, "horizontal"));
        newLevel.addObsticle(new _obsticle(120, 100, 120, 300, "vertical"));
        newLevel.addObsticle(new _obsticle(250, 0, 250, 230, "vertical"));
        levels.push(newLevel);

        // 8th level
        newLevel = new _level(250,80, 70, 160);
        newLevel.addObsticle(new _obsticle(200, 120, cW, 120, "horizontal"));
        newLevel.addObsticle(new _obsticle(120, 30, cW, 30, "horizontal"));
        newLevel.addObsticle(new _obsticle(0, 320, cW, 320, "horizontal"));
        newLevel.addObsticle(new _obsticle(120, 0, 120, 230, "vertical"));
        newLevel.addObsticle(new _obsticle(250, 120, 250, 230, "vertical"));
        levels.push(newLevel);

        // 9th level
        newLevel = new _level(180,180, 180, 280);
        newLevel.addObsticle(new _obsticle(120, 120, 250, 120, "horizontal"));
        newLevel.addObsticle(new _obsticle(120, 230, 250, 230, "horizontal"));
        newLevel.addObsticle(new _obsticle(250, 120, 250, 230, "vertical"));
        newLevel.addObsticle(new _obsticle(120, 230, 120, cH, "vertical"));
        levels.push(newLevel);

        // 10th level
        newLevel = new _level(300,180, 180, 180);
        newLevel.addObsticle(new _obsticle(120, 120, 250, 120, "horizontal"));
        newLevel.addObsticle(new _obsticle(120, 230, 250, 230, "horizontal"));
        newLevel.addObsticle(new _obsticle(250, 120, 250, 230, "vertical"));
        levels.push(newLevel);

        // 11th level
        newLevel = new _level(180,90, 180, 180);
        newLevel.addObsticle(new _obsticle(120, 120, 250, 120, "horizontal"));
        newLevel.addObsticle(new _obsticle(250, 120, 250, 230, "vertical"));
        newLevel.addObsticle(new _obsticle(120, 0, 120, 120, "vertical"));
        newLevel.addObsticle(new _obsticle(120, 230, 120, cH, "vertical"));
        levels.push(newLevel);

        // 12th level
        newLevel = new _level(250,80, 300, 170);
        newLevel.addObsticle(new _obsticle(200, 120, cW, 120, "horizontal"));
        newLevel.addObsticle(new _obsticle(0, 320, cW, 320, "horizontal"));
        newLevel.addObsticle(new _obsticle(120, 0, 120, 230, "vertical"));
        newLevel.addObsticle(new _obsticle(250, 120, 250, 230, "vertical"));
        levels.push(newLevel);

        // 13th level
        newLevel = new _level(250,80, 300, 170);
        newLevel.addObsticle(new _obsticle(200, 120, cW, 120, "horizontal"));
        newLevel.addObsticle(new _obsticle(0, 320, cW, 320, "horizontal"));
        newLevel.addObsticle(new _obsticle(150, 230, 250    , 230, "horizontal"));
        newLevel.addObsticle(new _obsticle(200, 0, 200, 60, "vertical"));
        newLevel.addObsticle(new _obsticle(90, 0, 90, 230, "vertical"));
        newLevel.addObsticle(new _obsticle(250, 120, 250, 230, "vertical"));
        levels.push(newLevel);

        // 14th level
        newLevel = new _level(120,290, 120, 50);
        newLevel.addObsticle(new _obsticle(90, 230, 250, 230, "horizontal"));
        newLevel.addObsticle(new _obsticle(170, 0, 170, 170, "vertical"));
        newLevel.addObsticle(new _obsticle(250, 90, 250, 230, "vertical"));
        newLevel.addObsticle(new _obsticle(90, 0, 90, cH, "vertical"));
        newLevel.addObsticle(new _obsticle(320, 0, 320, cH, "vertical"));
        levels.push(newLevel);
    }

    
    function move(e) {
        if (e.type === 'rotarydetent') {
        	if (e.detail.direction === "CCW") { 
                if (Math.sqrt(player.velocity.x*player.velocity.x + player.velocity.y*player.velocity.y) < 0.3) {
                    player.angle -= (2*Math.PI)/24.0;
                }
            } else {
                if (Math.sqrt(player.velocity.x*player.velocity.x + player.velocity.y*player.velocity.y) < 0.3) {
                    player.angle += (2*Math.PI)/24.0;
                }
            }
            if (player.angle > Math.PI*2) {
                player.angle -= Math.PI*2;
            } else if (player.angle < -Math.PI*2) {
                player.angle += Math.PI*2;
            }
        } else if (e.type === 'touchstart') {
            if (Math.sqrt(player.velocity.x*player.velocity.x + player.velocity.y*player.velocity.y) < 0.3) {
                player.boosting = true;
                player.velocity = {x:0, y:0};
                player.bouncingIdx = -1;
            }
        } else if (e.type === 'touchend') {
            if (Math.sqrt(player.velocity.x*player.velocity.x + player.velocity.y*player.velocity.y) < 0.3) {
                player.boosting = false;
                attempts += 1;
            }
        }

    }
 
    function action(e) {
        e.preventDefault();
        if(gameOver) {
            if(e.type === 'click') {
                gameOver   = false;
                player = new _player();
                coin = new _coin();
                currentLevel = 0;
                coin.x = levels[currentLevel].target.x;
                coin.y = levels[currentLevel].target.y;
                player.x = levels[currentLevel].start.x;
                player.y = levels[currentLevel].start.y;
                starting = true;
                playing = false;
                count      = 0;
                points     = 0;
                attempts = 0;
                document.removeEventListener('rotarydetent', move);
                document.removeEventListener('touchstart', move);
                document.removeEventListener('touchend', move);
            } 
        } else if (starting) {
        	if(e.type === 'click') {
        		starting = false;
                playing = true;
                document.addEventListener('rotarydetent', move);
                document.addEventListener('touchstart', move);
                document.addEventListener('touchend', move);
        	}
        } else if (playing) {
            if(e.type === 'click') {
                playing = true;
                document.addEventListener('rotarydetent', move);
                document.addEventListener('touchstart', move);
                document.addEventListener('touchend', move);
            }
        }
        
    }

    function _player() {
        this.radius = 10;
        this.x = cW/2;
        this.y = cH/2;
        this.angle = 0;
        this.boosting = false;
        this.power = 0;
        this.state = 0;
        this.stateX = 0;
        this.velocity = { x: 0, y: 0 };
        this.dead = false;
        this.bouncingIdx = -1;
        this.friction = 0.99;
        this.move = function() {
            // Border collision
            if (euclidianDistance(cW/2,cH/2,this.x,this.y) >= cW/2-this.radius) {
                var normal = { x: this.x - cW/2,
                               y: this.y - cH/2 };
                var len = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
                normal.x /= len;
                normal.y /= len;
                var nsx = this.velocity.x - (2 *( normal.x * this.velocity.x + normal.y * this.velocity.y ) ) * normal.x; 
                var nsy = this.velocity.y - (2 *( normal.x * this.velocity.x + normal.y * this.velocity.y ) ) * normal.y;
                this.velocity.x = nsx;
                this.velocity.y = nsy; 
                player.bouncingIdx = -1; 
            }


            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
        };
        this.checkBorderCollision = function() {
        };
    }

    function _coin() {
        this.radius = 10;
        this.x = cW/2;
        this.y = cH/2;
        this.collected = false;
        this.collectedForFrames = 0; 
        this.collectedPoints = 0;
        this.isAtInvalidPosition = function() {
            // if the distance between the coin and any ball is less than 2.5 times the radius, it's NOT legal
            if(euclidianDistance(player.x,player.y,this.x,this.y)<(player.radius*2.5)){
                return true;
            }
            
            // otherwise it's legal
            return false;          
        };
        this.randomPlace = function() {
            do {
            var angle = Math.random() * Math.PI * 2;
            var radius = Math.sqrt(Math.random()) * (cW/2-this.radius*2);
            this.x = cW/2 + radius * Math.cos(angle);
            this.y = cH/2 + radius * Math.sin(angle);
            } while (this.isAtInvalidPosition());
        };   
    }

    function _obsticle(startX, startY, endX, endY, type) {
        this.start = {x: startX, y:startY};
        this.end = {x: endX, y:endY};
        this.type = type;
    }

    function _level(targetX, targetY, startX, startY) {
        this.start = {x:startX, y:startY};
        this.target = {x:targetX, y:targetY};
        this.obsticles = [];
        this.addObsticle = function(obsticle) {
            this.obsticles.push(obsticle);
        };
    }

    function drawPowerBar() {
        // Draw power
        var percent = player.power/100.0;
        ctx.beginPath();
        ctx.arc(cW/2, cH/2, 160, -5*(Math.PI/4), -5*(Math.PI/4) + (Math.PI/2)*percent, false);
        ctx.strokeStyle = "rgba(8, 164, 8, 0.5)";
        ctx.lineWidth = 20;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(cW/2, cH/2, 171, -5*(Math.PI/4), -5*(Math.PI/4) + (Math.PI/2), false);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cW/2, cH/2, 149, -5*(Math.PI/4), -5*(Math.PI/4) + (Math.PI/2), false);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.translate(cW/2, cH/2);
        ctx.rotate(-5*(Math.PI/4));
        ctx.moveTo(0,149);
        ctx.lineTo(0,171);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.translate(0, 0);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.translate(cW/2, cH/2);
        ctx.rotate(Math.PI/4);
        ctx.moveTo(0,149);
        ctx.lineTo(0,171);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.translate(0, 0);
        ctx.restore();
    }
    
    function update() {
    	frame += 1;
    	frame %= 100;

        if (pause) {
            return;
        }

        if (playing) {
            
            if (player.boosting) {
                if (player.power < 100) {
                    player.power += 0.5;
                }
            } else {
                if (player.power > 0) {
                    player.velocity.x += Math.cos(player.angle-Math.PI/2)*player.power/10;
                    player.velocity.y += Math.sin(player.angle-Math.PI/2)*player.power/10;
                    player.power = 0;
                    player.angle = 0;
                }
                player.move();

                if (coin.collected) {
                    if (coin.collectedForFrames > 30) {
                        coin.collected = false;
                        coin.collectedForFrames = 0;
                        if (currentLevel === levels.length-1) {
                        	localStorage.removeItem("currentLevel");
                        	localStorage.removeItem("points");
                            gameOver = true;
                            playing  = false;
                            document.addEventListener('click', action);
                            document.removeEventListener('rotarydetent',move);
                            document.removeEventListener('touchstart', move);
                            document.removeEventListener('touchend', move);
                            return;
                        } else {
                            currentLevel += 1;
                            localStorage.setItem("currentLevel", currentLevel);
                            localStorage.setItem("points", points);
                            player = new _player();
                            coin = new _coin();
                            coin.x = levels[currentLevel].target.x;
                            coin.y = levels[currentLevel].target.y;
                            player.x = levels[currentLevel].start.x;
                            player.y = levels[currentLevel].start.y;
                        }

                    } else {
                        coin.collectedForFrames += 1;
                    }
                }

                if(euclidianDistance(player.x,player.y,coin.x,coin.y)<(player.radius+coin.radius-10) && !coin.collected &&
                    Math.sqrt(player.velocity.x*player.velocity.x + player.velocity.y*player.velocity.y) < 1){
                    if (attempts === 0) {
                        points += 12;
                        coin.collectedPoints = 12;
                    } else {
                        points += Math.round(10/attempts);
                        coin.collectedPoints = Math.round(10/attempts);
                    }
                    coin.collected = true;
                    attempts = 0;
                }


                for (var i = 0; i < levels[currentLevel].obsticles.length; i++) {
                    var obsticle = levels[currentLevel].obsticles[i];

                    if (obsticle.type === "horizontal") {
                        if (Math.abs(player.y - obsticle.start.y) < player.radius && player.x >= obsticle.start.x && player.x <= obsticle.end.x && player.bouncingIdx !== i) {
                            player.velocity.y = -player.velocity.y;
                            player.bouncingIdx = i;
                        }
                    } else {
                        if (Math.abs(player.x - obsticle.start.x) < player.radius && player.y >= obsticle.start.y && player.y <= obsticle.end.y && player.bouncingIdx !== i) {
                            player.velocity.x = -player.velocity.x;  
                            player.bouncingIdx = i;
                        }                        
                    }

                }

            }

        }
    }
    
    function draw() {
        if (pause) {
            if (countP < 1) {
                countP = 1;
            }
        } else if (playing) {
        	//Clear
            ctx.clearRect(0, 0, cW, cH);

            // Level
            ctx.font = "bold 30px Helvetica";
            ctx.fillStyle = "rgba(52,52,52,0.4)";
            ctx.textAlign = "center";
            ctx.textBaseline = 'middle';
            ctx.fillText(TIZEN_L10N["level"] + " " + (currentLevel+1), cW/2,cH/2);

            // Drawing obsticles ------------
            for (var i = 0; i < levels[currentLevel].obsticles.length; i++) {
                ctx.beginPath();
                ctx.strokeStyle = 'gray';
                ctx.moveTo(levels[currentLevel].obsticles[i].start.x, levels[currentLevel].obsticles[i].start.y);
                ctx.lineTo(levels[currentLevel].obsticles[i].end.x, levels[currentLevel].obsticles[i].end.y);
                ctx.stroke();
            }
            

            // Drawing coin ---------------
            ctx.drawImage(
                imgFlag,
                coin.x - 1,
                coin.y - 50
            ); 

            ctx.save();
            ctx.beginPath();
            ctx.arc(coin.x, coin.y, coin.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "gray";
            ctx.stroke();
            ctx.restore(); 
            if (coin.collected) {
                var alpha = 1;
                var up = 0;
                if (coin.collectedForFrames > 0) {
                    alpha = 1 - coin.collectedForFrames/30;
                    up = coin.collectedForFrames/5; 
                }
                ctx.font = "bold 18px Helvetica";
                ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
                ctx.textAlign = "center";
                ctx.textBaseline = 'middle';
                ctx.fillText("+" + coin.collectedPoints, coin.x, coin.y - up);  
            }
            

            // Ball
            if (!coin.collected) {
                ctx.drawImage(
                    imgBall,
                    player.x - player.radius,
                    player.y - player.radius,
                    20,
                    20
                );

                // Arrow
                if (Math.sqrt(player.velocity.x*player.velocity.x + player.velocity.y*player.velocity.y) < 0.3) {
                    ctx.save();
                    ctx.translate(player.x, player.y);

                    ctx.rotate(player.angle);

                    ctx.drawImage(
                        imgArrow,
                        -7,
                        -30,
                        14,
                        17
                    );
                    ctx.restore();
                }
            }

            // Drawing HUD ----------------
            // Draw power bar
            drawPowerBar();

            // Points
            ctx.font = "14px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = 'middle';
            ctx.fillText(TIZEN_L10N["score"] + ": " + points, cW/2,25);    

            // Attempts
            ctx.font = "14px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = 'middle';
            ctx.fillText(TIZEN_L10N["attempts"] + ": " + attempts, cW/2,cH/2 + 155);
            
        } else if(starting) {
            //Clear
            ctx.clearRect(0, 0, cW, cH);
            ctx.beginPath();

            ctx.font = "bold 25px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(TIZEN_L10N["title"], cW/2,cH/2 - 120);

            ctx.font = "bold 18px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(TIZEN_L10N["tap_to_play"], cW/2,cH/2 - 90);     
              
            ctx.font = "bold 18px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(TIZEN_L10N["instructions"], cW/2,cH/2 + 90);
              
            ctx.font = "13px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            wrapText(TIZEN_L10N["collect"], cW/2,cH/2 + 115, 220, 14);
            
            ctx.drawImage(
                    imgFlagIcon,
                    cW/2 - 64,
                    cH/2 - 74,
                    128,
                    128
                );
        } else if(count < 1) {
            count = 1;
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.rect(0,0, cW,cH);
            ctx.fill();

            ctx.font = "bold 25px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Game over",cW/2,cH/2 - 100);

            ctx.font = "18px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(TIZEN_L10N["score"] + ": "+ points, cW/2,cH/2 + 100);

            record = points > record ? points : record;
            localStorage.setItem("record", record);

            ctx.font = "18px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(TIZEN_L10N["record"] + ": "+ record, cW/2,cH/2 + 125);

            ctx.drawImage(imgRefresh, cW/2 - 23, cH/2 - 23);        	
        }
    }
    
    function init() {
    	update();
        ctx.save();
        draw();
        ctx.restore();
        window.requestAnimationFrame(init);
    }

    init();

    //Utils ---------------------
    function euclidianDistance(x1,y1,x2,y2) {
        return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    }
    
    function wrapText(text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = ctx.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, y);
      }

};