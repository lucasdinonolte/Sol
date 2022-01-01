// Ported from https://github.com/lnolte/easygrid
// which is a fork of https://github.com/runemadsen/easygrid
import Folio from './Folio.js';
class Grid {
    constructor(options) {
        this.state = {
            x: 0,
            y: 0,
            columns: 10,
            columnRatio: Grid.EVEN,
            rows: 1,
            rowRatio: Grid.EVEN,
            gutter: 0,
            gutterWidth: 0,
            gutterHeight: 0,
            moduleWidth: 50,
            moduleHeight: 500,
            height: 0,
            width: 0,
        };
        this.setOptions(options);
    }
    setOptions(options) {
        const req = Object.assign(this.state, options);
        if (req.columnRatio === Grid.EVEN && req.width === 0) {
            throw new Error('You need to provide a width when using a non even column ratio');
        }
        if (req.rowRatio === Grid.EVEN && req.height === 0) {
            throw new Error('You need to provide a height when using a non even row ratio');
        }
        if (req.columnRatio !== Grid.EVEN && req.columnRatio.length !== req.columns) {
            throw new Error('Your column ratio length needs to match the number of columns for non even ratios');
        }
        if (req.rowRatio !== Grid.EVEN && req.rowRatio.length !== req.rows) {
            throw new Error('Your row ratio length needs to match the number of row for non even ratios');
        }
        // if gutter is set, override gutterWidth and gutterHeight
        if (req.gutter !== 0) {
            req.gutterWidth = req.gutter;
            req.gutterHeight = req.gutter;
        }
        // if width is set, override moduleWidth
        if (req.width !== 0) {
            req.moduleWidth = (req.width - ((req.columns - 1) * req.gutterWidth)) / req.columns;
        }
        else {
            req.width = (req.moduleWidth * req.columns) + (req.gutterWidth * (req.columns - 1));
        }
        // if height is set, override moduleHeigt
        if (req.height !== 0) {
            req.moduleHeight = (req.height - ((req.rows - 1) * req.gutterHeight)) / req.rows;
        }
        else {
            req.height = (req.moduleHeight * req.rows) + (req.gutterHeight * (req.rows - 1));
        }
        this.state = req;
        this.calculateGrid();
    }
    calculateColumnRatio() {
        if (this.state.columnRatio instanceof Array)
            return this.state.columnRatio;
        return new Array(this.state.columns).fill(1);
    }
    calculateRowRatio() {
        if (this.state.rowRatio instanceof Array)
            return this.state.rowRatio;
        return new Array(this.state.rows).fill(1);
    }
    calculateGrid() {
        this.modules = [];
        // normalize the ratios
        const totalColumnRatio = this.calculateColumnRatio().reduce((acc, cur) => acc + cur);
        const totalRowRatio = this.calculateRowRatio().reduce((acc, cur) => acc + cur);
        this.normalizedColumnRatio = this.calculateColumnRatio().map((item) => item / totalColumnRatio);
        this.normalizedRowRatio = this.calculateRowRatio().map((item) => item / totalRowRatio);
        let totalHeight = 0;
        for (let y = 0; y < this.state.rows; y++) {
            const height = (this.state.height - ((this.state.rows - 1) * this.state.gutterHeight)) * this.normalizedRowRatio[y];
            let totalWidth = 0;
            for (let x = 0; x < this.state.columns; x++) {
                const width = (this.state.width - ((this.state.columns - 1) * this.state.gutterWidth)) * this.normalizedColumnRatio[x];
                this.modules.push({
                    x: this.state.x + totalWidth + (x * this.state.gutterWidth),
                    y: this.state.y + totalHeight + (y * this.state.gutterHeight),
                    width: width,
                    height: height
                });
                totalWidth += width;
            }
            totalHeight += height;
        }
    }
    getModule(column, row) {
        const index = (column - 1) + ((row - 1) * this.state.columns);
        if (this.modules[index]) {
            return this.modules[index];
        }
        else {
            throw new Error('The column or row does not exist');
        }
    }
    colSpan(from, to) {
        const startCol = this.getModule(from, 1), endCol = this.getModule(to, 1), x = startCol.x, y = startCol.y, w = endCol.x + endCol.width - startCol.x, h = this.state.height;
        return {
            x: x,
            y: y,
            width: w,
            height: h,
        };
    }
    rowSpan(from, to) {
        const startRow = this.getModule(1, from), endRow = this.getModule(1, to), x = startRow.x, y = startRow.y, w = this.state.width, h = endRow.y + endRow.height - startRow.y;
        return {
            x: x,
            y: y,
            width: w,
            height: h,
        };
    }
    moduleSpan(fromCol, fromRow, toCol, toRow) {
        const col = this.colSpan(fromCol, toCol);
        const row = this.rowSpan(fromRow, toRow);
        return {
            x: col.x,
            y: row.y,
            width: col.width,
            height: row.height
        };
    }
    show(doc) {
        const color = 'cyan';
        for (let i = 0; i < this.modules.length; i++) {
            const module = this.modules[i];
            doc.add(Folio.Path.Rectangle(module.x, module.y, module.width, module.height).stroke(color));
        }
    }
}
Grid.EVEN = 'even';
export default Grid;
