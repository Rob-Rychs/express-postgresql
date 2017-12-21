"use strict";

/**
 * Fake posts to simulate a database.
 */
var posts = [
  {
    id: 1,
    author: 'Rob',
    title: 'Templating with EJS',
    body: 'EJS provides a nice syntax for creating both template partials and page layouts as well as conditional rendering, looping through arrays of values and rendering data from javascript objects and JSONs into html view templates receiving the data passed to it from the controller which is defined in the model. Here the Model is Sequelize, the View is EJS and the Controllers are vanilla es5 js.'
  },
  {
    id: 2,
    author: 'Drake',
    title: 'Express: Started from the Bottom now you app.(getting) it',
    body: 'It\'s not a node.js app without express, the NPM legend.'
  },
  {
    id: 3,
    author: 'Rob',
    title: 'Secure Auth',
    body: 'Secure local authentication using postgresql and bcrypt. Session storage cookies active for 30 days.'
  },
  {
    id: 4,
    author: 'Rob',
    title: 'AngularJs Forms',
    body: 'Utilize the power of two-way data binding, custom validation and more form handler methods like ng-model, ng-submit, etc...'
  }
]


/**
 * GET /posts
 * Contact form page.
 */
exports.getBlogs = function(req, res) {
  res.render('list', {
    title: 'List',
    posts: posts
  });
};

/**
 * GET /post/:id
 */
exports.getBlogPost = function(req, res) {
  // find the post in the `posts` array
  const post = posts.filter((post) => {
    return post.id == req.params.id
  })[0]

  // render the `post.ejs` template with the post content
  res.render('post', {
    author: post.author,
    title: post.title,
    body: post.body
  })
};

/**
 * GET /posts/submit
 * Submit blog form page.
 */
exports.getBlogSubmit = function(req, res) {
  res.render('listsubmit', {
    title: 'Add'
  });
};

/**
 * POST /posts/submit
 * Send a contact form via Nodemailer.
 */
exports.postBlogSubmit = function(req, res) {
  req.assert('title', 'Title cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('description', 'Description can be blank or 3 to 1000 characters').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/posts');
  }

  console.log(req.title);
  //You can see an example of sending emails in emailService.js
  //This is just hack to avoid having tons of spam ;)
  req.flash('success', { msg: 'Blog posts successfully added' });
  res.redirect('/posts/submit');
};