angular.module('quedadas.controllers', ['quedadas.services'])



.filter('capitalize', function() {
    return function(input, all) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
  })
.filter('dateToISO', function() {
  return function(input) {
    return new Date(input).toISOString();
  };
})

.controller('MenuCtrl', function($scope, $localstorage, $state, $ionicHistory, $ionicLoading,Service) {
  

  //Si cambia en algún sitio (actualiza datos, etc, de aquí) 
  $scope.$watch(function () { return Service.getUser(); },
   function (value) {
       $scope.usuario = value;
   }
  );
  $scope.logout = function() {
    $ionicLoading.show({
      template: 'Logging out...'
    });
    $localstorage.setObject('user', {});
    $scope.setUser = Service.setUser($scope.usuario);
    console.log('logout');
    $ionicHistory.nextViewOptions({
            historyRoot: true,
            disableBack: true
        });
    $ionicHistory.clearHistory();
    $ionicLoading.hide();
    $state.go('login');
  };
  //Si ya está logueado, lo coge de aquí:
  $scope.usuario = $localstorage.getObject('user');
  $scope.setUser = Service.setUser($scope.usuario);
})

.controller('ProfileCtrl', function($scope, $localstorage, $state, $ionicHistory) {
  $scope.usuario = $localstorage.getObject('user');

  //Estos datos deben sacarse desde un modelo para estadísticas: TODO
  $scope.usuario.invitaciones = 25;
  $scope.usuario.asistidas = 15;
  
  $scope.usuario.creadas = 5;
  $scope.usuario.canceladas = 1;
})
.controller('LoginCtrl', function($ionicLoading,$scope,  $timeout, $localstorage, Quedada,$state, $ionicPopup, $ionicHistory, User, Service) {
  $scope.navigateTo = function(state){
    return $state.go(state);  
  }
//Vemos si ya está logueado el usuario:
  var post = $localstorage.getObject('user');
   console.log('Login: recuperando datos guardados ' + post);
    var $iduser = post.id;
    if ($iduser == "undefined" || $iduser == null) {
        //continúa con la operacion normal de login
    } else {
      //Ya esta logueado
      
      $state.go('app.browse');
    }
  // Form data for the login 
  $scope.loginData = {};

  
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $ionicLoading.show({
      template: 'Accediendo...'
    });

    //console.log('Doing login', $scope.loginData);
    var login = Quedada.userlogin($scope.loginData);
    
    login.success(function(resp){
      console.log("[login]API response ", resp.result[0]);
        $localstorage.setObject('user', {
          name: resp.result[0].name,
          surname: resp.result[0].surname,
          username: resp.result[0].username,
          id: resp.result[0].id,
          api_key: resp.result[0].api_key,
          avatar : resp.result[0].picture,
          profileBg : '',
          last_login: resp.result[0].last_login
        });
        
     
      $ionicLoading.hide();
      $state.go('app.browse');
      
    });

    login.error(function(data,status,headers,config) {
      console.log("API response ", data.status);
      $ionicLoading.hide();
      $scope.showAlertBadLogin();
    });
     
  };
  $scope.showAlertBadLogin = function() {
    var alertPopup = $ionicPopup.alert({
       title: 'Error Login Usuario',
       template: 'Usuario/password incorrectos'
     });
     alertPopup.then(function(res) {
       console.log('Usuario/password incorrectos');

     });
   };
   // An alert dialog
   $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Don\'t eat that!',
       template: 'It might taste good'
     });
     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });
   };
})
.controller('SignUpCtrl', function($ionicLoading,$scope, $ionicModal, $localstorage, Quedada,$state, $ionicPopup, $ionicHistory, User, Service) {
  $scope.userreg = {};
 
  $scope.registerUser = function(form){
    
    if(form.$valid) {
      $ionicLoading.show({
        template: 'Registrando usuario...'
      });

      console.log('Registrando usuario:', $scope.userreg);
      var register = User.createuser($scope.userreg);
      
      register.success(function(resp){
        console.log("[SingUp]API response ", resp.result);
        $scope.usuario = {
            name: resp.result.name,
            surname: resp.result.surname,
            username: resp.result.username,
            id: resp.result.id,
            api_key: resp.result.api_key,
            profileBg : '',
            avatar: '',
            last_login: resp.result.date_created
          };
          $localstorage.setObject('user', $scope.usuario);
          $scope.setUser = Service.setUser($scope.usuario);
            

        $ionicLoading.hide();
        $state.go('app.browse');
        
      });

      register.error(function(data,status,headers,config) {
        $scope.showAlertBad();
      });
    
      
      }
  };
 
  $scope.navigateTo = function(state){
    return $state.go(state);  
  }

  $scope.showAlertBad = function() {
    $ionicLoading.hide();
   var alertPopup = $ionicPopup.alert({
     title: 'Error Registrando Usuario',
     template: 'Datos incorrectos'
   });
   alertPopup.then(function(res) {
     console.log('Usuario/password incorrectos');

   });
 };
 
})


