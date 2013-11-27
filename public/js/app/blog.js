var app = angular.module('blogApp', [
        'twitterService', 'userService', 'http-auth-interceptor', 'login', 'socketio', 'updateService',
        'Scope.onReady', 'blogResource', 'loaderModule', 'Plugin.Controller.Title', 'Plugin.Controller.BlogEntries', 'Plugin.Controller.GroupEntries',
        'blogFilter', 'blogService', 'infinite-scroll', 'dropzone', 'apiResource', 'ui.bootstrap','ngAnimate','ngRoute','adaptive.detection','MusicPlayer.Controller','controller.GiftShop'
    ]).
    config(function ($routeProvider) {
        $routeProvider.
            when("/", {templateUrl: "partials/blog.html"}).
            when("/groups", {templateUrl: "partials/groups.html"}).
            when("/about", {templateUrl: "partials/about.html"}).
            when("/projects", {templateUrl: "partials/projects.html"}).
            when("/shoutouts", {templateUrl: "partials/shoutouts.html"}).
            when("/AddBlogEntry", {templateUrl: "partials/admin/createBlogEntry.html"}).
            //when("/blog/:id", {templateUrl: "partials/blogEntry.html"}).
            when("/angel/:id", {templateUrl: "partials/blogEntry.html"}).
            //when("/petangel/:id", {templateUrl: "partials/blogEntry.html"}).
            when("/StartGroup", {templateUrl: "partials/admin/createGroup.html"}).
            when("/group/:id", {templateUrl: "partials/groupHome.html"}).
            when("/groupPreview/:id", {templateUrl: "partials/groupHomePublic.html"}).
            when("/public/:id", {templateUrl: "partials/publicAngelProfile.html"}).
            when("/petpublic/:id", {templateUrl: "partials/publicAngelProfile.html"}).
            when("/listByTag/:name", {templateUrl: "partials/blog.html"}).
            when("/petitions", {templateUrl: "partials/petitions.html"}).
            when("/petition/:title", {templateUrl: "partials/petition.html"}).
            when("/editpetition/:id", {templateUrl: "partials/editpetitions.html"}).
            when("/registration", {templateUrl: "partials/registration.html"}).
            when("/profile/:username", {templateUrl: "partials/userprofile.html"}).
            when("/AddBlogEntry/uploadportrait/:id", {templateUrl: "partials/admin/addportrait.html"}).
            when("/AddBlogEntry/uploadspread/:id", {templateUrl: "partials/admin/addspread.html"}).
            when("/inviteblock/:wall", {templateUrl: "partials/inviteblock.html"}).
            when("/findenewmembers/:wall",{templateUrl: "partials/findnewmembers.html"}).
            when("/deletewall/:wall", {templateUrl: "partials/deletewall.html"}).
            when("/rules", {templateUrl: "partials/rules.html"}).
            when("/addworkshop", {templateUrl: "partials/addWorkshop.html"}).
            when("/editworkshop", {templateUrl: "partials/editWorkshop.html"}).
            when("/deleteworkshop", {templateUrl: "partials/deleteWorkshop.html"}).
            when("/workshops", {templateUrl: "partials/workshops.html"}).
            when("/pets", {templateUrl: "partials/blog.html"}).
            when("/editwall/:wall", {templateUrl: "partials/editwall.html"}).
            when("/passwordrecovery", {templateUrl: "partials/forgotpassword.html"}).
            when("/updatepass", {templateUrl: "partials/updatepass.html"}).
            when("/editprofile", {templateUrl: "partials/editprofile.html"}).
            when("/login", {templateUrl: "partials/login.html"}).
            when("/gifts/:user/:wall", {templateUrl: "partials/giftShop.html"}).
            otherwise("/oops",{templateUrl:"404.html"});

    });
app.directive('fdatepicker', function () {
    return{
        link: function (scopee, ele, attr) {
            ele.fdatepicker();
            ele.fdatepicker('hide')
        }
    }
})
app.directive('closeparent', function () {
    return {
        link: function (scope, ele, attr) {
            ele.click(function () {
                ele.parent().slideUp();
            });
        }
    }
});

app.directive('becomeMainContent', function () {
    return {
        link: function (scope, ele) {

            scope.$whenReady(
                function () { //called when $scope.$onReady() is run
                    ele.removeClass("nine");
                    ele.addClass("twelve");
                },
                function (someArgs) { //called when $scope.$onFailure() is run

                }
            );

        }
    }
});

app.directive('reflow', function () {
    return{
        link: function (scope, ele) {
            console.log("reflowing a " + ele);
            ele.foundation('section', 'reflow');
        }
    }
})


app.directive('nivogallery', function () {
    return{
        link: function (scope, elm, attrs) {
            elm.nivoGallery();
        }
    }
})


app.directive('fixedMenu', function () {
    return{
        link: function (scope, elm, attrs) {

            $("document").ready(function ($) {

                var nav = elm;
                //var nav = $('.nav-container');

                $(window).scroll(function () {
                    if ($(this).scrollTop() > 136) {
                        nav.addClass("f-nav");
                    } else {
                        nav.removeClass("f-nav");
                    }
                });

            });
        }
    }
})

app.directive('offsetHeight', function () {
    return{
        link: function (scope, elm, attrs) {
            elm.css({marginTop: attrs.offsetHeight + 'px'});
        }
    }
});

app.directive('revealModal', function (DeletePicsFactory) {
    return {
        link: function (scope, elm, attrs) {
            scope.$on('event:auth-loginConfirmed', function (event) {
                console.log("EVENT TRIGGERED" + event);
                if (attrs.revealModal == 'login') {
                    elm.trigger('reveal:close');
                } else {
                }
            });
            scope.$on('event:auth-registered', function () {
                console.log("registered event fired in directive");
                /*
                 if (attrs.revealModal == 'register') {
                 elm.foundation('reveal', 'close');
                 }
                 */

                if (attrs.revealModal == 'login') {
                    scope.message = 'Please fill out your user details';
                    elm.foundation('reveal', 'open');
                }
            });
            scope.$on('event:message-sent', function () {
                console.log("registered event message sent closing modal view");
                if (attrs.revealModal == 'message') {
                    console.log("EVENT TRIGGERED" + event);
                    elm.foundation('reveal', 'close');
                }
            });
            scope.$on('event:forgot-password', function () {
                if (attrs.revealModal == 'login') {
                    elm.foundation('reveal', 'close');
                }
            })
            scope.$on('event:pic-deleted', function () {
                if(attrs.revealModal == 'deletepic'){
                    elm.foundation('reveal','close');
                }
            })
            scope.$on('event:pic-delete-request', function (event,data) {
                if(attrs.revealModal == 'deletepic'){
                    scope.message = data.message;
                    console.log("to users "+data.message)
                    elm.foundation('reveal','open');
                }
            })
            scope.$on('showlogin', function () {
                if(attrs.revealModal == 'login'){
                    elm.foundation('reveal','open');
                }
            })
        }
    }
});

app.directive('ifAuthed', function ($http) {
    return {
        //TODO:autoscroll being called to early in the link process????
        link: function (scope, elm, attrs) {
            $http.get('/checkauthed').then(function (data) {
                scope.username = data.data;
                if (attrs.ifAuthed == 'show') {
                    elm.show();
                } else {
                    elm.hide();
                }
            });
            scope.$on('event:auth-loginConfirmed', function (event) {
                if (attrs.ifAuthed == 'show') {
                    elm.show();
                } else {
                    elm.hide();
                }
            });
            scope.$on('event:auth-loggedOut', function (event) {
                if (attrs.ifAuthed == 'show') {
                    elm.hide();
                } else {
                    elm.show();
                }
            });
            scope.$on('event:auth-loginRequired', function () {

                if (attrs.ifAuthed == 'show') {
                    elm.hide();
                } else {
                    elm.show();
                }
            });


        }
    }
});

app.directive('autoscroll', function () {
    return{
        link: function (scope, elm, attrs) {
            //no reason for this to be in a directive
            angular.element(document).ready(function () {

                $('body').autoscroll(
                    {
                        direction: "left",
                        step: 50,
                        scroll: true,
                        //problems with this
                        pauseOnHover: true
                    }
                );

                /*
                 elm.animate({
                 opacity: 0.25,
                 left: '+=50'
                 //height: 'toggle'
                 }, 5000, function() {
                 // Animation complete.
                 console.log("animation complete");
                 });
                 */
            })

        }
    }
})

