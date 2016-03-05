let assert = require('power-assert');
let Status = require(`${__dirname}/../../../src/game/model/status.js`);
let Game = require(`${__dirname}/../../../src/game.js`).Game;

describe("Status", () => {
    describe("isDead", () => {
        it("should return true if currentHp equal to or lower than minHp", () => {
            let game = new Game(0, 10);
            let status = new Status(game, 0);
            assert.ok(status.isDead());
        });

        it("should return false if currentHp greater than minHp", () => {
            let game = new Game(0, 10);
            let status = new Status(game, 1);
            assert.ok(!status.isDead());
        });
    });

    describe("object", () => {
        it("should not change property", () => {
            let game = new Game(0, 10);
            let status = new Status(game, 1);
            assert.throws( () => {
                status.currentHp = 10;
            });
        });
    });
});

