import { TileNode } from './TileNode';
import * as THREE from 'three';
import { MapRenderer } from './MapRenderer';
import { Graph } from './Graph';
import { VectorUtil } from '../../Util/VectorUtil';
import { generateMaze } from './MazeGenerator';


export class GameMap {
	
	// Constructor for our GameMap class
	constructor() {

		this.width = 200;
		this.depth = 140;
	

		this.start = new THREE.Vector3(-this.width/2,0,-this.depth/2);

		// We also need to define a tile size 
		// for our tile based map
		this.tileSize = 2;

		// Get our columns and rows based on
		// width, depth and tile size
		this.cols = this.width/this.tileSize;
		this.rows = this.depth/this.tileSize;

		// Create our graph
		// Which is an array of nodes
		this.graph = new Graph(this.tileSize, this.cols, this.rows);

		// Create our map renderer
		this.mapRenderer = new MapRenderer();

		this.mazeRows = 0;
        this.mazeCols = 0;
        this.mazeData = [];


	}

	// initialize the GameMap
	init(scene) {
		this.scene = scene; 

		this.graph.initGraph([]);

		// Set the game object to our rendering
		this.gameObject = this.mapRenderer.createRendering(this);

		this.generateMaze();

        // Render maze
        this.renderMaze(scene);
	
	}

	generateMaze() {
		this.mazeRows = 30; // Adjust as needed
        this.mazeCols = 30;
        this.mazeData = generateMaze(this.mazeRows, this.mazeCols);
	}

	renderMaze(scene) {
        const mazeBlockSize = 10; // Adjust as needed

        // Loop through maze data and render walls
        for (let i = 0; i < this.mazeRows; i++) {
            for (let j = 0; j < this.mazeCols; j++) {
				// * WALL
                if (this.mazeData[i][j] === 1) { 
                    const x = j * mazeBlockSize - this.width / 2; 
                    const z = i * mazeBlockSize - this.depth / 2; 

                    // Create wall geometry
                    const wallGeometry = new THREE.BoxGeometry(mazeBlockSize, mazeBlockSize, mazeBlockSize);
                    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
                    const wall = new THREE.Mesh(wallGeometry, wallMaterial);

                    // Position the wall
                    wall.position.set(x, mazeBlockSize / 2, z);

                    // Add wall to the scene
                    scene.add(wall);
                } else {
					const x = j * mazeBlockSize - this.width / 2; 
                    const z = i * mazeBlockSize - this.depth / 2; 

                    // Create wall geometry
                    const wallGeometry = new THREE.BoxGeometry(mazeBlockSize, 1, mazeBlockSize);
                    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
                    const wall = new THREE.Mesh(wallGeometry, wallMaterial);

                    // Position the wall
                    wall.position.set(x, 0, z);

                    // Add wall to the scene
                    scene.add(wall);
				}
            }
        }
    }



	// Method to get location from a node
	localize(node) {
		let x = this.start.x+(node.x*this.tileSize)+this.tileSize*0.5;
		let y = this.tileSize;
		let z = this.start.z+(node.z*this.tileSize)+this.tileSize*0.5;

		return new THREE.Vector3(x,y,z);
	}

	// Method to get node from a location
	quantize(location) {
		let x = Math.floor((location.x - this.start.x)/this.tileSize);
		let z = Math.floor((location.z - this.start.z)/this.tileSize);
		
		return this.graph.getNode(x,z);
	}


	backtrack(start, end, parents) {
		let node = end;
		let path = [];
		path.push(node);
		while (node != start) {
			path.push(parents[node.id]);
			node = parents[node.id];
		}
		return path.reverse();
	}


	
}




















