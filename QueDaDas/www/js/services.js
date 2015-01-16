angular.module('quedadas.services', [])
.factory('Quedada', ['$http',function($http) {
    return {
    	create:function(data){
            return $http.post('http://quedadas.magentadesigncorporation.com/quedadas/quedada.json',data,{
                headers:{
                    'Content-Type':'application/json'
                }
            });
        },
        adduserto:function(data){
            return $http.post('http://quedadas.magentadesigncorporation.com/quedadas/quedadauser.json',data,{
                headers:{
                    'Content-Type':'application/json'
                }
            });
        },
        userlogin:function(data){
            return $http.post('http://quedadas.magentadesigncorporation.com/quedadas/userlogin.json',data,{
                headers:{
                    'Content-Type':'application/json'
                }
            });
        }
    }
}])

.factory('User', ['$http',function($http) {
    return {
        getfriends:function(data){
            return $http.get('http://quedadas.magentadesigncorporation.com/quedadas/listfriends/:id',data,{
                headers:{
                    'Content-Type':'application/json'
                }
            });
        },
        createuser:function(data){
            return $http.post('http://quedadas.magentadesigncorporation.com/quedadas/createuser.json',data,{
                headers:{
                    'Content-Type':'application/json'
                }
            });
        }
    }
}])


.value('PARSE_CREDENTIALS',{
    APP_ID: 'V0xnMvV7KwHrqmSc5MBeXuFRCYltZvpM9h2peCIV',
    REST_API_KEY:'qGmOHoKggNXPszSsHSZwu4Ctgg7Rj6cGO95Ry496'
})

.factory("Service", function () {
  var user = {};
  function getUser() {
    return user;
  }
  function setUser(newUser) {
    user = newUser;
  }
  return {
    getUser: getUser,
    setUser: setUser,
  }
})


.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);