.controller('ActiveQddCtrl', function($ionicLoading,$location,$ionicHistory,$scope,$filter, $state,$http, $q, myService, $localstorage) {

  $scope.verqdd = function($activeqdd){

    $scope.activeqdds = $activeqdd;
    myService.set($scope.activeqdds);
    console.log('myserviceactiveqdd: ', myService.get());
    $state.go('app.qdd');
  }
  $scope.init = function(){
    $ionicLoading.show({
      template: 'Cargando quedadas...'
    });
    $scope.getActiveQdd()
    .then(function(res){
      //Success
      console.log('ActiveQdds: ', res)
      $scope.activeqdds = res.result;
      $ionicLoading.hide();
      
    }, function(status){
      //Err
      $scope.pageError = status;
    })
  }

  $scope.getActiveQdd = function(){
    var post = $localstorage.getObject('user');
   console.log(post);
    var $iduser = post.id;
    if ($iduser === undefined || $iduser === null) {
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true,
            historyRoot: true
        });
        $ionicHistory.clearHistory();
        $state.go('login');
    }
    var defer = $q.defer();
    var $fecha_actual = $filter('date')(new Date(), 'yyyy-MM-dd');
    var $hora_actual = $filter('date')(new Date(), 'HH:mm');
    var $hora = $hora_actual.replace(':', '-');

    $isport = myService.get();
    console.log ("isport=" + $isport);
    if ($isport === undefined) {
      var $query = 'http://quedadas.magentadesigncorporation.com/quedadas/getActiveQdd/iduser/' + $iduser + '/fecha_actual/' + $fecha_actual + '/hora/' + $hora + '/format/json?callback=JSON_CALLBACK';
      
    } else {
      $idsport = $isport.idsport;
      console.log ("idsport=" + $idsport);
      if ($idsport === undefined || $idsport === null) {
        var $query = 'http://quedadas.magentadesigncorporation.com/quedadas/getActiveQdd/iduser/' + $iduser + '/fecha_actual/' + $fecha_actual + '/hora/' + $hora + '/format/json?callback=JSON_CALLBACK';
      } else {
        var $query = 'http://quedadas.magentadesigncorporation.com/quedadas/getActiveQddbySport/iduser/' + $iduser + '/idsport/' + $isport.idsport + '/fecha_actual/' + $fecha_actual + '/hora/' + $hora + '/format/json?callback=JSON_CALLBACK';
      }
      
    }

    $http.jsonp($query)
    .success(function(res){
      defer.resolve(res)
    })
    .error(function(status, err){
      defer.reject(status)
    })

    return defer.promise;

  }
  
  $scope.init();
}) 



