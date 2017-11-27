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
    domains: 'sound-nuggets.xyz',
    //domains: 'sound-nuggets.xyz,www.sound-nuggets.xyz',
    ssl: {
      // Enable let's encrypt to create free certificates
			letsEncryptEmail: 'adrien.candiotti@gmail.com',
			forceSSL: true
		}
  },

  app: {
    name: 'sound-nuggets', // !!! Was called app on first deployment
    path: '../../',

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
      NODE_ENV: 'production'
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
