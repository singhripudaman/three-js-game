import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { TileNode } from './TileNode.js'

export class MapRenderer {

	constructor() {
	
	}

	createRendering(gameMap) {
		this.gameMap = gameMap;

		this.groundGeometries = new THREE.BoxGeometry(0,0,0);
		this.obstacleGeometries = new THREE.BoxGeometry(0,0,0);
		this.goalGeometries = new THREE.BoxGeometry(0,0,0);
	
		// Iterate over all of the 
		// indices in our graph
		for (let node of this.gameMap.graph.nodes) {
			
			if (node.type != TileNode.Type.Ground) {
				this.createTile(node);
			}


		}

		let groundMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
		let groundGeometry = this.makeGroundGeometry();
		let ground = new THREE.Mesh(groundGeometry, groundMaterial);

		let obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
		let obstacles = new THREE.Mesh(this.obstacleGeometries, obstacleMaterial);

		let goalMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
		let goals = new THREE.Mesh(this.goalGeometries, goalMaterial);

		let gameObject = new THREE.Group();
		
		gameObject.add(ground);
		gameObject.add(obstacles);
		gameObject.add(goals);

		return gameObject;
	}

	makeGroundGeometry() {
		let width = this.gameMap.tileSize * this.gameMap.cols;
		let height = this.gameMap.tileSize;
		let depth = this.gameMap.tileSize * this.gameMap.rows;

		let geometry = new THREE.BoxGeometry(width, height, depth);
		return geometry;
	}

	createTile(node) {

		let x = (node.x * this.gameMap.tileSize) + this.gameMap.start.x;
		let y = node.type == TileNode.Type.Wall ? this.gameMap.tileSize : 0;
		let z = (node.z * this.gameMap.tileSize) + this.gameMap.start.z;

		let height = node.type == TileNode.Type.Wall ? this.gameMap.tileSize*2 : 1;

		let geometry = new THREE.BoxGeometry(this.gameMap.tileSize,
											 height, 
											 this.gameMap.tileSize);
		geometry.translate(x + 0.5 * this.gameMap.tileSize,
						   y + 0.5 * this.gameMap.tileSize,
						   z + 0.5 * this.gameMap.tileSize);

		if (node.type === TileNode.Type.Wall) {
			this.obstacleGeometries = BufferGeometryUtils.mergeGeometries(
										[this.obstacleGeometries,
										geometry]
									);
		} 

		if (node.type === TileNode.Type.Goal) {
			this.goalGeometries = BufferGeometryUtils.mergeGeometries(
										[this.goalGeometries,
										geometry]
									);
		} 

	}


}