var level = 2;              // 난이도 기본 설정 : 중(2)
var bossHP = 1000*level;    // 보스체력
var velocity = level;       // 벽돌 떨어지는 속도, 미니게임 속도
var soundEffect = 5;        // 효과음 크기
var BGM = 5;                // 배경음악 크기
var keyGameCount = 5;       // Key Game 반복 횟수

// main game canvas 기본 세팅
var mainGameCanvas = document.getElementById("mainGameCanvas");
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

    // 스토리 씬#1 스킵하면 메인 게임 시작
    $("#skip3").on("click", function () {
        $("#scene3").addClass("offScreen");
        $("#main_game").removeClass("offScreen");
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
var turns = 0;
var imgOrder3x3 = ["4", "2", "8", "5", "1", "6", "7", "9", "3"];
//var imgOrder3x3 = ["1", "3", "2", "4", "5", "6", "7", "8", "9"];
var imgOrder5x5 = ["13", "3", "6", "5", "11", "9", "20", "24", "21", "4", "12", "17", "23", "18", "15", "7", "22", "10", "1", "16", "8", "14", "19", "2", "25"];
var imgOrder4x4 = ["15", "3", "16", "14", "7", "13", "6", "1", "8", "12", "2", "4", "10", "9", "5", "11"];


function board_game() {
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
        blank_tile = "4.jpg"; 
    }if(rows == 5){
        document.getElementById("board").style.height = "600px";
        document.getElementById("board").style.width = "600px";
        imgOrder = imgOrder5x5;
        blank_tile = "5.jpg"; 
    }if(rows == 3){
        document.getElementById("board").style.height = "360px";
        document.getElementById("board").style.width = "360px";
        imgOrder = imgOrder3x3
        blank_tile = "3.jpg"; 
    }else{}


    for (let r=0; r < rows; r++) {
        for (let c=0; c < columns; c++) {

            //<img id="0-0" src="1.jpg">
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "img"+rows+"/"+imgOrder.shift() + ".jpg";

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart);  //click an image to drag
            tile.addEventListener("dragover", dragOver);    //moving image around while clicked
            tile.addEventListener("dragenter", dragEnter);  //dragging image onto another one
            tile.addEventListener("dragleave", dragLeave);  //dragged image leaving anohter image
            tile.addEventListener("drop", dragDrop);        //drag an image over another image, drop the image
            tile.addEventListener("dragend", dragEnd);      //after drag drop, swap the two tiles
            document.getElementById("board").append(tile);
            
        }
    }
    
}

function checkWin(){
    var parent = document.getElementById("board"), child;
    var winning_cond = 0;
    for(i=1; i < parent.childNodes.length; i++){
        child = parent.childNodes[i];
        let img_src = child.src;
        let arr = img_src.split("/");
        let arr2 = arr.pop().split(".");
        text = arr2[0];
        if(i == parseInt(text)){
            winning_cond++
        }else{
            winning_cond = 0;
        }
        if (winning_cond == 9)
            alert("You Win");
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
    if (!otherTile.src.includes(blank_tile)) {
        return;
    }

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