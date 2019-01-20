var lastChoosenTab; //used to store the last opened tab in order to disable
//tabs being choosen on slide Transition

var isMobile;
var swipeSpeed = 600;
var swipe = false;
var animationStartMilliSecondsDifference = 500;

function enter_hover_function() {
    var ffdf = $(this);
    var fff = ffdf.position();
    var x = this;
    var gg = this.getBoundingClientRect();
    var ff = this.getBoundingClientRect().left;
    var theOverlay = $("#theOverlay")[0];

    var newTopPosition = this.y - 192;
    console.log("hiehgt: " + this.height + " width: " + this.width + " y: " + this.y + " x:" + this.x + " and new Top Position:" + newTopPosition);
    $("#theOverlay").css({
        height: this.height,
        width: this.width,
        top: newTopPosition,
        left: this.x,
        position: 'relative',
        opacity: 1
    });
}

function exit_hover_function() {
    $("#theOverlay").css({opacity: 0});
}



function oneSecondFunction() {
    $("#nav").css('visibility', 'visible').hide().fadeIn(500).delay(0).queue(function (next) {
        $("#divOfName").css('visibility', 'visible').hide().fadeIn(1000).delay(0).queue(function (next) {
            $("#content").css('visibility', 'visible').hide().fadeIn(750).removeClass('visib_hidden');
            var elementsActive = $(".active");
            if (elementsActive.length == 0) {
                $("#theNav0").addClass('active');
            }
        }).removeClass('visib_hidden');

    }).fadeIn(2000).removeClass('visib_hidden');
    ;


}


function resizeNav() {

    function getTotalWidthOfIds(ids) {
        //var ids=[];
        if (!(ids instanceof Array)) {
            ids = [ids];
        }
        var totalWidth = 0;
        for (var i = 0; i < ids.length; i++) {
            var f = $("#" + ids[i]);
            var width = f.outerWidth();
            totalWidth += width;
        }
        return totalWidth;
    }

    function getSortedArrayOfNavIds()
    {
        var arrayOfIds = $.map($(".nav_tab_li"), function (n, i) {
            return n.id;
        });
        return arrayOfIds.sort();
    }

    function getWidthOfFirstNNavElements(n=null) {
        
        arrayOfIds=getSortedArrayOfNavIds()
        if(n!=null)arrayOfIds=arrayOfIds.slice(0, n);
        return getTotalWidthOfIds(arrayOfIds)
    }

    function addMaxMarginRightLeft(x)
    {
        return x+2*maxMargin;
    }

    function getMaxPossibleNavsInFirstRow()
    {
        var viewportWidth = $(window).width();
        var currentWidth=addMaxMarginRightLeft(getWidthOfFirstNNavElements())
        numberOfElements=getSortedArrayOfNavIds().length;
        while(currentWidth>viewportWidth)
        {
            numberOfElements--;
            currentWidth=addMaxMarginRightLeft(getWidthOfFirstNNavElements(numberOfElements))
        }
        return numberOfElements
    }

    function putAllIdsInMiddle() {
        ff=getMaxPossibleNavsInFirstRow();
        var totalWidth, contactLeftMargin = 0, articleLeftMargin = 0;
        totalWidth = getWidthOfFirstNNavElements(5);
        var viewportWidth = $(window).width();
        var leftMargin = ((viewportWidth - totalWidth) / 2);
        leftMargin = leftMargin > maxMargin ? leftMargin : maxMargin;
        var rightMargin = viewportWidth - totalWidth - leftMargin;

        var fourthNav = $("#theNav4");
        var thirdNav = $("#theNav3");
        if (rightMargin < maxMargin) {
            var widthOfFour = getWidthOfFirstNNavElements(4) + 2 * maxMargin;
            if (widthOfFour >= viewportWidth) {
                totalWidth = getWidthOfFirstNNavElements(3);

                articleLeftMargin = -getTotalWidthOfIds("theNav3") / 2 + (getTotalWidthOfIds("theNav0") + getTotalWidthOfIds("theNav1")) / 2;
                contactLeftMargin = 0;

                //contact and articles down
                //put all again in middle
                //put contact between about and artwork
                //put articles between artwork and exhibtion
            } else {
                //contact only down
                //put all again in middle
                //put contact between artwork and exhibtion
                totalWidth = getWidthOfFirstNNavElements(4);


                contactLeftMargin = -getTotalWidthOfIds("theNav4") / 2 + getTotalWidthOfIds("theNav0") + (getTotalWidthOfIds("theNav1") + getTotalWidthOfIds("theNav2")) / 2;

            }
            leftMargin = ((viewportWidth - totalWidth) / 2);
        }

        fourthNav.css('margin-left', contactLeftMargin + 'px');
        thirdNav.css('margin-left', articleLeftMargin + 'px');

        //leftMargin=leftMargin>mm?leftMargin:mm;
        $("#nav").css('margin-left', leftMargin + 'px');
    }
    var maxMargin = 47;//max margin
    putAllIdsInMiddle();
    return;
   }

