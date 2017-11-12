if (!process.env.METEOR_SETTINGS) {
  throw new Error('METEOR_SETTINGS env variable wasn\'t set.\nPlease check that it is set with the content of settings.json as it\'s value.')
}

const settings = JSON.parse(process.env.METEOR_SETTINGS)

['FACEBOOK_APP_ID', 'FACEBOOK_APP_SECRET'].forEach((env_variable) => {
  if (!settings[env_variable]) {
    throw new Error(env_variable + ' is missing, check it was set in settings.json and METEOR_SETTINGS was filled')
  }
})

module.exports = {
  servers: {
    one: {
      host: 'sound-nuggets.xyz',
      username: 'root',
      pem: '~/.ssh/id_rsa'
    }
  },

  proxy: {
    // comma-separated list of domains your website
    // will be accessed at.
    // You will need to configure your DNS for each one.
    domains: 'sound-nuggets.xyz,www.sound-nuggets.xyz',
    ssl: {
      // Enable let's encrypt to create free certificates
			letsEncryptEmail: 'adrien.candiotti@gmail.com',
			forceSSL: true
		}
  },

  app: {
    name: 'sound-nuggets', // !!! Was called app on first deployment
    path: '../',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'https://sound-nuggets.xyz',
      MONGO_URL: 'mongodb://localhost/meteor',
      NODE_ENV: 'production',
      FACEBOOK_APP_ID: settings.FACEBOOK_APP_ID,
      FACEBOOK_APP_SECRET: settings.FACEBOOK_APP_SECRET
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'abernix/meteord:node-8.4.0-base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  }
};
