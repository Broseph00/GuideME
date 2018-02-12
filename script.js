var pageLang = "es";
var directionsDisplay;
var directionsService; 
var results; 

function getLang() {
	return pagelang;
}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

function translate(text, lang, element) {
	var url = "http://localhost:8081/Translate/" + encodeURI(text) + "/" + lang;
	var xhr = createCORSRequest('GET', url);
	if (!xhr) {
	  throw new Error('CORS not supported');
	}
	var xmlDoc;
	xhr.addEventListener("readystatechange", function () {
	  if (this.readyState === 4) {
	   	var parser = new DOMParser();
		xmlDoc = parser.parseFromString(this.response,"text/xml");
		var translation = xmlDoc.getElementsByTagName("string")[0].innerHTML;
	    element.text(translation);
	    console.log(translation);
	  }
	});

	xhr.send();
}

$(document).ready(function(){

	var options = $("option");
	for(var i = 0; i < options.length;i++) {
		var option = options.eq(i);
		translate(option.text(),option.val(),option);
	}

   $("select").change(function(){
   		var language = $("#lang").val(); 
   		currentLang = language; 
   		for(var i = 0; i < $("p").length;i++) {
   			var paragraph = $("p").eq(i);
   			translate(paragraph.text(),language,paragraph);
   		}

   		for(var i = 0; i < $("button").length;i++) {
   			var paragraph = $("button").eq(i);
   			translate(paragraph.text(),language,paragraph);
   		}

   		for(var i = 0; i < $("label").length;i++) {
   			var paragraph = $("label").eq(i);
   			translate(paragraph.text(),language,paragraph);
   		}

   		for(var i = 0; i < $("a").length;i++) {
   			var paragraph = $("a").eq(i);
   			translate(paragraph.text(),language,paragraph);
   		}
   });

   var sourceMarker;
   var startLocationListener;
   var endLocationListener;
   //Load "next" page after language selected 
   $("#lang-btn").click(function() {
   		$("#lang-title").css("display","none");
   		$("#lang").css("display","none");
   		$("#br-lang").css("display","none");
   		$("#lang-btn").css("display","none")
   		$("#Loc-start-title").css("display","block");
   		$("#map").css("display","block");
   		$("#Loc-start-btn").css("display","block");
	  	directionsService = new google.maps.DirectionsService();
	  	directionsDisplay = new google.maps.DirectionsRenderer();
	  	map = new google.maps.Map(document.getElementById('map'), {
			  center: {lat: 29.6428471, lng: -82.3526396},
			  zoom: 15
		});
	  
  		sourceMarker = new google.maps.Marker({
          position: {lat: 29.6428471, lng: -82.3526396},
          map: map,
          draggable: true,
      	  animation: google.maps.Animation.DROP
    	});   

    	startLocationListener =  google.maps.event.addListener(map, 'click', function(event) {
          sourceMarker.setPosition(event.latLng);
        });
   });

   var endMarker;
   $("#Loc-start-btn").click(function(){
   		sourceMarker.setDraggable(false);
   		sourceMarker.setOpacity(0.5);
   		google.maps.event.removeListener(startLocationListener);
   		$("#Loc-start-title").css("display","none");
   		$("#Loc-start-btn").css("display","none");
   		$("#Loc-end-title").css("display","block");
   		$("#Loc-end-btn").css("display","block");
   		endMarker = new google.maps.Marker({
	          position: map.getCenter(),
	          map: map,
	          draggable: true,
          	  animation: google.maps.Animation.DROP
        	});  
   		endLocationListener =  google.maps.event.addListener(map, 'click', function(event) {
          endMarker.setPosition(event.latLng);
        });
   		directionsDisplay = new google.maps.DirectionsRenderer();
   		directionsDisplay.setMap(map);
   });

   $("#Loc-end-btn").click(function(){
   		endMarker.setDraggable(false);
   		endMarker.setOpacity(0.5);
   		google.maps.event.removeListener(endLocationListener);
   		$("#Loc-end-title").css("display","none");
   		$("#Loc-end-btn").css("display","none");
   		$("#confirm-title").css("display","block");
   		$("#confirm-no-btn").css("display","inline");
   		$("#confirm-yes-btn").css("display","inline");
   		sourceMarker.setMap(null);
   		endMarker.setMap(null);
   		var start = sourceMarker.getPosition();
   		var end = endMarker.getPosition();
   		var request = {
		    origin: start,
		    destination: end,
		    travelMode: 'WALKING'
		};

		directionsService.route(request, function(result, status) {
		    if (status == 'OK') {
		      directionsDisplay.setDirections(result);
		      results = result;
		      console.log(result);
		    }
		});
   });

   $("#confirm-no-btn").click(function(){
   		$("#confirm-title").css("display","none");
   		$("#confirm-no-btn").css("display","none");
   		$("#confirm-yes-btn").css("display","none");
   		$("#Loc-start-title").css("display","block");
   		$("#Loc-start-btn").css("display","block");
   		directionsDisplay.setMap(null);

   		sourceMarker = new google.maps.Marker({
	          position: {lat: 29.6428471, lng: -82.3526396},
	          map: map,
	          draggable: true,
          	  animation: google.maps.Animation.DROP
        	});  

        startLocationListener =  google.maps.event.addListener(map, 'click', function(event) {
          sourceMarker.setPosition(event.latLng);
        }); 
   });

   $("#confirm-yes-btn").click(function(){
   		$("#confirm-title").css("display","none");
   		$("#confirm-no-btn").css("display","none");
   		$("#confirm-yes-btn").css("display","none");
   		
   		$("#complete-btn").css("display","inline");
   		$("#confirmed-title").css("display","block");
   		$("#target-lang-title").css("display","block");

   		$("#directions").css("display","block");
   		$("#map-container").addClass("w3-half");
   		
   		var directions = results.routes[0].legs[0].steps;
   		
   		for(var i = 0; i < directions.length;i++) {
   			var instruction = directions[i].instructions;
   			var newPara = $("<li></li>").html(instruction); 
   			newPara.text(newPara.text());
   			newPara.addClass("instructions");
   			$("#list").append(newPara);
   		}
   });

   $("#direction-btn").click(function() {
   		$("#direction-btn").css("display","none");
   		$("#map").css("display","none");
   		$("#confirmed-title").css("display","none");
   		$("#map-btn").css("display","inline");
   		
   		
   		

   });

   $("#target-lang").change(function(){
   		var targetLang = $("#target-lang").val();
   		var instructions = $(".instructions");
   		var directions = results.routes[0].legs[0].steps;
   		var temp = $("<p></p>");
   		for(var i = 0; i < instructions.length; i++) {
   			var eng_instruction = directions[i].instructions;
   			var instruction = instructions.eq(i);
   			temp.html(eng_instruction);
   			temp.text(temp.text());
   			translate(temp.text(),targetLang,instruction); 
   		}
   	});	
});


