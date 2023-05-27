var level = 2;              // 난이도 기본 설정 : 중(2)
var bossHP = 1000*level;    // 보스체력
var damage = 50;			// 피해량
var velocity = level;       // 벽돌 떨어지는 속도, 미니게임 속도

var soundEffect = 5;        // 효과음 크기
var BGM = 5;                // 배경음악 크기
var skip = false;           // 스토리 스킵 여부

var keyGameCount = 5;       // Key Game 반복 횟수
var keyGametimer = 100; // Key Game 남은 시간

var mole_catch=0;           // 두더지 잡은 횟수
var mole_miss=0;            // 두더지 놓친 횟수

var width, height;
var x = 150, y = 400, radius = 10;
var dmg=1;
var dx = 5, dy = 5;


var x_left, x_right;
var is_gameover = false;

//paddle
var paddlex, paddle_height, paddle_width;
var move_left = false, move_right = false;

var context;
var animation;
var start_time;
var intervalId;

var my_life = (4 - level) * 3;

var mainBgm = new Audio("mainBgm.mp3");
// main game canvas 기본 세팅
//var mainGameCanvas = document.getElementById("mainGameCanvas");
//var mainGameContext = mainGameCanvas.getContext('2d');

$(document).ready(function(){
    // 시작 화면 버튼 설정
    $(".menuButton").mouseover(function () {
        $(this).css({"color":"yellowgreen", "text-shadow":"-3px 0 #000, 0 3px #000, 3px 0 #000, 0 -3px #000"});
    });
    // $(".menuButton").mousedown(function () {
    //     $(this).css({"text-shadow":"-3px 0 #000, 0 3px #000, 3px 0 #000, 0 -3px #000"});
    // });
    // $(".menuButton").mouseup(function () {
    //     $(this).css({"text-shadow":"-3px 0 #000, 0 3px #000, 3px 0 #000, 0 -3px #000"});
    // });
    $(".menuButton").mouseout(function () {
        $(this).css({"color":"white", "text-shadow":"-3px 0 #000, 0 3px #000, 3px 0 #000, 0 -3px #000"});
    });

    // 난이도 변경 버튼 : 누를 때마다 난이도 변경(loop)
    $("#levelButton").on("click", function () {
        selectSound.load();
        selectSound.play();
        var levelText = $(this).text();
        if (levelText == "난이도 : 하") {
            level = 2;
            $(this).text("난이도 : 중");
        }
        if (levelText == "난이도 : 중") {
            level = 3;
            $(this).text("난이도 : 상");
        }
        if (levelText == "난이도 : 상") {
            level = 1;
            $(this).text("난이도 : 하");
        }
        console.log("level :", level);
        bossHP = 1000*level;
        velocity = level;
    });

    // 환경 설정 버튼 : 누르면 환경설정으로 이동
    $("#settingButton").on("click", function () {
        selectSound.load();
        selectSound.play();
        $("#startScreen").addClass("offScreen");
        $("#settingScreen").removeClass("offScreen");
    });

    // 홈 버튼 : 환경 설정에서 시작 화면으로 이동
    $("#homeButton").on("click", function () {
        selectSound.load();
        selectSound.play();
        $("#settingScreen").addClass("offScreen");
        $("#startScreen").removeClass("offScreen");
    });
    $("#homeButton").mouseover(function() {
        $(this).attr("src", "home_button_mouseover.png");
    });
    $("#homeButton").mouseout(function() {
        $(this).attr("src", "home_button.png");
    });

    // 효과음 수정
    $("#soundEffect").on("click", function () {
        $("#soundEffectNum").text($(this).val());
        soundEffect = parseInt($(this).val());
        console.log("sound effect :", soundEffect);
    });
    // 배경음악 수정
    $("#BGM").on("click", function () {
        $("#BGMNum").text($(this).val());
        BGM = parseInt($(this).val());
        mainBgm.volume = BGM/10;
        console.log("BGM :", BGM);
    });

    // 게임 시작 버튼
    $("#startButton").on("click", function () {
        startEff.play();
        $("#startScreen").addClass("offScreen");
        $("#storyScreen").removeClass("offScreen");
        mainBgm.loop = true;
        mainBgm.play();
        var showTime = 2300;
        var term = 2000;

        // Scene #1
        $("#scene1Start").fadeOut(term);
        setTimeout(function() {
            $("#scene1End").fadeIn(term);
            setTimeout(function() {
                $("#scene1").addClass("offScreen");
                $("#scene2").removeClass("offScreen");
            }, term);
        }, term+showTime);

        // Scene #2
        setTimeout(function() {
            $("#scene2Start").show().fadeOut(term);
            setTimeout(function() {
                $("#scene2End").fadeIn(term);
                setTimeout(function() {
                    $("#scene2").addClass("offScreen");
                    $("#scene3").removeClass("offScreen");
                }, term);
            }, term+showTime);
        }, showTime+2*term);

        // Scene #3
        setTimeout(function() {
            $("#scene3Start").show().fadeOut(term);
            setTimeout(function() {
                $("#scene3End").fadeIn(term);
                setTimeout(function() {
                    $("#scene3").addClass("offScreen");
                    $("#scene4").removeClass("offScreen");
                }, term);
            }, term+showTime);
        }, (showTime+2*term)*2);

        // Scene #4
        setTimeout(function() {
            $("#scene4Start").show().fadeOut(term);
            setTimeout(function() {
                $("#scene4End").fadeIn(term);
                setTimeout(function() {
                    $("#scene4").addClass("offScreen");
                    if (!skip) {
                        startGame();
                    }
                }, term);
            }, term+showTime);
        }, (showTime+2*term)*3);
    });

    // 스토리 스킵 버튼 설정
    $("#skipButton").mouseover(function () {
        $(this).css({"top":"548px", "width":"788px", "text-shadow":"2px 2px 0 darkgray"});
    });
    $("#skipButton").mousedown(function () {
        $(this).css({"top":"550px", "width":"790px", "text-shadow":"none"});
		setTimeout(function() {
			$("#skipButton").mouseup(function() {
				$(this).css({"top":"548px", "width":"788px", "text-shadow":"2px 2px 0 darkgray"});
			});
		}, 210);
    });
    $("#skipButton").mouseout(function () {
        $(this).css({"top":"550px", "width":"790px", "text-shadow":"none"});
    });

    // 스토리 스킵하면 메인 게임 시작
    $("#skipButton").on("click", function () {
        skip = true;
		$("#skipCurtain").css({"margin":"300px 400px", "width":"0", "height":"0", "opacity":"0"});
		$("#skipCurtain").show();
		$("#skipCurtain").animate({"margin":"0", "width":"800px", "height":"600px", "opacity":"1"}, 700);
		setTimeout(startGame, 1000);
    });

    $("#key_game_textField").keydown(function(e){
        var keys = $(".input_keys").get();
        var i = 0;
        while(keys[i].style.display=="none"){
            i++;
        }
        console.log(keys[i].getElementsByTagName("img")[0].getAttribute("value"));
        if(keys[i].getElementsByTagName("img")[0].getAttribute("value")=="0"){
            if(e.keyCode=="40"){
                keys[i].style.display="none";
                console.log(keys[i]);
            }
            else{
                keyGametimer -= 5;
            }
        }
        else if(keys[i].getElementsByTagName("img")[0].getAttribute("value")=="1"){
            if(e.keyCode=="38"){
                keys[i].style.display="none";
                console.log(keys[i]);
            }
            else{
                keyGametimer -= 5;
            }
        }
        else if(keys[i].getElementsByTagName("img")[0].getAttribute("value")=="2"){
            if(e.keyCode=="37"){
                keys[i].style.display="none";
                console.log(keys[i]);
            }
            else{
                keyGametimer -= 5;
            }
        }
        else if(keys[i].getElementsByTagName("img")[0].getAttribute("value")=="3"){
            if(e.keyCode=="39"){
                keys[i].style.display="none";
                console.log(keys[i]);
            }
            else{
                keyGametimer -= 5;
            }
        }
    });

    $("#mole").mousedown(function() {
        if($("#mole img:first-child").attr("src")=="koopa.png"){ // 잡기 전인 경우에만
            breakSound.play();
            mole_catch++;
            catchcmiss_show();
            $("#mole").empty();
            var image=$("<img>").attr("src", "koopa shell.png");
            image.css({
                width: 60,
                height: 60
            });
            $("#mole").append(image);

            clearInterval(moletimer);
            setTimeout(function() { // 잡았을 시 잠시 대기
                moletimer=setInterval(mole_pop,825-75*level);
            }, 100);
        }
    });
    // $("#mole").on("click",function(){
    //     if($("#mole img:first-child").attr("src")=="mole.png"){ // 잡기 전인 경우에만
    //         mole_catch++;
    //         catchcmiss_show();
    //         $("#mole").empty();
    //         var image=$("<img>").attr("src", "catch_mole.png");
    //         image.css({
    //             width: 100,
    //             height: 100
    //         });
    //         $("#mole").append(image);

    //         clearInterval(moletimer);
    //         setTimeout(function() { // 잡았을 시 잠시 대기
    //             moletimer=setInterval(mole_pop,850-100*level);
    //         }, 100);
    //     }
    // });


    // 보스의 피가 75%인 경우 Key Game 실행
    $("#HP75").on("click", function () {
        bossHP = 1000 * level * 0.75 + damage;
    });
    // 보스의 피가 50%인 경우 Board Game 실행
    $("#HP50").on("click", function () {
        bossHP = 1000 * level * 0.50 + damage;
    });
    // 보스의 피가 25%인 경우 Mole Game 실행
    $("#HP25").on("click", function () {
        bossHP = 1000 * level * 0.25 + damage;
    });
    $("#HP05").on("click", function () {
        bossHP = 1000 * level * 0.05;
    })
    
});