.controller('ActiveQddCtrlforUser', function($ionicLoading,$scope,$filter,$state,$http, $q, myService, $localstorage) {
  $scope.test=function($activeqddfu){
   // alert('Click me' + $activeqddfu.name);
     $scope.activeqdds = $activeqddfu;
     myService.set($scope.activeqdds);
    $state.go('app.qdd');
  }
  $scope.init = function(){
    $ionicLoading.show({
      template: 'Loading data...'
    });
    $scope.getActiveQddforUser()
    .then(function(res){
      //Success
      console.log('ActiveQddsforUser: ', res)
      $scope.activeqddsforuser = res.result;
      myService.set($scope.activeqddsforuser);
      $ionicLoading.hide();
      
      
    }, function(status){
      //Err
      $scope.pageError = status;
    })
  }
  $scope.getActiveQddforUser = function(){
    var post = $localstorage.getObject('user');
    var $iduser = post.id;
    var defer = $q.defer();
    var $fecha_actual = $filter('date')(new Date(), 'yyyy-MM-dd');
    var $hora_actual = $filter('date')(new Date(), 'HH:mm');
    var $hora = $hora_actual.replace(':', '-');

    //Si viene del listado de deportes, que haga la query filtrada
    $isport = myService.get();

    console.log ("isport=" + $isport);
    if ($isport === undefined) {
        var $query = 'http://quedadas.magentadesigncorporation.com/quedadas/getActiveQddforUser/iduser/' + $iduser + '/fecha_actual/' + $fecha_actual + '/hora/' + $hora + '/format/json?callback=JSON_CALLBACK';
       
    } else {
      $idsport = $isport.idsport;
      console.log ("idsport=" + $idsport);
      if ($idsport === undefined || $idsport === null) {
        var $query = 'http://quedadas.magentadesigncorporation.com/quedadas/getActiveQddforUser/iduser/' + $iduser + '/fecha_actual/' + $fecha_actual + '/hora/' + $hora + '/format/json?callback=JSON_CALLBACK';
      } else {
        var $query = 'http://quedadas.magentadesigncorporation.com/quedadas/getActiveQddforUser/iduser/' + $iduser + '/idsport/' + $isport.idsport + '/fecha_actual/' + $fecha_actual + '/hora/' + $hora + '/format/json?callback=JSON_CALLBACK';
      }
    }

    $http.jsonp($query)
    .success(function(res){
      defer.resolve(res)
    })
    .error(function(status, err){
      defer.reject(status)
    })

    return defer.promise;

  }

  $scope.init();
  $scope.getdd = function($activeqdd){
    $scope.activeqdds = $activeqdd;
     myService.set($scope.activeqdds);
    $state.go('app.qdd');
  }
}) 

.controller('UsersQddCtrl', function($scope, $filter, $state, $http, $q,myService, Quedada, $localstorage) {
 
  $scope.showAlertBad = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Añadir usuario',
     template: 'Se ha producido un error'
   });
   alertPopup.then(function(res) {
     console.log('Error añadiendo usuario a la quedada');
   });
 };

  $scope.init = function(){
    $scope.getUsersQdd()
    .then(function(res){
      //Success
      console.log('UsersQddCtrl: ', res);
      $scope.usersinvited = res.result;
      
      
      
    }, function(status){
      //Err
      $scope.pageError = status;
    })
  }
  $scope.getUsersQdd = function(){
    var defer = $q.defer();
    var $qddsel = myService.get();
    console.log('myserviceqdd: ', $qddsel);
    $http.jsonp('http://quedadas.magentadesigncorporation.com/quedadas/getUsersQdd/idquedada/' + $qddsel.idquedada + '/format/json?callback=JSON_CALLBACK')
    .success(function(res){
      defer.resolve(res)
    })
    .error(function(status, err){
      defer.reject(status)
    })

    return defer.promise;

  }

  $scope.init();

  $scope.adduser = function(qdd){
    var post = $localstorage.getObject('user');
    console.log(post);
    var $iduser = post.id;
    $scope.qdduser = {};
    var date_create = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    
    $scope.qdduser.iduser = $iduser;
    $scope.qdduser.idquedada = $scope.qdd.idquedada;
    $scope.qdduser.status = 1; //Confirmado ya que es el propio usuario quien quiere
    $scope.qdduser.date_created = date_create;
    $scope.qdduser.users_left = +$scope.qdd.users_left + 1;

    var create = Quedada.adduserto($scope.qdduser);
    
    create.success(function(resp){
        $scope.qdd.users_left = $scope.qdduser.users_left;
        myService.set($scope.qdd);
        $state.go('app.qdd');
      
    });

    create.error(function(data,status,headers,config) {
      $scope.showAlertBad();
    });
   

  }
}) 

