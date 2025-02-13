package shaman

import (
	"time"

	"github.com/wowsims/wotlk/sim/core"
	"github.com/wowsims/wotlk/sim/core/items"
	"github.com/wowsims/wotlk/sim/core/stats"
)

var lavaBurstActionID = core.ActionID{SpellID: 60043}

// newLavaBurstSpell returns a precomputed instance of lightning bolt to use for casting.
func (shaman *Shaman) newLavaBurstSpell() *core.Spell {
	baseCost := baseMana * 0.1

	spellConfig := core.SpellConfig{
		ActionID:     lavaBurstActionID,
		SpellSchool:  core.SpellSchoolFire,
		ResourceType: stats.Mana,
		BaseCost:     baseCost,

		Cast: core.CastConfig{
			DefaultCast: core.Cast{
				Cost:     baseCost,
				CastTime: time.Second * 2,
				GCD:      core.GCDDefault,
			},
			CD: core.Cooldown{
				Timer:    shaman.NewTimer(),
				Duration: time.Second * 8,
			},
		},
	}

	spellConfig.Cast.ModifyCast = func(sim *core.Simulation, spell *core.Spell, cast *core.Cast) {
		if shaman.ElementalMasteryAura.IsActive() {
			cast.CastTime = 0
		} else if shaman.NaturesSwiftnessAura.IsActive() {
			cast.CastTime = 0
		}
	}

	lavaflowBonus := []float64{1.0, 1.06, 1.12, 1.24}
	// TODO: does lava flows multiply or add with elemental fury? Only matters if you had <5pts which probably won't happen.
	critMultiplier := shaman.SpellCritMultiplier(1, (0.2*float64(shaman.Talents.ElementalFury))*(lavaflowBonus[shaman.Talents.LavaFlows]))

	effect := core.SpellEffect{
		ProcMask:             core.ProcMaskSpellDamage,
		BonusSpellHitRating:  float64(shaman.Talents.ElementalPrecision) * 2 * core.SpellHitRatingPerHitChance,
		BonusSpellCritRating: 0,
		BonusSpellPower: 0 +
			core.TernaryFloat64(shaman.Equip[items.ItemSlotRanged].ID == TotemOfHex, 165, 0),
		DamageMultiplier: 1 * (1 + 0.01*float64(shaman.Talents.Concussion)),
		ThreatMultiplier: 1 - (0.1/3)*float64(shaman.Talents.ElementalPrecision),
		BaseDamage:       core.BaseDamageConfigMagic(1192, 1518, 0.5714),
		OutcomeApplier: func(sim *core.Simulation, spell *core.Spell, spellEffect *core.SpellEffect, attackTable *core.AttackTable) {
			if spellEffect.MagicHitCheck(sim, spell, attackTable) {
				if shaman.FlameShockDot.IsActive() || spellEffect.MagicCritCheck(sim, spell, attackTable) {
					spellEffect.Outcome = core.OutcomeCrit
					spell.SpellMetrics[spellEffect.Target.TableIndex].Crits++
					spellEffect.Damage *= critMultiplier
				} else {
					spellEffect.Outcome = core.OutcomeHit
					spell.SpellMetrics[spellEffect.Target.TableIndex].Hits++
				}
			} else {
				spellEffect.Outcome = core.OutcomeMiss
				spell.SpellMetrics[spellEffect.Target.TableIndex].Misses++
				spellEffect.Damage = 0
			}
		},
	}
	effect.DamageMultiplier *= 1.0 + .02*float64(shaman.Talents.CallOfFlame)

	spellConfig.ApplyEffects = core.ApplyEffectFuncDirectDamage(effect)
	return shaman.RegisterSpell(spellConfig)
}