// 게임 시작 함수
var start = false;
function startGame() {
    if (!start) {
        start = true;
        $("#storyScreen").addClass("offScreen");
        $("#main_game").removeClass("offScreen");
        mainBgm.setAttribute("src","countdown.wav");
        mainBgm.loop = false;
        mainBgm.play();
        $("#countDown3").fadeOut(1200);
        setTimeout(function() {
            $("#countDown2").show().fadeOut(1300);
            setTimeout(function() {
                $("#countDown1").show().fadeOut(1100);
                setTimeout(function() {
                    start_time = new Date();
                    main_game(); 
                    init_paddle(); 
                }, 1200);
            }, 1300);
        }, 1100);
    }
}

//phase 2
function goPhase2(){
    mainBgm.setAttribute("src","phase2.mp3");
    console.log(mainBgm.src);
    mainBgm.play();
}

let backImg = new Image(); // 배경이미지
let ballImg = new Image(); // 볼 이미지
let marioImg = new Image(); // 마리오 이미지
let brickImg = new Image();
let bricks = []; // 벽돌듯
let effectSound = [paddleEffect, breakSound, missSound,hit1,hit2,laugh, miniGameFail, miniGameClear, selectSound, finalPhase, bounce];

let hit = [hit1,hit2];
var paddleEffect = new Audio("fireball.mp3");
var breakSound = new Audio("break.wav");
var missSound = new Audio("miss.mp3");
var hit1 = new Audio("hit1.mp3");
var hit2 = new Audio("hit2.mp3");
var laugh = new Audio("startminiGame.mp3");
var startEff = new Audio("start.mp3");
var miniGameFail = new Audio("fail.mp3");
var miniGameClear = new Audio("clearMini.mp3");
var selectSound = new Audio("select.mp3");
var finalPhase = new Audio("finalPhase.mp3");
var bounce = new Audio("bounce.mp3");
var hitstack = 0;
var isBall = false; // 공이 있는지
//main game 함수
function main_game() {
    mainBgm.loop = true;
    mainBgm.src = "phase1.mp3";
    mainBgm.play();
    //canvas 가져오기
    var $c = $('#mainGameCanvas');

    context = $c.get(0).getContext('2d');
    width = $c.width();
    height = $c.height();

    x_left = $c.offset().left;
    x_right = $c.offset().right;

    backImg.src = "background.png";
    ballImg.src = "fireball.png";
    marioImg.src = "mario.png";
    brickImg.src = "brick.png";
    brickInterval();
    brickGenerator();
    animation = window.requestAnimationFrame(draw_main_game);
}

