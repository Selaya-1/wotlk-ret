import { Class } from '/wotlk/core/proto/common.js';
import { EquipmentSpec } from '/wotlk/core/proto/common.js';
import { Race } from '/wotlk/core/proto/common.js';
import { Spec } from '/wotlk/core/proto/common.js';
import { IndividualSimUI } from '/wotlk/core/individual_sim_ui.js';
import { Popup } from './popup.js';
export declare function newIndividualImporters<SpecType extends Spec>(simUI: IndividualSimUI<SpecType>): HTMLElement;
export declare abstract class Importer extends Popup {
    private readonly textElem;
    protected readonly descriptionElem: HTMLElement;
    protected readonly importButton: HTMLButtonElement;
    private readonly includeFile;
    constructor(parent: HTMLElement, title: string, includeFile: boolean);
    abstract onImport(data: string): void;
    protected finishIndividualImport<SpecType extends Spec>(simUI: IndividualSimUI<SpecType>, charClass: Class, race: Race, equipmentSpec: EquipmentSpec, talentsStr: string): void;
}