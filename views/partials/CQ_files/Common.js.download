var valid_time_reg = /((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))/;
var youtubeReg = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
var youtubeIdReg = /^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/
//-------------------------------Number of days--------------------------------------
function NumberOfDays(currentTime,postedTime) {
  var a = Date.UTC(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
  var b = Date.UTC(postedTime.getFullYear(), postedTime.getMonth(), postedTime.getDate())
  var Days = (a-b)/ 86400000;
  if(Days==0)
  {
    var d = new Date(postedTime);
    var resultTime = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return resultTime;
  } else {
    return Days +'d';
    // var month =(currentTime.getTime() - postedTime.getTime()) / 1000;
    //     month /= (60 * 60 * 24 * 7 * 4);
    //     month = Math.abs(Math.round(month))
    //     if(month>=1)
    //     {
    //       return month+'m';
    //     } else {
    //       return Days+'d';
    //     }
  }
}
//-------------------------------Color Extraction-----------------------------------
var rgbToHex = function (rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};
var fullColorHex = function(r,g,b) {
    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);
    return red+green+blue;
};
function fillReleventColorInDiv(src,id){
  Vibrant.from(src).getPalette(function(err, palette) {
      if( palette && palette.LightVibrant && palette.LightVibrant._rgb.length)
      $(id).css('background-color', '#' + fullColorHex( palette.LightVibrant._rgb[0], palette.LightVibrant._rgb[1] ,
          palette.LightVibrant._rgb[2]) )
  });
}

async function getReleventColor(src){ //it will return promise
  try{
    palette = await Vibrant.from(src).getPalette();
    color = '#' + fullColorHex( palette.LightVibrant._rgb[0], palette.LightVibrant._rgb[1] , palette.LightVibrant._rgb[2]);
    return color;
  }catch(err){
    return '#ffffff';
  }
}
//-------------------------------Header Desgin--------------------------------------
$(document).ready(function() {
    $("#openMenu").click(function(){
        $('.dropdown').addClass('open');
    });

});
//--------------------------State Change admin user---------------------------------
function switchState(e){
  $.confirm({
      title: e,
      content: "Do you really want switch state...",
      buttons: {
          'Yes': {
              btnClass: 'btn-success',
              action: function () {
                window.location.replace("/admin/switchAsUser");
              }
          },
          'No': {btnClass: 'btn-danger',}
      }
  });
}

//----------------------------------------------------------------------------------
function OnlyDate(str) {
  if(str)
  {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2);
    return [ date.getFullYear(), mnth, day ].join("-");
  }
  else{
    return ' Not Updated'
  }
}
function OnlyDateEditProfile(str) {
  if(str)
  {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2);
    return [ date.getFullYear(), mnth, day ].join("-");
  }
  else{
    return '';
  }
}

$('.dobDatePop',).text(OnlyDate($('.dobDatePop').text()));
$(".profilePic").click(function(){
  location.href = '/profile';
});

function validateImageSize(element){
  var flag = true;
  if(element){
    if(element.files[0].size<40000)
    {
      $.alert({
          title: 'Invalid Image',
          content: 'Image is too small it should be > 40 KB',
      });
      element.value = "";
      flag = false;
    }
    else if(element.files[0].size>1024000)
    {
      $.alert({
          title: 'Invalid Image',
          content: 'Image is too large it should be < 1 MB',
      });
      element.value = "";
      flag = false;
    }
  }
  return flag;
}
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
function validatePhone(phone)
{
  var validity = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(phone);
  return validity;
}
function logout()
{
   $.confirm({
    title: 'Confirm Logout!',
    content: 'Do you really want logout?',
    theme: 'supervan',
    buttons: {
       'Yes': {
           btnClass: 'btn-success',
           action: function(){
              window.location.replace("/logout");
            }
          },
          'No': {btnClass: 'btn-danger',}
   }
  });
}

// window.onbeforeunload = function () {
//   window.scrollTo(0, 0);
// }