//효과음 볼륨
function effectSoundVolume(){
    for(var i = 0; i<effectSound.length;i++){
        effectSound[i].volume = soundEffect/10;
    }
}
var generate;
var initInterval = level * 3000;
var playFinalPhase = false; 
function brickGenerator(){
    generate = setInterval(brickInterval,initInterval);
}
function brickInterval(){
    var pos = Math.floor(Math.random()*4);
    init_Brick(pos);
    if(bossHP<=500*level){
        pos = Math.floor(Math.random()*4);
        init_Brick(pos);
    }
    if(bossHP<=150*level){
        if(playFinalPhase == false){
            playFinalPhase = true;
            finalPhase.play();
        }
        pos = Math.floor(Math.random()*4);
        init_Brick(pos);
    }
}
// 벽돌 생성
function init_Brick(position){
    var brick = {
        posX : position * width/4,
        posY : 0,
        check : function(){
            if((((x < this.posX)&&(x > this.posX-radius))||((x>this.posX+200)&&(x < this.posX+200+radius)))&&((y>this.posY) && (y<this.posY+66))){
                return -2;
            }
            else if((x > this.posX && x < this.posX+200)&&((y>this.posY) && (y<this.posY+66))){
                return -1;
            }
            else if(this.posY>600){
                return 0;
            }
            else{
                return 1;
            }
        }
    };
    bricks.push(brick);
}

