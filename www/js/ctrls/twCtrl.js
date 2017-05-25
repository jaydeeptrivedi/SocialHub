/**
 * Created by Jd on 29-Sep-15.
 */

function twitterCtrl($rootScope,$scope,$state,$http,apiService,$cordovaOauth,$localStorage,$ionicTabsDelegate,$cordovaOauthUtility){

    //$scope.accesstoken="";
    $scope.profile="Twitter";

    var timestamp = Number(new Date());

    loadProfileData();

    $scope.twitterLogin = function() {
        $cordovaOauth.twitter("twitter-consumer-key", "twitter-consumer-secret-key").then(function (result) {
            debugger;
            $scope.data = result;
            $localStorage.twitter_oauth_token = result.oauth_token;
            $localStorage.twitter_user_id = result.user_id;
            $localStorage.twitter_oauth_token_secret = result.oauth_token_secret;
            $localStorage.twitter_screen_name=result.screen_name;
            //$localStorage.stored_token = JSON.stringify(result);
            //$state.go('app.twitter');

            loadProfileData();

        }, function (error) {
           // $ionicLoading.hide();
            alert(JSON.stringify(error));
        });
    }

    function loadProfileData() {
        //$ionicLoading.show({
        //    content: 'Loading',
        //    animation: 'fade-in',
        //    showBackdrop: true,
        //    maxWidth: 200,
        //    showDelay: 0
        //});

        var nonce = randString(32);
        var unixtime = Math.round (new Date().getTime() / 1000).toString();

        function createTwitterSignature(method, url) {
            var token = angular.fromJson(getStoredToken());
            var oauthObject = {
                oauth_consumer_key: "consumer-key",
                oauth_nonce: nonce,
                oauth_signature_method: "HMAC-SHA1",
                oauth_token: $localStorage.twitter_oauth_token,
                oauth_timestamp: unixtime,
                oauth_version: "1.0"
            };
            var signatureObj = $cordovaOauthUtility.createSignature(method, url, oauthObject, {}, clientSecret, token.oauth_token_secret);
            $http.defaults.headers.common.Authorization = signatureObj.authorization_header;
        }

        //if ($localStorage.hasOwnProperty("igAccessToken") === true) {  //Create Signature Base String using formula


        //Create Signature, With consumer Secret key we sign the signature base string
        var signature = sha1("consumer-secret-key", baseSign);


            $http.get("https://api.twitter.com/1.1/statuses/user_timeline.json", {
                params: {
                    count:2,
                    screen_name:$localStorage.twitter_screen_name,
                    oauth_consumer_key:"l3SQx67Dzk5lvPDIgNm8i7LO2",
                    oauth_nonce:nonce,
                    oauth_signature:signature,
                    oauth_signature_method:"HMAC-SHA1",
                    oauth_timestamp:unixtime,
                    oauth_token:$localStorage.twitter_oauth_token,
                    oauth_version:"1.0"
                }
            }).then(function (result) {
                debugger;
                var profile = {
                    data: result.data.data
                };
                $scope.profile = profile;
                debugger;

            }, function (error) {
               // $ionicLoading.hide();
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
       // }

    }

    function randString(x){
        var s = "";
        while(s.length<x&&x>0){
            var r = Math.random();
            s+= (r<0.1?Math.floor(r*100):String.fromCharCode(Math.floor(r*26) + (r>0.5?97:65)));
        }
        return s;
    }

}
