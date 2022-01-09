require('DateExt');

var img = {
    width : 112, height : 119, bpp : 3,
    transparent : 1,
    buffer : require("heatshrink").decompress(atob("kmSpICOC64CPwBDIFLxudARQhEgQIByAIEiR6dBaZ6TggOJpCAZoAZBhIRMFQSkXUIQLFyAyEVoSqUTAQIGgILCMo4pTSpApCwVAXI6PNCh4pBZwI+PdJgLIFIcESQ4IGfBa8JKZTmCFJzmCBxIpCU4xBDgT4PBxQpLX4T4ODoOQAQgpGBAoCDkD+NBwggIAoQdKIgQpKMQlBAQgpEyApGkCkCTBlIWwgmCKY+AX5DsDggpLiRTKDQIgBaI4yDOAIpJoALEFI5uBggCCFJIdFAQoXFU5ACKFIZxFAQhuCFIzmMFI7vBYoYOFFIi5CXhgpJkEABxBKQFK8AhIpXEYJEEEA4yJLLB0GFNLaJAS7pBFI0SFL+SFItIFMcEFIomeAQVAEYgFFFMhZEATbyBO4qDBwEBbpACUEALLFEYOCFIILBKzeQhIpDJoYpBwVIQbYpCgQpHRIIpcpMgFIYmBFMGCFIMAAoLOCFMCkBFIkJU8EgAoQplgEAEYICFwDUBa4Z9ZiBTCFIgODAooCZPQSACEbopwgL+DFP4CNyApBgQp/FP7OhgEAyACBFIUAhIpewVJgEQFIYDBgBWgkESFIVIgGSoEEFMcSpAmBAQQp/AQ4mBAQQpEBAIpkU4QpfPor7DFMEkgQpDkkAaMIpGfc4ICoBQewAmCU4mQgApgOgIpBgTRChIpeAQRNBFIQmhFN0gFP4pRgIp/FKkAFP4CPwEBkgp/FKMJFIICBFP4CNEwQsCKEIpCKwhQhFIrUByVIgESFLcgiACBFIWQFIVAkkCFLmQAQIgCyEAFIeCFLcEU4IpJKbdIFIUAEAYpCU7odBgEJEAkAginfO4JKFoApBoKndFIYIDoAFBFL4jDQwgICPrp3DFIiDBGQgCaZYQIDKD4pDBAophyApGkEAFL+AgIIGgEJFP4CIEBAyIASyeJWA4CXgApKggpdgQLIFLOCAoVIgESCJFAgBZEAALaOEYJ3DDogRIGouAKZ1IOKKJGFI5EHpAjDYprdGXIxuBBAx9EwEANBcgUIkgXI1ADROQC4MAgKSMBwh0HDRQpBIgoRKRgRrBBwwaKyEIRI4CISIK/FDoqGIwCzBBYwCICJRfBkDRJIIQpOcwinIOJD4BNAwCKFILIHd4WCdJEAExwUNFJITBfBpoHSQ5cBFIy8BSRL+NTwynHbQL4QahCqFJQIgEkAPBZyICFDQSAEGQJ6GcY6qUYRAKCUiqqHABakVAQwoLEzTvGAAr+FATonDVo4CKA"))
  };


var IMAGEWIDTH = 112;
var IMAGEHEIGHT = 119;

var hour_hand = {
  width : 61, height : 4, bpp : 1,
  transparent : 0,
  buffer : E.toArrayBuffer(atob("/////////////////////////////////////////////////////////////////////////////////w=="))
};
var minute_hand = {
  width : 110, height : 4, bpp : 1,
  transparent : 0,
  buffer : E.toArrayBuffer(atob("/////////////////////////////////////////////////////////////////////////w=="))
};

//g.fillRect(0,24,239,239); // Apps area
let intervalRef = null;
const p180 = Math.PI/180;
const clock_center = {x:Math.floor((g.getWidth()-1)/2), y:24+Math.floor((g.getHeight()-25)/2)};
// ={ x: 119, y: 131 }
const radius = Math.floor((g.getWidth()-24+1)/2); // =108

let tick0 = Graphics.createArrayBuffer(30,8,1,{msb:true});
tick0.fillRect(0,0,tick0.getWidth()-1, tick0.getHeight()-1);
let tick5 = Graphics.createArrayBuffer(20,6,1,{msb:true});
tick5.fillRect(0,0,tick5.getWidth()-1, tick5.getHeight()-1);
let tick1 = Graphics.createArrayBuffer(8,4,1,{msb:true});
tick1.fillRect(0,0,tick1.getWidth()-1, tick1.getHeight()-1);

// Adjust hand lengths to be within 'tick' points
minute_hand.width=radius-tick1.getWidth()-20;
hour_hand.width=radius-tick5.getWidth()-20;

