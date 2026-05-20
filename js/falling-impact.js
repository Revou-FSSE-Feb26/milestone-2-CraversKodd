 const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        let frames = 0;
        let score = 0;
        let animationId;
        let isPlaying = false;
        let nickname = "";
        let obstacles = [];

        // Player Object
        const player = {
            x: 180,
            y: 450,
            width: 30,
            height: 30,
            speed: 5,
            dx: 0
        };

        const screens = {
            start: document.getElementById('start-screen'),
            play: document.getElementById('play-screen'),
            end: document.getElementById('end-screen')
        };
        const els = {
            nickInput: document.getElementById('nickname'),
            scoreDisplay: document.getElementById('score-display'),
            finalScore: document.getElementById('final-score'),
            leaderboardList: document.getElementById('leaderboard-list')
        };

        // Controls Event Listeners
        
        //document.addEventListener('keydown', (e) => {
        //    if (e.key === 'ArrowLeft') player.dx = -player.speed;
        //    if (e.key === 'ArrowRight') player.dx = player.speed;
        //});
        //document.addEventListener('keyup', (e) => {
        //    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
        //});

        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    player.dx = -player.speed;
                    break;
                case 'ArrowRight':
                    player.dx = player.speed;
                    break;
            }
        });
        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowRight':
                    player.dx = 0;
                    break;
            }
        });

        document.getElementById('start-btn').addEventListener('click', startGame);
        document.getElementById('restart-btn').addEventListener('click', () => switchScreen('start'));

        function switchScreen(screenName) {
            Object.values(screens).forEach(s => s.style.display = 'none');
            screens[screenName].style.display = 'block';
        }

        function startGame() {
            nickname = els.nickInput.value.trim() || "Spirit";
            obstacles = [];
            frames = 0;
            score = 0;
            player.x = canvas.width / 2 - player.width / 2;
            player.dx = 0;
            isPlaying = true;
            
            switchScreen('play');
            updateLoop();
        }

        function spawnObstacle() {
            const size = Math.random() * 30 + 20; // Size between 20 and 50
            const x = Math.random() * (canvas.width - size);
            // Speed slowly increases as score goes up
            const speed = Math.random() * 3 + 2 + (score / 10); 
            
            obstacles.push({ x, y: -size, width: size, height: size, speed });
        }

        //function updateLoop() {
            //if (!isPlaying) return;
//
            //// Clear Canvas
            //ctx.clearRect(0, 0, canvas.width, canvas.height);
//
            //// Update Score (Assuming ~60 FPS, 60 frames = 1 second)
            //frames++;
            //if (frames % 60 === 0) {
            //    score++;
            //    els.scoreDisplay.textContent = score;
            //}
//
            //// Spawn Obstacles (Every 40 frames)
            //if (frames % 40 === 0) {
            //    spawnObstacle();
            //}
//
            //// Move and Draw Player
            //player.x += player.dx;
            //// Wall constraints
            //if (player.x < 0) player.x = 0;
            //if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
            
            function updateLoop() {
            if (!isPlaying) return;

            // Clear Canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update Score (Assuming ~60 FPS, 60 frames = 1 second)
            frames++;
            if (frames % 60 === 0) {
                score++;
                els.scoreDisplay.textContent = score;
            }

            // Spawn Obstacles (Every 40 frames)
            if (frames % 40 === 0) {
                spawnObstacle();
            }

            // Move and Draw Player
            player.x += player.dx;
            // Wall constraints
            if (player.x < 0) player.x = 0;
            if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
            
            ctx.fillStyle = '#2ecc71'; // Spirit color
            ctx.fillRect(player.x, player.y, player.width, player.height);

            // Move, Draw, and Check Collision for Obstacles
            for (let i = 0; i < obstacles.length; i++) {
                let obs = obstacles[i];
                obs.y += obs.speed;

                ctx.fillStyle = '#e74c3c'; // Shadow color
                ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

                // Collision Detection (AABB)
                if (
                    player.x < obs.x + obs.width &&
                    player.x + player.width > obs.x &&
                    player.y < obs.y + obs.height &&
                    player.y + player.height > obs.y
                ) {
                    endGame();
                }

                // Remove off-screen obstacles to save memory
                if (obs.y > canvas.height) {
                    obstacles.splice(i, 1);
                    i--;
                }
            }

            if (isPlaying) {
                animationId = requestAnimationFrame(updateLoop);
            }
        }

        function endGame() {
            isPlaying = false;
            cancelAnimationFrame(animationId);
            switchScreen('end');
            els.finalScore.textContent = score;
            saveScore(nickname, score);
            displayLeaderboard();
        }

        function saveScore(name, finalScore) {
            let scores = JSON.parse(localStorage.getItem('spirit_scores')) || [];
            scores.push({ name, score: finalScore });
            scores.sort((a, b) => b.score - a.score); 
            scores = scores.slice(0, 5); 
            localStorage.setItem('spirit_scores', JSON.stringify(scores));
        }

        function displayLeaderboard() {
            let scores = JSON.parse(localStorage.getItem('spirit_scores')) || [];
            els.leaderboardList.innerHTML = scores.map(entry => `<li>${entry.name}: ${entry.score}s</li>`).join('');
        }