app.directive('dropzone', function (dropzone, $rootScope) {
    return{
        // scope:{},
        restrict: 'E',
        link: function (scope, elm, attrs) {


            var maxImages;
            scope.images = 0;
            console.log(attrs.autoupload);
            if (attrs.autoupload == undefined) {
                console.log("autoupload == false")
                attrs.autoupload = true;
            }
            var dropzoneOptions = {
                url: attrs.url,

                autoProcessQueue: (attrs.autoupload == "true" ? true : false),
                addRemoveLinks: (attrs.addremovelinks == "true" ? true : false)
            }
            //make a maxsize so can make a dropzone that only accepts
            //a set number of images
            //TODO:TEST ALL THIS STUFF
            dropzone.createDropzone(elm, attrs.url, dropzoneOptions, attrs.id);
            if (attrs.maximages != undefined) {
                //dropzone.setMaxNoImages(parseInt(attrs.maximages,10)+1)
                maxImages = parseInt(attrs.maximages, 10) + 1;

            }
            $rootScope.dropzone = dropzone;

            dropzone.registerEvent('complete', elm, function (file) {
                console.log('complete event start broadcasting')
                $rootScope.$broadcast('uploadedFile', {file: file});
            })
            dropzone.registerEvent("addedfile", elm, function (file) {
                scope.images++;
                if (
                    maxImages != 0 &&
                        maxImages <= scope.images

                    ) {
                    dropzone.removeFile(file);
                } else {
                    dropzone.setFileLoadedInUi(file);

                    $rootScope.$broadcast('addedFile', {file: file});

                }

                //console.log(file);
                /* Maybe display some more file information on your page */
            });
            dropzone.registerEvent('removedFile', elm, function (file) {
                scope.images--;
            })
            dropzone.registerEvent("sending", elm, function (file, xhr, formData) {
                if (scope.$parent.blogId != undefined)
                    formData.append('blogId', scope.$parent.blogId.blogId);
                if (scope.entry != undefined)
                    formData.append("memwall", scope.entry._id);
            });
            scope.$on('uploadit', function (event, data) {
                dropzone.uploadFile(data.file);
            })
        }
    }
})

app.directive('onKeyup', function () {
    return function (scope, elm, attrs) {
        function applyKeyup() {
            scope.$apply(attrs.onKeyup);
        };

        var allowedKeys = scope.$eval(attrs.keys);
        elm.bind('keyup', function (evt) {
            //if no key restriction specified, always fire
            if (!allowedKeys || allowedKeys.length == 0) {
                applyKeyup();
            } else {
                angular.forEach(allowedKeys, function (key) {
                    if (key == evt.which) {
                        applyKeyup();
                    }
                });
            }
        });
    };
});

app.directive("click", function () {
    return function(scope, element, attrs) {
        element.bind("click", function() {
            scope.boolChangeClass = !scope.boolChangeClass;
            scope.$apply();
        });
    };
});

app.factory('show', function () {
    return {state: false};
});

app.factory('categoryService', function () {
    return [
        {name: 'test'}
    ];
});

app.factory('groupsListing', function () {
    return[
        {name: "Mother", code: 0},
        {name: "Father", code: 1},
        {name: "Husband", code: 2},
        {name: "Wife", code: 3},
        {name: "Son", code: 4},
        {name: "Daughter", code: 5},
        {name: "Brother", code: 6},
        {name: "Sister", code: 7},
        {name: "Grandfather", code: 8},
        {name: "Grandmother", code: 9},
        {name: "Grandchild", code: 10},
        {name: "Stepmother", code: 15},
        {name: "Stepfather", code: 16},
        {name: "Stepbrother", code: 17},
        {name: "Stepsister", code: 18},
        {name: "Godfather", code: 11},
        {name: "Godmother", code: 12},
        {name: "Godson", code: 13},
        {name: "Goddaughter", code: 14},
        {name: "Aunt", code: 19},
        {name: "Uncle", code: 20},
        {name: "Cousin", code: 21},
        {name: "Niece", code: 22},
        {name: "Nephew", code: 23},
        {name: "Fiance", code: 24},
        {name: "Boyfriend", code: 25},
        {name: "Girlfriend", code: 26},
        {name: "Mother-in-law", code: 27},
        {name: "Father-in-law", code: 28},
        {name: "Brother-in-law", code: 29},
        {name: "Sister-in-law", code: 30},
        {name: "Partner", code: 31},
        {name: "Friend", code: 32},
        {name: "Colleague", code: 33},
        {name: "Teacher", code: 34},
        {name: "Mentor", code: 35}
    ];
})

app.service('userInfoService', function () {
    var username = "Guest";
    var _id = "";
    return {
        getUsername: function () {
            return username;
        },
        setUsername: function (value, id) {
            username = value;
            _id = id;
        }
    }
});

app.controller('blogViewCtrl', function ($scope, show, categoryService, BlogsService) {
    $scope.categories = BlogsService.getCategories();
    $scope.show = show;


});

app.controller('blogEntryPicCtrl', function ($scope) {
    $scope.test = "TEST RESULT";
});

app.controller('blogEntryCtrl', function ($scope, $location, show, Blog, $routeParams, socket, $rootScope, $http, dropzone, api) {
    $scope.parentObject = {
        routeParamId: $routeParams.id,
        entryId: ""
    }
    $scope.embedVideos = {
        youtube:"",
        animoto:""
    }
    socket.connect();
    $scope.entry = "";
    $scope.viewers = [];
    $scope.entry.comments = [];
    $rootScope.profileMenuViewable = true;
    $scope.textorphoto = false;
    $scope.event;
    $scope.eventdate;
    $scope.eventdesc;
    $scope.flipEntry = function () {

        $scope.textorphoto = !$scope.textorphoto;
        $scope.photobox = !$scope.photobox;
        $scope.videobox = false;
        $scope.eventbox = false;
        switchCheckFromPhotoToVideo();
    }

    $scope.toogleVideoEntry = function () {

        $scope.videobox = !$scope.videobox;
        $scope.photobox = false;
        $scope.eventbox = false;
        switchCheckFromPhotoToVideo();
    }
    $scope.toogleEventEntry = function () {
        console.log("eetest")
        $scope.eventbox = !$scope.eventbox;
        $scope.videobox = false;
        $scope.photobox = false;
        switchCheckFromPhotoToVideo();
    }

    function switchCheckFromPhotoToVideo() {
        console.log($scope.photobox + " " + $scope.videobox + " " + $scope.eventbox);
        if ($scope.photobox || $scope.videobox || $scope.eventbox) {
            $scope.textbox = true;

        } else {
            $scope.textbox = false;
        }
    }


    $scope.submitEvent = function () {
        api.createSubDocResource('Blog', $scope.blogId, 'postText', {
            event: $scope.event,
            date: $scope.eventdate,
            text: $scope.eventdesc,
            postType: 3
        }, function () {
            $http.get('lastestEvents/' + $scope.blogId).
                success(function (data) {
                    console.log(data);
                    $scope.anis = data;
                })
            $scope.event = "";
            $scope.eventdate ="";
            $scope.eventdesc ="";

        })

    }

    $scope.postText = "";
    if (!$scope.template) {
        $scope.template = '/partials/profile/Latest.html';
        $scope.contentHeaderTitle = 'Latest';

    }
    $scope.loadPage = function (page) {
        console.log("loadpage");
        $scope.template = '/partials/profile/' + page.toLowerCase() + '.html';
        $scope.contentHeaderTitle = page;
        console.log($scope.template);

    }


    socket.on('testrec', function (data) {
        console.log(data);
        console.log("rece socket event");
    })

    socket.on('login', function () {
        socket.emit('subscribe', {room: $scope.entry._id});
    });
    socket.on('initialuserlist', function (data) {
        $scope.viewers = data;
    });


    socket.on('commentsupdated', function () {
        console.log("commentsupdated received");
        //TODO: is this sending the right parameters?
        Blog.get({id: $routeParams.id}, function (blog) {
                $scope.entry = blog[0];
                $scope.text = blog[0].text;
                $scope.comments = blog[0].comments;
                $scope.$onReady("commentsupdated");
            },
            function () {
                $scope.$onFailure("failed");
            });
    });
    socket.on('updateusers', function (data) {
        $scope.viewers = data;
    });
    socket.on('removeuser', function (data) {
        var viewers = [];
        angular.copy($scope.viewers, viewers);
        angular.forEach($scope.viewers, function (value, key) {
            if (value.id == data) {
                $scope.viewers.splice(key, 1);
            }
        });
    });
    $scope.submitComment = function () {
        $scope.entry.comments.unshift({body: $scope.body, date: Date.now()});
        $scope.entry.$save(function (blog) {
            $scope.comments = blog.comments;
            $scope.body = "";
            console.log("sentcomment socket event emitted");
            console.log({room: $scope.entry._id});
            socket.emit('sentcomment', {room: $scope.entry._id});
        });
    };
    $scope.submitphotodata = function () {
        console.log("dropzone pq")
        console.log(dropzone.getFilesLoadedInUI());

        $http.post('/submitphotodata', {files: dropzone.getFilesLoadedInUI(), id: $scope.entry._id})
            .success(function (data) {
                console.log(data);
                //TODO:if data is successfully submitted show user message and clear queue and ui
            })
    }
    $scope.cancelphotodata = function () {
        $http.post('/cancelphotodata')
            .success(function () {
                //TODO:if canceled show user message and clear queue and ui
            })
    }
    show.state = true;
    $scope.show = show;
    $scope.$prepareForReady();
    /*
     BlogsService.getBlogFromLocal($routeParams.id,function(blog){

     $scope.entry = blog;
     $scope.text = blog.text;
     $scope.comments = blog.comments;
     $scope.$onReady("success");
     });
     */


    Blog.get({id: $routeParams.id}, function (blog) {
            console.log('got blog');
            console.log(blog[0].limited);
            console.log(blog[0]);
            $scope.entry = blog[0];
            console.log('wall limited? ' + blog[0].limited)
            if (blog[0].limited) {
                $scope.profileMenuViewable = false;
                $location.path("/public/" + $routeParams.id);
            } else {
                $scope.parentObject.entryId = blog[0]._id;
                $scope.text = blog[0].text;
                $scope.comments = blog[0].comments;
                socket.emit('subscribe', {room: blog[0]._id});

                $scope.$onReady("success");
                $location.path("/angel/" + $routeParams.id);
            }

        },
        function () {
            $scope.$onFailure("failed");
        });

    $scope.$on('$routeChangeStart', function (scope, next, current) {
        socket.emit('unsubscribe', {room: $scope.entry._id});
    });
    $scope.$on('$destroy', function () {
        socket.removeListener('enterroom');
        socket.removeAllListeners('initialuserlist');
        socket.removeAllListeners('commentsupdated');
        socket.removeAllListeners('updateusers');
    });

});

