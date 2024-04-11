

// Function to generate a maze using Depth-First Search algorithm, took me like 5 hours 
function generateMaze(rows, cols) {
    const maze = new Array(rows).fill(null).map(() => new Array(cols).fill(1));
    const stack = [];

    // Selecting a random edge
    const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

    // Start from a random cell on the selected edge
    let startX, startY;

    switch (edge) {
        case 0: // Top edge
            startX = 0;
            startY = Math.floor(Math.random() * cols);
            break;
        case 1: // Right edge
            startX = Math.floor(Math.random() * rows);
            startY = cols - 1;
            break;
        case 2: // Bottom edge
            startX = rows - 1;
            startY = Math.floor(Math.random() * cols);
            break;
        case 3: // Left edge
            startX = Math.floor(Math.random() * rows);
            startY = 0;
            break;
    }

    console.log(startX, startY)


    maze[startX][startY] = 2; // Mark the starting cell as visited
    stack.push([startX, startY]); // Push the starting cell to the stack

    // Perform DFS
    while (stack.length > 0) {
        let [x, y] = stack.pop();
        let neighbors = getUnvisitedNeighbors(x, y, maze);

        if (neighbors.length > 0) {
            stack.push([x, y]);
            let [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
            maze[nx][ny] = 0; // Mark the neighbor as visited
            maze[(x + nx) >> 1][(y + ny) >> 1] = 0; // Carve a passage between the current cell and the neighbor
            stack.push([nx, ny]); // Push the neighbor to the stack
        }
    }
    console.log(maze)
    return maze;
}

// Function to get unvisited neighbors
function getUnvisitedNeighbors(x, y, maze) {
    const neighbors = [];
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // Possible directions: down, up, right, left

    for (let [dx, dy] of directions) {
        let nx = x + dx * 2;
        let ny = y + dy * 2;

        if (nx >= 0 && nx < maze.length && ny >= 0 && ny < maze[0].length && maze[nx][ny] === 1) {
            neighbors.push([nx, ny]);
        }
    }

    return neighbors;
}

export { generateMaze }; // Export the generateMaze function
