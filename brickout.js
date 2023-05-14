$(document).ready(function(){
    var level;
    $("#topLevel").on("click",function(){
        level = 3;

        var Screen = $("#startScreen");
        Screen.addClass("offScreen");
        var Game = $("#main_game");
        Game.removeClass("offScreen");
    });
    $("#middleLevel").on("click",function(){
        level = 2;
        var Screen = $("#startScreen");
        Screen.addClass("offScreen");
        var Game = $("#main_game");
        Game.removeClass("offScreen");
    });    
    $("#lowLevel").on("click",function(){
        level = 1;
        var Screen = $("#startScreen");
        Screen.addClass("offScreen");
        var Game = $("#main_game");
        Game.removeClass("offScreen");
        keyGame();
    });
    var bossHp=100*level; // 보스체력
    var velocity = level; // 벽돌 떨어지는 속도
    
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
