/**
 * Created by Jd on 29-Sep-15.
 */

function facebookCtrl($rootScope,$scope,apiService,$localStorage,$cordovaOauth,$location,$http,$ionicLoading,$ionicTabsDelegate){

    change();
    $scope.login = function() {
        $cordovaOauth.facebook("fb-app-token", ["email","user_birthday","user_status","user_education_history","user_photos", "user_website", "user_location", "user_relationships","user_posts"]).then(function(result) {
            $localStorage.accessToken = result.access_token;
            //$location.path("/profile");
            change();
        }, function(error) {
            $ionicLoading.hide();
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        })
    };


    function change() {
        // alert($localStorage.accessToken);
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        if ($localStorage.hasOwnProperty("accessToken") === true) {

            $http.get("https://graph.facebook.com/v2.4/me", {
                params: {
                    access_token: $localStorage.accessToken,
                    fields: "id,name,gender,location,website,picture,relationship_status,birthday,bio",
                    format: "json"
                }
            }).then(function (result) {
                $scope.profileData = result.data;
                initFbAnalytics();
            }, function (error) {
                $ionicLoading.hide();
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });

            function initFbAnalytics() {
                $http.get("https://graph.facebook.com/me/albums", {
                    params: {
                        access_token: $localStorage.accessToken,
                        limit: 100
                    }
                }).then(function (result) {
                    $scope.profileData.albums = result.data;

                    for (var i = 0; i < $scope.profileData.albums.data.length; i++) {
                        if ($scope.profileData.albums.data[i].name == "Profile Pictures")
                            $scope.profilePicAlbumId = $scope.profileData.albums.data[i].id;
                        if ($scope.profileData.albums.data[i].name == "Cover Photos")
                            $scope.coverPicAlbumId = $scope.profileData.albums.data[i].id;
                    }

                    var totalLikes = 0, totalComments = 0, mostLikedProfilePic = {}, mostCommentedProfilePic = {};
                    $http.get("https://graph.facebook.com/" + $scope.profilePicAlbumId + "/photos", {
                        params: {
                            access_token: $localStorage.accessToken,
                            fields: "id,images,likes.summary(true),comments.summary(true)",
                            limit: 1000
                        }
                    }).then(function (result)
                    {
                        for (var j = 0; j < result.data.data.length; j++) {

                            if (result.data.data[j].likes && result.data.data[j].likes.summary.total_count >= totalLikes) {
                                totalLikes = result.data.data[j].likes.summary.total_count;
                                mostLikedProfilePic = result.data.data[j];//.images[0].source;
                            }
                            if (result.data.data[j].comments && result.data.data[j].comments.summary.total_count >= totalComments) {
                                totalComments = result.data.data[j].comments.summary.total_count;
                                mostCommentedProfilePic = result.data.data[j];//.images[0].source;
                            }
                        }

                        $scope.profileData.mostLikedProfilePic = mostLikedProfilePic;
                        $scope.profileData.mostCommentedProfilePic = mostCommentedProfilePic;
                        //$ionicLoading.hide();

                    }, function (error) {
                        $ionicLoading.hide();
                        alert("There was a problem getting your profile.  Check the logs for details.");
                        console.log(error);
                    });

                    var totalLikesCoverPic = 0, totalCommentsCoverPic = 0, mostLikedCoverPic = {}, mostCommentedCoverPic = {};
                    $http.get("https://graph.facebook.com/" + $scope.coverPicAlbumId + "/photos", {
                        params: {
                            access_token: $localStorage.accessToken,
                            fields: "id,images,likes.summary(true),comments.summary(true)",
                            limit: 1000
                        }
                    }).then(function (result)
                    {

                        for (var j = 0; j < result.data.data.length; j++) {

                            if (result.data.data[j].likes && result.data.data[j].likes.summary.total_count >= totalLikesCoverPic) {
                                totalLikesCoverPic = result.data.data[j].likes.summary.total_count;
                                mostLikedCoverPic = result.data.data[j];//.images[0].source;
                            }
                            if (result.data.data[j].comments && result.data.data[j].comments.summary.total_count >= totalCommentsCoverPic) {
                                totalCommentsCoverPic = result.data.data[j].comments.summary.total_count;
                                mostCommentedCoverPic = result.data.data[j];//.images[0].source;
                            }
                        }

                        $scope.profileData.mostLikedCoverPic = mostLikedCoverPic;
                        $scope.profileData.mostCommentedCoverPic = mostCommentedCoverPic;
                        //$ionicLoading.hide();

                    }, function (error) {
                        $ionicLoading.hide();
                        alert("There was a problem getting your profile.  Check the logs for details.");
                        console.log(error);
                    });

                    var totalLikesStatus = 0, totalCommentsStatus = 0, mostLikedStatus = {}, mostCommentedStatus = {};
                    $http.get("https://graph.facebook.com/v2.4/me/posts", {
                        params: {
                            access_token: $localStorage.accessToken,
                            fields: "id,story,message,likes.summary(true),comments.summary(true),created_time",
                            filter: "app_2915120374",
                            limit: 1000
                        }
                    }).then(function (result)
                    {
                        var posts={
                            data:result.data.data
                        }

                        getNextBatch(result.data.paging.next);
                        function getNextBatch(url) {
                            $http.get(url).then(function (r) {
                                posts.data=posts.data.concat(r.data.data);
                                if (r.data.paging) {getNextBatch(r.data.paging.next);}
                                else{init();}
                            });
                        }

                    function init() {
                        debugger;

                        for (var j = 0; j < posts.data.length; j++) {
                            if(posts.data[j].message && !posts.data[j].story) {
                                if (posts.data[j].likes && posts.data[j].likes.summary.total_count >= totalLikesStatus) {
                                    totalLikesStatus = posts.data[j].likes.summary.total_count;
                                    mostLikedStatus = posts.data[j];//.images[0].source;
                                }
                                if (posts.data[j].comments && posts.data[j].comments.summary.total_count >= totalCommentsStatus) {
                                    totalCommentsStatus = posts.data[j].comments.summary.total_count;
                                    mostCommentedStatus = posts.data[j];//.images[0].source;
                                }
                            }
                        }

                        debugger;
                        $scope.profileData.mostLikedStatus = mostLikedStatus;
                        var tempDate1= new Date($scope.profileData.mostLikedStatus.created_time);
                        $scope.profileData.mostLikedStatus.created_time= tempDate1.toLocaleString();
                        $scope.profileData.mostCommentedStatus = mostCommentedStatus;
                        var tempDate2= new Date($scope.profileData.mostCommentedStatus.created_time);
                        $scope.profileData.mostCommentedStatus.created_time= tempDate2.toLocaleString();
                        $ionicLoading.hide();
                    }


                    }, function (error) {
                        $ionicLoading.hide();
                        alert("There was a problem getting your profile.  Check the logs for details.");
                        console.log(error);
                    });



                }, function (error) {
                    $ionicLoading.hide();
                    alert("There was a problem getting your profile.  Check the logs for details.");
                    console.log(error);
                });
            }
            //https://graph.facebook.com/me/albums?$accessToken&limit=0
        } else {
            alert("Not signed in");
           // $location.path("/login");
        }
    }

}
