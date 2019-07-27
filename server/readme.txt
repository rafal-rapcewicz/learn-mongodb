npm init -y
npm i express
npm i -D typescript ts-node nodemon @types/node @types/express

// creates tsconfig.json file
tsc --init
    "target": "es6" // for example, default: "es5"
    "outDir": "./dist" // defaulf: "./", uncomment & change
    "rootDir": "./src" // default: "./" uncomment & change
    "moduleResolution": "node" // uncomment

package.json scripts:
    "scripts": {
        "start": "node dist/app.js",
        "dev": "nodemon src/app.ts",
        "build": "tsc -p ."
    },

