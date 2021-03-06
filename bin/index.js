#!/usr/bin/env node
'use strict';

// cConsole.cyan('this command will create project based on koa2, if you want to use koa1, please use \'create-koa-app koa#1 <project name>\'');

//  installing packages
let installDep = (() => {
    var _ref = _asyncToGenerator(function* (target) {
        const useYarn = yarnAccess();
        let install;
        try {
            return new Promise(function (resolve, reject) {
                if (useYarn) {
                    cConsole.cyan('your command line supported \'yarn\', use yarn to install dependencies');
                    install = (0, _crossSpawn2.default)('yarn', {
                        cwd: target,
                        stdio: 'inherit'
                    });
                } else {
                    cConsole.cyan('your command line unsupported \'yarn\', use npm to install dependencies');
                    install = (0, _crossSpawn2.default)('npm', ['install', '--exact'], {
                        cwd: target,
                        stdio: 'inherit'
                    });
                }

                install.on('close', function (code) {
                    if (code === 0) {
                        resolve({
                            success: true
                        });
                    } else {
                        resolve({
                            success: false
                        });
                    }
                });
            });
        } catch (e) {
            return {
                success: false,
                error: e
            };
        }
    });

    return function installDep(_x) {
        return _ref.apply(this, arguments);
    };
})();

//  should use yarn


var _child_process = require('child_process');

var cp = _interopRequireWildcard(_child_process);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _inquirer = require('inquirer');

var inquirer = _interopRequireWildcard(_inquirer);

var _fsExtraPromise = require('fs-extra-promise');

var fse = _interopRequireWildcard(_fsExtraPromise);

var _colorConsole = require('color-console');

var cConsole = _interopRequireWildcard(_colorConsole);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _nodeVersion = require('node-version');

var _nodeVersion2 = _interopRequireDefault(_nodeVersion);

var _crossSpawn = require('cross-spawn');

var _crossSpawn2 = _interopRequireDefault(_crossSpawn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

if (_nodeVersion2.default.major < 6) {
    cConsole.red('create-koa-app requires at least version 6 of NodeJs. Please upgrade!');
    process.exit(1);
}

const args = (0, _minimist2.default)(process.argv.slice(2))['_'];

if (!args.length) {
    cConsole.red('you must provide the project name you will create!');
    process.exit(1);
}

const templatesMap = {
    JavaScript: path.resolve(__dirname, '../', 'templates/javascript'),
    TypeScript: path.resolve(__dirname, '../', 'templates/typescript')
},
      cwd = process.cwd(),
      projectCfgMap = {
    JavaScript: fse.readJsonSync(path.resolve(templatesMap.JavaScript, 'package.json')),
    TypeScript: fse.readJsonSync(path.resolve(templatesMap.TypeScript, 'package.json'))
};
let name = args[0],
    target = path.join(cwd, name),
    version = '1.0.0',
    description = 'a koa app',
    main = 'index.js';

const exists = fse.existsSync(target);

//  folder exits
if (exists) {
    cConsole.red(`The directory ${name} contains files that could conflict.`);
    process.exit(1);
}function yarnAccess() {
    try {
        cp.execSync('yarnpkg --version', {
            stdio: 'ignore'
        });
        return true;
    } catch (e) {
        return false;
    }
}

//  global typescript environment
function tscAccess() {
    try {
        cp.execSync('tsc -v', {
            stdio: 'ignore'
        });
        return true;
    } catch (e) {
        return false;
    }
}

//  output some develop infomation
function outputInfo(language, { name }, target) {
    const useYarn = yarnAccess();
    console.log(`project create success! ${name} at ${cwd}\n`);
    console.log('inside that directory, you can run following commands:\n');
    switch (language) {
        case 'JavaScript':
            cConsole.cyan(`${useYarn ? 'yarn' : 'npm'} run dev`);
            console.log('   use nodemon to run your app\n');
            cConsole.cyan(`${useYarn ? 'yarn' : 'npm'} run pm2`);
            console.log('   use pm2 to run your app\n');
            break;
        case 'JavaScript':
            cConsole.cyan(`${useYarn ? 'yarn' : 'npm'} run dev`);
            console.log('   typescript watch file changes & use nodemon to run your app\n');
            break;
        default:
            break;
    }
    console.log('happy coding! ^_^');
}

//  merge keys to object
function mergeInfo(obj1, { name }, { version }, { description }, { main }) {
    obj1.name = name;
    obj1.version = version;
    obj1.description = description;
    obj1.main = main;
    return obj1;
}

function createKoaApp({
    defaultName,
    defaultVersion,
    defaultMain,
    defaultDescription
}) {
    inquirer.prompt([{
        name: 'language',
        message: 'which language would you like to write this project?',
        choices: ['JavaScript', 'TypeScript'],
        type: 'list'
    }, {
        name: 'name',
        message: 'your project name',
        type: 'input',
        default: defaultName
    }, {
        name: 'version',
        message: 'your project version',
        type: 'input',
        default: defaultVersion
    }, {
        name: 'main',
        message: 'your project main scripts',
        type: 'input',
        default: defaultMain
    }, {
        name: 'description',
        message: 'your project description',
        type: 'input',
        default: defaultDescription
    }]).then((() => {
        var _ref2 = _asyncToGenerator(function* ({
            language,
            name,
            version,
            main,
            description
        }) {

            //  tsc check
            if (language !== 'JavaScript' && !tscAccess()) {
                cConsole.red('you select `TypeScript` as your project language, but your system is missing global typescript environment!');
                cConsole.cyan('please run `npm install typescript -g` before you choose `TypeScript` as your project language');
                process.exit(1);
            }

            if (name !== args[0]) {
                fse.moveSync(target, path.join(cwd, name));
                target = path.join(cwd, name);
            }

            cConsole.cyan('copy files...');
            yield fse.copySync(templatesMap[language], target);
            cConsole.cyan('copy file success!');

            projectCfgMap[language] = mergeInfo(projectCfgMap[language], name, version, description, main);
            yield fse.outputJsonSync(path.join(target, 'package.json'), projectCfgMap[language]);

            //  install dependence
            cConsole.cyan('installing packages, this might take a couple minutes...');
            const installRes = yield installDep(target);
            console.log('');
            if (installRes.success) {
                cConsole.cyan('dependencies install success!');
                //  output some developing information
                outputInfo(language, name, target);
            } else {
                yield fse.removeSync(target);
                cConsole.red('dependencies install fail!');
            }
            process.exit(1);
        });

        return function (_x2) {
            return _ref2.apply(this, arguments);
        };
    })());
}

createKoaApp({
    defaultName: name,
    defaultVersion: version,
    defaultDescription: description,
    defaultMain: main
});