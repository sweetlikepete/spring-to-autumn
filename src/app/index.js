

import "./index.scss";


const conf = {
    directionClearTime : 1500,
    directionForceTop : 10,
    directionToleranceDown : 50,
    directionToleranceUp : 50,
    hiddenClass : "hidden",
    offsetClass : "offset",
    offsetRatio : 0.33
};

let forceShowNav = false;


const initializeScrollDirectionEvents = function(){

    let lastTop = document.body.scrollTop;
    let clearLasts = null;
    let lastDir = null;
    let lastDown = 0;
    let lastUp = 0;
    let st = 0;

    const getScrollTop = function(){

        return window.pageYOffset ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

    };

    const clear = function(){

        window.clearTimeout(clearLasts);

        /*
            * Forget how much up and down has been happening
            * if nothing happens for a while
            */
        clearLasts = window.setTimeout(() => {

            lastDown = 0;
            lastUp = 0;

        }, conf.directionClearTime);

    };

    const atTop = function(){

        return st <= 0;

    };

    const goingUp = function(){

        return st < conf.directionForceTop || lastDir !== "up" && lastUp > conf.directionToleranceUp;

    };

    const goingDown = function(){

        return st > conf.directionForceTop && lastDown > conf.directionToleranceDown && lastDir !== "down";

    };

    let onScroll = function(){

        updateNavSelection();

        clear();

        st = getScrollTop();

        if(atTop() || forceShowNav){

            lastDir = "up";

            document.querySelector("nav").classList.remove(conf.hiddenClass);

        }else if(st < lastTop){

            lastDown = 0;

            lastUp += lastTop - st;

            if(goingUp()){

                lastDir = "up";

                document.querySelector("nav").classList.remove(conf.hiddenClass);

            }

        }else if(st > lastTop){

            lastUp = 0;

            lastDown += st - lastTop;

            if(goingDown()){

                lastDir = "down";

                document.querySelector("nav").classList.add(conf.hiddenClass);

            }

        }

        if(st < 30){
            document.querySelector("nav").classList.remove(conf.offsetClass);
        }else{
            document.querySelector("nav").classList.add(conf.offsetClass);
        }

        lastTop = st;

    };

    onScroll = onScroll.bind(this);

    document.addEventListener("scroll", onScroll);

    onScroll();

};

const updateNavSelection = function(){

    let sel = $("a.anchor:eq(0)").attr("id");

    if(window.location.hash){

        sel = window.location.hash.replace(/\#/g, "");

    }else{

        $("a.anchor").each((index, el) => {

            if($(window).scrollTop() >= $(el).offset().top){
                sel = $(el).attr("id");
            }

        });

    }

    $("nav a").removeClass("selected");
    $(`nav a[href='#${ sel }']`).addClass("selected");

};

const initializeThemeSearch = function(){

    const change = () => {

        const val =  $.trim($(".themes .search input").val());

        if(val){

            const show = [];

            $(".themes ul li").each((index, el) => {

                if($(el).text().toLowerCase().indexOf(val.toLowerCase()) > -1){
                    show.push(el);
                }

            });

            if(show.length > 0){

                $(".themes ul li").stop().fadeTo(150, .1);

                show.forEach((el) => {
                    $(el).stop().fadeTo(150, 1);
                });

            }else{

                $(".themes ul li").stop().fadeTo(150, 1);

            }

        }else{

            $(".themes ul li").stop().fadeTo(150, 1);

        }

    };

    $(".themes .search input").keyup(change);
    $(".themes .search input").change(change);

};

const initializeEpisodesScroll = function(){

    const scr = $(".episodes-scroll");

    $(".episodes-wrap .right").click(() => {

        const sl = Math.floor(scr.scrollLeft() + 50);

        $(".episodes-wrap .episode").each((index, el) => {

            const lef = Math.floor($(el).position().left) + scr.scrollLeft();

            if(lef > sl && scr.scrollLeft() !== lef - 50){

                scr.stop().animate({ scrollLeft : lef - 50}, 300, "swing");

                return false;

            }

        });

    });

    $(".episodes-wrap .left").click(() => {

        const sl = Math.floor(scr.scrollLeft() + 50);

        let target = 0;

        $(".episodes-wrap .episode").each((index, el) => {

            const lef = Math.floor($(el).position().left);

            if(lef < 0){
                target = Math.floor($(el).position().left) + scr.scrollLeft() - 50;
            }

        });

        console.log(target);

        scr.stop().animate({ scrollLeft : target}, 300, "swing");

    });
};

$(() => {

    $("nav a").click(() => {

        updateNavSelection();

    });

    initializeThemeSearch();

    initializeScrollDirectionEvents();

    initializeEpisodesScroll();

});
