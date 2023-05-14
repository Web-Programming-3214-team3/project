var level = 2;
var bossHp = 100*level; // 보스체력
var velocity = level; // 벽돌 떨어지는 속도, 미니게임 속도
$(document).ready(function(){



    $("#startButton").on("click", function () {
        $("#startScreen").addClass("offScreen");
        $("#main_game").removeClass("offScreen");
        keyGame();
    });

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
        bossHp = 100*level;
        velocity = level;
    });

    $("#settingButton").on("click", function () {
        $("#startScreen").addClass("offScreen");
        $("#settingPage").removeClass("offScreen");
    });

    $("#soundEffect").on("click", function () {
        $("#soundEffectNum").text($(this).val());
    })

    $("#BGM").on("click", function () {
        $("#BGMNum").text($(this).val());
    })

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
    })
});
var keyGameCount = 5;
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
        timer -= level;
    },50);
    function ClearKeyGame(){
        clearInterval(downloadTimer);
        if(keyGameCount>1){
            keyGameCount--;
            console.log(keyGameCount);
            keyGame();
        }
        else{
            $("#key_game").addClass("offScreen");
        }


    }
    function FailKeyGame(){
        keyGameCount=5;
        clearInterval(downloadTimer);
        $("#key_game").addClass("offScreen");
        bossHp+=10*level;
    }
}
