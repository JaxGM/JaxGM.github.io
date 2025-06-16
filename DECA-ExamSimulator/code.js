// Global Data
let cdcDate = "";
let icdcDate = "2026-04-25";

/////////////////////////////////////////////////////////////////////////

// Init Variables
let cdcCountdown,
	correct,
	counter,
	data,
	icdcCountdown,
	incorrect,
	mode,
	progress,
	questionSet,
	reviewSet,
	scoreChart,
	temp,
	url,
	examCatageory;
let currentQ = 1;

// Calculates and displays the countdown to CDC testing and ICDC testing
function dates() {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// CDC
	try {
		cdcDate = Math.round(
			(new Date(cdcDate).setHours(0, 0, 0, 0) - today) /
				(1000 * 60 * 60 * 24)
		);
		cdcDate = isNaN(cdcDate) ? "TBD" : cdcDate;
	} catch (error) {
		cdcDate = "TBD";
	}

	// ICDC
	try {
		icdcDate = Math.round(
			(new Date(icdcDate).setHours(0, 0, 0, 0) - today) /
				(1000 * 60 * 60 * 24)
		);
		icdcDate = isNaN(icdcDate) ? "TBD" : icdcDate;
	} catch (error) {
		icdcDate = "TBD";
		console.log(icdcDate);
	}

	// Push
	document.getElementById("dates").innerHTML =
		"<strong>" +
		cdcDate +
		"</strong>&nbsp;days&nbsp;until&nbsp;Flordia&nbsp;CDC&nbsp;Testing&nbsp;| <strong>" +
		icdcDate +
		"</strong>&nbsp;days&nbsp;until&nbsp;ICDC";
}

// Start Code
function onStart() {
	// Updates countdowns
	dates();

	// Awakes Server
	fetch("https://deca-examprocessor.onrender.com/url?link=awake", {
		method: "GET",
	})
		.then((response) => response.json())
		.then((response) => console.log(response))
		.catch((err) => console.error(err));
}

// Optimized for TEST mode, pulls up the requested question
function callQuestion(number) {
	document.getElementById("advancement<").hidden = false;
	document.getElementById("advancement>").hidden = false;
	document.getElementById("BubbleQuestion").hidden = false;

	document.getElementById("BubbleReveiw").hidden = true;
	document.getElementById("reviewButton").hidden = false;
	document.getElementById("subScore").hidden = true;

	console.log("calling" + number);
	document.getElementById("id" + currentQ).hidden = true;
	currentQ = number;
	document.getElementById("id" + number).hidden = false;
	document.getElementById("questionNumber").innerText = "Questiom " + number;
}

// Records a radio button click
function recordResponce() {
	console.log(incorrect);
	console.log(correct);
	//commit answer to data
	qualifyingButtons = document.getElementsByName("RadioButton" + currentQ);
	for (i = 0; i < qualifyingButtons.length; i++) {
		if (qualifyingButtons[i].checked) {
			if (data[currentQ][8] != true) {
				data[currentQ][8] = true;
				progress = progress + 1;
				document.getElementById("ProgressPercent").innerText =
					progress + "%";
				document.getElementById("ProgressBar").value = progress;
				document.getElementById("ProgressText").innerText =
					progress + "/100";
			}

			data[currentQ][9] = qualifyingButtons[i].id.substring(0, 1);
			console.log(qualifyingButtons[i].id.substring(0, 1));
		}
	}

	//bold answer on review
	console.log(currentQ + "CLetterR");
	if (data[currentQ][9] == "A" && data[currentQ][8]) {
		document.getElementById(currentQ + "ALetterR").innerHTML =
			"<strong>" + "&nbspA.&nbsp" + "</strong>";
		document.getElementById(currentQ + "ATextR").innerHTML =
			"<strong>" + data[currentQ][2] + "</strong>";
	} else {
		document.getElementById(currentQ + "ALetterR").innerHTML =
			"&nbspA.&nbsp";
		document.getElementById(currentQ + "ATextR").innerHTML =
			data[currentQ][2];
	}
	if (data[currentQ][9] == "B" && data[currentQ][8]) {
		document.getElementById(currentQ + "BLetterR").innerHTML =
			"<strong>" + "&nbspB.&nbsp" + "</strong>";
		document.getElementById(currentQ + "BTextR").innerHTML =
			"<strong>" + data[currentQ][3] + "</strong>";
	} else {
		document.getElementById(currentQ + "BLetterR").innerHTML =
			"&nbspB.&nbsp";
		document.getElementById(currentQ + "BTextR").innerHTML =
			data[currentQ][3];
	}
	if (data[currentQ][9] == "C" && data[currentQ][8]) {
		document.getElementById(currentQ + "CLetterR").innerHTML =
			"<strong>" + "&nbspC.&nbsp" + "</strong>";
		document.getElementById(currentQ + "CTextR").innerHTML =
			"<strong>" + data[currentQ][4] + "</strong>";
	} else {
		document.getElementById(currentQ + "CLetterR").innerHTML =
			"&nbspC.&nbsp";
		document.getElementById(currentQ + "CTextR").innerHTML =
			data[currentQ][4];
	}
	if (data[currentQ][9] == "D" && data[currentQ][8]) {
		document.getElementById(currentQ + "DLetterR").innerHTML =
			"<strong>" + "&nbspD.&nbsp" + "</strong>";
		document.getElementById(currentQ + "DTextR").innerHTML =
			"<strong>" + data[currentQ][5] + "</strong>";
	} else {
		document.getElementById(currentQ + "DLetterR").innerHTML =
			"&nbspD.&nbsp";
		document.getElementById(currentQ + "DTextR").innerHTML =
			data[currentQ][5];
	}
}

