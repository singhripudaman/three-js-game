import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { TileNode } from './TileNode.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Import GLTFLoader


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

		let groundMaterial = new THREE.MeshStandardMaterial({ color: 0x343434 });
		let groundGeometry = this.makeGroundGeometry();
		let ground = new THREE.Mesh(groundGeometry, groundMaterial);

		let obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xfffffff });
		let obstacles = new THREE.Mesh(this.obstacleGeometries, obstacleMaterial);

		 // Load GLB file
		//  let loader = new GLTFLoader();
		//  loader.load(
		// 	 'models/lambo.glb',
		// 	 function (gltf) {
		// 		console.log("hit")
		// 		gltf.scene.scale.set(0.03, 0.03, 0.03)
		// 		obstacles.add(gltf.scene);
		// 	 },
		// 	 undefined,
		// 	 function (error) {
		// 		 console.error('Failed to load GLB file:', error);
		// 	 }
		//  );

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

		let height = node.type == TileNode.Type.Wall ? this.gameMap.tileSize : 1;

		let geometry = new THREE.BoxGeometry(this.gameMap.tileSize,
											 height, 
											 this.gameMap.tileSize);
		geometry.translate(x + 0.5 * this.gameMap.tileSize,
						   this.gameMap.tileSize,
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


	highlight(vec, color) {
		let geometry = new THREE.BoxGeometry( this.tileSize, 1, this.tileSize ); 
		let material = new THREE.MeshBasicMaterial( { color: color } ); 
		
		geometry.translate(vec.x, vec.y+0.5, vec.z);
		this.flowfieldGraphics.add(new THREE.Mesh( geometry, material ));
		
	}

	// Debug method
	arrow(pos, vector) {

		vector.normalize();
		let origin = pos.clone();
		origin.y += 1.5;
		let length = this.tileSize;
		let hex = 0x000000;

		let arrowHelper = new THREE.ArrowHelper( vector, origin, length, hex );
		this.flowfieldGraphics.add( arrowHelper );

	}

	
	// Debug method
	showFlowField(gameMap) {
		if ((this.flowfieldGraphics != undefined) 
			&& (this.flowfieldGraphics.children.length > 0)) {
				gameMap.scene.remove(this.flowfieldGraphics);
			
		}
		this.flowfieldGraphics = new THREE.Group();
			
		for (let [n,i] of gameMap.heatmap) {
			let nPos = gameMap.localize(n);
			if ((n == gameMap.goal) || (gameMap.goals.includes(n))) {
				this.highlight(nPos, new THREE.Color(0xffffff));
			} else {
				// this only works because i is kind of in the hue range (0,360)
				this.highlight(nPos, new THREE.Color('hsl('+i*2+', 100%, 50%)'));
				if (gameMap.flowfield.size != 0)
					this.arrow(nPos, gameMap.flowfield.get(n));
			}
			
		}
		gameMap.scene.add(this.flowfieldGraphics);
	}


}