function brickManager(){
    for(var i = 0; i<bricks.length; i++){
        bricks[i].posY += level/4;
        var C = bricks[i].check();
        if(C == -1){
            bricks.splice(i,1);
            breakSound.play();
            dy = -dy;
            dmg=1;
            if(ballImg.src == "fireballup.png"){
                ballImg.setAttribute("src","fireball.png");
            }
            break;
        }else if(C == -2){
            bricks.splice(i,1);
            breakSound.play();
            dx = -dx;
            dmg=1;
            if(ballImg.src == "fireballup.png"){
                ballImg.setAttribute("src","fireball.png");
            }
            break;
        }
        else if(C == 0){
            bricks.splice(i,1);
            missSound.play();
            my_life--;
        }else{
            context.drawImage(brickImg,bricks[i].posX,bricks[i].posY,200,66);
        }
    }
}
function draw_main_game() {
    console.log(dmg);
    clear();
    draw_life();
    context.drawImage(backImg,0,0,800,600);
    drawLives();
    brickManager();

    //key 입력 event
    $(document).on('keydown', function(e) {
        if (e.which == 37) {
            move_left = true;
        } 
        else if (e.which == 39) {
            move_right = true;
        }
    });
    $(document).on('keyup', function(e) {
        if (e.which == 37) {
           move_left = false;
        } else if (e.which == 39) {
         move_right = false;
        }
    });
    $(document).on('keyup',function(e){
        if(e.which == 32 && !isBall){
            x=paddlex+50;
            dx=0;
            y=height-paddle_height-15;
            dy = -dy;
            isBall = true;
        }
    })
    //ball 과 paddle 그리기
    if(isBall){

        ball(x, y, radius);
        x += dx;
        y += dy; 
    }

    paddle(paddlex, height - paddle_height, paddle_width, paddle_height);

    /*
    //draw bricks
    for (i = 0; i < row_number; i++) { 
        for (j = 0; j < col_number; j++) {
            if (bricks[i][j] >= 30) {    
                rect(j * brick_width, i * brick_height + 200, brick_width - 1, brick_height -1); // +200 지움
            }
        }
    }
    */
    //paddle 움직이기
    if (move_left && paddlex > 0) { // 왼쪽으로 이동
        paddlex -= 10;
    }
    if (move_right && paddlex + paddle_width < width) { // 오른쪽으로 이동
        paddlex += 10;
    }
    /*
    //벽돌에 부딪혔을 때
    if(y>200){
        var row = Math.floor( (y-200)  / (brick_height) );
    }
    
    var col = Math.floor( x / (brick_width));
    if (row < row_number) { 
        if (bricks[row][col] >= 30) {
            dy = -dy;
            bricks[row][col] = 0;
        }
    }
*/
    //벽에 부딪혔을 때
    if (x >= width - radius || x <= 0 + radius) {
        bounce.play();
        dx = -dx;
        dmg=2;
        ballImg.setAttribute("src","fireballup.png");
        
    }

    //천장에 부딪혔을 때
    if (y <= 0) {
        if((bossHP-damage)/level == 750 || (bossHP-damage)/level == 500 || (bossHP-damage)/level == 250 || (bossHP - damage*dmg) < 0){
            dmg = 1;
        }
        bossHP -= damage*dmg;
        
        dmg=1;
        if(ballImg.getAttribute("src") == "fireballup.png"){
            ballImg.setAttribute("src","fireball.png");
        }

        dy = -dy;

        if(hitstack==0){
            hit1.play();
            hitstack = (hitstack+1)%2;
        }else{
            hit2.play();
            hitstack = (hitstack+1)%2;
        
        }


        console.log("Boss HP : " + bossHP);

        // 미니게임 실행
        if ((bossHP == 1000*level*0.75)||(bossHP == 1000*level*0.5)||(bossHP == 1000*level*0.25)||(bossHP == 0)) {
            is_gameover = true;
            $("#waitScreen").removeClass("offScreen");
            if (bossHP == 1000*level*0.75) {
                laugh.play();
                keyGame();
            }
            if (bossHP == 1000*level*0.5) {
                laugh.play();
                board_game();
                goPhase2();
            }
            if (bossHP == 1000*level*0.25) {
                laugh.play();
                wam_game();
            }
            if (bossHP == 0) {
                mainBgm.setAttribute("src","winGame.mp3");
                mainBgm.loop = false;
                mainBgm.play();
                $("#main_game").addClass("offScreen");
                $("#winEndingScreen").removeClass("offScreen");
                return;
            }
        }
    }

    //바닥에 부딪히기 전에
    else if (y >= height - radius - paddle_height) {
        if(isBall){
            //paddle에 부딪힌다면
            if ((x >= paddlex && x <= paddlex + paddle_width)&&(y==height-radius-paddle_height)) {
                dx = -((paddlex + (paddle_width/2) - x)/(paddle_width)) * 10;
                dy = -dy;
                paddleEffect.play();
            }
           
            else {  //paddle에 부딪히지 않고
                if (y == height - radius) { // 바닥에 부딪힌다면
                    isBall = false;
                    dy = -dy;
                    my_life--;
                    draw_life();
                    missSound.play();
                    if(my_life <= 0){
                        is_gameover = true;
                    }
                }
            }
        }

    }
    if (is_gameover) {
        window.cancelAnimationFrame(anim); // 게임 종료
        clearInterval(generate);
        clearInterval(intervalId);  

        generate = null;
        if (my_life <= 0) {
            mainBgm.setAttribute("src","gameover.mp3");
            mainBgm.loop = false;
            mainBgm.play();
            $("#loseEndingScreen").fadeIn(3000);
            setTimeout(function() {
                $("#main_game").addClass("offScreen");
            }, 3000);
        }
    } 
    else {
        intervalId = setInterval(updateElapsedTime, 1000);
        anim = window.requestAnimationFrame(draw_main_game);
        if(generate==null){
            generate = setInterval(brickInterval,initInterval);
        }
    }
}

