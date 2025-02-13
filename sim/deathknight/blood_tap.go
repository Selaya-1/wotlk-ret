package deathknight

import (
	"time"

	"github.com/wowsims/wotlk/sim/core"
)

func (deathKnight *DeathKnight) registerBloodTapSpell() {
	actionID := core.ActionID{SpellID: 45529}
	cdTimer := deathKnight.NewTimer()
	cd := time.Minute * 1

	deathKnight.BloodTapAura = deathKnight.RegisterAura(core.Aura{
		Label:    "Blood Tap",
		ActionID: actionID,
		Duration: time.Second * 20,
		OnGain: func(aura *core.Aura, sim *core.Simulation) {
			deathKnight.CorrectBloodTapConversion(sim,
				deathKnight.BloodRuneGainMetrics(),
				deathKnight.DeathRuneGainMetrics(),
				deathKnight.BloodTap)

			amountOfRunicPower := 10.0
			deathKnight.AddRunicPower(sim, amountOfRunicPower, deathKnight.BloodTap.RunicPowerMetrics())
		},
	})

	deathKnight.BloodTap = deathKnight.RegisterSpell(core.SpellConfig{
		ActionID: actionID,
		Flags:    core.SpellFlagNoOnCastComplete,

		Cast: core.CastConfig{
			CD: core.Cooldown{
				Timer:    cdTimer,
				Duration: cd,
			},
			IgnoreHaste: true,
		},
		ApplyEffects: func(sim *core.Simulation, target *core.Unit, spell *core.Spell) {
			deathKnight.BloodTapAura.Activate(sim)
			deathKnight.BloodTapAura.Prioritize()
		},
	})
}

func (deathKnight *DeathKnight) CanBloodTap(sim *core.Simulation) bool {
	return deathKnight.BloodTap.IsReady(sim) && deathKnight.BloodTap.CD.IsReady(sim)
}
