$(document).ready(function(){

    var level = 2;
    var bossHp = 100*level; // 보스체력
    var velocity = level; // 벽돌 떨어지는 속도

    $("#startButton").on("click", function () {
        $("#startScreen").addClass("offScreen");
        $("#main_game").removeClass("offScreen");
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
});

function keyGame(){
    
    $("#key_game").removeClass("offScreen");
    var arrows = ["key_down.png", "key_up.png","key_left.png","key_right.png"];
    var steps = [0,0,0,0,0];
    for(var i = 0; i<5;i++){
        steps[i] = Math.floor(Math.random()*4);
    }
    var keyImg = $(".key_img").get();
    for(var i = 0; i<5; i++){
        keyImg[i].src = arrows[steps[i]];
    }
}
