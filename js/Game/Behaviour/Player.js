import { Character } from './Character.js';
import { State } from './State';

export class Player extends Character {

	constructor(colour) {
		super(colour);
		this.frictionMagnitude = 20;

		this.name = "player"

		this.gameObject.name = "player";

		// State
		this.state = new IdleState();

		this.state.enterState(this);
	}

	switchState(state) {
		this.state = state;
		this.state.enterState(this);
	}

	update(deltaTime, gameMap, controller) {

		const goalNode = gameMap.graph.goalNode;
		const goalLocation = gameMap.localize(goalNode)

		this.state.updateState(this, controller);

		
		console.log(this.location.distanceTo(goalLocation))

		console.log(this.location.distanceTo(goalLocation))
		if (this.location.distanceTo(goalLocation) < 23) {
			let url = window.location.href;
			if (url.indexOf('?') > -1){
				url += '&state=win'
			 } else {
				url += '?state=win'
			 }
			 window.location.href = url;
		}
		super.update(deltaTime, gameMap);
	}


}

export class IdleState extends State {

	enterState(player) {
		player.velocity.x = 0;
		player.velocity.z = 0;
	}

	updateState(player, controller) {
		if (controller.moving()) {
			player.switchState(new MovingState());
		}
	}

}



export class MovingState extends State {

	enterState(player) {
	}

	updateState(player, controller) {

		if (!controller.moving()) {
			player.switchState(new IdleState());
		} else {
			let force = controller.direction(player);
			force.setLength(100);
			player.applyForce(force);
		
		}	
	}
  
}
