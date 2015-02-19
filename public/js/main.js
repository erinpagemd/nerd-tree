/* jshint node: true */

//var $ = require('jquery'),
//    _ = require('lodash'),
//    Firebase = require('firebase');

var FIREBASE_URL = 'https://nerd-tree.firebaseio.com',
    fb = new Firebase(FIREBASE_URL),
    usersFbUrl,
    fbUsers,
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
    //hide profile form
    $('.profile-form').hide();

    fbUsers = new Firebase(FIREBASE_URL + '/users/' + fb.getAuth().uid);

    console.log(fb.getAuth().uid);

    displayProfileDiv();

  } else {
    //hide these things
    //signup form
    $('.sign-up-form').hide();
    //signin form
    $('.sign-in-form').hide();
    //profile form
    $('.profile-form').hide();
    //hide allUsersTarget
    $('#allUsersTarget').hide();

  }

  ////////////////////////////////////////////////////
  ///////////////// Click Events /////////////////////
  ///////////////////////////////////////////////////

  //signIn button on navbar
  $('#signIn').click(showSignInForm);
  //signUp button on navbar
  $('#signUp').click(showSignUpForm);
  //loogout on navbar
  $('#logout').click(logoutUser);

  // //signUp form
  $('#createNewUser').click(createNewUser);
  // $('#cancelSignup').click();
  //
  //signin form
  $('#loginExistingUser').click(loginExistingUser);

  //profile form
  $('#submitProfile').click(submitProfile);
  $('#cancelProfile').click(cancelProfile);

  //edit click events will have to happen on profileTarget
  $('#profileTarget').on('click', '#editProfile', editProfile);

}//end of initialize

////////////////////////////////////////////////////
///////////////// Functions // /////////////////////
///////////////////////////////////////////////////

//edit the name of the user in firebase
function editProfile (event) {
  event.preventDefault();
  //empty the profile and show the profile form
  $('#profileTarget').empty();
  $('.profile-form').toggle();
}

//logout the user
function logoutUser (event) {
  event.preventDefault();
  fb.unauth();
  location.reload(true);
}//end logoutUser

//cancel profile button hides the profile page
function cancelProfile (event) {
  event.preventDefault();
  fbUsersData = fbUsers.child('data');
  //hide the profile form
  $('.profile-form').toggle();
  //display the name and photo
  $('#profileTarget').append(createProfileDiv());
  //clear the values of the inputs
  $('#profileName').val('');
  $('#imgUrl').val('');

}

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
  //clear the values of the inputs
  $('#profileName').val('');
  $('#imgUrl').val('');

  //save the data to firebase using set()
  fbUsers = new Firebase(FIREBASE_URL + '/users/' + fb.getAuth().uid);
  fbUsersData = fbUsers.child('data');
  fbUsersData.set(profileObj);

  //hide the profile form
  $('.profile-form').toggle();

  displayProfileDiv();
}

//display the name and photo
function displayProfileDiv () {
  $('#profileTarget').append(createProfileDiv());
}

//create dynamic html div container for profile
function createProfileDiv () {
  //get the data, and then do all this div stuff inside that callback
  fbUsersData = fbUsers.child('data');
  fbUsersData.once('value', function(snapshot) {
    var snap = snapshot.val();
    //container for profile
    var $profileDiv = $('<div class="col-md-6 col-md-offset-3 profile-div"><h3>My Profile</h3></div>');
    //image src is the profile image
    var $img = $('<img src="' + snap.image + '" class="img-circle">');
    //heading with profile name as the text
    var $h2 = $('<h2>' + snap.name + '</h2>');
    //create edit buttons
    var $buttonDiv = $('<button class="btn btn-default" id="editProfile" >Edit Profile</button>');

    //append the h2 and img to the container
    $profileDiv.append($img);
    $profileDiv.append($h2);
    $profileDiv.append($buttonDiv);
    //if it has a unique identifier, grab it here???

    //put the container on the page
    $('#profileTarget').append($profileDiv);

  });
}//end createProfileDiv

//login an existing user
function loginExistingUser (event) {
  event.preventDefault();

  fb.authWithPassword(getSigninFormObj(event), function(error, authData) {
    if(error) {
      console.log("login failed! ", error);
      alert("login failed! ", error);
    } else {
      fbUsers = new Firebase(FIREBASE_URL + '/users/' + fb.getAuth().uid);
      //hide the signin form
      $('.sign-in-form').toggle();
      //hide the signup button
      $('#signUp').hide();
      //hide the signin button
      $('#signIn').hide();
      //show the profile
      $('#profileTarget').append(createProfileDiv());
      //show allUsersTarget button
      $('#allUsersTarget').toggle();

      console.log('authenticated successfully with payload: ', authData);
    }
  });
}//end loginExistingUser

//get signin form info and create signin obj
function getSigninFormObj (event) {
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

  return loginObj;
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
      fb.authWithPassword(loginObj, function(error, authData) {
        if(error) {
          console.log("login failed! ", error);
          alert("login failed! ", error);
        } else {
          console.log('authenticated successfully with payload: ', authData);
          //hide the signup form
          $('.sign-up-form').toggle();
          //show the profile form
          $('.profile-form').toggle();
          //show allUsersTarget button
          $('#allUsersTarget').toggle();
          //hide the signup button
          $('#signUp').hide();
          //hide the signin button
          $('#signIn').hide();
        }
      });
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
