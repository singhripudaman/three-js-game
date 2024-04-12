import * as THREE from 'three';
import { VectorUtil } from '../../Util/VectorUtil.js';
import { Character } from './Character.js';
import { State } from './State.js';

export class NPC extends Character {

	// Character Constructor
	constructor(mColor) {

		

		super(mColor);
		this.name = "enemy"
		this.gameObject.name = "enemy"

		// NEW
		this.segment = 0;
		this.path = [];


		this.state = new IdleState();

		this.state.enterState(this);

		this.raycaster = new THREE.Raycaster();

		this.search = [];
		this.lag = 0.02;

		for (let i = 0; i < 360; i+=3) {
			this.search[i] = new THREE.Vector3(Math.cos(i), 0, Math.sin(i));
		}
	}


	// Seek steering behaviour
	seek(target) {
		let desired = new THREE.Vector3();
		desired.subVectors(target, this.location);
		desired.setLength(this.topSpeed);

		let steer = new THREE.Vector3();
		steer.subVectors(desired, this.velocity);

	
		return steer;
	}

	// Arrive steering behaviour
	arrive(target, radius) {
		let desired = VectorUtil.sub(target, this.location);

		let distance = desired.length();


		if (distance < radius) {
			let speed = (distance/radius) * this.topSpeed;
			desired.setLength(speed);
			
		} else {
			desired.setLength(this.topSpeed);
		} 

		let steer = VectorUtil.sub(desired, this.velocity);

		return steer;
	}


	flow(gameMap) {

		let node = gameMap.quantize(this.location);

		let steer = new THREE.Vector3();

		if (node != gameMap.goal) {

			let desired = gameMap.flowfield.get(node);
			desired.setLength(this.topSpeed);
			steer = VectorUtil.sub(desired, this.velocity);

		} else {

			let nodeLocation = gameMap.localize(node);
			steer = this.arrive(nodeLocation, gameMap.tileSize/2);

		}
		return steer;

	}



	interactiveFlow(gameMap, player) {
		let playerNode = gameMap.quantize(player.location);

		if (!gameMap.goals.includes(playerNode)) {
			gameMap.setupSingleGoalFlowField(playerNode);
		}

		return this.flow(gameMap);
	}

	interactiveFlowGoal(gameMap, goalLoc) {
		let goalNode = gameMap.quantize(goalLoc);

		if (!gameMap.goals.includes(goalNode)) {
			gameMap.setupSingleGoalFlowField(goalNode);
		}

		return this.flow(gameMap);
	}

	

	switchState(state) {
		this.state = state;
		this.state.enterState(this);
	}

	update(deltaTime, gameMap, player) {
		this.state.updateState(this, gameMap, player);
		console.log(this.location.distanceTo(player.location))
		if (this.location.distanceTo(player.location) < 5) {
			let url = window.location.href;
			if (url.indexOf('?') > -1){
				url += '&state=lose'
			 } else {
				url += '?state=lose'
			 }
			 window.location.href = url;
		}
		super.update(deltaTime, gameMap);
	}



}


export class IdleState extends State {

	enterState(enemy, gameMap) {

	}

	updateState(enemy, gameMap, player) {
		
		const condition = enemy.location.distanceTo(player.location) < 100;


		if (condition) {
			enemy.switchState(new ChaseState())
		} else {
			enemy.switchState(new PatrolState())
		}
	}

}


export class ChaseState extends State {
	enterState(enemy, gameMap) {

	}

	updateState(enemy, gameMap, player) {
		const condition = enemy.location.distanceTo(player.location) > 130;

		if (condition) {
			enemy.switchState(new PatrolState())
		} else {
			let steer = enemy.interactiveFlow(gameMap, player);
			enemy.applyForce(steer);
		}
	}
}


export class PatrolState extends State {
    enterState(enemy) {
        // When entering the patrol state, set a random destination for the enemy
       
    }

    updateState(enemy, gameMap, player) {
        // Check if the player is within a certain distance
        const condition = enemy.location.distanceTo(player.location) < 100;

        if (condition) {
            enemy.switchState(new ChaseState());
        } else {
			if ( !enemy.randomDestination) {
				enemy.randomDestination = this.generateRandomDestination(enemy, gameMap);
			}
            // Check if enemy has reached the random destination
            if (enemy.location.distanceTo(enemy.randomDestination) < 10) {
                // If reached, generate a new random destination
                enemy.randomDestination = this.generateRandomDestination(enemy, gameMap);
            } else {
                // Move towards the random destination
                let steer = enemy.interactiveFlowGoal(gameMap, enemy.randomDestination); // Adjust radius as needed
                enemy.applyForce(steer);
            }
        }
    }

    generateRandomDestination(enemy, gameMap) {
        // Generate a random empty tile as destination
        const randomEmptyTile = gameMap.graph.getRandomEmptyTile();
        return gameMap.localize(randomEmptyTile);
    }
}

