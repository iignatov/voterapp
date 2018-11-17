var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');

class YamlStore {

    constructor(filename) {
        this.file = filename;
        this.data = {};
        return new Proxy(this, this);
    }

    get(target, name) {
        return this[name] || this.data[name];
    }

    set(target, name, value) {
        if (!this[name]) {
            this.data[name] = value;
        } else {
            this[name] = value;
        }
        return true;
    }

    transaction(callback) {
        let result;

        if (callback) {
            var filePath = this.getFilePath();
            var doesFileExist = fs.existsSync(filePath);
            try {
                this.data = doesFileExist ? yaml.safeLoad(fs.readFileSync(filePath, 'utf8')) : {};
                result = callback();
                fs.writeFileSync(filePath, yaml.safeDump(this.data));
            } catch (ex) {
                console.error(ex);
            }
        }

        return result;
    }

    getFilePath() {
        return path.join(__dirname, this.file);
    }

}

module.exports = YamlStore;
