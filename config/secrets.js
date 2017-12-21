/**
 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 *
 * You should never commit this file to a public repository on GitHub!
 * All public code on GitHub can be searched, that means anyone can see your
 * uploaded secrets.js file.
 *
 *
 * Use config vars (environment variables) below for production API keys
 * and passwords. Each PaaS (e.g. Heroku, Nodejitsu, OpenShift, Azure) has a way
 * for you to set it up from the dashboard.
 *
 * Another added benefit of this approach is that you can use two different
 * sets of keys for local development and production mode without making any
 * changes to the code.

 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 */
'use strict';

module.exports = {

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  //will be generated. Take a look at the bottom of this file
  postgres: {},
  sessionTable: 'session',
  googleAnalyticsCode: process.env.GOOGLE_ANALYTICS_CODE || null,

  /*  */
  mailgun: {
    user: process.env.MAILGUN_USER || 'postmaster@sandbox697fcddc09814c6b83718b9fd5d4e5dc.mailgun.org',
    password: process.env.MAILGUN_PASSWORD || '29eldds1uri6'
  },

  mandrill: {
    user: process.env.MANDRILL_USER || '',
    password: process.env.MANDRILL_PASSWORD || ''
  },

  sendgrid: {
    api_key: process.env.SENDGRID_APIKEY || ''
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || '754220301289665',
    clientSecret: process.env.FACEBOOK_SECRET || '41860e58c256a3d7ad8267d3c1939a4a',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true,
    enableProof: true,
    authOptions: { scope: ['email', 'user_location'] }
  },

  github: {
    clientID: process.env.GITHUB_ID || 'cb448b1d4f0c743a1e36',
    clientSecret: process.env.GITHUB_SECRET || '815aa4606f476444691c5f1c16b9c70da6714dc6',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true,
    enableProof: true,
    authOptions: {}
  },

  twitter: {
    consumerKey: process.env.TWITTER_KEY || '6NNBDyJ2TavL407A3lWxPFKBI',
    consumerSecret: process.env.TWITTER_SECRET || 'ZHaYyK3DQCqv49Z9ofsYdqiUgeoICyh6uoBgFfu7OeYC7wTQKa',
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true,
    enableProof: true,
    authOptions: {}
  },

  google: {
    clientID: process.env.GOOGLE_ID || '828110519058.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'JdZsIaWhUFIchmC1a_IZzOHb',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true,
    enableProof: true,
    authOptions: { scope: 'profile email' }
  },

  linkedin: {
    clientID: process.env.LINKEDIN_ID || '77chexmowru601',
    clientSecret: process.env.LINKEDIN_SECRET || 'szdC8lN2s2SuMSy8',
    callbackURL: process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:3000/auth/linkedin/callback',
    scope: ['r_basicprofile', 'r_emailaddress'],
    passReqToCallback: true,
    enableProof: true,
    authOptions: { state: 'SOME STATE' }
  },
};

//constructing Postgres connection string
if(process.env.NODE_ENV === 'test-travis') {
  module.exports.postgres = 'postgres://postgres@127.0.0.1/test_travis_ci';
} else if(process.env.NODE_ENV === 'test') {
  module.exports.postgres = 'postgres://@localhost:5432/test'; 
} else {
  module.exports.postgres = process.env.DATABASE_URL || 'postgres://@localhost:5432/prod';
}