function clear() {
    
    context.clearRect(0, 0, width, height);
}

// 공 그리기
function ball(x, y, r) {
    /*
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
    */
    context.drawImage(ballImg,x,y,2*r,2*r);
}

// paddle & 벽돌 그리기
function rect(x, y, w, h) {
    context.beginPath();
    context.rect(x, y, w, h);
    context.closePath();
    context.fill();
}
function paddle(x,y,w,h){
    context.drawImage(marioImg,x,y-40,w,100);
}

//main game의 paddle 설정
function init_paddle() {
    paddlex = width / 2;
    paddle_height = 20;
    paddle_width = 100;
}
/*
//main game의 벽돌 설정
function init_bricks() {
    row_number = 3;
    col_number = 4;
    PADDING = 5;
    brick_width = (width / col_number);
    brick_height = 50;

    bricks = new Array(row_number);
    for (i = 0; i < row_number; i++) {
        bricks[i] = new Array(col_number);
        for (j = 0; j < col_number; j++) {
            bricks[i][j] = (Math.random()*99)+1;
        }
    }
}
*/
//main game에 사용자 life와 보스 Hp 출력
function draw_life(){

    var Hp_bar = document.getElementById('prog');
    var Boss_HP = bossHP / (10*level);
    Hp_bar.style.width=Boss_HP+"%";
    Hp_bar.innerHTML= bossHP+"/"+(1000*level)+" ("+Boss_HP+"%)";
}
function drawLives() {

    const lifeImage = new Image();
    lifeImage.src = 'heart.png';
    const imageWidth = 30; // 이미지의 가로 크기
    const imageHeight = 30; // 이미지의 세로 크기

    for (let i = 0; i < my_life; i++) {
        const x = i * (imageWidth + 10); // 이미지 간격을 조절하려면 숫자를 조정하세요.
        const y = 10; // 이미지의 y 좌표

    context.drawImage(lifeImage, x, y, imageWidth, imageHeight);
    }
}
function updateElapsedTime() {
    var current_time = new Date(); // 현재 시간
    var elapsed_time = current_time - start_time; // 경과한 시간 계산 (밀리초 단위)
  
    // 걸린 시간을 적절한 형식으로 변환하여 출력
    var minutes = Math.floor(elapsed_time / 60000); // 분 계산
    var seconds = Math.floor((elapsed_time % 60000) / 1000); // 초 계산

    // 출력을 원하는 HTML 요소에 경과 시간을 동적으로 표시
    var timeDisplay = document.getElementById('time-display');
    timeDisplay.textContent = '경과 시간: ' + minutes + ' : ' + seconds ;
}
// Key Game 함수
var keyGameFirst = false;
function keyGame(){
    var arrows = ["key_down.png", "key_up.png","key_left.png","key_right.png"];
    var steps = [0,0,0,0,0];
    keyGametimer = 100;
    for(var i = 0; i<5;i++){
        steps[i] = Math.floor(Math.random()*4);
    }
    var keyImg = $(".key_img").get();
    for(var i = 0; i<5; i++){
        keyImg[i].src = arrows[steps[i]];
        keyImg[i].setAttribute("value",steps[i]);
    }
    
    $("#key_game").css({"margin":"300px 400px", "width":"0", "height":"0"});
    $("#key_zone").css({"width":"0", "height":"0"});
    $(".key_img").css({"width":"0", "height":"0"});
    $(".game_CountBar").css({"width":"0", "height":"0"});

    $(".input_keys").css("display","block");
    $("#key_game").removeClass("offScreen");

    if (!keyGameFirst) {
        keyGameFirst = true;
        $("#key_game").animate({"margin":"250px 200px", "width":"400px", "height":"100px"});
        $("#key_zone").animate({"width":"400px", "height":"80px"});
        $(".key_img").animate({"width":"70px", "height":"70px"});
        $(".game_CountBar").animate({"width":"360px", "height":"10px"});
    }
    $("#key_game").css({"margin":"250px 200px", "width":"400px", "height":"100px"});
    $("#key_zone").css({"width":"400px", "height":"80px"});
    $(".key_img").css({"width":"70px", "height":"70px"});
    $(".game_CountBar").css({"width":"360px", "height":"10px"});

    var downloadTimer = setInterval(function(){
        $("#key_game_textField").find("input").focus();
        if($(".input_keys").get()[4].style.display=="none"){
            ClearKeyGame();
        }
        if(keyGametimer<=0){
            FailKeyGame();
        }
        $(".count_Mainbar").css("width",keyGametimer+"%");
        keyGametimer -= (level/10);
    },5);
    function ClearKeyGame(){
        clearInterval(downloadTimer);
        if(keyGameCount>1){
            keyGameCount--;
            console.log(keyGameCount);
            keyGame();
        }
        else{
            //$("#key_game").addClass("offScreen");
            miniGameClear.play();
            console.log("Success");
            EndKeyGame();
        }
    }
    function FailKeyGame(){
        keyGameFirst = false;
        keyGameCount=5;
        clearInterval(downloadTimer);
        //$("#key_game").addClass("offScreen");
        bossHP += 5*damage;
        miniGameFail.play();
        console.log("Fail");
        EndKeyGame();
    }
    function EndKeyGame() {
        $("#key_game").addClass("offScreen");
        miniGameEnd();
    }
}

