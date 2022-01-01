import { __awaiter } from "tslib";
// A thin wrapper around OpenType.js
import * as opentype from 'opentype.js';
import Path from './Path.js';
import CompoundPath from './CompoundPath.js';
import Group from './Group.js';
class Font {
    load(src) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Loading font');
            this.font = yield opentype.load(src);
        });
    }
    /**
     * Returns a group containing compound paths of the given text input.
     */
    toPath(text, x = 0, y = 0, size = 72, options = {}) {
        if (!this.font)
            throw Error('No font loaded');
        const source = this.font.getPaths(text, x, y, size, options);
        const target = new Group();
        for (let j = 0; j < source.length; j++) {
            const glyph = source[j];
            if (glyph.commands.length > 0) {
                const commands = this._splitCommands(glyph.commands);
                const cp = new CompoundPath().fill('black');
                commands.forEach((c) => {
                    const p = new Path();
                    for (let i = 0; i < c.length; i++) {
                        const cmd = c[i];
                        if (cmd.type === 'M') {
                            p.moveTo(cmd.x, cmd.y);
                        }
                        else if (cmd.type === 'L') {
                            p.lineTo(cmd.x, cmd.y);
                        }
                        else if (cmd.type === 'C') {
                            p.curveTo(cmd.x, cmd.y, cmd.x1, cmd.y1, cmd.x2, cmd.y2);
                        }
                        else if (cmd.type === 'Z') {
                            p.close();
                        }
                    }
                    cp.addPath(p);
                });
                target.add(cp);
            }
        }
        return target;
    }
    /**
     * Returns the advance width for a string at given options.
     *
     * @param {string} text
     * @param {number} size
     * @param {object} opentype.js compatible options
     */
    advanceWidth(text, size = 72, options = {}) {
        if (!this.font)
            throw Error('No font loaded');
        return this.font.getAdvanceWidth(text, size, options);
    }
    /**
     * Splits the commands by close command, so we can build a compound path.
     * This is due to the fact that folio only handles single closed paths as
     * paths. Meaning a shaping consisting of multiple paths (such as inner and
     * outer shape) has to become a Compound Path.
     *
     * @param {Array} Array of Post Script Commands
     */
    _splitCommands(cmds) {
        const cmdLetters = cmds.map(c => c.type), commands = [];
        let prevIndex = 0;
        for (let i = 0; i < cmdLetters.length; i++) {
            if (cmdLetters[i] === 'Z') {
                commands.push(cmds.slice(prevIndex, i + 1));
                prevIndex = i + 1;
            }
        }
        return commands;
    }
}
export default Font;