$(window).resize(function () {
    resizeNav();
});

$(document).ready(function () {

    resizeNav();
    $('.galleryImage').hover(enter_hover_function, exit_hover_function);
    $("#fblikeDiv").removeAttr("data-href");
    console.log("ready!");
    window.setTimeout(oneSecondFunction, 1000);

    isMobile = window.matchMedia("only screen and (max-width: 760px)");

    if (isMobile.matches) {
        swipeSpeed = 300;
        $(".hrefToRemoveInMobile").removeAttr("href");
        swipe = true;
    } else {
        initPhotoSwipeFromDOM('.galleryImageContainer');
    }


    $('#content').slick({
        infinite: false,
        speed: swipeSpeed,
        slidesToShow: 1,
        adaptiveHeight: true,
        arrows: false,
        swipe: swipe,
        touchMove: false,
        touchThreshold: 4
    });
    gotoArtworkIfUrlContainsGidAndPid();
    fixDisplay();
    lastChoosenTab = $('.active')[0];
    $('#content').on('afterChange', function (event, slick, currentSlide) {
        var tt = $("#theNav" + currentSlide)[0];
        if (lastChoosenTab == undefined) {
            lastChoosenTab = $('.active')[0]; //executed only once
        }
        if (lastChoosenTab != undefined && tt.id != lastChoosenTab.id) {
            chooseLastChoosenTabAndUpdateActiveUIGivenLi(tt);
        }
    });


    // media query event handler
    var mq = window.matchMedia("(min-width: 961px)");
    mq.addListener(WidthChange);
    WidthChange(mq);
    CSSPropertiesAddedOnTheFly();


});


function gotoArtworkIfUrlContainsGidAndPid() {
    var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
            params = {};

        if (hash.length < 5) { // pid=1
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        tryToSlickGoTo(1);
    }

}


function goto(id, t) {
    if (tryToSlickGoTo(id)) {
        chooseLastChoosenTabAndUpdateActiveUIGivenLi(t.parentNode);
    }
}

function chooseLastChoosenTabAndUpdateActiveUIGivenLi(t) {
    $(lastChoosenTab).first().removeAttr("data-toggle");
    $(lastChoosenTab).removeClass('active');
    $(t).first().attr("data-toggle", "tab");
    $(t).addClass('active');
    lastChoosenTab = t;
}

function tryToSlickGoTo(id) {
    var currentSlide = $('#content').slick('slickCurrentSlide');
    $('#content').slick('slickGoTo', id, false);
    var currentSlideAfterSwipe = $('#content').slick('slickCurrentSlide');
    if (currentSlideAfterSwipe == currentSlide) {
        return false;
    } else {
        return true;
    }
}

function slickSwipe(direction) {
    var currentSlide = $('#content').slick('slickCurrentSlide');
    if (direction == "right" && currentSlide != 0) {
        $('#content').slick('slickGoTo', currentSlide - 1, false);
    } else if (direction == "left" && currentSlide != 4) {
        $('#content').slick('slickGoTo', currentSlide + 1, false);
    }
}


function changeDisplay(newDisplay) {
    var cols = document.getElementsByClassName('emptyDiv');
    for (i = 0; i < cols.length; i++) {
        cols[i].style.display = newDisplay;
    }
}

function fixDisplay() {
    if (window.outerWidth <= 1177) {
        changeDisplay("none");
        //make the divs use no space
    } else {
        changeDisplay("");
    }
}

window.onresize = function () {
    fixDisplay();
}

function CSSPropertiesAddedOnTheFly() {

    $(".exhibitionImage").css("width", "100%");
    $(".exhibitionImage").css("height", "100%");


    $("#fblikeDiv").removeAttr("data-layout"); //to enable source copying in git
    $("#fblikeDiv").removeAttr("data-show-faces");
    $("#fblikeDiv").removeAttr("data-href");

    if (isMobile.matches) {
        $("#fblikeDiv").attr("data-layout", "button_count");
        $("#fblikeDiv").attr("data-show-faces", "false");
    } else {
        $("#fblikeDiv").attr("data-layout", "standard");
        $("#fblikeDiv").attr("data-show-faces", "true");
    }
    $("#fblikeDiv").attr("data-href", "https://www.facebook.com/Nourine-Hammad-1413192872293705/");
}


function WidthChange(mq) {
    if (mq.matches) {
        $("#theHomeMain").attr("data-size", "1162x1460");
    } else {
        $("#theHomeMain").attr("data-size", "1055x1460");
    }
}
