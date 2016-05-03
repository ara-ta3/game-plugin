const assert = require('power-assert');
const User = require(`${__dirname}/../../../src/game/model/user.js`);
const Status = require(`${__dirname}/../../../src/game/model/status.js`);
const Game = require(`${__dirname}/../../../src/game.js`).Game;
const Equipment = require(`${__dirname}/../../../src/game/model/Equipment.js`);
const Weapon = require(`${__dirname}/../../../src/game/model/Weapon.js`);
const Parameter = require(`${__dirname}/../../../src/game/model/Parameter.js`);
const HitRate   = require(`${__dirname}/../../../src/game/model/HitRate.js`);
const Spell  = require(`${__dirname}/../../../src/game/model/Spell.js`);
const Effect = require(`${__dirname}/../../../src/game/model/Effect.js`);
const HitPoint  = require(`${__dirname}/../../../src/game/model/HitPoint.js`);
const MagicPoint    = require(`${__dirname}/../../../src/game/model/MagicPoint.js`);
const AttackEffect = Effect.AttackEffect;
const CureEffect   = Effect.CureEffect;

describe("User", () => {
    describe("attack", () => {
        it("should decrease target HP", () => {
            let equipment = new Equipment(new Weapon(5, 0, new HitRate(100)));
            let actor   = new User("id1", "A", new HitPoint(10, 10), new MagicPoint(0, 0), equipment);
            let target  = new User("id2", "B", new HitPoint(10, 10), new MagicPoint(0, 0), equipment);
            actor.attack(target);
            assert.equal(target.hitPoint.current, 5);
        });
    });

    describe("cast", () => {
        let emptyEquipment = new Equipment(new Weapon(0, 0, new HitRate(100)));
        let emptyParameter = new Parameter(0, 0);

        it("should decrease target's HP when spell has attack effect", () => {
            let spell   = new Spell("ファイア", 0, new AttackEffect(5));
            let actor   = new User("id1", "A", new HitPoint(10, 10), new MagicPoint(0, 0), emptyEquipment, emptyParameter);
            let target  = new User("id2", "B", new HitPoint(10, 10), new MagicPoint(0, 0), emptyEquipment, emptyParameter);
            actor.setSpells([spell]);
            actor.cast(spell, [target]);

            assert.equal(target.hitPoint.current, 5);
        });

        it("should decrease actor's MP when spell is casted", () => {
            let spell   = new Spell("ファイア", 5, new AttackEffect(5));
            let actor   = new User("id1", "A", new HitPoint(10, 10), new MagicPoint(10, 10), emptyEquipment, emptyParameter);
            let target  = new User("id2", "B", new HitPoint(10, 10), new MagicPoint(0, 0), emptyEquipment, emptyParameter);

            actor.setSpells([spell]);
            actor.cast(spell, [target]);
            assert.equal(actor.magicPoint.current, 5);
        });


        it("should decrease target's HP more when user has high parameter", () => {
            let param   = new Parameter(10, 0);
            let spell   = new Spell("ファイア", 0, new AttackEffect(10));
            let actor   = new User("id1", "A", new HitPoint(10, 10), new MagicPoint(10, 10), emptyEquipment, param);
            let target  = new User("id2", "B", new HitPoint(30, 30), new MagicPoint(0, 0), emptyEquipment, emptyParameter);

            actor.setSpells([spell]);
            actor.cast(spell, [target]);
            assert.equal(target.hitPoint.current, 10);
        });

        it("should return null when user does not have enough mp", () => {

            let actor   = new User("id1", "A", new HitPoint(10, 10), new MagicPoint(0, 10), emptyEquipment, emptyParameter);
            let target  = new User("id2", "B", new HitPoint(10, 10), new MagicPoint(0, 0), emptyEquipment, emptyParameter);
            let spell   = new Spell("ファイア", 5, new AttackEffect(10));
            actor.setSpells([spell]);
            let result  = actor.cast(spell, [target]);
            assert.equal(result, null);
            assert.equal(target.hitPoint.current, 10);
        });

        it("should return null when user does not learn spell", () => {
            let actor   = new User("id1", "A", new HitPoint(10, 10), new MagicPoint(0, 10), emptyEquipment, emptyParameter);
            assert.equal(actor.cast(new Spell("ファイア", 5, new AttackEffect(10))), null)
        });

        it("should increase target's HP when user cast cure spell", () => {
            let spell   = new Spell("キュア", 0, new CureEffect(5));
            let actor   = new User("id1", "A", new HitPoint(10, 10), new MagicPoint(0, 10), emptyEquipment, emptyParameter);
            let target  = new User("id1", "A", new HitPoint(0, 10), new MagicPoint(0, 10), emptyEquipment, emptyParameter);
            actor.setSpells([spell]);
            actor.cast(spell, [target]);
            assert.equal(target.hitPoint.current, 5);
        });
    });
});
