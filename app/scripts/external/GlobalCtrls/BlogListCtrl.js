/**
 * Created with JetBrains WebStorm.
 * User: Ray Garner
 * Date: 13/02/08
 * Time: 0:45
 * To \ this template use File | Settings | File Templates.
 */
angular.module('Plugin.Controller.BlogEntries', ['updateService', 'blogService', 'Scope.onReady'])
    .controller('ContentCtrl', function ($scope, show, Blog, BlogsService, $q, $routeParams, UpdateService,$location) {
        $scope.entries = [];
        $scope.$prepareForReady();
        $scope.type = "";
        $scope.pets = false;
        $scope.groups = false;
        $scope.filtersubgroup = $scope.subgroup;
        $scope.spinner = true;
        if("/pets" == $location.path()){
            $scope.type = "pet";
            $scope.pets = true;
            $scope.groups = false;
            console.log("We are in pets");
        }else if("/groups" == $location.path()){
            $scope.type = "group";
            $scope.pets = false;
            $scope.groups = true;
        }else{
            $scope.type = "angel";
            $scope.pets = false;
            $scope.groups = false;
        }
        //check if user wants to see blogs by categories or not
        if ($routeParams.name) {
            UpdateService.checkIfUpdate(function (result) {
                if (result) {
                    //get all the blogs from server:ie this is first init
                    BlogsService.getBlogs(function (blogs) {
                        $scope.entries = blogs;
                        $scope.spinner = false;
                        //**********how to encapsulate in angular??************//
                        $scope.fiterTag = $routeParams.name;
                        //$scope.entries = BlogsService.getAllBlogs();
                        $scope.$onReady("filter");
                        //**********how to encapsulate in angular??************//
                        chopBlogText();
                    });
                } else {
                    //if we dont have any updates just show from cache
                    //**********how to encapsulate in angular??************//
                    BlogsService.getAllBlogs(function (blogs) {
                        $scope.entries = blogs;
                        $scope.fiterTag = $routeParams.name;
                        $scope.$onReady("filter");
                        $scope.spinner = false;
                        chopBlogText();
                    });
                    //**********how to encapsulate in angular??************//
                }
            })

        } else {
            show.state = false;
            $scope.show = show;
                $scope.getEntries = function () {
                    BlogsService.getAllBlogs(function (blogs) {
                        $scope.entries = blogs;
                        $scope.categories = BlogsService.getCategories();
                        $scope.$onReady("success");
                        chopBlogText();
                        $scope.spinner = false;
                    });
                }



            $scope.getBackImg = function (_id) {
                angular.forEach($scope.entries, function (value, key) {
                    if (value._id == _id) {
                        return value.titleImage;
                    }
                })
            }
        }
        //conv method
         function chopBlogText(){
             for(var i = 0;i<$scope.entries.length;i++){
                 $scope.entries[i].text = chopText($scope.entries[i].text,100);
             }
         }

        function chopText(txt,no){return txt == undefined ? null : txt.substring(0,no);}
        $scope.busy = false;
        $scope.skip = 0;
        $scope.limit = 8;
        //get Some entries as soon as we load the page
        //get the entries as we scroll down the page
        $scope.nextPage = function(){
            $scope.getSomeEntries();
        }

        $scope.getSomeEntries = function () {
            if($scope.busy)return;
            $scope.busy = true;
            $scope.spinner = true;
            BlogsService.paginatedBlogs($scope.skip,$scope.limit,function(blogs){
                $scope.spinner = false;
                for(var i = 0;i<blogs.length;i++){
                    console.log("getting groups and looping")

//                        if(blogs[i].group == false || blogs[i].group == undefined){
                    if("/pets" == $location.path() && blogs[i].pet == true){
                        $scope.entries.push(blogs[i]);
                    }else if("/groups" == $location.path() && blogs[i].group == true){
                        $scope.entries.push(blogs[i]);
                    }else if($location.path() == "/" && blogs[i].group != true && blogs[i].pet != true){
                        $scope.entries.push(blogs[i]);
                    }

                }
                $scope.skip += $scope.limit;
                $scope.busy = false;
            })
        }
        $scope.getSomeEntries();

    });