function big_wheel_x(angle){
  return clock_center.x + radius * Math.cos(angle*p180);
}
function big_wheel_y(angle){
  return clock_center.y + radius * Math.sin(angle*p180);
}
function rotate_around_x(center_x, angle, tick){
  return center_x + Math.cos(angle*p180) * tick.getWidth()/2;
}
function rotate_around_y(center_y, angle, tick){
  return center_y + Math.sin(angle*p180) * tick.getWidth()/2;
}
function hour_pos_x(angle){
  return clock_center.x + Math.cos(angle*p180) * hour_hand.width/2;
}
function hour_pos_y(angle){
  return clock_center.y + Math.sin(angle*p180) * hour_hand.width/2;
}
function minute_pos_x(angle){
  return clock_center.x + Math.cos(angle*p180) * minute_hand.width/2;
}
function minute_pos_y(angle){
  return clock_center.y + Math.sin(angle*p180) * minute_hand.width/2;
}
function minute_angle(date){
  //let minutes = date.getMinutes() + date.getSeconds()/60;
  let minutes = date.getMinutes();
  return 6*minutes - 90;
}
function hour_angle(date){
  let hours= date.getHours() + date.getMinutes()/60;
  return 30*hours - 90;
}

Graphics.prototype.setFontDancingScript = function() {
  // Actual height 44 (44 - 1)
  var widths = atob("DBIhFB4bGRoeFhweDQ==");
  var font = atob("AAAAAAAAAAAAAAMAAAAAAAHgAAAAAAD4AAAAAAA+AAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAD8AAAAAAD+AAAAAAD/AAAAAAD/gAAAAAH/gAAAAAH/wAAAAAH/gAAAAAP/gAAAAAP/gAAAAAf/AAAAAAf/AAAAAA/+AAAAAA/+AAAAAB/+AAAAAB/8AAAAAB/8AAAAAA/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/8AAAAAf//4AAAAf///AAAAf///4AAAf////AAAf/8Af4AAP/gAA/AAP/AAADwAH+AAAAcAD+AAAAHAA+AAAABwAfAAAAAcAPAAAAAHADgAAAABwB4AAAAA8AcAAAAAOAHAAAAAHgBgAAAAHwAYAAAAD4AGAAAAD+ABwAAAD/AAcAAAD/gAHgAAH/wAA+AAP/wAAH+H//4AAB////4AAAP///4AAAA///4AAAAD//gAAAAAD8AAAAAAAAAAAGAAAAAAABwAAAAAAAcAAAAAAAHAAAAAAABwAAAAAAAcAAGAAAAPAADwAAA/wAA4AAB/8AAeAAP//AAPAD//7wAHwf//w8AB////gPAA///+ABwAf//4AAcAP/+AAADAH/wAAAAQB8AAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAB8AAAAAAAfAAAAAAAGwAAAAAABsAAAAAAAfAAAAAAAHwAAP4AAB4AAP/AAAeAAH/wAAHAAD/+AAD4AB+AgAB+AA8AAAA/gAOAAAAf8AHAAAAPvABwAAAPzwAYAAAH4eAGAAAH8HgBgAAD+B8AcAAD/AfAHAAH/AHwB4AH/gB8AP4//gAfAD///wAHwAf//wAB8AB//gAAeAAP/gAAHAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfwAAAAAAP+AAAAAAH/wAAAAAB/+AAAAAAcfgAAAAAEB8AB/AAAAPAA/4AAABwAf+AAAAcAP/gAAAHADwQAAABwAwABAAAcAcAAYAAHAHAAOAADwBgAHwAB4AYAD+AB+AHAB/4B/ABwB+///wAeB/P//4AH//h//8AA//4P/+AAH/4B/+AAA/8AH/AAAH8AAEAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAA4AAAAAAAeAAAAAAAPAAAAAAAHwAAAAAAD8AAAAAAB/AAAAAAA/wAAAAAAe8AAAAAAPPAAAAAAHjwAAAAADw8AAAAAB4PAAwAAA8DwP+AAAeA///wAAPAP//8AAHh////AAH3////wAD////AAAB///wAAAA//88AAAAf/gPAAAAf8ADgAAAHgAA4AAAAAAAMAAAAAAAAAfwAAAAAAP+AAAAAAH/wAAAAAB/+AAAAAA8PgAAAAwEA8AAAH8AAHAAAP/AABwAA//gAAcAD/4YAAHAH/gGAABwB/ABgAAcAfgAYAAPAD4AHAADwA+ABwAB4APgAeAB+AD4AH4B/AA+AA///wAPgAP//4AD4AB//8AB+AAP/+AAfgAB//AAHwAAH/AAB8AAAAAAAeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAf/4AAAAA///gAAAB///+AAAB////wAAB////+AAA//+B/gAA//8AD8AAf+OAAPAAP8HAABwAH8BgAAcAD8A4AAHAB+AOAABwAeADgAAcAPAA4AAHADgAOAADwBwADgAA8AcAA8AA+AGAAPgAfgBgAD+A/wAYAAf//4AGAAH//8ABwAA//+AAfgAH//AAD4AAf/AAAcAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAHAA/AAAABwB/wAwAA8B/8AeAAPB//AHwADx//gB8AA9//wAfAAP/4IAHwAD/wAAB8AB/wAAAPAB/gAAADwB/wAAAA8A/8AAAAPA/PAAAADw/DwAAAA8/A8AAAAP/AOAAAAD/ADgAAAB/gAwAAAAAAAAAAAAAAAAABAAAAAAAH/AAAAAAD/4AAAAAB//AAAAAA//4AAOAAfA+AAf8APgHwAP/wHgA8AH/+DwAHAD//48ABwA///eAAcAeAf/AAHAHAB/gABwBwAP4AA8AYAB/AAPAGAAf4AHgBgAP/AD4AcAHv8B8AHgD5///AA8H8H//gAP/+A//wAB/+AH/4AAP/AAf8AAA/AAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAP/gAAeAAP/+AAPgAH//wAD8AD//+AAPAB///gAAwAfwD8AAMAPwAfAADADwADwAAwB4AAeAAcAcAAHgAHAHAAA4ADgBwAAOAB4AcAADAB8AHAAAwA/ABwAAcA/gAeAAGB/wAHwADh/4AA+AB//8AAP+D//8AAB////+AAAP///+AAAB///+AAAAP//8AAAAAf/4AAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAA4AAAAAAAeAAAAADAHgAAAAB4BwAAAAAeAIAAAAAHgAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  var scale = 1; // size multiplier for this font
  g.setFontCustom(font, 46, widths, 50+(scale<<8)+(1<<16));
};

// timeout used to update every minute
var drawTimeout;

// schedule a draw for the next minute
function queueDraw() {
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = setTimeout(function() {
    drawTimeout = undefined;
    draw();
  }, 60000 - (Date.now() % 60000));
}

function draw() {
  var date = new Date();
  var x = g.getWidth()/2;
  var y = 50;
  g.reset().clearRect(0,24,239,239); // clear app area; //.clearRect(0,24,g.getWidth(),g.getHeight()-IMAGEHEIGHT);
  g.drawImage(img,g.getWidth()/2-IMAGEWIDTH/2,g.getHeight()/2-IMAGEHEIGHT/2+10);

    g.setColor(g.theme.fg);
g.setFontAlign(0,0).setFont("6x8",2.5);
  g.drawString(date.as("0i:0m").str,30,30);

  g.setFontAlign(0,0).setFont("6x8",2.5);
  g.drawString(date.as("a").str.toUpperCase(),130,30);
  
  g.setFontAlign(0,0).setFont("6x8",2.5);
  g.drawString(date.as("0D.0M").str,30,170);

    g.setFontAlign(0,0).setFont("6x8",2.5);
  g.drawString(date.as("T").str.toUpperCase(),130,170);

  let hour_agl = hour_angle(date);
  let minute_agl = minute_angle(date);
  g.drawImage(hour_hand, hour_pos_x(hour_agl), hour_pos_y(hour_agl), {rotate:hour_agl*p180}); //
  g.drawImage(minute_hand, minute_pos_x(minute_agl), minute_pos_y(minute_agl), {rotate:minute_agl*p180}); //
  g.setColor(g.theme.fg);
  g.fillCircle(clock_center.x, clock_center.y, 6);
  g.setColor(g.theme.bg);
  g.fillCircle(clock_center.x, clock_center.y, 3);

  //g.flip();
  
  //var dateStr = require("locale").date(date);
  // draw time
  //g.setFont("DancingScript").setFontAlign(0,0).setColor("#f00");
  //g.drawString(date.getHours(), x,y);
  //y += 43;
  //g.drawString(date.getMinutes().toString().padStart(2,0), x,y);
  // draw date
  //y += 22;
  //g.setFontAlign(0,0).setFont("6x8");
  //var p = g.getWidth()-60;
  //g.clearRect(p,y-4,g.getWidth()-p,y+3); // clear the background
  //g.drawString(dateStr,x,y);
  // queue draw in one minute
  queueDraw();
}

// Stop updates when LCD is off, restart when on
Bangle.on('lcdPower',on=>{
  if (on) {
    draw(); // draw immediately, queue redraw
  } else { // stop draw timer
    if (drawTimeout) clearTimeout(drawTimeout);
    drawTimeout = undefined;
  }
});
// set background colour
g.setTheme({bg:"#fff"});
// Clear the screen once, at startup
g.clear();
// draw immediately at first, queue update
draw();
// Show launcher when middle button pressed
Bangle.setUI("clock");
// Load widgets
Bangle.loadWidgets();
Bangle.drawWidgets();
