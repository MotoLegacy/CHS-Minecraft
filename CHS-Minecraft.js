window.onload = function() {
    /*
        TODO:
        * Use an alternative image hosting site
        * Change jumping
            - smoothen, better collison check
        * Convert keyboard events to ints for cleaner hotbar select
        * make crouching less.. awkward
        * have all button registration one function (have var storing current menu)
        * have splashes load from a file (saves lines)
        * re-organize function locations
    */

    /* =================
        IMAGE DEFITIONS
       ================ */
    var IMG_STEVE = "assets/steve.png";
    var IMG_STEVECROUCH = "assets/steve-Crouch.png";
    var IMG_LSTEVE = "assets/steveL.png";
    var IMG_LSTEVECROUCH = "assets/steve-Crouch-L.png";
    var IMG_HOTBARSLOT = "assets/slot.png";
    var IMG_MENUBUTTON = "assets/button.png";
    var IMG_MENUBUTTONACTIVE = "assets/buttonHi.png";
    var IMG_MENULOGO = "assets/logo.png";
    var IMG_MENUDISCLAIMER = "assets/disclaimer.png";
    var IMG_MENUSTEVE = "assets/menuSteve.png";
    var IMG_MENUTUX = "assets/menuTux.png";
    var IMG_TUX = "assets/tux.png";
    var IMG_TUXCROUCH = "assets/tux-Crouch.png";
    var IMG_LTUX = "assets/tuxL.png";
    var IMG_LTUXCROUCH = "assets/tux-Crouch-L.png";
    var IMG_HOTBAR = "assets/hotbar.png";
    var IMG_BLOCKGRASS = "assets/grass-side.png";
    var IMG_BLOCKDIRT = "assets/dirt.png";
    var IMG_BLOCKBEDROCK = "assets/bedrock.png";

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
    
    //plr
    var player;
    var playerSkin = IMG_STEVE;
    var playerSkinCrouch = IMG_STEVECROUCH;
    var playerSkinL = IMG_LSTEVE;
    var playerSkinCrouchL = IMG_LSTEVECROUCH;
    var pTempY = 0;
    var playerOnGround = false;
    var playerDir = 0;
    var playerStance = 0;
    
    //hotbar
    var slotArr = [];
    var slot = new WebImage(IMG_HOTBARSLOT);
    var hotbarSlot = 0;
    var blockInSlot = [];
    blockInSlot.push(GRASS);
    blockInSlot.push(DIRT);

    //input
    blockAction = 0;

    /* ================
        WORLD GEN DEFS
       ================ */
    
    var world_gamemode = 0;

    /* ===========
        MENU DEFS
       =========== */

    var menuButtons = [];
    var menuText = [];
    var activeButton = 0;
    var splash;
    var splashSize = 20;
    var splashState = 0;
    var splashArray = [];
    
    function start(splash) {
        splashArray = splash;
        ImageHandler_Initialize();
        //Menu_Initialize();
        //startMenu();
    }

    //---------------------------------------------------------
    //menu stuffs
    //---------------------------------------------------------

    function startMenu() {
        mainMenu();
        setTimer(splashChange, 15);
        mouseMoveMethod(buttonCheck);
    }
    
    function mainMenu() {
        //drawSplash();
        drawMenuBG();
        createMenuButton("New World", getWidth()/2, 210);
        createMenuButton("Skins", getWidth()/2, 250);
        createMenuButton("Disclaimer", getWidth()/2, 290);
        mouseClickMethod(mainEnterMenu);
    }

    function buttonCheck(e) {
        for (var i = 0; i < menuButtons.length; i++) {
            if (e.getX() >= menuButtons[i].getX() && e.getX() <= menuButtons[i].getX() + 200 && e.getY() >= menuButtons[i].getY() && e.getY() <= menuButtons[i].getY() + 33) {
                menuButtons[i].setImage(IMG_MENUBUTTONACTIVE);
                menuText[i].setColor(Color.white);
                activeButton = i + 1;
            } else {
                menuButtons[i].setImage(IMG_MENUBUTTON);
                menuText[i].setColor(Color.black);
                if (activeButton == i + 1)
                    activeButton = 0;
            }
        }
    }

    function mainEnterMenu(e) {
        switch(activeButton) {
            case 1: /*cleanMenu(); worldMenu();*/startGame(); break;
            case 2: cleanMenu(); skinMenu(); break;
            case 3: cleanMenu(); disclaimerMenu(); break;
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

    function addText(txt, size, col, x, y, cenx) {
        var temp = new Text(txt, size);
        temp.setColor(col);

        if (cenx) {
            x = getWidth()/2 - temp.getWidth()/2;
        }

        temp.setPosition(x, y);
        add(temp);

        return temp;
    }

    function disclaimerMenu() {
        drawMenuBG();
        disclaimerBG();
        createMenuButton("Back", getWidth()/2, getHeight() - 16);
        mouseClickMethod(enterMainMenu);

        addText("DISCLAIMER", "20pt Arial", Color.white, 0, 40, 1)
        addText("     2D-Minecraft is in no way affiliated with MojangAB, Microsoft, etc. This project", "15pt Arial", Color.white, 20, 70, 0);
        addText("was created to demonstrate the capabilities of CodeHS' JavaScript Graphics API,", "15pt Arial", Color.white, 23, 90, 0);
        addText("as well as point out various issues with the API, in hopes they may be altered in", "15pt Arial", Color.white, 23, 110, 0);
        addText("the future.", "15pt Arial", Color.white, 18, 130, 0);
        //
        addText("     Many thanks to the Minecraft team for creating/adding on to such an amazing", "15pt Arial", Color.white, 23, 170, 0);
        addText("project, and I cannot wait to see how the game further changes!", "15pt Arial", Color.white, 18, 190, 0);
    }

    function enterMainMenu() {
        cleanMenu();
        mainMenu();
    }
    
    function disclaimerBG() {
        var fakeSky = new Rectangle(getWidth(), getHeight());
        fakeSky.setColor(SKY_DAY);

        var disclaim = new WebImage(IMG_MENUDISCLAIMER);
        disclaim.setPosition(5, 5);
        
        add(fakeSky);
        add(disclaim);
    }

    function worldMenu() {
        drawMenuBG();
        createMenuButton("Survival", getWidth()/2, 210);
    }
    
    function skinMenu() {
        drawMenuBG();
        createMenuButton("Skin Selection", getWidth()/2, 210);
        createMenuButton("Coming Soon..", getWidth()/2, 250);
        createMenuButton("Back", getWidth()/2, 290);
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
        addSkin(IMG_MENUSTEVE, getWidth()/3 - 40, 100);
        addSkin(IMG_MENUTUX, getWidth()/3 * 2 - 30, 100);
        createMenuButton("Steve", getWidth()/3, 330);
        createMenuButton("Tuxedo Steve", getWidth()/3 * 2, 330);
        createMenuButton("Back", getWidth()/2, 370);
        mouseClickMethod(skinSEnterMenu);
    }

    function addSkin(img, x, y) {
        var temp = new WebImage(img);
        temp.setPosition(x, y);
        temp.setSize(88, 176);
        add(temp);
    }

    function skinSEnterMenu(e) {
        switch(activeButton) {
            case 1: setSkin(0); cleanMenu(); skinMenu(); break;
            case 2: setSkin(1); cleanMenu(); skinMenu(); break;
            case 3: cleanMenu(); skinMenu(); break;
            default: break;
        }
    }

    function setSkin(skin) {
        switch(skin) {
            case 0:
                playerSkin = IMG_STEVE;
                playerSkinCrouch = IMG_STEVECROUCH;
                playerSkinL = IMG_LSTEVE;
                playerSkinCrouchL = IMG_LSTEVECROUCH;
                break;
            case 1:
                playerSkin = IMG_TUX;
                playerSkinCrouch = IMG_TUXCROUCH;
                playerSkinL = IMG_LTUX;
                playerSkinCrouchL = IMG_LTUXCROUCH;
                break;
        }
    }

    function readSplashes() {
        // read text from URL location
        var request = new XMLHttpRequest();
        request.open('GET', 'assets/splashes.txt', true);
        request.send(null);

        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var type = request.getResponseHeader('Content-Type');
                if (type.indexOf("text") !== 1) {
                    var stuff = request.responseText;
                    stuff = stuff.split(/\r\n|\r|\n/g);
                    start(stuff);
                }
            }
        }
    }

    function getSplashText() {
        spl = Randomizer.nextInt(1, 361);
        return splashArray[spl];
    }

    function drawMenuBG() {
        var fakeSky = new Rectangle(getWidth(), getHeight());

        // FIXME
        fakeSky.setColor(Color.blue);

        var logo = new WebImage(IMG_MENULOGO);
        logo.setPosition(getWidth()/4, 10);

        add(fakeSky);
        add(logo);
        //add(splash);
    }

    function drawSplash() {
        splash = new Text(getSplashText(), "20pt Arial");
        splash.setColor(Color.yellow);
        //splash.setPosition(getWidth()/2 - splash.getWidth()/2 + 150, 100);
        splash.setPosition(getWidth()/2 - splash.getWidth()/2 + 150, 100);
        //splash.rotate(-15);
    }

    function splashChange() {
        splash.setFont(splashSize + "pt Arial");
        splash.setPosition(getWidth()/2 - splash.getWidth()/2 + 150, 100);
        //splash.setPosition(getWidth()/2 - splash.getWidth()/2 + 150, 100);

        if (splashState == 0) {
            splashSize += 0.1;

            if (splashSize > 21.3)
                splashState = 1;
        }

        if (splashState == 1) {
            splashSize -= 0.1;

            if (splashSize < 20) {
                splashState = 0;
            }
        }
    }

    function createMenuButton(txt, x, y) {
        var temp = new Text(txt, "20pt Arial");
        temp.setPosition(x - temp.getWidth()/2, y);

        var tempImg = new WebImage(IMG_MENUBUTTON);
        tempImg.setPosition(x - 100, y - 27);

        add(tempImg);
        add(temp);
        menuButtons.push(tempImg);
        menuText.push(temp);
    }

    //---------------------------------------------------------
    //in-game stuffs
    //---------------------------------------------------------

    // Initialization of Game.
    function startGame() {
        // Start drawing of the Sky
        Sky_Create();

        // Start Tick System
        setTimer(Tick_Update, 50);

        // Set Time of Day to Mid-Day
        Time = 12000;
        
        generateTerrain();
        initHUD();
        spawnPlayer(32, 32);
        mouseClickMethod(placeBlock);
        mouseMoveMethod(moveBoundBox);
        keyDownMethod(keyDown);
    }

    
    //Return the texture name for blocks
    function getBlockTexture(block) {
        switch(block) {
            case GRASS: return IMG_BLOCKGRASS;
            case DIRT: return IMG_BLOCKDIRT;
            case BEDROCK: return IMG_BLOCKBEDROCK;
            default: return "";
        }
    }

    /* ====================
        ENVIRONMENT STUFFS
       ====================
    Sky, terrain generation, sun & moon (good game)
    ------------------------------------------------*/

    //Generate a normal, flat terrain
    function generateTerrain() {
        //Grass layer
        for (var i = 0; i < 24*32; i += 32) {
            generateBlock(GRASS, i, 7*32);
        }

        //Dirt layer
        for (var i = 0; i < 24*32; i += 32) {
            for (var j = 8; j < 12; j ++) {
                generateBlock(DIRT, i, j*32);
            }
        }

        //Bedrock layer
        for (var i = 0; i < 24*32; i += 32) {
            generateBlock(BEDROCK, i, 12*32);
        }
    }

    //Place the blocks needed for world terrain individually, push to array
    function generateBlock(type, x, y) {
        var blk = new WebImage(getBlockTexture(type));
        blk.setPosition(x, y);
        blk.setSize(32, 32);
        blocks.push(blk);
        add(blk);
    }

    /* ====================
        COLLISON DETECTION
       ==================== 
    The thing everyone hates but everyone's gotta do!
    --------------------------------------------------*/

    /*function checkCollison(a, b) {
        var leftA = a.getX();
        var rightA = a.getX() + getObjectDimensions(a, 0);
        var topA = a.getY();
        var bottomA = a.getY() + getObjectDimensions(a, 1);

        var leftA = b.getX();
        var rightA = b.getX() + getObjectDimensions(b, 0);
        var topA = b.getY();
        var bottomA = b.getY() + getObjectDimensions(b, 1);


        if (bottomA <= topB)
            return false;

        if (topA >= bottomB)
            return false;

        if (rightA <= leftB)
            return false;

        if (leftA >= rightB)
            return false;

        return true;
    }*/

    function getObjectDimensions(obj, xy) {
        switch(obj) {
            case player:
                if (xy) return 64;
                else return 32;
                break;
            default:
                return 32;
        }
    }

    //Checks if the X-Position is clear
    function xClear(dir) {
        if (!dir) { //right
            var xpos = player.getX() + 32;

            for (var i = 0; i < blocks.length; i++) {
                for (var j = 0; j < 64; j++) {
                    if (blocks[i].getX() <= xpos - 1 && blocks[i].getX() + 32 >= xpos - 1) { //x check
                    
                        if ((blocks[i].getY() < player.getY() + j) && (blocks[i].getY() + 32 > player.getY() + j)) {
                            return false;
                        }

                    }
                }
            }

            return true;
        } else {
            var xpos = player.getX();

            for (var i = 0; i < blocks.length; i++) {
                for (var j = 0; j < 64; j++) {
                    if (blocks[i].getX() + 32 == xpos) { //xcheck

                        if ((blocks[i].getY() < player.getY() + j) && (blocks[i].getY() + 32 > player.getY() + j)) {
                            return false;
                        }
    
                    }
                }
                
            }

            return true;
        }
    }

    /* ==================
        PLAYER FUNCTIONS
       ==================
    Stance, jumping, gravity, blocks
    ---------------------------------*/

    //Remove block from world and array
    function breakBlock() {
        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].getX() == boundBox.getX() && blocks[i].getY() == boundBox.getY()) {
                remove(blocks[i]);
                blocks.splice(i, 1);
            }
        }
    }
    
    //Draw block, add to array
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

    //Check that spot is clear before moving
    function movePlayer(x, y) {
        if (x > 0) {
            for (var i = 0; i < x; i++) {
                if (xClear(0)) {
                    player.move(1, 0);
                }
            }
        } else {
            for (var i = 0; i < -x; i++) {
                if (xClear(1)) {
                    player.move(-1, 0);
                }
            }
        }
    }
    
    //Crouch 'n' stuff
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

    //Spawn the player into the world!
    function spawnPlayer(x, y) {
        player = new WebImage(playerSkin);
        player.setPosition(x, y);
        add(player);
        
        setTimer(playerGravity, 10);
    }
    
    //Progressively falling player
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
    
    //Chris Cross will make you jump! Jump! Jump!
    function playerJump(startY) {
        if (!playerOnGround)
            return;
        
        playerOnGround = false;
        
        for (i = 0; i < startY + 12; i += 2) {
            player.move(0, -0.5);
        }
    }


    /* ===============
        GUI FUNCTIONS
       =============== 
    Hotbar, heads up display, etc.
    -------------------------------*/

    //Initialize the Heads-Up Display
    function initHUD() {
        var hotbar = new WebImage(IMG_HOTBAR);
        hotbar.setPosition(320 - 128, getHeight() - 45);
        add(hotbar);
        add(slot);
        drawHotbarItems();
        setHotbarSlot(0);
    }
    
    //Draw the blocks in their designated slots
    function drawHotbarItems() {
        for (var i = 0; i < 8; i++) {
            var temp = new WebImage(getBlockTexture(blockInSlot[i]));
            temp.setSize(25, 25);
            temp.setPosition((320 - 118) + (40 * i), getHeight() - 35);
            add(temp);
            slotArr.push(temp);
        }
    }
    
    //Figure out which block is in each slot
    function setHotbarSlot(slt) {
        slot.setPosition((320 - 128) + (40 * slt), getHeight() - 46);
        hotbarSlot = slt;
        blockInHand = getBlockInSlot(hotbarSlot);
    }
    
    function getBlockInSlot(slt) {
        return blockInSlot[slt];
    }

    //Hollow box that follows cursor to indicate block positions
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

    //Remove lines to re-draw
    function cleanGrid() {
        if (bboxUp) {
            remove(bboxUp);
            remove(bboxDown);
            remove(bboxLeft);
            remove(bboxRight);
        }
    }

    //Create a new bounding box
    function defineBoundBox(wid, hei, col) {
        var temp = new Rectangle(wid, hei);
        temp.setColor(col);
        temp.setPosition(0, 0);
        add(temp);
        
        return temp;
    }

    //ACTUAL fake grid, for determine whether things would overlap. (32px = 1 block)
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

    /* ================
        MISC FUNCTIONS
       ================ 
    Shapes, Input, etc. is here
    ----------------------------*/

    //when a key is pressed
    function keyDown(e) {
        if (e.keyCode == Keyboard.SPACE) {
            //playerJump(player.getY());
            return;
        }
        
        if (e.keyCode == Keyboard.letter('D')) {
            //player.move(3, 0);
            movePlayer(3, 0);
            if (playerDir == 1) {
                playerDir = 0;

                if (!playerStance)
                    player.setImage(playerSkin);
                else
                    player.setImage(playerSkinCrouch);
                player.setSize(32, 64);
            }
        } else if (e.keyCode == Keyboard.letter('A')) {
            movePlayer(-3, 0);
            if (playerDir == 0) {
                playerDir = 1;

                if (!playerStance)
                    player.setImage(playerSkinL);
                else
                    player.setImage(playerSkinCrouchL);
                player.setSize(32, 64);
            }
        }

        /*if (e.keyCode == Keyboard.letter('E')) {
            player.rotate(45);
        }*/
        
        if (e.keyCode == Keyboard.SHIFT) {
            changeStance();
        }

        if (e.keyCode == Keyboard.CTRL) {
            if (blockAction) {
                mouseClickMethod(placeBlock); 
            } else {
                mouseClickMethod(breakBlock);
            }

            blockAction = !blockAction;
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
    
    if (typeof start === 'function') {
        //readSplashes();
        start();
    }
    
};