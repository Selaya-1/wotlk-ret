import { Spec } from '/wotlk/core/proto/common.js';
import { Player } from '/wotlk/core/player.js';
import { TalentsConfig, TalentsPicker } from './talents_picker.js';
export declare class MageTalentsPicker extends TalentsPicker<Spec.SpecMage> {
    constructor(parent: HTMLElement, player: Player<Spec.SpecMage>);
}
export declare const mageTalentsConfig: TalentsConfig<Spec.SpecMage>;