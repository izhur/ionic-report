angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('AccountCtrl', function($scope,$rootScope) {
  $scope.edited = false;
  $scope.change = function(){
    $scope.edited = true;
  }
  $scope.saveSettings = function() {
    if ($scope.settings.tahun!='') {
      localStorage.year = $scope.settings.tahun;
    }
    if ($scope.settings.api_url!='') {
      localStorage.api = $scope.settings.api_url;
    }
    $scope.edited = false;
  }
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

.controller('Lra2Ctrl', function($scope,$stateParams,$httpParamSerializer,
  $cordovaToast,$ionicPopup,Application,Pendapatan,Belanja,Pembiayaan) {

  $scope.accounts = [];
  $scope.subgroup = [];
  $scope.pen = [];
  $scope.bel = [];
  $scope.pem = [];

  Application.getskpd().then(function(data){
    $scope.accounts = data;
  });

  $scope.showDetail = function(detail) {
    console.log(detail);
    var alertPopup = $ionicPopup.alert({
      title: 'Detail',
      cssClass: 'wide',
      template: '<div class="row"><span class="col">Kode</span><span class="col">'+detail[0]+'</span></div>'+
        '<div class="row"><span class="col">Nama</span><span class="col">'+detail[1]+'</span></div>'+
        '<div class="row"><span class="col">Anggaran</span><span class="col">'+detail[2].formatMoney()+'</span></div>'+
        '<div class="row"><span class="col">Realisasi</span><span class="col">'+detail[3].formatMoney()+'</span></div>'+
        '<div class="row"><span class="col">Persentase</span><span class="col">'+detail[4].formatMoney()+'%</span></div>'
    });
  };

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      console.log(group);
      var params = {
        tahun: $scope.settings.tahun,
        skpd: group.kode.slice(0,7) 
      };
      $scope.pen = [];
      $scope.bel = [];
      $scope.pem = [];

      
        Pendapatan.pendapatandetail($httpParamSerializer(params)).then(function(data){
          $scope.pen = data.items;
          console.log($scope.pen);
        });
        Belanja.belanjadetail($httpParamSerializer(params)).then(function(data){
          $scope.bel = data.items;
          console.log($scope.bel);
        });
        Pembiayaan.pembiayaandetail($httpParamSerializer(params)).then(function(data){
          $scope.pem = data.items;
          console.log($scope.pem);
        });
      
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
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
      if (group.kode!="_.__.____") {
        Laporan.apbd3(params).then(function(data){
          $scope.details = data;
        });
      } else {
        Laporan.apbd1(params).then(function(data){
          $scope.details = data;
        });
      }
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
    //console.log(data);
    $scope.accounts = data;
  });
})

.controller('StatCtrl', function($scope,$stateParams,$httpParamSerializer,
  $cordovaToast,Application,Laporan) {

  $scope.stat = [];
  $scope.list = [
    {kode:'apbd',nama:'APBD'},
    {kode:'apbdp',nama:'APBDP'},
    {kode:'1',nama:'Januari'},
    {kode:'2',nama:'Februari'},
    {kode:'3',nama:'Maret'},
    {kode:'4',nama:'April'},
    {kode:'5',nama:'Mei'},
    {kode:'6',nama:'Juni'},
    {kode:'7',nama:'Juli'},
    {kode:'8',nama:'Agustus'},
    {kode:'9',nama:'September'},
    {kode:'10',nama:'Oktober'},
    {kode:'11',nama:'November'},
    {kode:'12',nama:'Desember'}
  ];
  Laporan.kelengkapan().then(function(data){
    $scope.stat = data;
  });
})
;


