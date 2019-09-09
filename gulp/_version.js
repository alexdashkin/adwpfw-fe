const config = require('../../../../gulp-config');
const fs = require('fs');

module.exports = function () {
	let newVersion;
	const versionPattern = /Version:\s*([\d]{1,2}\.[\d]{1,2}\.[\d]{1,3})/i;
	const docString = fs.readFileSync(config.paths.version, 'utf8');
	const vNumRexEx = new RegExp(versionPattern);
	const oldVersion = (vNumRexEx.exec(docString))[1];
	const versionParts = oldVersion.split('.');
	const vArray = {
		vMajor: versionParts[0],
		vMinor: versionParts[1],
		vPatch: versionParts[2]
	};
	vArray.vPatch = parseInt(vArray.vPatch) + 1;
	newVersion = vArray.vMajor + '.' + vArray.vMinor + '.' + vArray.vPatch;
	return {oldVersion, newVersion};
};