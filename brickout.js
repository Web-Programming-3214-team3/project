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
    });
    var bossHp=100*level; // 보스체력
    var velocity = level; // 벽돌 떨어지는 속도
    
})