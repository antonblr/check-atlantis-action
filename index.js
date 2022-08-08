const core = require('@actions/core');
const fs   = require('fs');
const path = require('path');
const yaml = require('js-yaml');


async function run() {
    try {
        // Get inputs
        const taskDefinitionFile = core.getInput('task-definition', {required: true});
        const containerName = core.getInput('container-name', {required: true});
        const imageURI = core.getInput('image', {required: true});

        const environmentVariables = core.getInput('environment-variables', {required: false});

        // Get document, or throw exception on error
        const doc = yaml.load(fs.readFileSync('/home/ixti/example.yml', 'utf8'));
        console.log(doc);
    }
}


run();