app.controller('groupEntryCtrl', function ($scope, $location, show, Blog, $routeParams, socket, $rootScope, $http, dropzone, api) {


    $scope.parentObject = {
        routeParamId: $routeParams.id,
        entryId: ""
    }
    socket.connect();
    $scope.entry = "";
    $scope.viewers = [];
    $scope.entry.comments = [];
    $rootScope.profileMenuViewable = true;
    $scope.textorphoto = false;
    $scope.event;
    $scope.eventdate;
    $scope.eventdesc;
    $scope.flipEntry = function () {

        $scope.textorphoto = !$scope.textorphoto;
        $scope.photobox = !$scope.photobox;
        $scope.videobox = false;
        $scope.eventbox = false;
        switchCheckFromPhotoToVideo();
    }

    $scope.toogleVideoEntry = function () {

        $scope.videobox = !$scope.videobox;
        $scope.photobox = false;
        $scope.eventbox = false;
        switchCheckFromPhotoToVideo();
    }
    $scope.toogleEventEntry = function () {
        console.log("eetest")
        $scope.eventbox = !$scope.eventbox;
        $scope.videobox = false;
        $scope.photobox = false;
        switchCheckFromPhotoToVideo();
    }

    function switchCheckFromPhotoToVideo() {
        console.log($scope.photobox + " " + $scope.videobox + " " + $scope.eventbox);
        if ($scope.photobox || $scope.videobox || $scope.eventbox) {
            $scope.textbox = true;

        } else {
            $scope.textbox = false;
        }
    }

    $scope.submitVideo = function () {
        //TODO:Checkk this
        console.log("submitvideo");
        api.createSubDocResource('Blog', $scope.entry._id, 'postText', {
            embedYouTube: youtube_embed(youtube_parser($scope.embedYouTube)), embedAnimoto: $scope.embedAnimoto, postType: 2
        }, function () {
            console.log("video sent");
            $scope.embedYouTube = "";
            $scope.embedAnimoto = "";
        })
    }
    $scope.submitEvent = function () {
        api.createSubDocResource('Blog', $scope.blogId, 'postText', {
            event: $scope.event,
            date: $scope.eventdate,
            text: $scope.eventdesc,
            postType: 3
        }, function () {
            $http.get('lastestEvents/' + $scope.blogId).
                success(function (data) {
                    console.log(data);
                    $scope.anis = data;
                })
            $scope.$digest();
            $scope.event = "";
            $scope.eventdate ="";
            $scope.eventdesc ="";

        })

    }

    $scope.postText = "";
    if (!$scope.template) {
        $scope.template = '/partials/profile/LatestGroups.html';
        $scope.contentHeaderTitle = 'Latest';

    }
    $scope.loadPage = function (page) {
        console.log("loadpage");
        $scope.template = '/partials/profile/' + page.toLowerCase() + '.html';
        $scope.contentHeaderTitle = page;
        console.log($scope.template);

    }

    $scope.submit = function () {
        console.log("button fired");
        $http.post('/addtextpost', {text: $scope.postText, id: $scope.entry._id}).
            success(function (data, status) {
                console.log(data);
                console.log("emited socket events");
                socket.emit('postText', {room: $scope.entry._id});
                $scope.postText = "";
            }).error(function (err) {
                console.log(err);
            });
    }
    socket.on('testrec', function (data) {
        console.log(data);
        console.log("rece socket event");
    })

    socket.on('login', function () {
        socket.emit('subscribe', {room: $scope.entry._id});
    });
    socket.on('initialuserlist', function (data) {
        $scope.viewers = data;
    });


    socket.on('commentsupdated', function () {
        console.log("commentsupdated received");
        //TODO: is this sending the right parameters?
        Blog.get({id: $routeParams.id}, function (blog) {
                $scope.entry = blog[0];
                $scope.text = blog[0].text;
                $scope.comments = blog[0].comments;
                $scope.$onReady("commentsupdated");
            },
            function () {
                $scope.$onFailure("failed");
            });
    });
    socket.on('updateusers', function (data) {
        $scope.viewers = data;
    });
    socket.on('removeuser', function (data) {
        var viewers = [];
        angular.copy($scope.viewers, viewers);
        angular.forEach($scope.viewers, function (value, key) {
            if (value.id == data) {
                $scope.viewers.splice(key, 1);
            }
        });
    });
    $scope.submitComment = function () {
        $scope.entry.comments.unshift({body: $scope.body, date: Date.now()});
        $scope.entry.$save(function (blog) {
            $scope.comments = blog.comments;
            $scope.body = "";
            console.log("sentcomment socket event emitted");
            console.log({room: $scope.entry._id});
            socket.emit('sentcomment', {room: $scope.entry._id});
        });
    };
    $scope.submitphotodata = function () {
        console.log("dropzone pq")
        console.log(dropzone.getFilesLoadedInUI());

        $http.post('/submitphotodata', {files: dropzone.getFilesLoadedInUI(), id: $scope.entry._id})
            .success(function (data) {
                console.log(data);
                //TODO:if data is successfully submitted show user message and clear queue and ui
            })
    }
    $scope.cancelphotodata = function () {
        $http.post('/cancelphotodata')
            .success(function () {
                //TODO:if canceled show user message and clear queue and ui
            })
    }
    show.state = true;
    $scope.show = show;
    $scope.$prepareForReady();
    /*
     BlogsService.getBlogFromLocal($routeParams.id,function(blog){

     $scope.entry = blog;
     $scope.text = blog.text;
     $scope.comments = blog.comments;
     $scope.$onReady("success");
     });
     */


    Blog.get({id: $routeParams.id}, function (blog) {
            console.log('got blog');
            console.log(blog[0].limited);
            console.log(blog[0]);
            $scope.entry = blog[0];

            if (blog[0].limited) {
                $scope.profileMenuViewable = false;
                $location.path("/public/" + $routeParams.id);
            } else {
                $scope.parentObject.entryId = blog[0]._id;
                $scope.text = blog[0].text;
                $scope.comments = blog[0].comments;
                socket.emit('subscribe', {room: blog[0]._id});

                $scope.$onReady("success");
                $location.path("/group/" + $routeParams.id);
            }

        },
        function () {
            $scope.$onFailure("failed");
        });

    $scope.$on('$routeChangeStart', function (scope, next, current) {
        socket.emit('unsubscribe', {room: $scope.entry._id});
    });
    $scope.$on('$destroy', function () {
        socket.removeListener('enterroom');
        socket.removeAllListeners('initialuserlist');
        socket.removeAllListeners('commentsupdated');
        socket.removeAllListeners('updateusers');
    });

});

