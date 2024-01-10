const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const DIR_VARIABLE = path.join(process.cwd(), './packages/Flipbook')
const VERSION_TO_UPDATE = 'patch'

const setVersionToJson = (version) => {
  const json = JSON.parse(fs.readFileSync(path.join(DIR_VARIABLE, 'package.json'), 'utf8'))

  json.version = version

  fs.writeFileSync(path.join(DIR_VARIABLE, 'package.json'), JSON.stringify(json, null, 4))
}

const run = async () => {
  if (!process.env.NPM_AUTH_TOKEN) throw new Error('Merge-release requires NPM_AUTH_TOKEN')
  // execSync('node ./postbuild.js')

  const pkg = require(path.join(DIR_VARIABLE, 'package.json'))

  const currentVersion = execSync(`npm view ${pkg.name} version`, {
    cwd: DIR_VARIABLE
  }).toString()
  setVersionToJson(currentVersion)

  let newVersion = execSync(`npm version --no-git-tag-version ${VERSION_TO_UPDATE}`, {
    cwd: DIR_VARIABLE
  }).toString()
  newVersion = newVersion.replace(/(\r\n|\n|\r)/gm, '')

  setVersionToJson(newVersion)

  console.log('new version:', newVersion)

  execSync(`npm set //registry.npmjs.org/:_authToken=${process.env.NPM_AUTH_TOKEN}`)
  execSync(`npm publish --verbose ${DIR_VARIABLE}`)
  execSync(`git checkout package.json`)

  execSync(`git tag ${newVersion}`)

  execSync('git push --tags')
}

try {
  run()
} catch (e) {
  console.error(e, '<------=')
}
