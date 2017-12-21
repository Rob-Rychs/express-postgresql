"use strict";

/**
 * Fake posts to simulate a database.
 */
var posts = [
  {
    id: 1,
    author: 'Johny',
    title: 'Templating with EJS',
    body: 'Blog post number 1'
  },
  {
    id: 2,
    author: 'Drake',
    title: 'Express: Starting from the Bottom',
    body: 'Blog post number 2'
  },
  {
    id: 3,
    author: 'Em',
    title: 'Streams',
    body: 'Blog post number 3'
  },
  {
    id: 4,
    author: 'Bob',
    title: 'Events',
    body: 'Blog post number 4'
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