app.controller('SearchBarCtrl', function ($scope, $filter, $rootScope) {
    $rootScope.search = {
        search: ""
    }
    $scope.$on('$routeChangeSuccess', function (next, current) {
        console.log(current);
        if (current.templateUrl == "partials/blog.html" || current.templateUrl == undefined) {
            $scope.searchViewable = false;
        } else {
            $scope.searchViewable = true;
        }
    });

    $scope.clearSearch = function () {
        $rootScope.search.search = "";
    }


});

app.controller('GroupingCtrl', function ($scope, $rootScope) {
    $rootScope.subgroup = undefined;
    $scope.$on('$routeChangeSuccess', function (next, current) {
        console.log(current);
        if (current.templateUrl == "partials/blog.html" || current.templateUrl == undefined) {
            $scope.groupingViewable = false;
        } else {
            $scope.groupingViewable = true;
        }
    });
    $scope.changeSubgroup = function (subgroup) {
        console.log(subgroup);
        $rootScope.subgroup = subgroup;
    }
});
app.controller('WelcomeCtrl', function ($scope, $rootScope) {
    $rootScope.subgroup = undefined;
    $scope.$on('$routeChangeSuccess', function (next, current) {
        console.log(current);
        if (
            current.templateUrl == "partials/blog.html"
                ||
                current.templateUrl == undefined) {
            $scope.groupingViewable = false;
        } else {
            $scope.groupingViewable = true;
        }
    });
    $scope.changeSubgroup = function (subgroup) {
        console.log(subgroup);
        $rootScope.subgroup = subgroup;
    }
});

app.controller('LoginController', function ($scope, $http, authService, userInfoService, socket, $rootScope, $location, $window) {
    $scope.error = "";
    $scope.message = "";
    $scope.loginAttempt = false;
    $scope.submitAuth = function () {
        $rootScope.$broadcast('event:auth-loginAttempt');
        $scope.loginAttempt = true;
        $scope.error = "";
        $http.post('/login', $scope.form)
            .success(function (data, status) {
                userInfoService.setUsername($scope.form.username);
                $scope.form.username = "";
                $scope.form.password = "";
                authService.loginConfirmed();
                $window.location.href = "";
            }).error(function (data, status) {
                $scope.error = "Failed to connect to server please check your connection";
            });
    };
    $scope.forgot = function () {
        $rootScope.$broadcast('event:forgot-password');
    }

    socket.on('connect', function () {
        console.log("connect");
    });
    socket.on('disconnect', function () {
        console.log("disconnect");
    });
    socket.on('connecting', function (x) {
        console.log("connecting", x);
    });
    socket.on('connect_failed', function () {
        console.log("connect_failed");
    });
    socket.on('close', function () {
        console.log("close");
    });
    socket.on('reconnect', function (a, b) {
        console.log("reconnect", a, b);
    });
    socket.on('reconnecting', function (a, b) {
        console.log("reconnecting", a, b);
    });
    socket.on('reconnect_failed', function () {
        console.log("reconnect_failed");
    });
    $scope.$on('event:auth-loginRequired', function () {
        if ($scope.loginAttempt == true) {
            $scope.error = "Username or password is incorrect";
        }
    });


});

app.controller('messageController', function ($scope, api, $http, authService, userInfoService, socket, $rootScope, $location, $window, limitToFilter) {
    $scope.error = "";
    $scope.message = "";
    $scope.loginAttempt = false;
    $scope.submitAuth = function () {
        $rootScope.$broadcast('event:auth-loginAttempt');
        $scope.loginAttempt = true;
        $scope.error = "";
        $http.post('/login', $scope.form)
            .success(function (data, status) {
                userInfoService.setUsername($scope.form.username);
                $scope.form.username = "";
                $scope.form.password = "";
                authService.loginConfirmed();
                $window.location.href = "";
            }).error(function (data, status) {
                $scope.error = "Failed to connect to server please check your connection";
            });
    };

    //$scope.selected = undefined;
    //$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    $scope.getPossibles = function (userdata) {
        console.log(userdata)
        return $http.get('usersinnetwork/' + $scope.selected).
            then(function (data) {
                console.log(data);
                return limitToFilter(data.data, 15);
            })
    }
    $scope.sendMessage = function () {
        api.createResource('Message', {to: $scope.selected, from: $scope.form.from, message: $scope.form.message}, function (data, status) {
            console.log(status);
            if (status == 400) {
                $scope.message = data;
            } else {
                $scope.message = "message sent!!"
                $scope.form.message = "";
                $scope.selected = "";
                $scope.form.username = "";
                $scope.form.password = "";
                $rootScope.$broadcast('event:message-sent');
            }
        });


    }


});

app.controller('RegisterCtrl', function ($scope, $http, $rootScope, socket, groupsListing, $timeout) {
    $scope.form = {};
    $scope.subgroup = [];
    $scope.form.groupcode;
    $scope.selectedSubgroup = {};
    $scope.groups = groupsListing;
    $scope.message = {};
    $scope.groups = groupsListing;
    $scope.selectedGroup = undefined;
    $scope.form.groupcode = $scope.groups[0].code;
    $scope.checked = function () {
        console.log($scope.selectedGroup)
        $scope.form.groupcode = $scope.selectedGroup.code;
    }
    $scope.submitFinalDetails = function () {
        $http.post('/register', $scope.form).
            success(function (data) {
                if (data.fail) {
                    //$scope.messages = data.fail;

                    $rootScope.$broadcast('event:reg-error');
                } else {
                    $scope.form = {};
                    $rootScope.$broadcast('event:auth-registered');
                }
            }).
            error(function (err) {
                if (err) {
                    $scope.message = {};
                    console.log(err)
                    for (var error in err) {
                        console.log(err[error].msg)
                        $scope.message[error] = err[error].msg;
                    }
                    $rootScope.$broadcast('event:reg-error');
                    return;
                }
                // $scope.message = "Registration failed please check connection";
            });

    }
    $scope.open = function (no) {
        $timeout(function () {
            $scope.opened = true;
        });
    };
});

app.controller('UserInfoCtrl', function ($scope, userInfoService, $http) {
    $scope.username = userInfoService.getUsername();
    $scope.logout = function () {
        $http.post('/logout').
            success(function () {
                //console.log("success should never come here");
            }).error(function () {
                //console.log("error on logout??")
            })
    };
    //waiting for a 410 from the authorizer service
    $scope.$on('event:auth-loggedOut', function (event) {
        $scope.username = "Guest";
        window.location.reload();

    })

    $scope.showLogin = function () {
        $scope.$broadcast('showlogin');
    }

});

//TODO:add a simple twitter feed here
app.controller('TwitterCtrl', function ($scope, Blog, Twitter, $routeParams) {
    $scope.twitterResult = Twitter.get();
});

//Child of BlogEntry
app.controller('LatestCtrl', function ($scope, $http, $routeParams, socket) {
    console.log('LatestCtrl started');
    console.log($scope);
    console.log($scope.routeParamId);
    $scope.commentbox = [];
    $scope.newcomment = [];
    $scope.blogId;
    $scope.$watch('parentObject.entryId', function (newVal, oldVal) {
        console.log(oldVal);
        console.log(newVal);
        $scope.blogId = newVal;
        $http.get('/lastestPosts/' + newVal).
            success(function (data, err) {
                $scope.posts = data;
            }).
            error(function (err, code, status) {
                console.log(err + code + status);
            });
    })
    $scope.submit = function () {
        console.log("button fired");
        $http.post('/addtextpost', {text: $scope.postText, id: $scope.blogId}).
            success(function (data, status) {
                console.log(data);
                console.log("emited socket events");
                socket.emit('postText', {room: $scope.blogId});
                $scope.postText = "";
            }).error(function (err) {
                console.log(err);
            });
    }
    $scope.showcommentbox = function (index) {
        console.log(index)
        $scope.commentbox[index] = true;
    }
    $scope.submitComment = function (index) {
        console.log("Submitted");
        console.log($scope.posts);
        console.log($scope.newcomment[index]);
        $http.post('/subcomment', {text: $scope.newcomment[index], comment_id: $scope.posts[index]._id, id: $scope.parentObject.entryId}).
            success(function (data) {
                console.log("Successfully sent data");
                console.log(data);
                socket.emit('subcomment', {room: $scope.parentObject.entryId, text: $scope.newcomment[index], comment_id: $scope.posts[index]._id})
                // $scope.posts[index].comments.unshift({text:$scope.newcomment.text});
                $scope.newcomment[index] = "";
                console.log($scope.newcomment[index])
                $scope.commentbox[index] = false;
            })
        console.log("comment submitted")

    }
    socket.on('newPostText', function (data) {
        console.log("get new POst text");
        console.log(data);

        $scope.posts.unshift(data);
    });
    socket.on('subcommentupdated', function (data) {
        for (var x = 0; x < $scope.posts.length; x++) {
            if ($scope.posts[x]._id == data.comment_id) {
                console.log($scope.posts[x]);
                if ($scope.posts[x].comments == undefined) {
                    $scope.posts[x].comments = [];
                    $scope.posts[x].comments.push({text: data.text})
                } else {
                    $scope.posts[x].comments.unshift({text: data.text});

                }
            }
        }
    })
});


