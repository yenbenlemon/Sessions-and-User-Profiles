
//Initialize by randomly selecting an answer for each question
function init(){
	let questions = document.getElementsByClassName("question_div");
	console.log("Init");
	console.log(questions);
	for(let i = 0; i < questions.length; i++){
		let id = questions[i].id;
		let selected = Math.floor(Math.random()*4);
		let radio = document.getElementById(id + "_" + selected);
		radio.checked = true;
	}
}

//Build an object containing keys/values representing question ids and selected answers respectively
//POST it to the /quiz route on the server
//Show alert and redirect to the URL the server tells us to when response comes back
function submit()
{
	let questions = document.getElementsByClassName("question_div");
	let obj = {}
	for(let i = 0; i < questions.length; i++){
		let id = questions[i].id;
		for(let answer = 0; answer < 4; answer++){
			let radio = document.getElementById(id + "_" + answer);
			if(radio.checked){
				obj[id] = radio.value;
				break;
			}
		}
	}

	req = new XMLHttpRequest();
	req.onreadystatechange = function()
	{
		if(this.readyState==4 && this.status == 200)
		{
			let response = JSON.parse(this.responseText);
			alert("Quiz submitted! Your score: " + response.correct + "/10");
			window.location.href = response.url;
		}
	}
	req.open("POST", '/quiz');
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(obj ));
}
