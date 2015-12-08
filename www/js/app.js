// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova', 'starter.controllers', 'starter.services','starter.directives'])

.run(function($ionicPlatform,$rootScope,$cordovaToast,$ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $rootScope.settings = {
    enable: true,
    tahun: angular.isDefined(localStorage.year)? localStorage.year:"2016",
    username: "admin",
    loading: false,
    //api_url: "http://bengkulu.mymac.net/index.php/rest"
    api_url: angular.isDefined(localStorage.api)?localStorage.api:"http://182.23.33.140/mr_keuangan/index.php/api"
    //api_url: "http://mrbkl-izhur.rhcloud.com/index.php/rest"
  };
  $rootScope.$on('loading:show', function() {
    if (!$rootScope.loading) {
      $rootScope.loading = true;
      $ionicLoading.show({template: '<ion-spinner icon="dots"></ion-spinner>'});
    }
  });
  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide();
    $rootScope.loading = false;
  });
  $rootScope.$on('toast:show', function(obj,msg,data) {
    //console.log("kk",msg);
    if (angular.isDefined(window.cordova)) $cordovaToast.showLongBottom(msg);
  });
})

.config(function($stateProvider,$urlRouterProvider,$httpProvider,$ionicConfigProvider) {
  $ionicConfigProvider.tabs.position("bottom");

  $httpProvider.interceptors.push(function($q,$rootScope) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:show');
        return config;
      },
      response: function(response) {
        $rootScope.$broadcast('loading:hide');
        return response;
      },
      'requestError': function(rejection) {
        // do something on error
        $rootScope.$broadcast('loading:hide');
        $rootScope.$broadcast('toast:show',"connection request error",rejection);
        return $q.reject(rejection);
      },
      'responseError': function(rejection) {
        // do something on error
        $rootScope.$broadcast('loading:hide');
        $rootScope.$broadcast('toast:show',"connection response error",rejection);
        return $q.reject(rejection);
      }
    }
  });
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.lap-lra', {
    url: '/dash/lra',
    views: {
      'tab-dash': {
        templateUrl: 'templates/lap-lra.html',
        controller: 'LraCtrl'
      }
    }
  })
  .state('tab.lap-angg', {
    url: '/dash/angg',
    views: {
      'tab-dash': {
        templateUrl: 'templates/lap-angg.html',
        controller: 'AnggCtrl'
      }
    }
  })
  .state('tab.lap-anggp', {
    url: '/dash/anggp',
    views: {
      'tab-dash': {
        templateUrl: 'templates/lap-anggp.html',
        controller: 'AnggPCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