app.controller('GrpLatestCtrl', function ($scope, $http, $routeParams, socket) {
    console.log('GrpLatestCtrl started');
    console.log($scope);
    console.log($scope.routeParamId);
    $scope.commentbox = [];
    $scope.newcomment = [];
    $scope.$watch('parentObject.entryId', function (newVal, oldVal) {
        console.log(oldVal);
        console.log(newVal);
        $http.get('/lastestPosts/' + newVal).
            success(function (data, err) {
                $scope.posts = data;
            }).
            error(function (err, code, status) {
                console.log(err + code + status);
            });
    })
    $scope.showcommentbox = function (index) {
        $scope.commentbox[index] = true;
    }
    $scope.submitComment = function (index) {
        console.log("Submitted");
        console.log($scope.posts);
        console.log($scope.newcomment[index]);
        $http.post('/subcomment', {text: $scope.newcomment[index], comment_id: $scope.posts[index]._id, id: $scope.parentObject.entryId}).
            success(function (data) {
                console.log("Successfully sent data");
                console.log(data);
                socket.emit('subcomment', {room: $scope.parentObject.entryId, text: $scope.newcomment[index], comment_id: $scope.posts[index]._id})
                // $scope.posts[index].comments.unshift({text:$scope.newcomment.text});
                $scope.newcomment[index] = "";
                console.log($scope.newcomment[index])
                $scope.commentbox[index] = false;
            })
        console.log("comment submitted")

    }
    socket.on('newPostText', function (data) {
        console.log("get new POst text");
        console.log(data);

        $scope.posts.unshift(data);
    });
    socket.on('subcommentupdated', function (data) {
        for (var x = 0; x < $scope.posts.length; x++) {
            if ($scope.posts[x]._id == data.comment_id) {
                console.log($scope.posts[x]);
                if ($scope.posts[x].comments == undefined) {
                    $scope.posts[x].comments = [];
                    $scope.posts[x].comments.push({text: data.text})
                } else {
                    $scope.posts[x].comments.unshift({text: data.text});

                }
            }
        }
    })
});


app.controller('PicsCtrl', function ($rootScope, $scope, $http, api,$modal,DeletePicsFactory) {
    $scope.pics = [];
    $scope.createalbum = [];
    $scope.blogId = "";
    $scope.blog = [];
    $scope.albums = [];
    $scope.albumName = "";
    $scope.updatingAlbum = false;
    $scope.showingAlbum = false;
    $scope.picParentObject = {
        picToDelete:""
    };
    $scope.albuminfo={
        name:"default name"
    }

    $rootScope.groupingViewable = true;

    $scope.$watch('parentObject.entryId', function (newVal, oldVal) {
        console.log(oldVal);
        console.log(newVal);
        $scope.blogId = newVal;
        $http.get('getPicsForBlog/' + newVal).
            success(function (data) {
                console.log(data);
                $scope.pics = data;
            })
        $http.get('/albums/' + $scope.blogId).
            success(function (data) {
                $scope.albums = data;
            })
    });
    $scope.$watch('picParentObject.picToDelete', function (newVal, oldVal) {
        console.log(oldVal);
        console.log(newVal);
        $scope.picParentObject.picToDelete = newVal;
    });
    $scope.addpictoalbum = function () {
        console.log(pic);
        for (var pic in $scope.pics) {
            console.log($scope.pics[pic][pic])
        }

    }
    $scope.delete = function () {
        //TODO:FInish this implementation
    }
    $scope.addtoalbum = function () {
        $scope.updatingAlbum = true;
        //get list of albums to display
        $http.get('/albums/' + $scope.blogId).
            success(function (data) {
                $scope.albums = data;
            })
    }
    /*
     $scope.albumAdded = function(id){
     $scope.createalbum.push(id);
     }  */
    $scope.createAlbum = function () {
        var picstoadd = [];//filter $Scope.pics check
        for (var pic in $scope.pics) {
            if ($scope.pics[pic][pic] == true) {
                picstoadd.push($scope.pics[pic]);
            }
        }
        $http.post('/createNewAlbum/' + $scope.blogId, {name: $scope.albumName, pics: picstoadd}).
            success(function () {
                console.log("created")
                $scope.albumName = "";
                for (var pics in $scope.pics) {
                    $scope.pics[pic][pic] = false;
                }
                $scope.addingNewAlbum = false;
                $scope.getAlbums();
            }).
            error(function () {
                console.log("error");
            })

    }

    $scope.updateAlbum = function (albumid) {
        var picstoadd = [];
        for (var pic in $scope.pics) {
            if ($scope.pics[pic][pic] == true) {
                picstoadd.push($scope.pics[pic]);
            }
        }

        $http.post('/updateAlbum/' + $scope.blogId, {albumid: albumid, pics: picstoadd}).
            success(function () {
                console.log("created")
                $scope.albumName = "";
                for (var pics in $scope.pics) {
                    $scope.pics[pic][pic] = false;
                }
                $scope.addingNewAlbum = false;
                $scope.updatingAlbum = false;
                $http.get('/showAlbum/' + $scope.blogId + '/' + albumid).
                    success(function (data) {
                        $scope.pics = data;
                    }).
                    error(function () {
                    })
            }).
            error(function () {
                console.log("error");
            })
    }
    $scope.setAlbumName = function (n) {
        console.log("set albuminfo to "+n)
        $scope.albuminfo.name = n;
        console.log($scope.albuminfo)
    }
    $scope.showAlbum = function (albumid) {
        $scope.showingAlbum = true;
        $http.get('/showAlbum/' + $scope.blogId + '/' + albumid).
            success(function (data) {
                $scope.pics = data;
            }).
            error(function () {
            })
    }
    $scope.getAlbums = function () {
        $http.get('/albums/' + $scope.blogId).
            success(function (data) {
                $scope.albums = data;
            })
    }
    $scope.showallpics = function () {
        console.log("showallpics")
        $scope.showingAlbum = false;
        $http.get('getPicsForBlog/' + $scope.blogId).
            success(function (data) {
                console.log(data);
                $scope.pics = data;
            })
    }
    $scope.setDeletedPic = function (id) {
        DeletePicsFactory.picToDelete = id;
        DeletePicsFactory.fromBlog = $scope.blogId;
        if($scope.showingAlbum){
           // DeletePicsFactory.setMessageToShowUsers("Are you sure want to delete this pic from this album?");
            $rootScope.$broadcast('event:pic-delete-request',{message:"Are you sure want to delete this pic from this album?"})

        }else{
            //DeletePicsFactory.setMessageToShowUsers("Are you sure you want to permantly delete this photo from our site forever?");
            $rootScope.$broadcast('event:pic-delete-request',{message:"Are you sure you want to permantly delete this photo from our site forever?<br /> (view " +
                "by album if you only wanted to remove a pic by album."})

        }
        console.log(DeletePicsFactory);
    }
    $rootScope.$on('event:pic-deleted', function () {
        $scope.showallpics();
    })
    $rootScope.$on('uploadedFile', function (data) {
        console.log("PICSCTRL UPloaded file")
        $http.get('getPicsForBlog/' + $scope.blogId).
            success(function (data) {
                console.log(data);
                $scope.pics = data;
            })
    })

});
//used to keep data between the deletepics ctrl modal and pics ctrl in sync
app.factory('DeletePicsFactory',function(){
    var messageToShowUsers = "";
    return {
        picToDelete:"",
        fromBlog:"",
        getMessageToShowUsers: function () {
            return messageToShowUsers;
        },
        setMessageToShowUsers:function(value){
            messageToShowUsers = value;
        }
    }
})

