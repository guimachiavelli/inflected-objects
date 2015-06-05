(function(){
    'use strict';

    var helpers = require('./helpers');
    var life, config;

    config = {
        cellSize: 10,
        canvas: [500, 500]
    };

    life = {
        canvas: null,
        ctx: null,
        cells: [],
        rows: 0,
        columns: 0,

        init: function(container) {
            container = container || document.body;
            var el = document.createElement('div');
            el.className = 'life';
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.canvas = this.configuredCanvas(this.canvas);
            el.appendChild(this.canvas);
            container.appendChild(el);

            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

            this.rows = Math.floor(config.canvas[0]/config.cellSize);
            this.columns = Math.floor(config.canvas[1]/config.cellSize);

            this.setup(this.ctx);
        },

        configuredCanvas: function(canvas) {
            canvas.className = 'life-canvas';
            canvas.width = config.canvas[0] * window.devicePixelRatio;
            canvas.height = config.canvas[1] * window.devicePixelRatio;

            return canvas;
        },

        setup: function(ctx) {
            //this.setGrid(ctx);
            this.draw(ctx);
        },

        draw: function(ctx) {
            if (this.cells.length < 1) {
                this.cells = this.seed();
            }
            ctx.clearRect(0,0,config.canvas[0], config.canvas[1]);
            this.cells.forEach(this.drawCell.bind(this, ctx));

            setTimeout(function(){
                this.live(ctx);
            }.bind(this), 500);
        },

        live: function(ctx) {
            this.cells = this.cells.map(function(cell) {
                var livingNeighbours;
                livingNeighbours = cell.neighbours.filter(function(neighbour){
                    return neighbour.alive;
                });

                if (cell.alive === true) {
                    if (this.shouldDie(livingNeighbours)) {
                        cell.alive = false;
                    }
                } else {
                    if (livingNeighbours.length === 3) {
                        cell.alive = true;
                    }
                }
                return cell;
            }.bind(this));

            this.draw(ctx);
        },

        shouldDie: function(neighbours) {
            return neighbours.length < 2 || neighbours.length > 3;
        },

        neighbours: function(rows, columns) {
            var neighbours, distances;

            distances = [[1,0],
                         [0,1],
                         [1,1],
                         [-1,0],
                         [0,-1],
                         [1,-1],
                         [-1,1],
                         [-1,-1]
            ];
            neighbours = [];

            distances.forEach(function(distance) {
                var neighbour = [rows + distance[0], columns + distance[1]];
                neighbours.push(neighbour.join(','));
            });

            return neighbours;
        },

        seed: function() {
            var cells, rows, columns;

            rows = this.rows;
            cells = [];

            while (rows > 0) {
                rows -= 1;
                columns = this.columns;
                while (columns > 0) {
                    columns -= 1;
                    cells.push({
                        id: [rows,columns].join(','),
                        x: rows,
                        y: columns,
                        alive: Math.floor(Math.random() * 10) % 17 === 0,
                        neighbourIds: this.neighbours(rows, columns)
                    });
                }
            }

            cells.forEach(function(cell){
                cell.neighbours = cells.filter(function(filterCell){
                    return cell.neighbourIds.indexOf(filterCell.id) > -1;
                });
            });

            return cells;
        },

        drawCell: function(ctx, cell) {
            var position;

            ctx.fillStyle = cell.alive === true ? 'rgba(0,0,0,0)' : 'white';
            position = [cell.x * config.cellSize, cell.y * config.cellSize]
            ctx.fillRect(position[0], position[1], config.cellSize, config.cellSize);

        }


    };

    module.exports = life;
}());
