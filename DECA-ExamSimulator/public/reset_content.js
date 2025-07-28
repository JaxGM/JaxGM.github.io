export const reset_content =
    `<div class="bubble" id="BubbleHead">
				<div id="TestStart">
					<input
						id="URL"
						placeholder="Paste a DECA.org or DECA+ link here:"
					/>
					<button onclick="code.newExam('test')" id="newTest">
						New Test
					</button>
					<button id="newTraining" onclick="code.newExam('training')">
						Enter Training
					</button>
				</div>

				<div id="ExamHead">
					<h3 id="ExamType">DECA Exam</h3>
					<p id="mode" style="text-align: right; flex-grow: 1">
						Welcome!
					</p>
				</div>

				<div id="ScoreChart">
					<canvas id="chart"></canvas>
					<div id="ScoresList">
						<p id="correct" onclick="chartTime()">
							<strong>Correct</strong>: 13
						</p>
						<p id="skipped"><strong>Skipped</strong>: 13</p>
						<p id="incorrect"><strong>Incorrect</strong>: 13</p>
					</div>
				</div>

				<div id="Progress" class="bar">
					<p id="ProgressPercent">0%</p>
					<progress id="ProgressBar" max="100" value="0"></progress>
					<p id="ProgressText">0/100</p>
				</div>

				<div id="TrainingControls" class="bar" hidden>
					<p
						hidden
						style="margin-right: 3rem; margin-left: 3rem"
						id="TrainWords"
					>
						These questions come from your Training Plan and will
						loop on shuffle.
					</p>
					<button
						hidden
						id="TrainRemove"
						class="trainingButtion"
						style="background-color: rgb(135, 0, 0); opacity: 0.7"
						onclick="code.trainNext(false)"
					>
						<strong>Next - </strong>Remove from Training Plan
					</button>
					<button
						hidden
						id="TrainKeep"
						class="trainingButtion"
						style="background-color: rgb(0, 135, 0); opacity: 0.7"
						onclick="code.trainNext(true)"
					>
						<strong>Next - </strong>Keep in Training Plan
					</button>
				</div>

				<div id="controls" hidden>
					<button onclick="code.lastQuestion()" id="advancement<">
						&lt;
					</button>
					<p id="questionNumber">Question #</p>
					<button onclick="code.nextQuestion()" id="advancement>">
						&gt;
					</button>

					<button id="reviewButton" onclick="code.callReview()">
						Review
					</button>
					<button id="subScore" onclick="code.scoreTest()" hidden>
						Submit & Score
					</button>
				</div>
			</div>

			<div class="bubble" id="BubbleQuestion" hidden>
				
			</div>

			<div class="bubble" id="BubbleReview" hidden></div>

			<div class="popup" id="LoginPage">
				<div
					style="
						display: flex;
						align-items: flex-start;
						justify-content: space-between;
					"
				>
					<h2 style="font-size: 2rem; margin-bottom: 0.5rem">
						Welcome!
					</h2>
					<p
						style="font-size: 1rem"
						class="clickable"
						onclick="code.toggleLoginPopup()"
					>
						<u>Close</u>
					</p>
				</div>
				<div style="display: flex; flex-direction: column">
					<p style="margin-bottom: 0.5rem" id="UsernameTitle" hidden>
						Username
					</p>
					<input
						type="text"
						name="text"
						class="loginField"
						placeholder="Usrname"
						id="UsernameField"
						hidden
					/>

					<p style="margin-bottom: 0.5rem">Email</p>
					<input
						type="email"
						name="email"
						class="loginField"
						placeholder="Email"
						id="EmailField"
					/>

					<p style="margin-bottom: 0.5rem">Password</p>
					<input
						type="password"
						name="password"
						class="loginField"
						placeholder="Password. Minimum 6 Characters"
						id="PasswordField"
					/>
					<div style="display: flex; margin-top: -0.5rem">
						<input
							type="checkbox"
							name="showPassword"
							id="showPassword"
							class="clickable"
							onclick="code.togglePasswordVisability()"
						/>
						<p style="font-size: 0.75rem">Reveal Password</p>
					</div>
				</div>
				<div
					style="
						display: flex;
						justify-content: space-between;
						margin-top: 0.75rem;
					"
				>
					<button class="clickable" onclick="code.signUp()">
						Sign Up
					</button>
					<button class="clickable" onclick="code.logIn()">
						Log In
					</button>
				</div>
				<div
					style="
						display: flex;
						justify-content: space-between;
						margin-top: 0.75rem;
					"
				>
					<p id="errorOnLogin"><em></em></p>
					<p class="clickable"><u>Forgot Password</u></p>
				</div>
			</div>
			
			
			<div class="bubble" id="trainingBubble" hidden>
				

			</div>
			
			
			
			
			
			
			`

