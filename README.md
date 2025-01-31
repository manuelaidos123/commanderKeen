# Commander Keen Inspired Game

A simple HTML5/JavaScript platformer inspired by the classic Commander Keen series. This project features basic player movement, platform collisions, enemy patrols, a pistol for shooting enemies, and level progression with increasing difficulty.

## Features

- **Player Movement:**  
  Use the arrow keys to move left/right and jump (Space or Up arrow).  
- **Shooting Mechanism:**  
  Press the **Z** key to fire the pistol. Bullets travel horizontally and destroy enemies on collision.  
- **Enemies:**  
  Enemies patrol within specified boundaries on the platforms. Colliding with an enemy causes the player to lose a life.  
- **Level Progression:**  
  Reach the finish line (indicated by a green line) to complete the level. Each new level increases the enemy count and their speed, making the game more challenging.  
- **Lives and Score Tracking:**  
  The game displays the player’s current lives (starting at 3) and score. Falling off the screen or colliding with an enemy results in a life loss, and the game resets when lives are depleted.

## How to Play

1. **Movement:**  
   - **Left/Right Arrow Keys:** Move left and right.
   - **Space/Up Arrow Key:** Jump.
2. **Shooting:**  
   - **Z Key:** Fire the pistol to shoot bullets.
3. **Objective:**  
   - Navigate through the level, avoid enemies, and reach the finish line to advance to the next level.  
   - Destroy enemies for extra points.

## Running the Game

1. Clone or download the repository.
2. Open the `index.html` file in a modern web browser (e.g., Microsoft Edge, Chrome, or Firefox).
3. Enjoy the game!

## Project Structure

- **index.html:**  
  Contains the complete game code (HTML, CSS, and JavaScript) for the platformer.

## Recent Changes

- **Pistol Implementation:**  
  Added a shooting mechanism allowing the player to fire bullets (using the **Z** key) to eliminate enemies.
- **Enhanced Enemy Behavior:**  
  Enemies now patrol specific areas on the platforms. Their number and speed increase with each level.
- **Level System:**  
  Added a finish line that, when reached, completes the current level and advances the player to a harder, subsequent level.
- **Life System:**  
  The player now has 3 lives; falling off the platform or colliding with an enemy decreases the life count. When lives run out, the game resets.

## Future Improvements

- Introduce animated sprites and more detailed graphics.
- Improve collision detection and add more refined physics.
- Add varied enemy types and obstacles.
- Incorporate sound effects and background music.
- Develop additional levels with unique layouts and challenges.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

This game is inspired by the classic Commander Keen series originally developed by id Software.
