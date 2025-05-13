const core = require('@actions/core');
const { execSync } = require('child_process');
const yaml = require('yaml');
const path = require('path');
const fs = require('fs');

/**
 * Read YAML file and override with specified values
 */
function yamlTypeOverride(filename, values) {
  const fileContent = fs.readFileSync(filename, 'utf8');
  const parsedYaml = yaml.parse(fileContent);
  const parsedValueYaml = yaml.parse(values);
  
  for (const [key, value] of Object.entries(parsedValueYaml)) {
    const keys = key.split('.');
    let current = parsedYaml;
    
    // Create nested object path
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    // Set final value
    current[keys[keys.length - 1]] = value;
  }

  core.debug('transformed YAML: ', parsedYaml);
  fs.writeFileSync(filename, yaml.stringify(parsedYaml));
}

const getYqBinary = () => path.join(__dirname, 'yq_linux_amd64');

/**
 * Execute yq command
 */
async function processYq(yqPath, filename, values) {
  const tmpFile = path.join(
    process.env.RUNNER_TEMP, 
    `yq_cmd_${Date.now()}_${Math.random().toString(36).slice(2)}`
  );
  
  try {
    fs.writeFileSync(tmpFile, values);
    execSync(`${yqPath} --from-file=${tmpFile} -i ${filename}`);
  } finally {
    fs.unlinkSync(tmpFile);
  }
}

/**
 * Override YAML file values using yq
 */
async function yqTypeOverride(filename, values, splitLine = false) {
  const yq = getYqBinary();

  if (splitLine) {
    const lines = values.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) continue;
      await processYq(yq, filename, trimmedLine);
    }
  } else {
    await processYq(yq, filename, values);
  }
}

/**
 * Main function
 */
(async () => {
  try {
    const filename = core.getInput('file');
    const values = core.getInput('values');
    const type = core.getInput('type');

    switch (type) {
      case 'yaml':
        yamlTypeOverride(filename, values);
        break;
      case 'yq':
        await yqTypeOverride(filename, values, true);
        break;
      case 'yq_multiline':
        await yqTypeOverride(filename, values, false);
        break;
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
  