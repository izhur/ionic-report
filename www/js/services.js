angular.module('starter.services', ['ngResource','ngCookies'])

.factory('Application', function($q, $http, $rootScope, $cookies){
  var app = {
    'use_session': true,
    'API_URL': $rootScope.settings.api_url,
    'request': function(args) {
      // Let's retrieve the token from the cookie, if available
      if (angular.isDefined($cookies.csrftoken)) {
        $http.defaults.headers.common['X-CSRFToken' ] = $cookies.csrftoken;
      }
      $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
      // Continue
      params = args.params || {}
      args = args || {};
      var deferred = $q.defer(),
          url = this.API_URL + args.url,
          method = args.method || "GET",
          params = params,
          //headers = args.headers || {},
          data = args.data || {};
      // Fire the request, as configured.
      $http({
          url: url,
          withCredentials: this.use_session,
          method: method.toUpperCase(),
          //headers: headers,
          params: params,
          timeout: 30000,
          data: data
      })
      .success(angular.bind(this,function(data, status, headers, config) {
        //console.log('http success! : '+angular.toJson(data));
          deferred.resolve(data, status);
      }))
      .error(angular.bind(this,function(data, status, headers, config) {
          //console.log("error syncing with: " + url);
          // Set request status
          if(data){
              data.status = status;
          }
          if(status == 0){
              if(data == ""){
                  data = {};
                  data['status'] = 0;
                  data['non_field_errors'] = ["Could not connect. Please try again."];
              }
              // or if the data is null, then there was a timeout.
              if(data == null){
                  // Inject a non field error alerting the user
                  // that there's been a timeout error.
                  data = {};
                  data['status'] = 0;
                  data['non_field_errors'] = ["Server timed out. Please try again."];
              }
          }
          deferred.reject(data, status, headers, config);
      }));
      return deferred.promise;
    },
    'login': function(username,password) {
      var apiAuth = this;
      return this.request({
          'method': "POST",
          'url': "/actionLogin",
          'data':{
              'username':username,
              'password':password
          }
      }).then(function(data){
          if(!apiAuth.use_session){
              $http.defaults.headers.common.Authorization = 'Token ' + data.token;
          }
          apiAuth.authenticated = 'true';
          apiAuth.token = data.token;
          apiAuth.username = username;
          $rootScope.settings.username = username;
          localStorage.token = data.token;
          localStorage.username = username;
          localStorage.authenticated = 'true';
          //$rootScope.$broadcast("api.logged_in", data);
          return data;
      });
    },
    'logout': function(){
      var apiAuth = this;
      return this.request({
          'method': "GET",
          'url': "/actionLogout",
          'data':{
              'username':username,
              'password':password
          }
      }).then(function(data){
        delete $http.defaults.headers.common.Authorization;
        delete localStorage.token;
        delete localStorage.username;
        delete localStorage.authenticated;
        apiAuth.authenticated = false;
        apiAuth.token = '';
        apiAuth.username = '';
      });
    },
    'getskpd': function() {
      return this.request({
        'method': "POST",
        'url': "/getskpd"
      });
    }
  };
  return app;
})

.factory('Pendapatan', function(Application) {
  var pend = {
    'pend': function(params) {
      var app = this;
      return Application.request({
        'method': "POST",
        'url': "/pend",
        'data': params
      });
    },
    'pendapatandetail': function(params) {
      var app = this;
      //console.log('params',params);
      return Application.request({
        'method': "POST",
        'url': "/pendapatandetail",
        'data': params
      }).then(function(data){
        data.items = [];
        var ang = 0;
        var real = 0;
        var persen = 0;
        for(i=0;i<data.dtakun.length;i++) {
          if (data.dtdepth[i]==1) {
            ang += data.dtnilai[i];
            real += data.dtreal[i];
          }
          zpad = "&nbsp;".repeat(data.dtdepth[i]*2);
          var item = [data.dtakun[i],data.dtnmakun[i],
            data.dtnilai[i],data.dtreal[i],data.dtpersen[i],
            data.dtdepth[i],zpad];
          data.items.push(item);
        }
        data.anggaran = ang;
        data.realisasi = real;
        data.persen = (real/ang)*100;
        return data;
      });
    }
  };
  return pend;
})

