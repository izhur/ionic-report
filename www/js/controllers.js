angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope,$rootScope) {
})

.controller('LraCtrl', function($scope,$stateParams,$httpParamSerializer,
  $cordovaToast,Pendapatan,Belanja,Pembiayaan) {
  $scope.accounts = [{
    id: 0,
    name: 'Pendapatan',
    anggaran: 0,
    realisasi: 0,
    sisa: 0,
    persen: 0,
    items: []
  }, {
    id: 1,
    name: 'Belanja',
    anggaran: 0,
    realisasi: 0,
    sisa: 0,
    persen: 0
  }, {
    id: 2,
    name: 'Pembiayaan',
    anggaran: 0,
    realisasi: 0,
    sisa: 0,
    persen: 0
  }];
  $scope.subgroup = {};
  $scope.details = [];

  Pendapatan.pend($httpParamSerializer({tahun:$scope.settings.tahun}))
  .then(function(data){
    $scope.accounts[0].items = data.data7;
    $scope.accounts[0].anggaran = 0;
    data.data.forEach(function(nnilai){
      $scope.accounts[0].anggaran += nnilai;
    });
    $scope.accounts[0].realisasi = 0;
    data.data2.forEach(function(nnilai){
      $scope.accounts[0].realisasi += nnilai;
    });
    $scope.accounts[0].sisa = $scope.accounts[0].anggaran-$scope.accounts[0].realisasi;
    $scope.accounts[0].persen = ($scope.accounts[0].sisa/$scope.accounts[0].anggaran)*100;
  });

  Belanja.belanja($httpParamSerializer({tahun:$scope.settings.tahun}))
  .then(function(data){
    $scope.accounts[1].anggaran = data.anggaran;
    $scope.accounts[1].realisasi = data.realisasi;
    $scope.accounts[1].items = data.items;
    $scope.accounts[1].sisa = $scope.accounts[0].anggaran-$scope.accounts[0].realisasi;
    $scope.accounts[1].persen = ($scope.accounts[0].sisa/$scope.accounts[0].anggaran)*100;
  });

  Pembiayaan.pembiayaan($httpParamSerializer({tahun:$scope.settings.tahun}))
  .then(function(data){
    $scope.accounts[2].anggaran = data.anggaran;
    $scope.accounts[2].realisasi = data.realisasi;
    $scope.accounts[2].items = data.items;
    $scope.accounts[2].sisa = $scope.accounts[0].anggaran-$scope.accounts[0].realisasi;
    $scope.accounts[2].persen = ($scope.accounts[0].sisa/$scope.accounts[0].anggaran)*100;
  });

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
  $scope.toggleSubGroup = function(subgroup,idx) {
    if ($scope.isSubGroupShown(subgroup)) {
      $scope.shownSubGroup = null;
    } else {
      var params = {
        tahun: $scope.settings.tahun,
        skpd: subgroup[0]
      };
      $scope.details = [];
      if (idx==0) {
        Pendapatan.pendapatandetail($httpParamSerializer(params)).then(function(data){
          $scope.details = data.items;
        });
      }else if (idx==1) {
        Belanja.belanjadetail($httpParamSerializer(params)).then(function(data){
          $scope.details = data.items;
        });
      }else if (idx==2) {
        Pembiayaan.pembiayaandetail($httpParamSerializer(params)).then(function(data){
          $scope.details = data.items;
        });
      }
      $scope.shownSubGroup = subgroup;
    }
  };
  $scope.isSubGroupShown = function(subgroup) {
    return $scope.shownSubGroup === subgroup;
  };
})
.controller('AnggCtrl', function($scope,$stateParams,$httpParamSerializer,
  $cordovaToast,Application,Laporan,Pembiayaan) {

  $scope.accounts = [];
  $scope.subgroup = [];

  Application.getskpd().then(function(data){
    $scope.accounts = data;
  });

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      var params = {
        tahun: $scope.settings.tahun,
        kodeS: group.kode 
      };
      $scope.details = [];
      Laporan.apbd3(params).then(function(data){
        $scope.details = data;
      });
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
})

.controller('AnggPCtrl', function($scope,$stateParams,$httpParamSerializer,
  $cordovaToast,Application,Laporan,Pembiayaan) {

  $scope.accounts = [];
  $scope.subgroup = [];

  var params = {
    tahun: $scope.settings.tahun
  };

  Laporan.apbd1p($httpParamSerializer(params)).then(function(data){
    console.log(data);
    $scope.accounts = data;
  });
})
;