function drawBossHP() {

}

//Board Game 함수
var rows = 3;
var columns = 3;
var text = "";
var currTile;
var otherTile; //blank tile
var imgOrder = [];
var backup = [];
var turns = 0;
var max_turn = 0;
var intervals = [];

//var imgOrder3x3 = ["1", "3", "2", "4", "5", "6", "7", "8", "9"];
//var imgOrder5x5 = ["1", "2", "3", "5", "4", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25"];
//var imgOrder4x4 = ["1", "2", "4", "3", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
var imgOrder3x3 = ["4", "2", "8", "5", "1", "6", "7", "9", "3"];
var imgOrder5x5 = ["13", "3", "6", "5", "11", "9", "20", "24", "21", "4", "12", "17", "23", "18", "15", "7", "22", "10", "1", "16", "8", "14", "19", "2", "25"];
var imgOrder4x4 = ["15", "3", "16", "14", "7", "13", "6", "1", "8", "12", "2", "4", "10", "9", "5", "11"];

var boardGameFirst = false;
function board_game() {
    keyGametimer = 100;
    var downloadTimer = setInterval(function(){
        if(keyGametimer <=0){
            clearInterval(downloadTimer);
            intervals = [];
            boardGameFirst = false;
            var parent = document.getElementById("board");
            miniGameFail.play();
            bossHP += 5*damage;
            $("#board_game").addClass("offScreen");
            miniGameEnd();
            while (parent.hasChildNodes()) {
                parent.removeChild(parent.children[0]);
            }
        }
        $(".count_Mainbar").css("width",keyGametimer+"%");
        if(level == 1){
            keyGametimer -= 0.05;
        }else if(level == 2){
            keyGametimer -= 0.01;
        }else
            keyGametimer -= 0.005;
    },5);
    intervals.push(downloadTimer);
    var num = 0;
    if(level == 3){
        rows = 5;
        columns = 5;
    }else if(level == 2){
        rows = 4;
        columns = 4;
    }else{
        rows = 3;
        columns = 3;
    }

    turns=0;
    if(rows == 4){
        imgOrder = imgOrder4x4;
        backup = imgOrder4x4;
        max_turn = 40; 
    }if(rows == 5){
        imgOrder = imgOrder5x5;
        backup = imgOrder5x5;
        max_turn = 50; 
    }if(rows == 3){
        imgOrder = imgOrder3x3;
        backup = imgOrder3x3;
        max_turn = 15;
    }else{}

    
    for (let r=0; r < rows; r++) {
        for (let c=0; c < columns; c++) {
            //<img id="0-0" src="1.jpg">
            var tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "img"+rows+"/"+imgOrder[num]+ ".jpg";

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart);  //click an image to drag
            tile.addEventListener("dragover", dragOver);    //moving image around while clicked
            tile.addEventListener("dragenter", dragEnter);  //dragging image onto another one
            tile.addEventListener("dragleave", dragLeave);  //dragged image leaving anohter image
            tile.addEventListener("drop", dragDrop);        //drag an image over another image, drop the image
            tile.addEventListener("dragend", dragEnd);      //after drag drop, swap the two tiles
            document.getElementById("board").append(tile);
            num++;
        }
    }

    var imgSize;
    if(rows == 4){
        imgSize = "120px";
    }if(rows == 5){
        imgSize = "96px";
    }if(rows == 3){
        imgSize = "160px";
    }else{}

    if (!boardGameFirst) {
        $("#board_game").css({"margin":"300px 400px", "width":"0", "height":"0"});
        $("#board").css({"width":"0", "height":"0"});
        $("#board").find("img").css({"width":"0", "height":"0"});
        $("#board_game").removeClass("offScreen");
        $("#board_game").animate({"margin":"25px 125px", "width":"550px", "height":"550px"});
        $("#board").animate({"width":"480px", "height":"480px"});
        $("#board").find("img").animate({"width":imgSize, "height":imgSize});
        $("#board_game").css({"margin":"25px 125px", "width":"550px", "height":"550px"});
        $("#board").css({"width":"480px", "height":"480px"});
        $("#board").find("img").css({"width":imgSize, "height":imgSize});
    }
}