.factory('Belanja', function(Application) {
  var belanja = {
    'belanja': function(params) {
      var app = this;
      return Application.request({
        'method': "POST",
        'url': "/belanja",
        'data': params
      }).then(function(data){
        var totang = 0;
        var totreal = 0;
        data.items = [];
        for(i=0;i<data.dkskpd.length;i++) {
          var ang = data.d_btl[i]+data.d_bl[i];
          var real = data.d_btlr[i]+data.d_blr[i];
          var persen = (real/ang)*100;
          var item = [data.dkskpd[i],data.dnmskpd[i],ang,real,persen];
          data.items.push(item);
          totang += ang;
          totreal += real;
        }
        data.anggaran = totang;
        data.realisasi = totreal;
        data.persen = (totreal/totang)*100;
        return data;
      });
    },
    'belanjadetail': function(params) {
      var app = this;
      //console.log('params',params);
      return Application.request({
        'method': "POST",
        'url': "/belanjadetail",
        'data': params
      }).then(function(data){
        data.items = [];
        var ang = 0;
        var real = 0;
        var persen = 0;
        for(i=0;i<data.dtakun.length;i++) {
          if (data.dtdepth[i]==1) {
            ang += data.dtnilai[i];
            real += data.dtreal[i];
          }
          zpad = "&nbsp;".repeat(data.dtdepth[i]*2);
          var item = [data.dtakun[i],data.dtnmakun[i],
            data.dtnilai[i],data.dtreal[i],data.dtpersen[i],
            data.dtdepth[i],zpad];
          data.items.push(item);
        }
        data.anggaran = ang;
        data.realisasi = real;
        data.persen = (real/ang)*100;
        return data;
      });
    }
  };
  return belanja;
})

.factory('Pembiayaan', function(Application) {
  var pemb = {
    'pembiayaan': function(params) {
      var app = this;
      return Application.request({
        'method': "POST",
        'url': "/pembiayaan",
        'data': params
      }).then(function(data){
        data.items = [];
        var totang = 0;
        var totreal = 0;
        for(i=0;i<data.dtkdskpd.length;i++) {
          ang = data.d_in[i]+data.d_out[i];
          real = data.d_inr[i]+data.d_outr[i];
          pers = (real/ang)*100;
          var item = [data.dtkdskpd[i],data.data3[i],ang,real,pers];
          data.items.push(item);
          totang += ang;
          totreal += real;
        }
        data.anggaran = ang;
        data.realisasi = real;
        data.persen = (real/ang)*100;
        return data;
      });
    },
    'pembiayaandetail': function(params) {
      var app = this;
      //console.log('params',params);
      return Application.request({
        'method': "POST",
        'url': "/pembiayaandetail",
        'data': params
      }).then(function(data){
        data.items = [];
        var ang = 0;
        var real = 0;
        var persen = 0;
        for(i=0;i<data.dtakun.length;i++) {
          if (data.dtdepth[i]==1) {
            ang += data.dtnilai[i];
            real += data.dtreal[i];
          }
          zpad = "&nbsp;".repeat(data.dtdepth[i]*2);
          var item = [data.dtakun[i],data.dtnmakun[i],
            data.dtnilai[i],data.dtreal[i],data.dtpersen[i],
            data.dtdepth[i],zpad];
          data.items.push(item);
        }
        data.anggaran = ang;
        data.realisasi = real;
        data.persen = (real/ang)*100;
        return data;
      });
    }
  };
  return pemb;
})

.factory('Laporan', function(Application) {
  var lap = {
    'apbd3': function(params) {
      return Application.request({
        'method': "GET",
        'url': "/apbd3/"+params.kodeS,
        'data': params
      });
    },
    'apbd1p': function(params) {
      return Application.request({
        'method': "POST",
        'url': "/apbd1_p/",
        'data': params
      });
    }
  };
  return lap;
})
;