function altAnswer(q, a) {
	document.getElementById(a+'Button'+q).click()
}

// Activates the core functionality of the program
function newExam(type) {

	// Functionality is currenlty only enabled for TEST, not TRAINING.
	if (type == "test") {
		document.getElementById("newTest").innerText = "···";

		// Process Exam
		url = document.getElementById("URL").value;
		
		// DEBUG MODE
		// url = "https://cdn.prod.website-files.com/635c470cc81318fc3e9c1e0e/67c1d65441573664321a854f_24-25_BA%20Core%20Exam.pdf";


		fetch("https://deca-examprocessor.onrender.com/url?link=" + url, {
			method: "GET",
		})
			.then((response) => response.json())
			.then((response) => {
				// NEEDS TO BE CLEANED
				data = response;
				console.log(data);

				if (data != "error") {
					// General Reset
				}

				if (data != "error" && type == "test" && Array.isArray(data)) {
					document.getElementById("ExamType").innerText = data[0][0];

					document.getElementById("ScoreChart").style.display = "none";

					document.getElementById("newTest").innerText = "New Test";

					document.getElementById("reviewButton").innerText = "Review";

					document.getElementById("mode").innerText = "Testing Mode";
					correct = 0;
					incorrect = 0;
					progress = 0;
					document.getElementById("ProgressPercent").innerText = progress + "%";
					document.getElementById("ProgressBar").value = progress;
					document.getElementById("ProgressText").innerText = progress + "/100";

					document.getElementById("Progress").hidden = false;
					document.getElementById("ProgressPercent").hidden = false;
					document.getElementById("ProgressBar").hidden = false;
					document.getElementById("ProgressText").hidden = false;

					questionSet = "";
					for (let i = 1; i < data.length; i++) {
						questionSet += `<div id="id${i}" hidden><p id="QuestionPhrase">${i}. ${data[i][1]}</p><div id="AnswerChoices">` +
							`<div id="AnswerChoice"><input type="radio" class="Radio" onclick="recordResponce()" name="RadioButton${i}" id="AButton${i}"><p id="${i}ALetter" class="clickable" onclick="altAnswer(${i}, A)">&nbspA.&nbsp</p><p id="${i}AText" class="clickable" onclick="altAnswer(${i}, 'A')">${data[i][2]}</p></div>` +
							`<div id="AnswerChoice"><input type="radio" class="Radio" onclick="recordResponce()" name="RadioButton${i}" id="BButton${i}"><p id="${i}BLetter" class="clickable" onclick="altAnswer(${i}, B)">&nbspB.&nbsp</p><p id="${i}BText" class="clickable" onclick="altAnswer(${i}, 'B')">${data[i][3]}</p></div>` +
							`<div id="AnswerChoice"><input type="radio" class="Radio" onclick="recordResponce()" name="RadioButton${i}" id="CButton${i}"><p id="${i}CLetter" class="clickable" onclick="altAnswer(${i}, C)">&nbspC.&nbsp</p><p id="${i}CText" class="clickable" onclick="altAnswer(${i}, 'C')">${data[i][4]}</p></div>` +
							`<div id="AnswerChoice"><input type="radio" class="Radio" onclick="recordResponce()" name="RadioButton${i}" id="DButton${i}"><p id="${i}DLetter" class="clickable" onclick="altAnswer(${i}, D)">&nbspD.&nbsp</p><p id="${i}DText" class="clickable" onclick="altAnswer(${i}, 'D')">${data[i][5]}</p></div>` +
							`</div><p id="${i}Reasoning" class="reasoning" hidden></p></div>`;
					}
					document.getElementById("BubbleQuestion").innerHTML = questionSet;

					reviewSet = '<h2 id="RevHead" style="text-align: center;"><u>Review</u></h2><h5 id="Disclaim" hidden style="text-align: center;">*For answer descriptions, select the question :)</h5>';
					for (let i = 1; i < data.length; i++) {
						reviewSet += `<div id="rid${i}" class="reviewPart" onclick="callQuestion(${i})"><p id="QuestionPhrase" style="font-size: 1rem">${i}. ${data[i][1]}</p><div id="AnswerChoices">` +
							`<div id="${i}ReviewChoiceA" class="ReviewChoice"><p id="${i}ALetterR">&nbspA.&nbsp</p><p id="${i}ATextR">${data[i][2]}</p></div>` +
							`<div id="${i}ReviewChoiceB" class="ReviewChoice"><p id="${i}BLetterR">&nbspB.&nbsp</p><p id="${i}BTextR">${data[i][3]}</p></div>` +
							`<div id="${i}ReviewChoiceC" class="ReviewChoice"><p id="${i}CLetterR">&nbspC.&nbsp</p><p id="${i}CTextR">${data[i][4]}</p></div>` +
							`<div id="${i}ReviewChoiceD" class="ReviewChoice"><p id="${i}DLetterR">&nbspD.&nbsp</p><p id="${i}DTextR">${data[i][5]}</p></div>` +
							`</div></div>`;
					}
					document.getElementById("BubbleReveiw").innerHTML = reviewSet;

					document.getElementById("controls").hidden = false;
					document.getElementById("controls").className = "controlsON";

					callQuestion(1);

				} else {
					//error out
					document.getElementById("newTest").innerText = "New Test";
					alert("An error has occurred. Please try again.");
					console.log("error");
					console.log(data);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	} else if (type == "training") {
		alert("Training is not avalible yet.");
		return;
	}
}

// Optimized for TEST mode, pulls up the review page
function callReview() {
	if (progress == "Scored") {
		document.getElementById("BubbleQuestion").hidden = true;
		document.getElementById("advancement<").hidden = true;
		document.getElementById("advancement>").hidden = true;
		document.getElementById("reviewButton").hidden = true;

		document.getElementById("BubbleReveiw").hidden = false;

		document.getElementById("questionNumber").innerText = "Results Page";
	} else {
		document.getElementById("advancement<").hidden = true;
		document.getElementById("advancement>").hidden = true;
		document.getElementById("BubbleQuestion").hidden = true;

		document.getElementById("BubbleReveiw").hidden = false;
		document.getElementById("reviewButton").hidden = true;
		document.getElementById("subScore").hidden = false;

		document.getElementById("questionNumber").innerText = "Review Page";
	}
}

// Goes to the next quetion (or review page)
function nextQuestion() {
	if (currentQ < 100) {
		callQuestion(currentQ + 1);
	} else if (currentQ == 100) {
		callReview();
	}
}

// Goes to the qeustion before
function lastQuestion() {
	if (currentQ != 1) {
		callQuestion(currentQ - 1);
	}
}

// Creates chart and displays scores
function displayResults() {
	// Set Visable
	document.getElementById("ScoreChart").style.display = "flex";

	// Show Numerical Results
	document.getElementById("correct").innerHTML =
		"<strong>Correct</strong>: " + correct + "</p>";
	document.getElementById("skipped").innerHTML =
		"<strong>Correct</strong>: " + (100 - (correct + incorrect)) + "</p>";
	document.getElementById("incorrect").innerHTML =
		"<strong>Correct</strong>: " + incorrect + "</p>";

	//Create Chart
	if (scoreChart) {
		scoreChart.destroy();
	}
	scoreChart = new Chart(document.getElementById("chart"), {
		type: "doughnut",
		options: {
			plugins: {
				legend: {
					display: false,
				},
			},
		},
		data: {
			labels: ["Correct", "Skipped", "Incorrect"],
			datasets: [
				{
					data: [correct, 100 - (correct + incorrect), incorrect],
					backgroundColor: [
						"rgb(43, 188, 21)",
						"rgb(54, 162, 235)",
						"rgb(234, 42, 42)",
					],
					hoverOffset: 4,
				},
			],
		},
	});
}

// Scores the test
function scoreTest() {
	document.getElementById("Progress").hidden = true;
	document.getElementById("ProgressPercent").hidden = true;
	document.getElementById("ProgressBar").hidden = true;
	document.getElementById("ProgressText").hidden = true;

	progress = "Scored";

	document.getElementById("reviewButton").innerText = "Results";

	for (i = 1; i <= 100; i++) {
		// Score

		// Set Red     // Set Green      // Set Blue
		if (data[i][8]) {
			if (data[i][9] == data[i][6]) {
				document.getElementById(
					i + "ReviewChoice" + data[i][9]
				).className = "greenRihgt";
				correct = correct + 1;
			} else if (data[i][9] != data[i][6]) {
				document.getElementById(
					i + "ReviewChoice" + data[i][9]
				).className = "redWrong";
				document.getElementById(
					i + "ReviewChoice" + data[i][6]
				).className = "actualAnswer";
				incorrect = incorrect + 1;
			}
		} else {
			document.getElementById(i + "ReviewChoice" + data[i][6]).className =
				"actualAnswer";
		}

		// Add description
		document.getElementById(i + "Reasoning").hidden = false;
		document.getElementById(i + "Reasoning").innerHTML =
			"<i><strong>" + data[i][7] + "</strong></i>";

		document.getElementById("questionNumber").innerText = "Results Page";
		document.getElementById("RevHead").innerHTML = "<u>Results</u>";

		document.getElementById("subScore").hidden = true;
		document.getElementById("Disclaim").hidden = false;

		// Lock Radio buttons
		document.getElementById("AButton" + i).disabled = true;
		document.getElementById("BButton" + i).disabled = true;
		document.getElementById("CButton" + i).disabled = true;
		document.getElementById("DButton" + i).disabled = true;
	}

	// Display Score
	displayResults();
}