function checkWin(){
    var parent = document.getElementById("board");
    text = "";
    var winning_cond = 0;
    for(i=1; i < parent.childNodes.length; i++){
        var child= parent.childNodes[i];
        var img_src  = child.src;
        let arr = img_src.split("/");
        let arr2 = arr.pop().split(".");
        text = arr2[0];
        if(i == parseInt(text)){
            winning_cond++
        }else{
            winning_cond = 0;
        }
        if (winning_cond == (rows*columns)){
            miniGameClear.play();
            clearInterval(intervals[0]);
            intervals = [];
            $("#board_game").addClass("offScreen");
            miniGameEnd();
            while (parent.hasChildNodes()) {
                parent.removeChild(parent.children[0]);
            }
        }
    }
}

function dragStart() {
    currTile = this; //this refers to the img tile being dragged
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this; //this refers to the img tile being dropped on
}

function dragEnd() {
    let currCoords = currTile.id.split("-"); //ex) "0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = r == r2 && c2 == c-1;
    let moveRight = r == r2 && c2 == c+1;

    let moveUp = c == c2 && r2 == r-1;
    let moveDown = c == c2 && r2 == r+1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    
    let currImg = currTile.src;
    let otherImg = otherTile.src;

    currTile.src = otherImg;
    otherTile.src = currImg;
    checkWin();    
}
// 두더지 잡기 게임
var moletimer;
var wamFirst = false;
function wam_game(){
    mole_catch = 0;
    mole_miss = 0;
    $("#whack-a-mole_game").removeClass("offScreen");
    if (!wamFirst) {
        wamFirst = true;
        $("#whack-a-mole_game").css({"margin":"300px 400px", "width":"0", "height":"0"});
        $("#whack-a-mole_game").animate({"margin":"0", "width":"800px", "height":"600px"});
        $("#whack-a-mole_game").css({"margin":"0", "width":"800px", "height":"600px"});
    }
    moletimer = setInterval(mole_pop,825-75*level); // 난이도에 따라 시간 감소
}

