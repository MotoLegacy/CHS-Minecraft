window.onload = function() {
    /*
        TODO:
        * Use an alternative image hosting site
        * Change jumping
            - smoothen, better collison check
        * Convert keyboard events to ints for cleaner hotbar select
        * Sun move clockwise, moon move counter clockwise
        * make crouching less.. awkward
    */

    /* ===========
        GAME DEFS
       =========== */
    
    //block definitions
    var blocks = [];
    var HAND = 0;
    var GRASS = 1;
    var DIRT = 2;
    var BEDROCK = 3;
    
    //bounding box
    var boundBox = defineBoundBox(32, 32, Color.black);
    var bboxUp;
    var bboxDown;
    var bboxLeft;
    var bboxRight;
    var gridSpaceX = 1;
    var gridSpaceY = 1;
    
    //temp vars
    var blockInHand = HAND;
    
    //skybox colors
    var skyDay = new Color(157, 211, 255);
    
    //plr
    var player;
    var playerSkin = "https://image.ibb.co/ft3XVq/steve.png";
    var playerSkinCrouch = "https://image.ibb.co/hcu8YV/steve-Crouch.png";
    var playerSkinL = "https://image.ibb.co/krzVqq/steveL.png";
    var playerSkinCrouchL = "https://image.ibb.co/nsi2tV/steve-Crouch-L.png";
    var pTempY = 0;
    var playerOnGround = false;
    var playerDir = 0;
    var playerStance = 0;
    
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

    /* ===========
        MENU DEFS
       =========== */

    var menuButtons = [];
    var menuText = [];
    var buttonImg = "https://image.ibb.co/bXv8kA/button.png";
    var buttonHiImg = "https://image.ibb.co/moDayV/buttonHi.png";
    var logoImg = "https://image.ibb.co/kKx5iV/logo.png";
    var activeButton = 0;
    
    function start() {
        startMenu();
    }

    //---------------------------------------------------------
    //menu stuffs
    //---------------------------------------------------------

    function startMenu() {
        mainMenu();
        mouseMoveMethod(buttonCheck);
    }
    
    function mainMenu() {
        drawMenuBG();
        createMenuButton("New World", getWidth()/2, 250);
        createMenuButton("Skins", getWidth()/2, 290);
        mouseClickMethod(mainEnterMenu);
    }

    function buttonCheck(e) {
        for (var i = 0; i < menuButtons.length; i++) {
            if (e.getX() >= menuButtons[i].getX() && e.getX() <= menuButtons[i].getX() + 200 && e.getY() >= menuButtons[i].getY() && e.getY() <= menuButtons[i].getY() + 33) {
                menuButtons[i].setImage(buttonHiImg);
                menuText[i].setColor(Color.white);
                activeButton = i + 1;
            } else {
                menuButtons[i].setImage(buttonImg);
                menuText[i].setColor(Color.black);
                if (activeButton == i + 1)
                    activeButton = 0;
            }
        }
    }

    function mainEnterMenu(e) {
        switch(activeButton) {
            case 1: startGame(); break;
            case 2: cleanMenu(); skinMenu(); break;
            default: break;
        }
    }
    
    function cleanMenu() {
        menuButtons = [];
        menuText = [];
        activeButton = 0;
    }

    function inputTest() {
        var input = readLine("Enter text and check console: ");
        println("Player entered: " + input);
    }
    
    function skinMenu() {
        drawMenuBG();
        createMenuButton("Skin Selection", getWidth()/2, 250);
        createMenuButton("Custom Skin", getWidth()/2, 290);
        createMenuButton("Back", getWidth()/2, 330);
        mouseClickMethod(skinEnterMenu);
    }

    function skinEnterMenu(e) {
        switch(activeButton) {
            case 1: cleanMenu(); skinSMenu(); break;
            case 2: break;
            case 3: cleanMenu(); mainMenu(); break;
            default: break;
        }
    }
    
    function skinSMenu() {
        drawMenuBG();
        createMenuButton("Back", getWidth()/2, 250);
        mouseClickMethod(skinSEnterMenu);
    }

    function skinSEnterMenu(e) {
        switch(activeButton) {
            case 1: cleanMenu(); skinMenu(); break;
            default: break;
        }
    }

    function drawMenuBG() {
        var fakeSky = new Rectangle(getWidth(), getHeight());
        fakeSky.setColor(skyDay);

        var logo = new WebImage(logoImg);
        logo.setPosition(10, 5);

        add(fakeSky);
        add(logo);
    }

    function createMenuButton(txt, x, y) {
        var temp = new Text(txt, "20pt Arial");
        temp.setPosition(x - temp.getWidth()/2, y);

        var tempImg = new WebImage(buttonImg);
        tempImg.setPosition(getWidth()/2 - 100, y - 27);

        add(tempImg);
        add(temp);
        menuButtons.push(tempImg);
        menuText.push(temp);
    }

    //---------------------------------------------------------
    //in-game stuffs
    //---------------------------------------------------------

    function startGame() {
        createSky();
        generateTerrain();
        initHUD();
        spawnPlayer(32, 32);
        mouseClickMethod(placeBlock);
        mouseMoveMethod(moveBoundBox);
        keyDownMethod(keyDown);
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

        createDrawnPreview(boundBox.getX(), boundBox.getY());
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
    function spawnPlayer(x, y) {
        player = new WebImage(playerSkin);
        player.setPosition(x, y);
        add(player);
        
        setTimer(playerGravity, 10);
    }
    
    //tick system: 3ms = 1 tick
    //ticks are used for anything time based
    function playerGravity() {
        //checks every block
        for (var i = 0; i < blocks.length; i++) {
            for (var j = 0; j < 32; j++) {
                if (player.getY() + 64 >= blocks[i].getY() && player.getX() == blocks[i].getX() + j) {
                    playerOnGround = true;
                    return;
                }
            }
        }
        player.move(0, 2);
    }
    
    //jump
    function playerJump(startY) {
        if (!playerOnGround)
            return;
        
        playerOnGround = false;
        
        for (i = 0; i < startY + 8; i += 2) {
            player.move(0, -0.5);
        }
    }
    
    //input handling
    function keyDown(e) {
        if (e.keyCode == Keyboard.SPACE) {
            playerJump(player.getY());
        }
        
        if (e.keyCode == Keyboard.letter('D')) {
            player.move(3, 0);
            if (playerDir == 1) {
                println('facing right');
                playerDir = 0;

                if (!playerStance)
                    player.setImage(playerSkin);
                else
                    player.setImage(playerSkinCrouch);
                player.setSize(32, 64);
            }
        } else if (e.keyCode == Keyboard.letter('A')) {
            player.move(-3, 0);
            if (playerDir == 0) {
                println('facing left');
                playerDir = 1;

                if (!playerStance)
                    player.setImage(playerSkinL);
                else
                    player.setImage(playerSkinCrouchL);
                player.setSize(32, 64);
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
        playerStance = !playerStance;

        if (!playerStance) {
            switch(playerDir) {
                case 0: player.setImage(playerSkin); break;
                case 1: player.setImage(playerSkinL); break;
            }
        } else {
            switch(playerDir) {
                case 0: player.setImage(playerSkinCrouch); break;
                case 1: player.setImage(playerSkinCrouchL); break;
            }
        }

        player.setSize(32, 64);
    }

    //creates a hollow square at boundbox pos
    //necessary due to drawing order.. fix?
    function createDrawnPreview(x, y) {
        cleanGrid();

        bboxUp = defineBoundBox(32, 1, Color.black);
        bboxDown = defineBoundBox(32, 1, Color.black);
        bboxLeft = defineBoundBox(1, 32, Color.black);
        bboxRight = defineBoundBox(1, 32, Color.black);

        bboxUp.setPosition(x, y);
        bboxDown.setPosition(x, y + 32);
        bboxLeft.setPosition(x, y);
        bboxRight.setPosition(x + 32, y);
    }

    function cleanGrid() {
        if (bboxUp) {
            remove(bboxUp);
            remove(bboxDown);
            remove(bboxLeft);
            remove(bboxRight);
        }
    }
    
    if (typeof start === 'function') {
        start();
    }
    
};
    
