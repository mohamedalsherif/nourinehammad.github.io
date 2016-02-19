var lastChoosenTab; //used to store the last opened tab in order to disable
//tabs being choosen on slide Transition

$( document ).ready(function()
{
    console.log( "ready!" );
    $('#content').slick({
      infinite: true,
      speed: 400,
      slidesToShow: 1,
      adaptiveHeight: true,
      arrows: false
});

    initPhotoSwipeFromDOM('#demo-test-gallery');
    initPhotoSwipeFromDOM('#my-gallery');
    fixDisplay();
    lastChoosenTab=$('.active')[0];
    $('#content').on('afterChange', function(event, slick, currentSlide)
    {
      var tt= $("#theNav"+currentSlide)[0];
      if(tt.id!=lastChoosenTab.id)
      {
        chooseLastChoosenTabAndUpdateActiveUIGivenLi(tt);
      }
    });


    // media query event handler
      var mq = window.matchMedia("(min-width: 961px)");
      mq.addListener(WidthChange);
      WidthChange(mq);

      
});


function goto(id, t)
{
  if(tryToSlickGoTo(id))
  {
    chooseLastChoosenTabAndUpdateActiveUIGivenLi(t.parentNode);
  }
}

function chooseLastChoosenTabAndUpdateActiveUIGivenLi(t)
{
  $(lastChoosenTab).first().removeAttr("data-toggle");
  $(lastChoosenTab).removeClass('active');
  $(t).first().attr( "data-toggle", "tab" );
  $(t).addClass('active');
  lastChoosenTab=t;
}

function tryToSlickGoTo(id)
{
  var currentSlide = $('#content').slick('slickCurrentSlide');
  $('#content').slick('slickGoTo',id,false);
  var currentSlideAfterSwipe = $('#content').slick('slickCurrentSlide');
  if(currentSlideAfterSwipe==currentSlide)
  {
    return false;
  }
  else
  {
    return true;
  }
}


function changeDisplay(newDisplay)
{
  	var cols =     document.getElementsByClassName('emptyDiv');
  	for(i=0; i<cols.length; i++)
  	{
    	cols[i].style.display = newDisplay;
  	}
}

function fixDisplay()
{
	if(window.outerWidth<=1177)
     {
     	changeDisplay("none");
		//make the divs use no space
     }
     else
     {
    	 changeDisplay("");
     }
}

window.onresize = function()
{
   	fixDisplay();
   	//console.log(window.outerWidth);
}

function WidthChange(mq)
{
  if (mq.matches)
  {
    $("#theHomeMain").attr( "data-size", "1162x1460");
  }
  else
  {
    $("#theHomeMain").attr( "data-size", "1055x1460");
  }
}
