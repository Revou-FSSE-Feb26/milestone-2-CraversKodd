 // Variabel game
        let targetNumber, attemptsLeft, nickname, score;
        const maxAttempts = 5;

        // DOM Elements
        const screens = {
            start: document.getElementById('start-screen'),
            play: document.getElementById('play-screen'),
            end: document.getElementById('end-screen')
        };
        const els = {
            nickInput: document.getElementById('nickname'),
            guessInput: document.getElementById('guess-input'),
            feedback: document.getElementById('feedback'),
            attemptsDisplay: document.getElementById('attempts-display'),
            endMessage: document.getElementById('end-message'),
            leaderboardList: document.getElementById('leaderboard-list')
        };

        // Event Listeners
        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('submit-btn').addEventListener('click', checkGuess);
        document.getElementById('restart-btn').addEventListener('click', () => switchScreen('start'));

        function switchScreen(screenName) {
            Object.values(screens).forEach(s => s.style.display = 'none');
            screens[screenName].style.display = 'block';
        }

        function startGame() {
            nickname = els.nickInput.value.trim() || "Anonymous";
            targetNumber = Math.floor(Math.random() * 100) + 1;
            attemptsLeft = maxAttempts;
            
            els.feedback.textContent = "Enter your first guess!";
            els.feedback.style.color = "#ccc";
            els.attemptsDisplay.textContent = attemptsLeft;
            els.guessInput.value = '';
            
            switchScreen('play');
        }

        function checkGuess() {
            const guess = parseInt(els.guessInput.value);
            if (isNaN(guess) || guess < 1 || guess > 100) {
                els.feedback.textContent = "Please enter a valid number between 1 and 100.";
                return;
            }

            attemptsLeft--;
            els.attemptsDisplay.textContent = attemptsLeft;

            if (guess === targetNumber) {
                score = 100 + (attemptsLeft * 20);
                endGame(true);
            } else if (attemptsLeft === 0) {
                score = 0;
                endGame(false);
            } else {
                els.feedback.textContent = guess > targetNumber ? "Too high! Recalculate." : "Too low! Boost power.";
                els.feedback.style.color = "#e74c3c";
                els.guessInput.value = '';
            }
        }

        function endGame(won) {
            switchScreen('end');
            if (won) {
                els.endMessage.textContent = `Access Granted! Score: ${score}`;
                els.endMessage.style.color = "#2ecc71";
                saveScore(nickname, score);
            } else {
                els.endMessage.textContent = `Lockout! The code was ${targetNumber}.`;
                els.endMessage.style.color = "#e74c3c";
            }
            displayLeaderboard();
        }

        // Untuk localStorage leaderboard logic
        function saveScore(name, finalScore) {
            let scores = JSON.parse(localStorage.getItem('aurora_scores')) || [];
            scores.push({ name, score: finalScore });
            scores.sort((a, b) => b.score - a.score);
            scores = scores.slice(0, 5);
            localStorage.setItem('aurora_scores', JSON.stringify(scores));
        }

        function displayLeaderboard() {
            let scores = JSON.parse(localStorage.getItem('aurora_scores')) || [];
            els.leaderboardList.innerHTML = scores.map(entry => `<li>${entry.name}: ${entry.score} pts</li>`).join('');
        }