app.controller('DeletePicsCtrl', function ($rootScope,$scope,$http, DeletePicsFactory) {
    $scope.deletepic = function () {
        console.log(DeletePicsFactory)
        $http.get('deletepic/' + DeletePicsFactory.picToDelete+'/'+DeletePicsFactory.fromBlog).
            success(function (data) {
                $rootScope.$broadcast('event:pic-deleted');
                $scope.message = data;

            }).
            error(function () {
                $scope.message = "Pic could not be deleted.";
            })
    }
})
app.controller('PetitionCtrl', function ($http,$scope, api,$routeParams) {
    $scope.petitions = [];
    //$scope.edittitle = "";
    //$scope.edittext = "";
    api.getResourceById('Petition', 'all', function (petitions) {
        $scope.petitions = petitions;

    });

    api.getResourceByField('Petition',{field:'_id',query:$routeParams.id}, function (petition) {
        $scope.title = petition[0].title;
        $scope.text = petition[0].text;
    })
    $scope.submitedit = function () {
        $http.post('updatePetition',{id:$routeParams.id, title: $scope.title , text:$scope.text}).
            success(function (data) {
                console.log(data)
            }).error(function (err) {
                console.log(err)
            })
    }

    $scope.submit = function () {
        var text = $scope.text;
        var title = $scope.title;
        api.createResource('Petition', {text: text, title: title});
        $scope.title = "";
        $scope.text = "";
    }
});
app.controller('PetitionEntryCtrl', function ($scope, api, $routeParams) {
    $scope.petition = [];

    api.getResourceByField('Petition', {field: "title", query: $routeParams.title}, function (petitions) {
        $scope.petition = petitions;
        $scope.signatures = $scope.petition[0].signatures;

    });
    $scope.signPetition = function () {
        console.log($scope.petition)
        api.createSubDocResource('Petition', $scope.petition[0]._id, 'signatures', function () {

        });
    }
});
app.controller('UserProfileCtrl', function ($scope, api, $routeParams, $http, userInfoService) {
    $scope.messagedUsers = [];
    $scope.messages = [];
    $scope.walls = [];
    $scope.invitedGroups;

    api.getResourceByField('User', {field: "username", query: $routeParams.username}, function (user) {
        $scope.user = user[0];
        //get all angel profiles(blogs) that this user has in his profile id
    });


    $http.get('/blogdataforuser').
        success(function (data) {
            console.log(data);
            $scope.angels = data;
        })

    $http.get('/getMessagedUsers').
        success(function (data) {
            $scope.messagedUsers = data;
        })

    $http.get('/getGroups').
        success(function (data) {
            $scope.groups = data;
        })
    $scope.getFriendsMemorials = function () {
        $http.get('getFriendsMemorials').
            success(function (data) {
                $scope.walls = data;
                console.log(data)
            }).
            error(function (err) {
                console.log(err)
            })
    }
    $scope.getFriendsMemorials();
    $scope.getMessages = function (mUser) {
        $http.get('/getMessages/' + mUser).
            success(function (data) {
                $scope.messages = data;
            })
    }


    $scope.getInvitedGroups = function () {
        $http.get('getInvitedGroup').
            success(function (data) {
                console.log(data)
                $scope.invitedGroups = data;
            }).
            error(function (err) {
                console.log(data)

            })
    }
    $scope.getInvitedGroups();
    $scope.getNetworkedUsersAll = function(){
        $http.get('/usersinnetworkAll').
            success(function (data) {
                console.log(data);
            }).error(function (err) {
                console.log(err);
            })
    }
    $scope.getNetworkedUsersAll();
    $scope.getRecentMessages = function () {
        $http.get('/getRecentMessages').
            success(function (data) {
                console.log(data);
            })
    }

    $scope.removeself = function (wall) {
        $http.get('removeself/' + wall).
            success(function (data) {
                console.log(data)
                $scope.getFriendsMemorials();
            }).
            error(function (err) {
                console.log(err)
            })

    }
    $scope.removeselfgroup = function (wall) {
        $http.get('removeself/' + wall).
            success(function (data) {
                console.log(data)
                $scope.getInvitedGroups();
            }).
            error(function (err) {
                console.log(err)
            })
    }
    $scope.getPetitions = function () {
        $http.get('getPetitionsForUser').
            success(function (data) {
                console.log(data)
                $scope.petitions = data;
            }).
            error(function (err) {
                console.log(err)
            })
    }
    $scope.getPetitions();
    $scope.deletePetition = function (id) {
        $http.get('deletePetition/'+id).
            success(function (data) {
                console.log(data)
                $scope.getPetitions();
            }).error(function (err) {
                console.log(err)
            })
    }
});

app.controller('AddBlogCtrl', function ($scope, BlogsService, Blog, $rootScope, groupsListing, $timeout,$location) {
    $scope.template = {};
    $scope.hidemainform = false;
    $scope.blogId = {blogId: ""};
    $scope.addedFile = {};
    $scope.author = {author: ""};
    $scope.groups = groupsListing;
    $scope.message = {};
    $scope.selectedGroup = undefined;
    $scope.form = {};
    $scope.parentData = {
        author:""
    }
    $scope.pet = false;
    $scope.checked = function () {
        console.log($scope.selectedGroup)
        $scope.form.subgroup = $scope.selectedGroup.code;
    }
    $scope.petchecked = function(){
        console.log($scope.pet)
    }
    $scope.submitPost = function () {
        $scope.form.pet = $scope.pet;
        BlogsService.updateBlog($scope.form, function (err, res) {
            if (err) {
                $scope.message = {};
                for (var error in err.data) {
                    if (error == "author") {
                        $scope.message.url = err.data.author.msg;
                    }
                    else {
                        $scope.message[error] = err.data[error].msg;
                    }
                }
                return;
            }

            $scope.blogId.blogId = res.blogId;
            $scope.form.title = "";
            $scope.parentData.author = $scope.form.author;
            $scope.form.author = "";
            $scope.form.text = "";
            $scope.message = "";
            $scope.template.url = '/partials/admin/addportrait.html';
            $scope.hidemainform = true;
        });
    }
    $rootScope.$on('addedFile', function (event, file) {
        console.log("addedfile");
        console.log($scope.addedFile);
        $scope.addedFile = file.file;
    })
    $scope.submitportrait = function () {
       $scope.$parent.parentData.deregPor = $rootScope.$on('uploadedFile', function () {
            console.log("completed now spreadem");
            $scope.$parent.template.url = 'partials/admin/addspread.html';
            $scope.$apply()
        })
        $rootScope.$broadcast('uploadit', {file: $scope.addedFile});

    }
    $scope.submitspread = function () {
        $scope.$parent.parentData.deregPor();
        console.log("addedfile");
        console.log($scope.addedFile);
        $scope.deregSpread = $rootScope.$on('uploadedFile', function () {
            //$scope.$parent.template.url = 'partials/admin/mwregcom.html';
            $scope.$parent.template.url = '';
            console.log("adding portrait file")
            console.log($scope.parentData)
            $location.path("/angel/"+$scope.$parent.parentData.author)
            $scope.$apply()

        })
        $rootScope.$broadcast('uploadit', {file: $scope.addedFile});


    }
    $scope.open = function (no) {
        $timeout(function () {
            if (no == 1) {
                $scope.opened1 = true;
            }
            if (no == 2) {
                $scope.opened2 = true;
            }
        });
    };
});

app.controller('AddGroupCtrl', function ($scope, BlogsService, Blog, $rootScope, groupsListing) {
    $scope.template = {};
    $scope.hidemainform = false;
    $scope.blogId = {blogId: ""};
    $scope.addedFile = {};
    $scope.author = {author: ""};
    $scope.groups = groupsListing;
    $scope.form = {};
    $scope.message = {};
    $scope.parentData = {
        author:""
    }
    $scope.submitPost = function () {

        $scope.form.group = true;
        BlogsService.updateBlog($scope.form, function (err, res) {
            if (err) {
                $scope.message = {};
                for (var error in err.data) {
                    if (error == "author") {
                        $scope.message.url = err.data.author.msg;
                    }
                    else {
                        $scope.message[error] = err.data[error].msg;
                    }
                }
                return;
            }

            $scope.blogId.blogId = res.blogId;
            $scope.parentData.author = $scope.form.author;

            $scope.form.title = "";
            $scope.form.author = "";
            $scope.form.text = "";
            $scope.message = "";
            $scope.template.url = '/partials/admin/addGroupLogohtml';
            $scope.hidemainform = true;
        });
    }
    $rootScope.$on('addedFile', function (event, file) {
        console.log("addedfile");
        console.log($scope.addedFile);
        $scope.addedFile = file.file;
    })
    $rootScope.$on('addedFile', function (event, file) {
        console.log("addedfile");
        console.log($scope.addedFile);
        $scope.addedFile = file.file;
    })
    $scope.submitportrait = function () {
        $scope.$parent.parentData.deregPor = $rootScope.$on('uploadedFile', function () {
            console.log("completed now spreadem");
            $scope.$parent.template.url = 'partials/admin/addspread.html';
            $scope.$apply()
        })
        $rootScope.$broadcast('uploadit', {file: $scope.addedFile});

    }
    $scope.submitspread = function () {
        $scope.$parent.parentData.deregPor();
        console.log("addedfile");
        console.log($scope.addedFile);
        $scope.deregSpread = $rootScope.$on('uploadedFile', function () {
            //$scope.$parent.template.url = 'partials/admin/mwregcom.html';
            $scope.$parent.template.url = '';
            console.log("adding portrait file")
            console.log($scope.parentData)
            $location.path("/group/"+$scope.$parent.parentData.author)
            $scope.$apply()
        })
        $rootScope.$broadcast('uploadit', {file: $scope.addedFile});


    }
    $scope.open = function (no) {
        $timeout(function () {
            if (no == 1) {
                $scope.opened1 = true;
            }
            if (no == 2) {
                $scope.opened2 = true;
            }
        });
    };
});

