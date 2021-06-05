

//document.addEventListener("DOMContentLoaded", displayWorkoutsTable);
document.addEventListener("DOMContentLoaded", main);

function main(){
	displayWorkoutsTable();
	handleInsert();

//gets any table data from database 
function getWorkouts(workouts){
	//calls get and returns a list of objects
	var request = new XMLHttpRequest();
	request.open("GET", "http://flip3.engr.oregonstate.edu:1375/", true); // ip???
	request.withCredentials = true;
	request.addEventListener("load", function(){
		var response = request.responseText;
		var objectListFromDatabase = JSON.parse(response); 
		console.log(typeof(objectListFromDatabase)); 
		workouts(objectListFromDatabase); 
	});
	request.send(null);
};

//add workouts to the table
function convertWorkoutToTableRow(singleObjectRow){

	//get cell data from each element in the object
	var newRow = document.createElement("tr");
	document.getElementById("tableBody").appendChild(newRow);
	
	addTableRowToDOM(newRow, singleObjectRow.name);
	addTableRowToDOM(newRow, singleObjectRow.reps);
	addTableRowToDOM(newRow, singleObjectRow.weight);
	addTableRowToDOM(newRow, singleObjectRow.date);
	addTableRowToDOM(newRow, singleObjectRow.lbs);

	//create buttons
	var editButton = document.createElement("button");
	editButton.id = "Edit";
	var cellForButtons = document.createElement("td");
	newRow.appendChild(cellForButtons);
	cellForButtons.appendChild(editButton);
	editButton.textContent = "Edit";

	var deleteButton = document.createElement("button");
	deleteButton.id = "Delete";
	cellForButtons.appendChild(deleteButton);
	deleteButton.textContent = "Delete";
	deleteButton.addEventListener("click", function(event){
		var deleteRequest = new XMLHttpRequest();
		deleteRequest.open("GET", "http://flip3.engr.oregonstate.edu:1375/delete?id=" + singleObjectRow.id, true); // ip???
		deleteRequest.addEventListener("load", function(){
			var response = deleteRequest.responseText;
			console.log(response);
			resetTable();
			displayWorkoutsTable();
		});
		deleteRequest.send(null);
		event.preventDefault();
	});
};

// resets the table 
function resetTable(){
	var newTableBody = document.createElement("tbody");
	var oldTableBody = document.getElementById("tableBody");
	oldTableBody.parentNode.replaceChild(newTableBody, oldTableBody);
	newTableBody.id = "tableBody";
}

//builds table by row and cell
function addTableRowToDOM(newRow, singleTableItem){
	var cellData = document.createElement("td");
	newRow.appendChild(cellData);
	cellData.textContent = singleTableItem;
}

//coverts data from sql into the table
function convertWorkoutsToTable(objList){
	for (var i=0; i<objList.results.length; i++){
		convertWorkoutToTableRow(objList.results[i])
	}
}

// displays table
function displayWorkoutsTable(){
	getWorkouts(function workouts(objectListFromDatabase){
		console.log("objectListFromDatabase is an " + typeof(objectListFromDatabase));
		convertWorkoutsToTable(objectListFromDatabase);
	});
};

// function to handle inserts
function handleInsert(){
	document.getElementById("submit").addEventListener("click", function(event){
		console.log("click is working");
		var insertRequest = new XMLHttpRequest();
		var name = document.getElementById("name").value;
		var reps = document.getElementById("reps").value;
		var weight = document.getElementById("weight").value;
		var date = document.getElementById("date").value;
		if(document.getElementById("lbs").value == "lbs"){
			var lbs = 1;
		}else{
			var lbs = 0;
		}
		insertRequest.open("GET", "http://flip3.engr.oregonstate.edu:1375/insert", name, reps, weight, date, lbs, true); // ip???
		insertRequest.addEventListener("load", function(){
			if (insertRequest.status >= 200 && insertRequest.status < 400){
				var response = insertRequest.responseText;
				console.log(response);
				resetTable();
				displayWorkoutsTable();			
			} else {
				console.log("error");
			}
		});
		insertRequest.send(null);
		event.preventDefault();
	});
};

}; 

