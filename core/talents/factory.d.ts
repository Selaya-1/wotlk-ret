import { Player } from '/wotlk/core/player.js';
import { Class } from '/wotlk/core/proto/common.js';
import { Spec } from '/wotlk/core/proto/common.js';
import { SpecTalents } from '/wotlk/core/proto_utils/utils.js';
import { TalentsPicker } from './talents_picker.js';
export declare function newTalentsPicker<SpecType extends Spec>(parent: HTMLElement, player: Player<SpecType>): TalentsPicker<SpecType>;
export declare function talentSpellIdsToTalentString(playerClass: Class, talentIds: Array<number>): string;
export declare function talentStringToProto<SpecType extends Spec>(spec: Spec, talentString: string): SpecTalents<SpecType>;