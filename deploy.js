module.exports = {
	cache: true,
	beforeinstall: [],
	afterinstall: [
		'npm run build',
		'pm2 delete rollup',
		'pm2 start deploy.json',
	]
};
