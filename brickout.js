var level = 2;              // 난이도 기본 설정 : 중(2)
var bossHP = 1000*level;    // 보스체력
var velocity = level;       // 벽돌 떨어지는 속도, 미니게임 속도
var soundEffect = 5;        // 효과음 크기
var BGM = 5;                // 배경음악 크기
var keyGameCount = 5;       // Key Game 반복 횟수




var width, height;
var x = 150, y = 400, radius = 10;
var dx = 5, dy = 5;

var x_left, x_right;
var is_gameover = false;

//paddle
var paddlex, paddle_height, paddle_width;
var move_left = false, move_right = false;

//bricks
var bricks;
var row_number; // 벽돌의 행 갯수
var col_number; // 벽돌의 열 갯수
var brick_width;
var brick_height;
var PADDING;

var context;
var animation;
        
var boss_life = 100;
var my_life = 3;

// main game canvas 기본 세팅
//var mainGameCanvas = document.getElementById("mainGameCanvas");
//var mainGameContext = mainGameCanvas.getContext('2d');

$(document).ready(function(){
    // 시작 화면 버튼 설정
    $(".menuButton").mouseover(function () {
        $(this).css({"text-shadow":"0 3px 0 darkgreen", "font-size":"35px"});
    });
    $(".menuButton").mousedown(function () {
        $(this).css({"text-shadow":"none", "line-height":"86px"});
    });
    $(".menuButton").mouseup(function () {
        $(this).css({"text-shadow":"0 3px 0 darkgreen", "line-height":"80px"});
    });
    $(".menuButton").mouseout(function () {
        $(this).css({"text-shadow":"none", "line-height":"80px", "font-size":"33px"});
    });

    // 난이도 변경 버튼 : 누를 때마다 난이도 변경(loop)
    $("#levelButton").on("click", function () {
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
        $("#startScreen").addClass("offScreen");
        $("#settingPage").removeClass("offScreen");
    });

    // 홈 버튼 : 환경 설정에서 시작 화면으로 이동
    $("#homeButton").on("click", function () {
        $("#settingPage").addClass("offScreen");
        $("#startScreen").removeClass("offScreen");
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
        console.log("BGM :", BGM);
    });

    // 게임 시작 버튼
    $("#startButton").on("click", function () {
        $("#startScreen").addClass("offScreen");
        $("#storyScreen").removeClass("offScreen");
    });

    // 스토리 스킵 버튼 설정
    $(".skipButton").mouseover(function () {
        $(this).css({"font-size":"32px", "text-shadow":"0 2px 0 white"});
    });
    $(".skipButton").mousedown(function () {
        $(this).css({"bottom":"28px", "text-shadow":"none"});
    });
    $(".skipButton").mouseout(function () {
        $(this).css({"font-size":"30px", "text-shadow":"none"});
    });

    // 스토리 씬#1 스킵하면 씬#2 등장; 정확한 씬 개수는 아직 안정함.
    $("#skip1").on("click", function () {
        $("#scene1").addClass("offScreen");
        $("#scene2").removeClass("offScreen");
    });

    // 스토리 씬#2 스킵하면 씬#3 등장
    $("#skip2").on("click", function () {
        $("#scene2").addClass("offScreen");
        $("#scene3").removeClass("offScreen");
    });

    // 스토리 씬#3 스킵하면 메인 게임 시작
    $("#skip3").on("click", function () {
        $("#scene3").addClass("offScreen");
        $("#main_game").removeClass("offScreen");
         main_game();
            init_faddle(); 
            init_bricks();
    });

    $(document).on('keydown', function(e) {
        if (e.which == 37) {
            move_left = true;
        } else if (e.which == 39) {
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


    $("#key_game_textField").keydown(function(e){
        var keys = $(".input_keys").get();
        var i = 0;
        while(keys[i].style.display=="none"){
            i++;
        }
        console.log(keys[i].getElementsByTagName("img")[0].getAttribute("value"));
        if(keys[i].getElementsByTagName("img")[0].getAttribute("value")=="0"&& e.keyCode=="40"){
            keys[i].style.display="none";
            console.log(keys[i]);
        }
        else if(keys[i].getElementsByTagName("img")[0].getAttribute("value")=="1"&& e.keyCode=="38"){
            keys[i].style.display="none";
            console.log(keys[i]);
        
        }
        else if(keys[i].getElementsByTagName("img")[0].getAttribute("value")=="2"&& e.keyCode=="37"){
            keys[i].style.display="none";
            console.log(keys[i]);
        
        }
        else if(keys[i].getElementsByTagName("img")[0].getAttribute("value")=="3"&& e.keyCode=="39"){
            keys[i].style.display="none";
            console.log(keys[i]);
        
        }
    });


    // 보스의 피가 75%인 경우 Key Game 실행
    $("#HP75").on("click", function () {
        bossHP = bossHP * 0.75;
        $("#main_game").addClass("offScreen");
        keyGame();
    });
    // 보스의 피가 50%인 경우 Board Game 실행
    $("#HP50").on("click", function () {
        bossHP = bossHP * 0.50;
        $("#main_game").addClass("offScreen");
        board_game();
    });
});

//brick out 함수
function main_game() {
    //canvas 가져오기
    var $c = $('#mainGameCanvas');
    context = $c.get(0).getContext('2d');
    width = $c.width();
    height = $c.height();

    x_left = $c.offset().left;
    x_right = $c.offset().right;
    
    animation = window.requestAnimationFrame(draw);
}
function draw() {
    clear();
    draw_life();
    draw_boss_life();
    //draw ball
    ball(x, y, radius);

    //draw paddle
    rect(paddlex, height - paddle_height, paddle_width, paddle_height);

    //draw bricks
    for (i = 0; i < row_number; i++) { 
        for (j = 0; j < col_number; j++) {
            if (bricks[i][j] >= 30) {    
                rect(j * brick_width, i * brick_height+ 200, brick_width - 1, brick_height -1); // +200 지움
            }
        }
    }

    //draw boss
//    rect(width/2-30, 100, 60, 60);

    //move ball
    x += dx;
    y += dy; 

    //move pannel
    if (move_left && paddlex > 0) { // 왼쪽으로 이동
        paddlex -= 5;
    }
    if (move_right && paddlex + paddle_width < width) { // 오른쪽으로 이동
        paddlex += 5;
    }

    //Hit Bricks
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
    //벽에 부딪혔을 때
    if (x >= width - radius || x <= 0 + radius) {
        dx = -dx;
    }
    //천장에 부딪혔을 때
    if (y <= 0 + radius) {
        dy = -dy;
    }
    //바닥에 부딪혔을 때
    else if (y >= height - radius) {
        //paddle에 부딪힌다면
        if (x > paddlex && x < paddlex + paddle_width) {
            dx = -((paddlex + (paddle_width/2) - x)/(paddle_width)) * 10;
            dy = -dy;
        }
        //paddle에 부딪히지 않는다면
        else {
            dy = -dy;
            my_life--;
            if(!my_life){
                draw();
                is_gameover = true;
            }
        }
    }
//    if (y>100&&y<160&&x>width/2-30&&x<width/2+30){
//        boss_life--;
//    }
    if (is_gameover) {
        window.cancelAnimationFrame(anim); // 게임 종료
    } 
    else {
        anim = window.requestAnimationFrame(draw); // 이어서 그림 
    }
}
function clear() {
    context.clearRect(0, 0, width, height);
}

function ball(x, y, r) {
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
}

function rect(x, y, w, h) {
    context.beginPath();
    context.rect(x, y, w, h);
    context.closePath();
    context.fill();
}

function init_faddle() {
    paddlex = width / 2;
    paddle_height = 10;
    paddle_width = 75;
}

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
function draw_life(){
    context.font = "16px Arial";
    context.fillStyle = "#234529";
    context.fillText("life : " + my_life, 8, 20);
}
function draw_boss_life(){
    context.font = "16px Arial";
    context.fillStyle = "#234529";
    context.fillText("Boss : "+boss_life, width - 80, 20);
}


// Key Game 함수
function keyGame(){
    $(".input_keys").css("display","block");
    $("#key_game").removeClass("offScreen");
    var arrows = ["key_down.png", "key_up.png","key_left.png","key_right.png"];
    var steps = [0,0,0,0,0];
    for(var i = 0; i<5;i++){
        steps[i] = Math.floor(Math.random()*4);
    }
    var keyImg = $(".key_img").get();
    for(var i = 0; i<5; i++){
        keyImg[i].src = arrows[steps[i]];
        keyImg[i].setAttribute("value",steps[i]);
    }
    var timeleft = 10/level;
    var timer = 100;
    var downloadTimer = setInterval(function(){
        $("#key_game_textField").find("input").focus();
        if($(".input_keys").get()[4].style.display=="none"){
            ClearKeyGame();
        }
        if(timer<=0){
            FailKeyGame();
        }
        $(".count_Mainbar").css("width",timer+"%");
        timeleft -=0.05;
        timer -= (level/10);
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
            console.log("Success");
            EndKeyGame();
        }
    }
    function FailKeyGame(){
        keyGameCount=5;
        clearInterval(downloadTimer);
        //$("#key_game").addClass("offScreen");
        bossHP+=10*level;
        console.log("Fail");
        EndKeyGame();
    }
    function EndKeyGame() {
        $("#key_game").addClass("offScreen");
        $("#main_game").removeClass("offScreen");
    }
}

function drawBossHP() {

}

//Board Game 함수
var rows = 3;
var columns = 3;
var text = "";
var blank_tile = "";
var currTile;
var otherTile; //blank tile
var imgOrder = [];
var backup = [];
var turns = 0;


//var imgOrder3x3 = ["1", "3", "2", "4", "5", "6", "7", "8", "9"];
//var imgOrder5x5 = ["1", "2", "3", "5", "4", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25"];
//var imgOrder4x4 = ["1", "2", "4", "3", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
var imgOrder3x3 = ["4", "2", "8", "5", "1", "6", "7", "9", "3"];
var imgOrder5x5 = ["13", "3", "6", "5", "11", "9", "20", "24", "21", "4", "12", "17", "23", "18", "15", "7", "22", "10", "1", "16", "8", "14", "19", "2", "25"];
var imgOrder4x4 = ["15", "3", "16", "14", "7", "13", "6", "1", "8", "12", "2", "4", "10", "9", "5", "11"];


function board_game() {
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
$("#board_game").removeClass("offScreen");
    if(rows == 4){
        document.getElementById("board").style.height = "480px";
        document.getElementById("board").style.width = "480px";
        imgOrder = imgOrder4x4;
        backup = imgOrder4x4;
        blank_tile = "img4/4.jpg"; 
    }if(rows == 5){
        document.getElementById("board").style.height = "600px";
        document.getElementById("board").style.width = "600px";
        imgOrder = imgOrder5x5;
        backup = imgOrder5x5;
        blank_tile = "img5/5.jpg"; 
    }if(rows == 3){
        document.getElementById("board").style.height = "360px";
        document.getElementById("board").style.width = "360px";
        imgOrder = imgOrder3x3;
        backup = imgOrder3x3;
        blank_tile = "img3/3.jpg"; 
    }else{}

    
    for (let r=0; r < rows; r++) {
        for (let c=0; c < columns; c++) {
            //<img id="0-0" src="1.jpg">
            let tile = document.createElement("img");
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
    
}

function checkWin(){
    var parent = document.getElementById("board");
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
            alert("You Win");
            $("#board_game").addClass("offScreen");
            $("#main_game").removeClass("offScreen");
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
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

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;
        turns += 1;
        document.getElementById("turns").innerText = turns;
        checkWin();
    }


}