app.controller('VideoCtrl', function ($scope, BlogsService, Blog, $rootScope, $http,$sce,api) {
    $scope.videosyt = [];
    $scope.videosa = [];
    $scope.blogId = "";
    $scope.embedVideos = {
        youtube:"",
        animoto:""
    }
    $scope.$watch('parentObject.entryId', function (newVal, oldVal) {
        console.log(oldVal);
        console.log(newVal);
        $scope.blogId = newVal;
        $http.get('lastestVideosYoutube/' + newVal).
            success(function (data) {
                console.log(data);

                $scope.videosyt =   $scope.trustAsHtmlArray( data);
            })
        $http.get('lastestVideosAnimoto/' + newVal).
            success(function (data) {
                console.log(data);
                $scope.videosa =$scope.trustAsHtmlArray( data);
            })

    });
    $scope.submitVideo = function () {
        //TODO:Checkk this
        console.log("submitvideo");
        console.log("eani "+$scope.embedVideos.animoto )
        console.log(($scope.embedVideos.youtube));
        api.createSubDocResource('Blog', $scope.blogId, 'postText', {
            embedYouTube: youtube_embed(youtube_parser($scope.embedVideos.youtube)),
            embedAnimoto: animoto_embed(animoto_parser($scope.embedVideos.animoto)) ,
            postType: 2
        }, function () {
            console.log("video sent");
            $scope.embedVideos = {};
            $http.get('lastestVideosYoutube/' + $scope.blogId).
                success(function (data) {
                    console.log(data);

                    $scope.videosyt =   $scope.trustAsHtmlArray( data);
                })
            $http.get('lastestVideosAnimoto/' + $scope.blogId).
                success(function (data) {
                    console.log(data);
                    $scope.videosa =$scope.trustAsHtmlArray( data);
                })
        })
    }
    $http.get('lastestVideosYoutube/' + $scope.blogId).
        success(function (data) {
            console.log(data);
            $scope.videosyt =  $scope.trustAsHtmlArray(data);
            console.log($scope.videosyt)
        })

    $http.get('lastestVideosAnimoto/' + $scope.blogId).
        success(function (data) {
            console.log(data);
            $scope.videosa =  $scope.trustAsHtmlArray(data);
        })

    $scope.trustAsHtmlArray = function(arrayToPass){
        var buffer = [];
        for(var i = 0;i<arrayToPass.length;i++){
            console.log(arrayToPass[i])
            buffer[i] = $sce.trustAsHtml(arrayToPass[i]);
        }
        return buffer;
    }
});
app.controller('AnniCtrl', function ($scope, api, $http) {
    $scope.anis = [];
    $scope.blogId = "";
    $scope.$watch('parentObject.entryId', function (newVal, oldVal) {
        console.log(oldVal);
        console.log(newVal);
        /*
         api.getResourceById('Blog',newVal,function(blogs){
         console.log(blogs[0]);
         $scope.anis = blogs[0].anniverssaryDays;
         })
         */
        $scope.blogId = newVal;
        $http.get('lastestEvents/' + newVal).
            success(function (data) {
                console.log(data);
                $scope.anis = data;
            })
    });
    $http.get('lastestEvents/' + $scope.blogId).
        success(function (data) {
            console.log(data);
            $scope.anis = data;
        })

    $scope.submitEvent = function () {
        api.createSubDocResource('Blog', $scope.blogId, 'postText', {
            event: $scope.event,
            date: $scope.eventdate,
            text: $scope.eventdesc,
            postType: 3
        }, function () {
            $http.get('lastestEvents/' + $scope.blogId).
                success(function (data) {
                    console.log(data);
                    $scope.anis = data;
                })
            $scope.event = "";
            $scope.eventdate ="";

        })

    }

});

app.controller('groupEvntCtrl', function ($scope, api, $http) {
    $scope.grpEvnt = [];
    $scope.blogId = "";
    $scope.$watch('parentObject.entryId', function (newVal, oldVal) {
        console.log(oldVal);
        console.log(newVal);
        /*
         api.getResourceById('Blog',newVal,function(blogs){
         console.log(blogs[0]);
         $scope.anis = blogs[0].anniverssaryDays;
         })
         */
        $scope.blogId = newVal;
        $http.get('lastestEvents/' + newVal).
            success(function (data) {
                console.log(data);
                $scope.grpEvnt = data;
            })
    });
    $http.get('lastestEvents/' + $scope.blogId).
        success(function (data) {
            console.log(data);
            $scope.anis = data;
        })
});
app.controller('FriendsFamilyCtrl', function ($scope, api, $routeParams, $http) {
    $scope.subscribers = [];
    $scope.$watch('parentObject.entryId', function (newVal, oldVal) {
        console.log(oldVal);
        console.log(newVal);
        //TODO:get users that can access this memwall(blog)
        $http.get('subscribed/' + $routeParams.id).
            success(function (data) {
                $scope.subscribers = data;
            })
    });
});
app.controller('InviteBlockCtrl', function ($scope, api, $http, $routeParams) {
    $scope.users = [];
    $scope.$watch('parentObject.entryId', function (newVal, oldVal) {
        console.log(oldVal);
        console.log(newVal);

        $http.get('getInviteBlogUserData/'+$routeParams.wall).
            success(function (data) {
                console.log(data)
                $scope.members = data;
            }).
            error(function (err) {

            })
    });
    $scope.invite = function (user) {
        $http.get('invite/' + $routeParams.wall + '/' + user).success(function (data) {

        });
    }
    $scope.block = function (user) {
        $http.get('block/' + $routeParams.wall + '/' + user).
            success(function (data) {

            })
    }
});

app.controller('FindNewMembersBlockCtrl', function ($scope, api, $http, $routeParams) {
    $scope.users = [];
    $scope.$watch('parentObject.entryId', function (newVal, oldVal) {
        console.log(oldVal);
        console.log(newVal);

         api.getResourceById('User', 'all', function (data) {
         console.log(data);
         $scope.users = data;

         })
    });
    $scope.invite = function (user) {
        $http.get('invite/' + $routeParams.wall + '/' + user).success(function (data) {

        });
    }
    $scope.block = function (user) {
        $http.get('block/' + $routeParams.wall + '/' + user).
            success(function (data) {

            })
    }
});


