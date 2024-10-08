"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const lodash_1 = require("lodash");
const utils_1 = require("../../../common/utils");
const data_1 = require("../../../client/data");
const model_1 = require("../../services/model");
const constants_1 = require("../../../common/constants");
const icons_1 = require("../../../client/icons");
let CharacterList = class CharacterList {
    constructor(model, zone) {
        this.model = model;
        this.zone = zone;
        this.hashIcon = icons_1.faHashtag;
        this.inGame = false;
        this.canNew = false;
        this.close = new core_1.EventEmitter();
        this.newCharacter = new core_1.EventEmitter();
        this.selectCharacter = new core_1.EventEmitter();
        this.previewCharacter = new core_1.EventEmitter();
        this.selectedIndex = -1;
        this.ponies = [];
        this.tags = [];
        this.previewPony = undefined;
    }
    get selectedPony() {
        return this.model.pony;
    }
    get searchable() {
        return this.model.ponies.length > constants_1.LATEST_CHARACTER_LIMIT;
    }
    get placeholder() {
        return `search (${this.model.ponies.length} / ${this.model.characterLimit} ponies)`;
    }
    ngOnInit() {
        this.updatePonies();
        this.tags = lodash_1.uniq(utils_1.flatten(this.ponies.map(p => (p.desc || '').split(/ /g).map(x => x.trim())))
            .filter(x => /^#/.test(x)))
            .sort();
        if (!data_1.isMobile) {
            setTimeout(() => this.searchInput.nativeElement.focus());
        }
    }
    setPreview(pony) {
        this.previewPony = pony;
        this.previewCharacter.emit(this.model.parsePonyObject(pony));
    }
    unsetPreview(pony) {
        if (this.previewPony === pony) {
            this.previewPony = undefined;
            this.previewCharacter.emit(undefined);
        }
    }
    updatePonies() {
        this.zone.run(() => {
            const query = this.search && this.search.toLowerCase().trim();
            function matchesWords(text, words) {
                for (const word of words) {
                    if (text.indexOf(word) === -1) {
                        return false;
                    }
                }
                return true;
            }
            if (query) {
                const words = query.split(/ /g).map(x => x.trim());
                this.ponies = this.model.ponies.filter(pony => {
                    const text = `${pony.name} ${pony.desc || ''}`.toLowerCase();
                    return matchesWords(text, words);
                }).sort((a, b) => this.comparePonies(a, b));
            }
            else {
                this.ponies = this.model.ponies.slice().sort((a, b) => this.comparePonies(a, b));
            }
            this.setSelectedIndex(this.selectedIndex);
            this.previewCharacter.emit(undefined);
        });
    }
    comparePonies(a, b) {
        return a.name.localeCompare(b.name);
    }
    select(pony) {
        this.selectCharacter.emit(pony);
    }
    createNew() {
        this.newCharacter.emit();
    }
    setSelectedIndex(index) {
        this.zone.run(() => {
            this.selectedIndex = utils_1.clamp(index, -1, this.ponies.length - 1);
            const pony = this.ponies[index];
            this.ariaAnnounce.nativeElement.textContent = pony ? pony.name : '';
            if (pony) {
                this.setPreview(pony);
            }
            else if (this.previewPony) {
                this.unsetPreview(this.previewPony);
            }
        });
    }
};
tslib_1.__decorate([
    core_1.Input(),
    tslib_1.__metadata("design:type", Object)
], CharacterList.prototype, "inGame", void 0);
tslib_1.__decorate([
    core_1.Input(),
    tslib_1.__metadata("design:type", Object)
], CharacterList.prototype, "canNew", void 0);
tslib_1.__decorate([
    core_1.Output(),
    tslib_1.__metadata("design:type", Object)
], CharacterList.prototype, "close", void 0);
tslib_1.__decorate([
    core_1.Output(),
    tslib_1.__metadata("design:type", Object)
], CharacterList.prototype, "newCharacter", void 0);
tslib_1.__decorate([
    core_1.Output(),
    tslib_1.__metadata("design:type", Object)
], CharacterList.prototype, "selectCharacter", void 0);
tslib_1.__decorate([
    core_1.Output(),
    tslib_1.__metadata("design:type", Object)
], CharacterList.prototype, "previewCharacter", void 0);
tslib_1.__decorate([
    core_1.ViewChild('ariaAnnounce', { static: true }),
    tslib_1.__metadata("design:type", core_1.ElementRef)
], CharacterList.prototype, "ariaAnnounce", void 0);
tslib_1.__decorate([
    core_1.ViewChild('searchInput', { static: true }),
    tslib_1.__metadata("design:type", core_1.ElementRef)
], CharacterList.prototype, "searchInput", void 0);
CharacterList = tslib_1.__decorate([
    core_1.Component({
        selector: 'character-list',
        templateUrl: 'character-list.pug',
        styleUrls: ['character-list.scss'],
    }),
    tslib_1.__metadata("design:paramtypes", [model_1.Model, core_1.NgZone])
], CharacterList);
exports.CharacterList = CharacterList;
//# sourceMappingURL=character-list.js.map