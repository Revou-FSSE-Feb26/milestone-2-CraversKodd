 let score = 0;
        let timeLeft = 10;
        let timerInterval;
        let nickname = "";

        const screens = {
            start: document.getElementById('start-screen'),
            play: document.getElementById('play-screen'),
            end: document.getElementById('end-screen')
        };
        const els = {
            nickInput: document.getElementById('nickname'),
            timeDisplay: document.getElementById('time-display'),
            scoreDisplay: document.getElementById('score-display'),
            finalScore: document.getElementById('final-score'),
            leaderboardList: document.getElementById('leaderboard-list')
        };

        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('clicker-btn').addEventListener('click', incrementScore);
        document.getElementById('restart-btn').addEventListener('click', () => switchScreen('start'));

        function switchScreen(screenName) {
            Object.values(screens).forEach(s => s.style.display = 'none');
            screens[screenName].style.display = 'block';
        }

        function startGame() {
            nickname = els.nickInput.value.trim() || "Wanderer";
            score = 0;
            timeLeft = 10.0;
            
            els.scoreDisplay.textContent = score;
            els.timeDisplay.textContent = timeLeft.toFixed(1);
            
            switchScreen('play');
            
            timerInterval = setInterval(() => {
                timeLeft -= 0.1;
                els.timeDisplay.textContent = Math.max(0, timeLeft).toFixed(1);
                
                if (timeLeft <= 0) {
                    endGame();
                }
            }, 100);
        }

        function incrementScore() {
            if (timeLeft > 0) {
                score++;
                els.scoreDisplay.textContent = score;
            }
        }

        function endGame() {
            clearInterval(timerInterval);
            switchScreen('end');
            els.finalScore.textContent = score;
            saveScore(nickname, score);
            displayLeaderboard();
        }

        function saveScore(name, finalScore) {
            let scores = JSON.parse(localStorage.getItem('echoes_scores')) || [];
            scores.push({ name, score: finalScore });
            scores.sort((a, b) => b.score - a.score); 
            scores = scores.slice(0, 5); 
            localStorage.setItem('echoes_scores', JSON.stringify(scores));
        }

        function displayLeaderboard() {
            let scores = JSON.parse(localStorage.getItem('echoes_scores')) || [];
            els.leaderboardList.innerHTML = scores.map(entry => `<li>${entry.name}: ${entry.score} Clicks</li>`).join('');
        }