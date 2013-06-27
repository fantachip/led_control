/*********************************************

For more projects, visit https://github.com/fantachip/

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
**********************************************/

function toggle_led(num){
	$.ajax({
		url     : "/",
		type    : "GET",
		dataType: "json",
		data    : {action: "toggle", num: num},
		success: function(data){
			if(data["error"])
				alert(data["error"]);
		},
		error: function(){
			alert("Could not communicate with the device!");
		}
	});
}

var is_connected = false; 

function read_state(){
	$.ajax({
		url     : "/",
		type    : "GET",
		dataType: "json",
		data    : {action: "status"},
		success : function( status ) {
			for(var c in status){
				var btn = $('.buttons div[data-num="'+c+'"]');
				if(status[c] == "0"){
					btn.removeClass("green");
					btn.addClass("grey");
				} else {
					btn.removeClass("grey");
					btn.addClass("green");
				}
			}
			$(".message").html(""); 
			is_connected = true; 
		},
		error: function(){
			document.getElementById('screen').src = "images/nocon.jpg";
			$(".message").html("<center>Unable to connect to device!</center>"); 
			is_connected = false; 
		}
	});
}

$(document).ready(function(){
	read_state();
	$(".buttons div").click(function(){
		// this is for direct feedback (will be overwritten with correct state on data update)
		$(this).toggleClass("green");
		$(this).toggleClass("grey");
		
		var num = $(this).attr("data-num");
		
		toggle_led(num);
	});

	setInterval(function() {
		if(is_connected)
			document.getElementById('screen').src = "frame.jpeg?rand="+Math.random();
	}, 1000);
	
	setInterval(function() {
		read_state();
	}, 1000);
});  