app.controller('EditWallCtrl', function ($rootScope, $http, $scope, api, $routeParams, BlogsService, groupsListing, $timeout) {
    $scope.template = {};
    $scope.portrait = {portrait: ""};
    $scope.spread = {spread: ""};
    $scope.blogId = {blogId: ""};
    $scope.addedFile = {};
    $scope.form = {};
    $scope.groups = groupsListing;
    $scope.selectedGroup = undefined;

    $scope.checked = function () {
        console.log($scope.selectedGroup)
        $scope.form.subgroup = $scope.selectedGroup.code;
    }
    api.getResourceByField('Blog', {field: 'author', query: $routeParams.wall}, function (data) {
        console.log(data);
        $scope.form = data[0];
        $scope.portrait.portrait = data[0].profilePicPortrait;
        $scope.spread.spread = data[0].profilePicWide;
        $scope.blogId.blogId = data[0]._id;
        console.log("GROUPS ARE " + $scope.groups)
        for (var group in $scope.groups) {
            console.log(data[0].subgroup)
            if ($scope.groups[group].code == data[0].subgroup) {
                console.log("found subgroup " + $scope.groups[group])
                $scope.selectedGroup = $scope.groups[group];
            }
        }
        $scope.checked();
        console.log($scope.selectedGroup)
        console.log($scope.form);
        console.log("portrait " + $scope.portrait + " spread " + $scope.spread);
    })
    $scope.editPost = function () {
        console.log($scope.form._id);

        $http.post('blog/' + $scope.form._id, $scope.form).
            success(function (data) {
                $scope.form = data;


                $scope.template.url = '/partials/admin/editportrait.html';
                $scope.hidemainform = true;

            }).error(function (err) {
                console.log("error");

                if (err) {
                    console.log(err)

                    $scope.message = {};
                    for (var error in err) {

                        if (error == "author") {
                            $scope.message.url = err.author.msg;
                        }
                        else {
                            $scope.message[error] = err[error].msg;
                        }
                    }
                    return;
                }
            })


    };

    $scope.deletePost = function () {
        //TODO:Properly imlement this function
        $scope.form.$remove();
        console.log("blog/" + $scope.form._id);
        $http.delete('/blog/' + $scope.form._id).
            success(function () {
                console.log("wall deleted");
            }).
            error(function () {
                console.log("wall not deleted error");
            })
    };
    $scope.submitPost = function () {

        BlogsService.updateBlog($scope.form, function (err, res) {
            if (err) {
                $scope.message = "Blog entry must have a title.";
            }

            $scope.blogId.blogId = res.blogId;
            $scope.form.title = "";
            $scope.form.author = "";
            $scope.form.text = "";
            $scope.message = "";
            $scope.template.url = '/partials/admin/editportrait.html';
            $scope.hidemainform = true;
        });
    }
    $rootScope.$on('addedFile', function (event, file) {
        console.log("addedfile");
        console.log($scope.addedFile);
        $scope.addedFile = file.file;
    })
    $scope.submitportrait = function () {


        $rootScope.$broadcast('uploadit', {file: $scope.addedFile});

        $rootScope.$on('uploadedFile', function () {
            console.log("completed now spreadem");

            $scope.$parent.template.url = 'partials/admin/editspread.html';
            $scope.$apply()
        })
    }
    $scope.submitspread = function () {


        console.log("addedfile");
        console.log($scope.addedFile);
        $rootScope.$broadcast('uploadit', {file: $scope.addedFile});

        $rootScope.$on('uploadedFile', function () {
            $scope.$parent.template.url = 'partials/admin/mwregcom.html';
            $scope.$apply()
        })

    }
    $scope.nochange = function (type) {
        console.log(type);
        if (type.portrait != undefined)
            $scope.$parent.template.url = 'partials/admin/editspread.html';
        // $scope.$apply()

        if (type.spread != undefined)
            $scope.$parent.template.url = 'partials/admin/mwregcom.html';
        //$scope.$apply()


    }

    $scope.open = function (no) {
        $timeout(function () {
            if (no == 1) {
                $scope.opened1 = true;
            }
            if (no == 2) {
                $scope.opened2 = true;
            }
        });
    };
})

app.controller('NotificationsCtrl', function ($scope, $http, api,socket) {
    $scope.notifications = [];

    $http.get('notifications').
        success(function (data) {
            $scope.notifications = data;
        });

    $scope.notiviewed = function (id) {
        console.log("Running this functions notviewed")
        $http.get('notified/' + id).
            success(function (data) {

            })
    }
    socket.emit('subscribe_notifications');

    //TODO:add all the notifications to the array but only display the single ones with a count
    socket.on('newnotification', function (data) {
        console.log("new notification received")
        console.log(data)
        /*
        for(var noti in $scope.notifications){
            console.log($scope.notifications[noti])
            if($scope.notifications[noti].text == data.text){
                if(!$scope.notifications[noti].count){
                    $scope.notifications[noti].count = 2;
                    return;

                }else{
                    $scope.notifications[noti].count++;
                    return;

                }
            }
        }
        */
        $scope.notifications.push(data);

    });

});
app.controller('WorkshopCtrl', function ($scope, $http, api) {
    $scope.workshops = [];
    $scope.form;

    api.getResourceById('Workshop', 'all', function (workshops) {
        console.log(workshops);
        console.log("TESTING !#");
        $scope.workshops = workshops;
    });

    $scope.submit = function () {
        api.createResource('Workshops', $scope.form);
    }

    $scope.submitedit = function () {
        $http.post('updateworkshop/' + $scope.workshops._id).
            success(function (data) {

            }).
            error(function (data) {

            })
    }

})

app.controller('PasswordRecoveryCtrl', function ($scope, $http, $routeParams) {
    $scope.message = "";
    $scope.recover = function () {
        $http.post('passrecover', {email: $scope.email}).
            success(function (data) {
                console.log(data);
                $scope.message = "Email has been sent please check your email.";
            }).
            error(function (err) {
                console.log(err);
                $scope.message = "We could not send you an email.  Please check you have the right email addresss."
            });
    }
    $scope.updatePass = function () {
        if ($scope.password != $scope.passwordconfirm) {
            $scope.message = "Please verify that your password and password confirmation are the same.";
            return;
        }
        $http.post('updatepass', {password: $scope.password, passwordconfirm: $scope.passwordconfirm, key: $routeParams.key}).
            success(function (err, data) {
                console.log(data);
                $scope.message = "Your password has been reset please try and login."
            }).
            error(function (err) {
                console.log(err);
                $scope.message = "Your password could not be reset.  Please try again."
            })
    }
})

app.controller('EditProfileCtrl', function ($scope, $http, api, groupsListing) {
    $scope.messages = {};
    $scope.selectedGroup = undefined;
    $scope.groups = groupsListing;
    $scope.checked = function () {
        console.log($scope.selectedGroup)
        $scope.form.groupcode = $scope.selectedGroup.code;
    }
    $http.get('getreguserdata').
        success(function (data) {
            console.log(data)
            $scope.form = data;
            for (var group in $scope.groups) {
                console.log(group)
                console.log(data.lost + " was lost")
                if ($scope.groups[group].code == data.lost) {
                    $scope.selectedGroup = $scope.groups[group];
                }
            }
            $scope.checked();

            console.log($scope.selectedGroup)
        }).
        error(function (err) {
            console.log(err)
        })
    $scope.submitEdits = function () {
        console.log($scope.form)
        $http.post('updateuserdata', $scope.form)
            .success(function (data) {
                // success
                $scope.message = "User data updated.";
                console.log(data)
            }).
            error(function (err) {
                $scope.message = "Please check errors."
                console.log("error response")
                // error
                if (err) {
                    console.log(err)

                    $scope.message = {};
                    for (var error in err) {

                        if (error == "author") {
                            $scope.message.url = err.author.msg;
                        }
                        else {
                            $scope.message[error] = err[error].msg;
                        }
                    }
                    return;
                }
                console.log(response)
            });
    }
})
//console.log(youtube_embed(youtube_parser("http://www.youtube.com/watch?v=Pu1PPMaoArE")) );
function youtube_parser(url){
    //var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    if(!url)return;
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[2].length==11){
        return match[2];
    }else{
        alert("Probably not a youtube url please try again.");
    }
}
//<iframe id="vp1d9hMl" title="Video Player" width="432" height="243" frameborder="0" src="http://embed.animoto.com/play.html?w=swf/production/vp1&e=1383358396&f=d9hMlHCZJLbDtchmtVdo7g&d=0&m=b&r=360p&volume=100&start_res=360p&i=m&asset_domain=s3-p.animoto.com&animoto_domain=animoto.com&options=" allowfullscreen></iframe><p><a href="http://animoto.com/play/d9hMlHCZJLbDtchmtVdo7g">Emila</a></p>
function youtube_embed(string)
{
    if(!string)return;

    var iframestring = "<iframe title='YouTube video player' width='480' height='390' src='http://www.youtube.com/embed/"+string+"?autoplay=0' frameborder='0' allowfullscreen></iframe>";
    return iframestring;
}

function animoto_parser (url){
    if(!url)return;

    console.log(url)
    //url = 'animoto.com/play/d9hMlHCZJLbDtchmtVdo7g';
    var regExp = /^.*((play\/))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    console.log("parsing animoto")
    console.log(match)
    if (match&&match[3]){
        return match[3];
    }else{
        alert("Probably not a animoto url please enter a url with this form animoto.com/play/xxxkjxlkjxx");
    }
}
//<iframe id="vp1d9hMl" title="Video Player" width="432" height="243" frameborder="0" src="http://embed.animoto.com/play.html?w=swf/production/vp1&e=1383358396&f=d9hMlHCZJLbDtchmtVdo7g&d=0&m=b&r=360p&volume=100&start_res=360p&i=m&asset_domain=s3-p.animoto.com&animoto_domain=animoto.com&options=" allowfullscreen></iframe><p><a href="http://animoto.com/play/d9hMlHCZJLbDtchmtVdo7g">Emila</a></p>
function animoto_embed(string)
{
    if(!string)return;

    var iframestring = "<iframe id='vp1d9hMl' title='Video Player' width='432' height='243' frameborder='0' src='https://s3.amazonaws.com/embed.animoto.com/play.html?w=swf/production/vp1&e=1383394463&f="+string+"&d=0&m=b&r=360p&volume=100&start_res=360p&i=m&asset_domain=s3-p.animoto.com&animoto_domain=animoto.com&options=' allowfullscreen></iframe>";
    return iframestring;
}

