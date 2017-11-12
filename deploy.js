module.exports = {
	cache: false,
	beforeinstall: [],
	afterinstall: [
		'npm run build',
		'pm2 start deploy.json',
		'pm2 restart rollup',
	]
};
