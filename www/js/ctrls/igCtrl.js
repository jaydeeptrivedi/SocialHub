/**
 * Created by Jd on 28-Sep-15.
 */

function instagramCtrl($rootScope,$scope,apiService,$localStorage,$cordovaOauth,$location,$http,$ionicLoading,$ionicTabsDelegate){

    var instagramOAuthUrl="https://instagram.com/oauth/authorize/?client_id=instagram-client-id&redirect_uri=http://localhost/callback&response_type=token";
    //$http({method: "post", url: "https://api.instagram.com/v1/tags/coffee/media/recent?access_token="+requestToken})
    $scope.accesstoken="";
    $scope.profile="Instagram";

    loadProfileData();
    $scope.login = function() {
        $cordovaOauth.instagram("instagram-client-token", ["basic+likes+comments"]).then(function(result) {
            $localStorage.igAccessToken = result.access_token;
            $scope.accesstoken=result.access_token;
            console.log(result);
            //$location.path("/profile");
            loadProfileData();

        }, function(error) {
            $ionicLoading.hide();
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        });
    };

    //https://api.instagram.com/v1/users/self/?access_token=318311798.4fe70d8.33696c60b3794c05a6288847b0b4b571 basic info
    //https://api.instagram.com/v1/users/self/media/recent?access_token=318311798.4fe70d8.33696c60b3794c05a6288847b0b4b571 recent post
    function loadProfileData() {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        // alert($localStorage.accessToken);
        if ($localStorage.hasOwnProperty("igAccessToken") === true) {
            $http.get("https://api.instagram.com/v1/users/self/?access_token="+$localStorage.igAccessToken).then(function (result) {
                var profile={
                    data: result.data.data
                };
                $scope.profile = profile;
                debugger;

            }, function (error) {
                $ionicLoading.hide();
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
            $http.get("https://api.instagram.com/v1/users/self/media/recent?access_token="+$localStorage.igAccessToken).then(function (result) {
                var uploads={
                    data: result.data.data
                };

                getNextBatch(result.data.pagination.next_url);
                function getNextBatch(url) {
                        debugger;
                        $http.get(url).then(function (r) {
                            debugger;
                            uploads.data=uploads.data.concat(r.data.data);
                            if (r.data.pagination.next_url) {getNextBatch(r.data.pagination.next_url);}
                            else{init();}
                        });
                }



                function init() {

                    var mostLikedUploadCount=0;
                    var mostCommentedUploadCount=0;
                    var mostLikedUpload=uploads.data[0];
                    var mostCommentedUpload=uploads.data[0],tags=[],mostUsedTags='';

                    for(var i=0;i<uploads.data.length;i++) {
                        if (uploads.data[i].likes.count>=mostLikedUploadCount) {
                            mostLikedUploadCount=uploads.data[i].likes.count;
                            mostLikedUpload = uploads.data[i];
                        }
                        if (uploads.data[i].comments.count>=mostCommentedUploadCount) {
                            mostCommentedUploadCount=uploads.data[i].comments.count;
                            mostCommentedUpload = uploads.data[i];
                        }
                        tags=tags.concat(uploads.data[i].tags);
                    }

                    mostUsedTags=mode(tags);
                    function mode(arr){
                        return arr.sort(function(a,b){
                            return arr.filter(function(v){ return v===a }).length
                                - arr.filter(function(v){ return v===b }).length
                        }).pop();
                    }

                    $ionicLoading.hide();
                    $scope.uploads = uploads;
                    $scope.uploads.mostLikedUpload = mostLikedUpload;
                    $scope.uploads.mostCommentedUpload = mostCommentedUpload;
                    $scope.uploads.mostUsedTags=mostUsedTags;
                }

                debugger;

            }, function (error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        } else {
            alert("Not signed in");
        //    $location.path("/login");
        }
    }



}
