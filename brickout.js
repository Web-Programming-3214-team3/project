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