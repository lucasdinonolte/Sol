import MathUtil from './util/MathUtil.js';
class Util {
    static isBrowser() {
        return typeof window !== 'undefined';
    }
}
Util.Math = MathUtil;
export default Util;