.controller('SportsCtrl', function($ionicHistory,$scope, $state, myService,Quedada,$filter,$ionicPopup,$http,$timeout,$localstorage) {

  
  $scope.qdd = {};

  $scope.sports = [
    { sport: 'Futbol', idsport: 1, picture: 'futbol.png' },
    { sport: 'Futbol 7', idsport: 2, picture: 'futbol7.png' },
    { sport: 'Series', idsport: 3, picture: 'series.png' },
    { sport: 'Running', idsport: 4 , picture: 'running.png'},
    { sport: 'Padel', idsport: 5 , picture: 'padel.png'},
    { sport: 'Baloncesto', idsport: 6, picture: 'basketball.png' },
    { sport: 'MountainBike', idsport: 7, picture: 'mountainbike.png' },
    { sport: 'Gimnasio', idsport: 8, picture: 'gimnasio.png' }
  ];
  $scope.qdd.selectedSport = $scope.sports[0];
  $scope.qdd.maxusers = 0;
  $scope.qdd.fechaactual =  new Date();
 
  $scope.listar = function(id) {
    var $idsport = {};
    $idsport.idsport = id;
    myService.set($idsport);
    $state.go('app.browse');
  }

 $scope.showAlertBad = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Nueva Quedada',
     template: 'Se ha producido un error'
   });
   alertPopup.then(function(res) {
     console.log('Error creando la quedada');
   });
 };

  //Create new qdd:
  $scope.CreateQdd = function (qdd){
    var date_create = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');
    var post = $localstorage.getObject('user');
    console.log(post);
    var $iduser = post.id;
    $scope.qdd.iduser = $iduser;
    $scope.qdd.date_created = date_create;
    $scope.qdd.descripcion = "none";
    $scope.qdd.idsport = $scope.qdd.selectedSport.idsport;
    $scope.qdd.users_left = 1;

    console.log('Qdd: ', $scope.qdd);

    //Post to CRUD
    //var create = $http.post('http://quedadas.magentadesigncorporation.com/quedadas/quedada.json',$scope.qdd);
    
    var create = Quedada.create($scope.qdd);
    
    create.success(function(resp){
        $scope.qdd.idqdd = resp.result;
        myService.set($scope.qdd);
        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $state.go('app.addplayer');
      
    });

    create.error(function(data,status,headers,config) {
      $scope.showAlertBad();
    });
   };

   
  
})

.controller('QddCtrl', function($scope, $state, $stateParams, myService, $localstorage) {
  $scope.qdd= myService.get();
  $scope.loggeduser = $localstorage.getObject('user');
  console.log('Players to Qdd: ', $scope.qdd);
  
})

.controller('SportCtrl', function($scope, $state, $stateParams, myService, $ionicHistory) {
  $scope.qdd= myService.get();
  console.log('Players to Qdd: ', $scope.qdd);
  $scope.EndQdd = function(){
      console.log('Quedada creada');
      $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
      $state.go('app.browse');
   }
})

.controller('ShareController', function($scope, $cordovaSocialSharing) {
 
    $scope.shareAnywhere = function() {
        $cordovaSocialSharing.share('Quedada', 'Subject', null, 'He organizado una quedada. Descargate la app y podrás verla y apuntarte! Es gratis!');
    }
 
    $scope.shareViaTwitter = function(message, image, link) {
        $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function(result) {
            $cordovaSocialSharing.shareViaTwitter(message, image, link);
        }, function(error) {
            alert("Cannot share on Twitter");
        });
    }
 
})

.controller('FriendCtrl', function($scope, $state,$filter,$http,$q, User, myService) {
  
  $scope.init = function(){
    $scope.getFriends()
    .then(function(res){
      //Success
      console.log('Friends: ', res);
      $scope.friends = res.result;
      
      
      
    }, function(status){
      //Err
      $scope.pageError = status;
    })
  }
  $scope.getFriends = function(){
    var defer = $q.defer();
    $iduser=1;
    
    $http.jsonp('http://quedadas.magentadesigncorporation.com/quedadas/getfriends/iduser/' + $iduser + '/format/json?callback=JSON_CALLBACK')
    .success(function(res){
      defer.resolve(res)
    })
    .error(function(status, err){
      defer.reject(status)
    })

    return defer.promise;

  }

  $scope.init();
})

.factory('myService', function() {
   var savedData = {}
   function set(data) {
     savedData = data;
   }
   function get() {
    return savedData;
   }

   return {
    set: set,
    get: get
   }

});