// 두더지 출몰 함수
function mole_pop(){
    molegame_winlose_chk();
    if($("#mole img:first-child").attr("src")=="koopa.png"){
        mole_miss++;
        catchcmiss_show();
    }
    // 화면 내 랜덤한 좌표에 두더지 출몰
    var randomX = Math.floor(Math.random() * (700));
    var randomY = Math.floor(Math.random() * (500));
    if(randomX<250 && randomY<50){ //잡은 횟수 놓친 횟수 글자를 가릴 경우 처리
        randomX+=250;
        randomY+=50;
    }
    var image=$("<img>").attr("src", "koopa.png");
    image.css({
        width: 100,
        height: 100
    });
    $("#mole").empty();
    $("#mole").css({
        left: randomX+"px",
        top: randomY+"px"
    });
    $("#mole").append(image);
}

// 두더지 잡은 횟수, 놓친 횟수 표시 함수
function catchcmiss_show(){ 
    document.getElementById("catch").innerText = "잡은 횟수: "+mole_catch+" / 놓친 횟수: "+mole_miss;
}

// mole game 승리 패배 확인 함수
function molegame_winlose_chk(){
    if(mole_catch>=3+level*2){ // 두더지 게임 승리
        miniGameClear.play();
        clearInterval(moletimer);
        $("#whack-a-mole_game").addClass("offScreen");
        miniGameEnd();
    }
    if(mole_miss>=5){ // 두더지 게임 패배
        wamFirst = false;
        miniGameFail.play();
        bossHP += 5*damage;
        clearInterval(moletimer);
        $("#whack-a-mole_game").addClass("offScreen");
        miniGameEnd();
    }
}

function miniGameEnd() {
    is_gameover = false;
    anim = requestAnimationFrame(draw_main_game);
    $("#waitScreen").addClass("offScreen");
}