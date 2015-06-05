(function(){
    'use strict';

    var helpers = require('./helpers');
    var life, config;

    config = {
        cellSize: 20,
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
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.canvas = this.configuredCanvas(this.canvas);
            container.appendChild(this.canvas);

            this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

            this.rows = Math.floor(config.canvas[0]/config.cellSize);
            this.columns = Math.floor(config.canvas[1]/config.cellSize);

            this.setup(this.ctx);
        },

        configuredCanvas: function(canvas) {
            canvas.className = 'life';
            canvas.width = config.canvas[0] * window.devicePixelRatio;
            canvas.height = config.canvas[1] * window.devicePixelRatio;

            return canvas;
        },

        setup: function(ctx) {
            this.setGrid(ctx);
            this.draw(ctx);
        },

        draw: function(ctx) {
            if (this.cells.length < 1) {
                this.cells = this.seed();
            }
            //ctx.fillStyle = 'white';
            ctx.fillRect(0,0,config.canvas[0], config.canvas[1]);

            this.cells.forEach(this.drawCell.bind(this, ctx));

            setInterval(function(){
                this.live(ctx);
            }.bind(this), 500);
        },

        live: function(ctx) {
            this.cells = this.cells.map(function(cell) {
                var livingNeighbours;
                livingNeighbours = cell.neighbours.filter(function(neighbour){
                    var neighbourCell;
                    neighbourCell = this.cells.filter(function(nCell) {
                        return nCell.id === neighbour;
                    });
                    if (neighbourCell.length === 0) {
                        return false;
                    }
                    return neighbourCell[0].alive;
                }.bind(this));

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

            this.cells.forEach(this.drawCell.bind(this, ctx));
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
                        neighbours: this.neighbours(rows, columns)
                    });
                }
            }

            return cells;
        },


        setGrid: function(ctx) {
            var rows, columns;
            rows = this.rows;
            columns = this.columns;

            ctx.beginPath();
            while(rows > 0) {
                ctx.moveTo(0, rows * config.cellSize);
                ctx.lineTo(config.canvas[0], rows * config.cellSize);
                ctx.stroke();
                rows -= 1;
            }
            while(columns > 0) {
                ctx.moveTo(columns * config.cellSize, 0);
                ctx.lineTo(columns * config.cellSize, config.canvas[1]);
                ctx.stroke();
                columns -= 1;
            }
            ctx.closePath();
        },

        drawCell: function(ctx, cell) {
            var position;

            ctx.fillStyle = cell.alive === true ? 'black' : 'white';
            position = [cell.x * config.cellSize, cell.y * config.cellSize]
            ctx.fillRect(position[0], position[1], config.cellSize, config.cellSize);

        }


    };

    module.exports = life;
}());
