# Node-JS
Node Js initial configurations with typescript and Jest


npm init --y
npm install typescript @types/node --save-dev
Create tsconfig.json file with:
    {
        "compilerOptions": {
            "module": "commonjs",
            "esModuleInterop": true,
            "target": "ES2019",
            "moduleResolution": "node",
            "sourceMap": true,
            "outDir": "dist",
            "allowJs": true
        },
    }

Install eslint from https://www.npmjs.com/package/eslint-config-standard-with-typescript

npm install --save-dev eslint@7 eslint-plugin-promise@4 eslint-plugin-import@2 eslint-plugin-node@11 @typescript-eslint/eslint-plugin@4 eslint-config-standard-with-typescript

after install, it is recommended to install in VSCode ESLint extension and create the .eslintrc.json filewith:
    {
        "extends": "standard-with-typescript",
        "parserOptions": {
            "project": "./tsconfig.json"
        },
        "rules": {
            "@typescript-eslint/no-redeclare": "off"
        }
    }

Same as create an ingore file for eslint to avoid checking heavy directories like node_modules,   .eslintignore with same content as the gitignore, mainly checking for node_modules and dist directories.


Optionally, install husky and lint-staged to avoid commit files witch are not following typescript standards.

https://www.npmjs.com/package/husky
https://www.npmjs.com/package/lint-staged

For this to work create the followings files:
.husky.json with:
    {
    "hooks": {
        "pre-commit":"lint-staged"
    }
    }
.lintstagedrc.json with:
    {
        "*.ts": [
            "eslint 'src/**' --fix",
            "npm run test:staged"
        ]
    }


Install Jest as testing framework and its types
npm install --save-dev jest @types/jest ts-jest

Run the following command: node_modules/.bin/jest --init
The following questions will help Jest to create a suitable configuration for your project

✔ Would you like to use Jest when running "test" script in "package.json"? … yes
✔ Would you like to use Typescript for the configuration file? … yes
✔ Choose the test environment that will be used for testing › node
✔ Do you want Jest to add coverage reports? … yes
✔ Which provider should be used to instrument code for coverage? › v8
✔ Automatically clear mock calls and instances between every test? … no

That will create a jest.config.ts file that must be like:

    module.exports =  {

    roots: ['<rootDir>/src'],
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    coverageDirectory: "coverage",
    //coverageProvider: "v8",
    testEnvironment: "node",
    transform: {
        '.+\\.ts$': 'ts-jest'
    },

    };


Install npm install -save-dev ts-node


Run tests with:  npm test