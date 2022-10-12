import fs from 'fs';
import { basename } from 'path';
import yargs from 'yargs';
const { hideBin } = require('yargs/helpers')

let argBuilder = yargs(hideBin(process.argv));

argBuilder
    .command('ask', 'use inquirer to prompt for your name', () => {
        console.log("setup ask")
    }, ()=>{
        console.log('afasszzd')
    });

fs.promises.readdir('./src/cli/commands')
.then(files => {
    files.forEach(file => {

        const cmd_name = basename(file, '.ts');
        const m = require(`./cli/commands/${cmd_name}`);

        if (m.addArguments)
            argBuilder = m.addArguments(argBuilder);
    });
})
.then(()=>{
    argBuilder.parse();
})
.catch(err => {
    console.log(err)
})
