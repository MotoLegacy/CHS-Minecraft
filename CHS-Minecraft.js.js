window.onload = function() {
    /*
        TODO:
        * Use an alternative image hosting site
        * Change jumping
            - find best height, change system for height
        * Convert keyboard events to ints for cleaner hotbar select
        * Sun move clockwise, moon move counter clockwise
    */
    
    //block definitions
    var blocks = [];
    var HAND = 0;
    var GRASS = 1;
    var DIRT = 2;
    var BEDROCK = 3;
    
    //bounding box
    var boundBox = defineBoundBox(32, 32, Color.black);
    var gridSpaceX = 1;
    var gridSpaceY = 1;
    
    //temp vars
    var blockInHand = HAND;
    
    //skybox colors
    var skyDay = new Color(178, 253, 255);
    
    //plr
    var player;
    var playerSkin = "https://image.ibb.co/ft3XVq/steve.png";
    var playerSkinL = "https://image.ibb.co/krzVqq/steveL.png";
    var pTempY = 0;
    var playerOnGround = false;
    var playerDir = 0;
    
    //hotbar
    var slotArr = [];
    var slot = new WebImage("https://image.ibb.co/i2amVq/slot.png");
    var hotbarSlot = 0;
    var blockInSlot = [];
    blockInSlot.push(GRASS);
    blockInSlot.push(DIRT);
    
    //sky
    var theVoid;
    var day;
    var sun;
    var moon;
    var sunAng = 0;
    var moonAng = 0;
    
    function start() {
        createSky();
        generateTerrain();
        initHUD();
        spawnPlayer();
        //spawnPlayer();
        mouseClickMethod(placeBlock);
        mouseMoveMethod(moveBoundBox);
        keyDownMethod(keyDown);
        //placeBlock(GRASS);
    }
    
    function placeBlock(e) {
        //if we don't have anything in our hand
        if (blockInHand == HAND || blockInHand == undefined) 
            return;
        
        var blk = new WebImage(getBlockTexture(blockInHand));
        blk.setPosition(boundBox.getX(), boundBox.getY());
        blk.setSize(32, 32);
        add(blk);
        
        //check if block is inside player
        if ((blk.getX() == player.getX() && player.getY() == blk.getY())
            || (blk.getX() == player.getX() && player.getY() + 32 == blk.getY())) {
            
            remove(blk);
            return;
        }
        
        //check if there's already a block in space
        for (var i = 0; i < blocks.length; i++) {
            if (blk.getX() == blocks[i].getX()
            && blk.getY() == blocks[i].getY()) {
                remove(blk);
                return;
            }
        }
        
        blocks.push(blk);
    }
    
    function getBlockTexture(block) {
        switch(block) {
            case GRASS: return "https://image.ibb.co/eudD3A/grass-side.png";
            case DIRT: return "https://image.ibb.co/ez6SVq/dirt.png";
            case BEDROCK: return "https://image.ibb.co/kHeEAq/bedrock.png";
            default: return "";
        }
    }
    
    function defineBoundBox(wid, hei, col) {
        var temp = new Rectangle(wid, hei);
        temp.setColor(col);
        temp.setPosition(0, 0); //place in grid space 1
        add(temp);
        
        return temp;
    }
    
    //this serves as our fake grid, we move our bounding/collison box
    //to prevent block overlapping. fun stuff.
    function moveBoundBox(e) {
        if (e.getX() > (gridSpaceX * 32)) {
            boundBox.setPosition(gridSpaceX * 32, boundBox.getY());
            gridSpaceX++;
        } else if (e.getX() < (gridSpaceX * 32)) {
            boundBox.setPosition((gridSpaceX * 32) - 32, boundBox.getY());
            gridSpaceX--;
        }
        
        if (e.getY() > (gridSpaceY * 32)) {
            boundBox.setPosition(boundBox.getX(), gridSpaceY * 32);
            gridSpaceY++;
        } else if (e.getY() < (gridSpaceY * 32)) {
            boundBox.setPosition(boundBox.getX(), gridSpaceY * 32 - 32);
            gridSpaceY--;
        }
    }
    
    //make a flat world
    function generateTerrain() {
        //create grass layer
        for (var i = 0; i < 14*32; i += 32) {
            generateBlock(GRASS, i, 7*32);
        }
        //create dirt layer
        for (var i = 0; i < 14*32; i += 32) {
            for (var j = 8; j < 12; j ++) {
                generateBlock(DIRT, i, j*32);   
            }
        }
        //create bedrock layer
        for (var i = 0; i < 14*32; i += 32) {
            generateBlock(BEDROCK, i, 12*32);
        }
    }
    
    //make a "nice" sky
    function createSky() {
        day = new Rectangle(getWidth(), getHeight() - 2*32);
        day.setPosition(0, 0);
        day.setColor(skyDay);
        
        sun = new Rectangle(50, 50);
        sun.setPosition(getWidth()/2 - 50, 30);
        sun.setColor(Color.yellow);
        
        moon = new Rectangle(50, 50);
        moon.setPosition(getWidth()/2 - 50, 800);
        moon.setColor(Color.white);
        setTimer(skyChange, 50);
        
        theVoid = new Rectangle(getWidth(), getHeight());
        theVoid.setPosition(0, 0);
        theVoid.setColor(Color.black)
        
        add(theVoid);
        add(day);
        add(sun);
        add(moon);
    }
    
    function skyChange() {
        sunAng += 3 * Math.PI / 180;
        moonAng -= 3 * Math.PI / 180;
        sun.setPosition(sun.getX() + 20 * Math.cos(sunAng), sun.getY() + 20 * Math.sin(sunAng));
        moon.setPosition(moon.getX() + 20 * Math.cos(moonAng), moon.getY() + 20 * Math.sin(moonAng));
    }
    
    //place blocks created by generation, instead of hand
    function generateBlock(type, x, y) {
        var blk = new WebImage(getBlockTexture(type));
        blk.setPosition(x, y);
        blk.setSize(32, 32);
        blocks.push(blk);
        add(blk);
    }
    
    //put player into world
    function spawnPlayer(x, y, col) {
        player = new WebImage(playerSkin);
        //player.setColor(col);
        player.setPosition(32, 32);
        add(player);
        
        setTimer(playerGravity, 10);
        
        //return temp;
    }
    
    //tick system: 3ms = 1 tick
    //ticks are used for anything time based
    function playerGravity() {
        //player.move(1, 0);
        for (var i = 0; i < blocks.length; i ++) {
            if (player.getY() + 64 == blocks[i].getY()) {
                playerOnGround = true;
                return;
            }
                //return;
        }
        player.move(0, 4);
    }
    
    //jump
    function playerJump() {
        /*while(player.getY() != pTempY + 20) {
            player.move(0, -1);
            pTempY++;
        }*/
        if (player.getY() == pTempY + 8) {
            setTimer(playerGravity, 10);
            stopTimer(playerJump);
            return;
        }
        player.move(0, -4);
        pTempY++;
    }
    
    //input handling
    function keyDown(e) {
        if (e.keyCode == Keyboard.SPACE) {
            /*if (!playerOnGround)
                return;
            stopTimer(playerGravity);
            pTempY = player.getX();
            playerOnGround = false;
            setTimer(playerJump, 10);*/
            return;
        } if (e.keyCode == Keyboard.letter('D')) {
            player.move(3, 0);
            if (playerDir == 1) {
                playerDir = 0;
                player.setImage(playerSkin);
            }
        } else if (e.keyCode == Keyboard.letter('A')) {
            player.move(-3, 0);
            if (playerDir == 0) {
                playerDir = 1;
                player.setImage(playerSkinL);
            }
        }
        
        if (e.keyCode == Keyboard.SHIFT) {
            changeStance();
        }
        
        switch(e.keyCode) {
            case Keyboard.letter('1'): setHotbarSlot(0); break;
            case Keyboard.letter('2'): setHotbarSlot(1); break;
            case Keyboard.letter('3'): setHotbarSlot(2); break;
            case Keyboard.letter('4'): setHotbarSlot(3); break;
            case Keyboard.letter('5'): setHotbarSlot(4); break;
            case Keyboard.letter('6'): setHotbarSlot(5); break;
            case Keyboard.letter('7'): setHotbarSlot(6); break;
            case Keyboard.letter('8'): setHotbarSlot(7); break;
            case Keyboard.letter('9'): setHotbarSlot(8); break;
        }
    }
    
    //heads up display
    function initHUD() {
        var hotbar = new WebImage("https://image.ibb.co/moOeiA/hotbar.png");
        hotbar.setPosition(17, 430);
        add(hotbar);
        add(slot);
        drawHotbarItems();
        setHotbarSlot(0);
    }
    
    function drawHotbarItems() {
        for (var i = 0; i < 8; i++) {
            var temp = new WebImage(getBlockTexture(blockInSlot[i]));
            temp.setSize(25, 25);
            temp.setPosition(27 + (40 * i), 440);
            add(temp);
            slotArr.push(temp);
        }
    }
    
    function setHotbarSlot(slt) {
        slot.setPosition(16 + (40 * slt), 428);
        hotbarSlot = slt;
        blockInHand = getBlockInSlot(hotbarSlot);
    }
    
    function getBlockInSlot(slt) {
        return blockInSlot[slt];
    }
    
    function changeStance() {
        return;
    }
    
    if (typeof start === 'function') {
        start();
    }
    
    };
    