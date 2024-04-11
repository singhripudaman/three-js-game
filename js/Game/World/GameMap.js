import { TileNode } from './TileNode';
import * as THREE from 'three';
import { MapRenderer } from './MapRenderer';
import { Graph } from './Graph';
import { VectorUtil } from '../../Util/VectorUtil';
import { generateMaze } from './MazeGenerator';


export class GameMap {
	
	// Constructor for our GameMap class
	constructor() {

		this.width = 100;
		this.depth = 100;
	

		this.start = new THREE.Vector3(-this.width/2,0,-this.depth/2);

		// We also need to define a tile size 
		// for our tile based map
		this.tileSize = 5;

		// Get our columns and rows based on
		// width, depth and tile size
		this.cols = this.width/this.tileSize;
		this.rows = this.depth/this.tileSize;

		// Create our graph
		// Which is an array of nodes
		this.graph = new Graph(this.tileSize, this.cols, this.rows);

		// Create our map renderer
		this.mapRenderer = new MapRenderer();

        this.mazeData = [];


	}

	// initialize the GameMap
	init(scene) {
		this.scene = scene; 

		const mazeData = this.generateMaze();

		this.graph.initGraph(mazeData);

		// Set the game object to our rendering
		this.gameObject = this.mapRenderer.createRendering(this);

		

        // Render maze
        // this.renderMaze(scene);
	
	}

	generateMaze() {
		const mazeRows = this.rows; // Adjust as needed
        const mazeCols = this.cols;
		const mazeData = generateMaze(mazeRows, mazeCols);
		return mazeData
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




















