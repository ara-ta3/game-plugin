const StatusEffect    = require(`${__dirname}/Effect.js`).StatusEffect;

class Spell {
    constructor(name, requiredMp, effects) {
        this.name = name;
        this.requiredMagicPoint = requiredMp;
        this.effects = Array.isArray(effects) ? effects : [effects];
        this.effects.sort((e1, e2) => e2 instanceof StatusEffect)
    }

    cast(mp) {
        return mp.change(mp.current - this.requiredMagicPoint);
    }

    effectTo(user) {
        return (parameter) => this.effects.map((e) => {
            const effectWith = e.to(user);
            return effectWith(parameter)
        }).reduce((pre, cur) => {
            if(typeof cur === 'symbol') {
                return cur;
            } else if (typeof pre === 'symbol') {
                return pre;
            }
            // TODO add cast result class 
            return {
                "attack": sumUpIfExists(pre.attack, cur.attack.value),
                "cure": sumUpIfExists(pre.cure, cur.cure.value),
                "mindAttack": sumUpIfExists(pre.mindAttack, cur.mindAttack.value),
                "mindCure": sumUpIfExists(pre.mindCure, cur.mindCure.value),
                "status": pre.status.concat([{
                    kind: cur.status.target,
                    effective: cur.status.effective
                }]).filter((s) => s.kind !== undefined),
                "effects": pre.effects.concat([cur.effect]),
                "feedbacks": pre.feedbacks.concat(cur.effect.feedbacks.map(f => f.apply(cur)))
            };
        }, {
            "attack": null,
            "cure": null,
            "mindAttack": null,
            "mindCure": null,
            "status": [],
            "effects": [],
            "feedbacks": []
        })
    }
}

function sumUpIfExists(v1, v2) {
    return (v1 || v2) ? (v1 || 0) + (v2 || 0) : null
}

module.exports = Spell;
