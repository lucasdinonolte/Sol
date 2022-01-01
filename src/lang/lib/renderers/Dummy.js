class DummyRenderer {
    constructor(output = '') {
    }
    render(doc) {
        doc.stage.renderChildren(this);
    }
    group(group) {
        console.log(`Renderering Group: ${group}`);
        group.renderChildren(this);
    }
    path(path) {
        console.info(`Renderering Path:`, path.toInstruction());
    }
    compoundPath(path) {
        console.log(`Renderering Compound Path: ${path}`);
    }
}
export default DummyRenderer;
