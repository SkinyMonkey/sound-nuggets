import { ServiceConfiguration } from 'meteor/service-configuration'

['FACEBOOK_APP_ID', 'FACEBOOK_APP_SECRET'].forEach((env_variable) => {
  if (!Meteor.settings.private[env_variable]) {
    throw new Error(env_variable + ' is missing at the "private" key\nCheck it was set in settings.json and METEOR_SETTINGS was filled or --settings used')
  }
})

ServiceConfiguration.configurations.upsert(
      { service: 'facebook' },
      { $set: { appId: Meteor.settings.private.FACEBOOK_APP_ID,
                secret: Meteor.settings.private.FACEBOOK_APP_SECRET } }
      )
