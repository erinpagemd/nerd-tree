/* jshint node: true */

//var $ = require('jquery'),
//    _ = require('lodash'),
//    Firebase = require('firebase');

var FIREBASE_URL = 'https://nerd-tree.firebaseio.com',
    fb = new Firebase(FIREBASE_URL),
    usersFbUrl,
    fbUsers,
    fbUsersData,
    newFbLikedUserKey;

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

    ////////////// when logged in, the unlike button shows instead of the like button based on what is on firebase

    fbUsers = new Firebase(FIREBASE_URL + '/users/' + fb.getAuth().uid);

    displayProfileDiv();

    getAllUsers();


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

  //allUsersTarget events
  $('#allUsersTarget').on('click', '.likeUser', likeUser);
  $('#allUsersTarget').on('click', '.unlikeUser', unlikeUser);
  $('#allUsersTarget').on('click', '.emailMe', emailMe);

}//end of initialize

////////////////////////////////////////////////////
///////////////// Functions // /////////////////////
///////////////////////////////////////////////////

//when you click the email me button
function emailMe (event) {
  event.preventDefault();
  alert('COMING SOON!!');
}//end of emailMe

//show the matches
function showMatch (event, liked) {
  //when i like the user check their liked Users and see if I am in it
  //get my simpleLogin id
  var mySimpleLoginId = fb.getAuth().uid;
  //filter their likes for my simpleLogin id
  //get their likes
  var fbUserLikes = new Firebase('https://nerd-tree.firebaseio.com/users/' + liked + '/data/likes');
  fbUserLikes.once('value', function(snapshot){
    var snap = snapshot.val();
    var match = _.includes(snap, mySimpleLoginId);
    if (match) {
      $(event.target).parent().css('background-color', 'green');
      $(event.target).parent().css('color', 'white');
      //$('.emailMe').toggle();
      $(event.target).siblings('button').toggle();
    }

  });

  //if true...
  //if it is a match, change the color of the background of the div to green
  //filter the green ones to the top
  //then show the ones i like that are not matches
  //then show the ones i do not like
}

//like the user when you click the button
function likeUser (event) {
  event.preventDefault();
  //use event.target to get the uid, grab the data attribute
  //get the closest divs data-user attr
  var $divToLike = $(event.target).parent();
  var likedUser = $divToLike.data('user');
  //hides the like button
  $(event.target).toggle();
  //shows the unlike button
  $(event.target).siblings('.unlikeUser').toggle();
  //save the likes array to firebase
  var fbUsersDataLikes = fbUsersData.child('likes');
  var newfbLikedUser = fbUsersDataLikes.push(likedUser);
  newFbLikedUserKey = newfbLikedUser.key();

  showMatch(event, likedUser);
}//end likeUser

//REMOVE IS NOT WORKING!!!!
//unlike button removes from array
function unlikeUser (event) {
  event.preventDefault();
  //use event.target to get the uid, grab the data attribute
  //get the closest divs data-user attr
  var $divToUnlike = $(event.target).parent();
  var likedUser = $divToUnlike.data('user');
  //hides the unlike button
  $(event.target).toggle();
  //shows the like button
  $(event.target).siblings('.likeUser').toggle();
  //remove the unliked person from the likes data
  var fbUsersDataLikes = fbUsersData.child('likes');
  var fbLikesUuid = fbUsersDataLikes.child('newFbLikedUserKey');
  fbLikesUuid.remove();
  //newFbLikedUserKey.remove();

}// REMOVE IS NOT WORKING!!!!!!

//get all the users from firebase
function getAllUsers () {
  fb.child('/users').once('value', function(snapshot) {
    var snap = snapshot.val();
    var keys = Object.keys(snap);
    createAllUsersDiv(snap);
    $('.unlikeUser').hide();
    $('.emailMe').hide();
  });
}

function createAllUsersDiv (users) {
  var $allUsersDiv = $('<div class="allUsersDiv"><h3>Ooooh... look at that! Well... go ahead and get to judging all of these people. Simply click the button on the profile of the person (or persons... am I right?) you would like to meet!</h3></div>');

  $.each(users, function(uid) {
    //make a user div
    var $userDiv = $('<div class="userDiv"></div>');
    //make and append the image
    var $userPhoto = $('<img src="' + users[uid].data.image + '" class="img-circle">');
    //make and append the name
    var $userName = $('<h3>' + users[uid].data.name + '</h3>');
    var $likeButton = $('<button class="btn btn-warning likeUser">I like THIS person!</button>');
    var $unlikeButton = $('<button class="btn btn-danger unlikeUser">Remove from my likes list!!</button>');
    var $emailMeButton = $('<button class="btn btn-default emailMe">Email Me</button>');
    $userDiv.append($userPhoto, $userName, $likeButton, $unlikeButton, $emailMeButton);
    $userDiv.attr('data-user', uid);
    //append all of that to the allUsersDiv
    $allUsersDiv.append($userDiv);
  });
  //append the allUsersDiv to allUsersTarget
  $('#allUsersTarget').append($allUsersDiv);
}

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

  //save the data to firebase using set()
  fbUsers = new Firebase(FIREBASE_URL + '/users/' + fb.getAuth().uid);
  fbUsersData = fbUsers.child('data');
  fbUsersData.set(createProfileObj(event));

  //hide the profile form
  $('.profile-form').toggle();

  displayProfileDiv();
}// end submitProfile

//display the name and photo
function displayProfileDiv () {
  $('#profileTarget').append(createProfileDiv());
}//end displayProfileDiv

//create a login obj for profile
function createProfileObj (event) {
  event.preventDefault();
  //get the name
  var $name = $('#profileName').val();
  // and password
  var $imgUrl = $('#imgUrl').val();
  //create the login object
  var profileObj = {
    name: $name,
    image: $imgUrl
  }
  //clear the values of the inputs
  $('input').val('');

  return profileObj;

}//end createProfileObj

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
    $profileDiv.append($img, $h2, $buttonDiv);
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

      getAllUsers();

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
  $('input').val('');

  return loginObj;
}//end getSigninFormObj

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
