/* jshint node: true */

//var $ = require('jquery'),
//    _ = require('lodash'),
//    Firebase = require('firebase');

var FIREBASE_URL = 'https://nerd-tree.firebaseio.com',
    usersFbUrl;

$(document).ready(initialize);
function initialize () {

  ////////////////////////////////////////////////////
  ///////////////// Initial State ////////////////////
  ///////////////////////////////////////////////////

  //when you first come to the page, hide certain things if not logged in
  //signup form
  $('.sign-up-form').hide();
  //signin form
  $('.sign-in-form').hide();
  //profile form
  $('.profile-form').hide();


  ////////////////////////////////////////////////////
  ///////////////// Click Events /////////////////////
  ///////////////////////////////////////////////////

  //signIn button on navbar
  $('#signIn').click(showSignInForm);
  //signUp button on navbar
  $('#signUp').click(showSignUpForm);

  // //signUp form
  $('#createNewUser').click(createNewUser);
  // $('#cancelSignup').click();
  //
  //signin form
}//end of initialize

////////////////////////////////////////////////////
///////////////// Functions // /////////////////////
///////////////////////////////////////////////////

//create a new firebase user
function createNewUser (event) {
  event.preventDefault();
  //get the email
  var $email = $('#signupEmail').val();
  // and password
  var $password = $('#signupPassword').val();
  //create the login object
  var loginObj = {
    email: $email,
    password: $password
  }
  //clear the values of the inputs
  $('#signupEmail').val('');
  $('#signupPassword').val('');

  var fb = new Firebase(FIREBASE_URL);
  fb.createUser(loginObj, function (error, userData) {
    if (error) {
      console.log("Error creating user: ", error);
      alert("Rejected! ", error);
    } else {
      console.log("Successfully created user account with uid: ", userData.uid);
    }
  });
}

//show sign in form and hide the brand-land
function showSignInForm (event) {
  event.preventDefault();
  //show the signin form
  $('.sign-in-form').toggle();
  //hide brand-land
  $('.brand-land').toggle();
}

//show sign up form and hide the brand-land
function showSignUpForm (event) {
  event.preventDefault();
  //show the signup form
  $('.sign-up-form').toggle();
  //hide brand-land
  $('.brand-land').toggle();
}
