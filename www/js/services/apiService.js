/**
 * Created by Jd on 28-Sep-15.
 */

function apiService($http) {
    var URLs = {
        //login: API_URL + 'Account/Login/',
        //logout: API_URL + 'Account/Logout/',
        facebookUrl: "",
        instagramUrl: ""
    };
    var apiService = {};
    //apiService.login = function (data) {
    //    return $http.post(URLs.login, data);
    //};

    apiService.getFacebookData = function (params) {
        return $http.get(URLs.facebookUrl, { params: params });
    };
    apiService.getInstagramData = function (params) {
        return $http.get(URLs.instagramUrl, { params: params });
    };

    return apiService;
}
