// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'quedadas' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'quedadas.controllers' is found in controllers.js
var ionicApp = angular.module('quedadas', ['ionic','ngCordova', 'quedadas.controllers','ngMessages'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'MenuCtrl'
    })

    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'LoginCtrl'
    })

    .state('signup', {
      url: "/signup",
      templateUrl: "templates/signup.html",
      controller: 'SignUpCtrl'
    })

    .state('app.profile', {
      url: "/profile",
      views: {
        'menuContent' :{
          templateUrl: "templates/profile.html",
          controller: 'ProfileCtrl'
        }
      }
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.friends', {
      url: "/friends",
      views: {
        'menuContent' :{
          templateUrl: "templates/friends.html",
          controller: 'FriendCtrl'
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html"
          
        }
      }
    })
    .state('app.sports', {
      url: "/sports",
      views: {
        'menuContent' :{
          templateUrl: "templates/sports.html",
          controller: 'SportsCtrl'
        }
      }
    })

    .state('app.addsport', {
      url: "/addsport",
      views: {
        'menuContent' :{
          templateUrl: "templates/addsport.html",
          controller: 'SportsCtrl'
        }
      }
    })

    .state('app.newqdd', {
      url: "/newqdd",
      views: {
        'menuContent' :{
          templateUrl: "templates/newqdd.html",
          controller: 'SportsCtrl'
        }
      }
    })

    .state('app.addplayer', {
      url: "/addplayer",
      views: {
        'menuContent' :{
          templateUrl: "templates/addplayer.html",
          controller: 'SportCtrl'
        }
      }
    })

    .state('app.addfriend', {
      url: "/addfriend",
      views: {
        'menuContent' :{
          templateUrl: "templates/addfriend.html",
          controller : 'FriendCtrl'
        }
      }
    })

    .state('app.qdd', {
      url: "/qdd",
      views: {
        'menuContent' :{
          templateUrl: "templates/sport.html",
          controller: 'QddCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});