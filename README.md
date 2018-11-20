# Patch Plex Media Player Keys
Plex Media Player infuriatingly uses the Left & Right arrow keys to skip forwards and backwards through tracks, instead of seeking. There is no configuration setting for this, so this script manually patches the javascript file for the web player to fix this annoying behavior.

## Applying the patch:
- [Install Node](https://nodejs.org/en/download/)
- Download or clone this repository
- `cd` into the directory where the script is located
- Run `npm install`
- See section: [Specifying Plex Installation Directory](#Specifying-the-Plex-Installation-Directory)
- Run the script with `node script.js` (Don't forget to specify the Plex Media Player installation directory via config or cmd line arg!)

### Before the patch:
`Left`: Skip backwards

`Right`: Skip forwards

`Shift+Left`: Seek backwards

`Shift+Right`: Seek forwards

### After the patch:
`Left`: Seek backwards

`Right`: Seek forwards

`Shift+Left`: Skip backwards

`Shift+Right`: Skip forwards

## Specifying the Plex Installation Directory
There are two ways to specify the Plex Media Player installation directory:

NOTE: On OS X you will need to supply the full directory including package contents e.g. `/Applications/Plex Media Player.app/Contents/Resources`

- create a config file called `config.json` in the `config` directory (recommended)
  - if you used the default install directory on OS X or Windows, this is as simple as renaming the example config for your OS to `config.json`.
- specify the install directory with the `--plex-dir` flag (e.g. `node script.js --plex-dir "/Applications/Plex Media Player.app"`)
