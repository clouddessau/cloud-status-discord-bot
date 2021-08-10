module.exports = {
	apps: [{
		name: 'cloud-status-discord-bot',
		script: 'npm',
		args: 'start',

		autorestart: true,
		watch: false,
		env: {
			NODE_ENV: 'development',
		},
		env_production: {
			NODE_ENV: 'production',
		},
	}],
};
