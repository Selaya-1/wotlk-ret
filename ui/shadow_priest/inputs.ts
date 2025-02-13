import { IndividualSimUI } from '/wotlk/core/individual_sim_ui.js';
import { Player } from '/wotlk/core/player.js';
import { Spec } from '/wotlk/core/proto/common.js';
import { ShadowPriest_Rotation_RotationType as RotationType } from '/wotlk/core/proto/priest.js';
import { EventID } from '/wotlk/core/typed_event.js';

// Configuration for spec-specific UI elements on the settings tab.
// These don't need to be in a separate file but it keeps things cleaner.

export const ShadowPriestRotationConfig = {
	inputs: [
		{
			type: 'enum' as const, cssClass: 'rotation-enum-picker',
			getModObject: (simUI: IndividualSimUI<any>) => simUI.player,
			config: {
				label: 'Rotation Type',
				labelTooltip: 'Choose how to clip your mindflay. Basic will never clip. Clipping will clip for other spells and use a 2xMF2 when there is time for 4 ticks. Ideal will evaluate the DPS gain of every action to determine MF actions.',
				values: [
					{
						name: 'Basic', value: RotationType.Basic,
					},
					{
						name: 'Clipping', value: RotationType.Clipping,
					},
					{
						name: 'Ideal', value: RotationType.Ideal,
					},
				],
				changedEvent: (player: Player<Spec.SpecShadowPriest>) => player.rotationChangeEmitter,
				getValue: (player: Player<Spec.SpecShadowPriest>) => player.getRotation().rotationType,
				setValue: (eventID: EventID, player: Player<Spec.SpecShadowPriest>, newValue: number) => {
					const newRotation = player.getRotation();
					newRotation.rotationType = newValue;
					player.setRotation(eventID, newRotation);
				},
			},
		},
		{
			type: 'boolean' as const,
			cssClass: 'shadowfiend-picker',
			getModObject: (simUI: IndividualSimUI<any>) => simUI.player,
			config: {
				label: 'Use Shadowfiend',
				labelTooltip: 'Use Shadowfiend when low mana and off CD.',
				changedEvent: (player: Player<Spec.SpecShadowPriest>) => player.rotationChangeEmitter,
				getValue: (player: Player<Spec.SpecShadowPriest>) => player.getSpecOptions().useShadowfiend,
				setValue: (eventID: EventID, player: Player<Spec.SpecShadowPriest>, newValue: boolean) => {
					const newOptions = player.getSpecOptions();
					newOptions.useShadowfiend = newValue;
					player.setSpecOptions(eventID, newOptions);
				},
			},
		},
		{
			type: 'boolean' as const,
			cssClass: 'precastvt-picker',
			getModObject: (simUI: IndividualSimUI<any>) => simUI.player,
			config: {
				label: 'Precast Vampiric Touch',
				labelTooltip: 'Start fight with VT landing at time 0',
				changedEvent: (player: Player<Spec.SpecShadowPriest>) => player.rotationChangeEmitter,
				getValue: (player: Player<Spec.SpecShadowPriest>) => player.getRotation().precastVt,
				setValue: (eventID: EventID, player: Player<Spec.SpecShadowPriest>, newValue: boolean) => {
					const newRotation = player.getRotation();
					newRotation.precastVt = newValue;
					player.setRotation(eventID, newRotation);
				},
			},
		},
		{
			type: 'number' as const,
			cssClass: 'latency-picker',
			getModObject: (simUI: IndividualSimUI<any>) => simUI.player,
			config: {
				label: 'Channeling Latency (ms)',
				labelTooltip: 'Latency after a channel that lasts longer than GCD. 0 to disable. Has a minimum value of 100ms if set.',
				changedEvent: (player: Player<Spec.SpecShadowPriest>) => player.rotationChangeEmitter,
				getValue: (player: Player<Spec.SpecShadowPriest>) => player.getRotation().latency,
				setValue: (eventID: EventID, player: Player<Spec.SpecShadowPriest>, newValue: number) => {
					const newRotation = player.getRotation();
					newRotation.latency = newValue;
					player.setRotation(eventID, newRotation);
				},
			},
		},
	],
};
