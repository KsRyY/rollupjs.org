module.exports = {
	cache: true,
	beforeinstall: [],
	afterinstall: [
		'npm run build',
		'pm2 start deploy.json',
	]
};
