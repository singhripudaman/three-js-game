# Title

COMP 4303 Term Project

## Description

A Maze Escape Game while being pursued. \
Story: You have just robbed a Lamborghini and are being pursued by cops through a maze. The cops will give chase if they get close enough, but through your skilful driving, you can lose them and escape with your loot.

## Team

- Ripudaman Singh 202054565
- Mohammed Balfaqih 202051926

## How to Run

- Download .zip file
- run `npm install vite three` in the root directory
- run `npx vite`
- Click on "Play" button in the browser

## Controls

WASD for movement. Mouse is only required to press Play.

## Topics Implemented

- Complex Movement Algorithms - Path Following
- Pathfinding - Flow Field Pathfinding
- Decision Making - State Machine
- Procedural Content Generation - Depth-First Backtracking Maze Generation
- Extra topics - Pursue and Evade

## Topic Locations

- `js\Game\Behaviour\Player.js`, `js\Game\Behaviour\NPC.js`, and `js\Game\Behaviour\State.js` contain the State Machine logic
- `js\Game\World\MazeGenerator.js` contains the code to generate the maze (Depth-First Backtracking Maze Generation)
- `js\Game\Behaviour\NPC.js` contains the Path Following and Flow Field Pathfinding
- `js\Game\World\GameMap.js` path finding

## Contribution

Ripudaman Singh:

- implement the wander movement algorithm.
- implement the state machine.
- implement police chasing
- collision detection

Mohammed Balfaqih:

- implement the pathfinding field flow algorithm using appropriate heuristics.
- implement the depth-first backtracking maze generation for the map generation.
- Will make the player controls and other game assets required for visuals.

## References

CAR Model by Ignition Labs [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/5zUWP5UsLg-)
