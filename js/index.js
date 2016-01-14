/**
 *  AngularJS for Index.html
 */


// Declare and Configure app
var app = angular.module('searchApp', ['ngCookies']);
app.config(['$interpolateProvider', function($interpolateProvider) {
	$interpolateProvider.startSymbol('{[');
	$interpolateProvider.endSymbol(']}');
}]);

// Define functionality of app
app.controller('myCtrl', ['$scope', '$http', '$cookies', 
function($scope,$http, $cookies) {
	
	var storage = {};
	
	$scope.sendToStorage = function(){
		storage[$scope.key] = $("#code").val(); //scope.value;
		//clear the storage 
		$scope.key = "";
		$scope.value="";
	}
	
	$scope.sendPost = function() {
		
		// Set cookie for search term
		$cookies.put('entry' , $scope.entry);

		// Notify User that Data is loading
		$scope.loadData = true;

		// Get User Input
		var user_entry = $scope.entry;
		
		entry_len = user_entry.length;
		start = 0;
		end = 0
		while (start < entry_len){
			
			// Look for []
			// if you see a "[" then you know the next index will be the code
			// and the code next "]" will end the code
			start = user_entry.indexOf("[", start);
			end = user_entry.indexOf("]", start+1);

			if (start != -1 && end != -1){
				
				escape_index = user_entry.indexOf("#", start-1); // has to be next to start to be escaped

				if( escape_index != -1){

					// If found escape then remove the #
					user_entry = user_entry.replace(user_entry.substring(escape_index, escape_index+1), "");

					// skip over the [
					start = start + 1;

				}
				else{
						//An escape was not found
					

							end = user_entry.indexOf("]", start+1); //don't care if before start
							// no escape found, you meant to use a key word

							// Take away white space around keyword, find special character
							var key = user_entry.substring(start+1, end).trim();
							if (key in storage){
								
								//If you find the key in storage, 

								//replace the string with what's in storage
								user_entry = user_entry.replace(user_entry.substring(start, end+1), storage[key]);
			
								// find the next [
								
								//end += 1;
								//start = end; // could be making it loop if no end
								start = start+ 1;
							}
							else{
								//key not in storage and escape was not found
								//leave as is
								start += 1;
								end+=1;
							}
					}
			}else{
			break
			}
			console.log(start + " start");
			console.log(end + " end");
		}//end while
			

    	$scope.loadData = false;
        $("#result").html( user_entry);

	};//end sendPost
	
	$scope.generateUnicode = function(start,end){
		var display ="";
		var code = "";
		var id = "";
		for (var i=start; i<=end; i++){
				if( i < 10){
					code="&#00"+ String(i) + ";"
					id = "00" +String(i);
					
				}else if(i <=99){
					code="&#0"+ String(i) + ";"
					id = "0" +String(i);
				}else{
					code="&#"+ String(i) + ";"
					id = String(i);
				}
				display += "<button class=\"btn btn-default\" type=\"button\" "
						   + " onclick=\"sendToForm(\'"+ id + "\') \"> "
						   + code + " "+"</button>";
		}
		$("#display").html(display);
	}

	// Check for cookie and reload results
	var init = function () {

		//assume data is loading
		$scope.loadData = true;

		// get cookie for previous entry if possible
		entry =  $cookies.get('entry');
		//TODO: long term this belongs in a database
		
		// Put entry back in box
		$scope.entry = entry;
		
		if(entry){
			$scope.loadData = false;
		}
		$scope.generateUnicode(160, 255);
	};
		// and fire it after definition
	init();
	
}]);//end controller


//Some Jquery
function sendToForm(id){
	unicodeDecimal = "&#"+id + ";";
	$("#code").val(unicodeDecimal) ;
}