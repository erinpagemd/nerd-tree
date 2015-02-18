/* jshint node: true */

//var $ = require('jquery'),
//    _ = require('lodash'),
//    Firebase = require('firebase');

var FIREBASE_URL = 'https://nerd-tree.firebaseio.com',
    fb = new Firebase(FIREBASE_URL),
    usersFbUrl,
    fbUsersData;

$(document).ready(initialize);
function initialize () {

  ////////////////////////////////////////////////////
  ///////////////// Initial State ////////////////////
  ///////////////////////////////////////////////////

  //when you first come to the page, are you logged in?
  if(fb.getAuth()) {
    //if true show the things
    //signup form
    $('.sign-up-form').hide();
    //signin form
    $('.sign-in-form').hide();
    //hide the signup button
    $('#signUp').hide();
    //hide the signin button
    $('#signIn').hide();
    //hide brand-land
    $('.brand-land').hide();

    fbUsers = new Firebase('https://nerd-tree.firebaseio.com/users/' + fb.getAuth().uid);

    console.log(fb.getAuth().uid);

  } else {
    //hide these things
    //signup form
    $('.sign-up-form').hide();
    //signin form
    $('.sign-in-form').hide();
    //profile form
    $('.profile-form').hide();
  }

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
  $('#loginExistingUser').click(loginExistingUser);

  //profile form
  $('#submitProfile').click(submitProfile);
}//end of initialize

////////////////////////////////////////////////////
///////////////// Functions // /////////////////////
///////////////////////////////////////////////////

//submit profile name and picture url
function submitProfile (event) {
  event.preventDefault();
  //get the name
  var $name = $('#profileName').val();
  // and password
  var $imgUrl = $('#imgUrl').val();
  console.log($imgUrl);
  //create the login object
  var profileObj = {
    name: $name,
    image: $imgUrl
  }
  //profileObj = JSON.stringify(profileObj);
  //clear the values of the inputs
  $('#profileName').val('');
  $('#imgUrl').val('');

  //save the data to firebase using set()
  var fbUsersData = fbUsers.child('data');
  fbUsersData.set(profileObj);
}

//login an existing user
function loginExistingUser (event) {
  event.preventDefault();
  //get the email
  var $email = $('#signinEmail').val();
  // and password
  var $password = $('#signinPassword').val();
  //create the login object
  var loginObj = {
    email: $email,
    password: $password
  }
  //clear the values of the inputs
  $('#signinEmail').val('');
  $('#signinPassword').val('');


  fb.authWithPassword(loginObj, function(error, authData) {
    if(error) {
      console.log("login failed! ", error);
      alert("login failed! ", error);
    } else {
      console.log('authenticated successfully with payload: ', authData);
    }
  });
}

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

  fb.createUser(loginObj, function (error, userData) {
    if (error) {
      console.log("Error creating user: ", error);
      alert("Rejected! ", error);
    } else {
      console.log("Successfully created user account with uid: ", userData.uid);
      //login
    }
  });
}//end createNewUser

//show sign in form and hide the brand-land
function showSignInForm (event) {
  event.preventDefault();
  //show the signin form
  $('.sign-in-form').toggle();
  //hide brand-land
  $('.brand-land').toggle();
}//end showSignInForm

//show sign up form and hide the brand-land
function showSignUpForm (event) {
  event.preventDefault();
  //show the signup form
  $('.sign-up-form').toggle();
  //hide brand-land
  $('.brand-land').toggle();
}//end showSignUpForm
