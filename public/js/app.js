const app = angular.module("locationsApp", []);

app.controller("MyController", ["$http",'$window', function($http, $window){
    this.test="test";
    const controller = this;
    this.loggedInUsername = null;
    //partials include and function to change partials
    this.includePath = "partials/display.html"
    this.changeInclude = (path) => {
        this.includePath = 'partials/'+ path +'.html';
    }

    //Variable for performing filter
    this.selected = ['-createdAt',""]

    //scroll to top of page
    this.toTop = function(){
        $window.scroll(0,0)
    }
    ///////////////////////////////////////////////////////////////
    // new /////////////
    this.getComments = function() {
        $http({
            method: 'GET',
            url: '/comments/'
        }).then(function(response) {
            // console.log(response.data)
            controller.comment = response.data
        }, function(error) {
            console.log(error)
        })
    }
    this.getComments()

    //// new post //////////////
    this.createComments = function() {
        $http({
            method: 'POST',
            url: '/comments',
            data: {
                comment: this.newComment,
                user1: controller.loggedInUsername,
                name: controller.oneLocation.name
            }
        }).then(function(response) {
            controller.getComments()
            controller.newComment = ""
        })
    }
    //////////////////////////////////////////////////////////////////

    //get route
    this.getLocations = function(){
        this.includePath = "partials/display.html"
        $http({
            method:'GET',
            url: '/locations/'
        }).then(function(response){
            // console.log(response);
            controller.toTop()
            controller.location = response.data;
            // console.log(controller.bookmarkArray);
        }, function(){
            console.log('error');
        });
    };

    this.getLocations();

    //show route
    this.showOne = function(id){
        $http({
            method:'GET',
            url:'/locations/'+ id,
        }).then(function(response){
            // console.log(response.data)
            controller.toTop()
            controller.oneLocation = response.data
            // console.log(response);
        }, function(err){
            console.log(err);
        })
    }

    //delete route
    this.deleteLocation = function(id){
        $http({
            method: "DELETE",
            url: "/locations/" + id
        }).then(
            function(response){
                console.log(response);
                controller.getLocations();
            },
            function(error){
                console.log("error");
            }
        );
    }

    //edit route
    this.editLocation = function(id){
        if (this.loggedInUsername) {
            $http({
                method: "PUT",
                url: "/locations/" + id,
                data: {
                    name: this.oneLocation.name,
                    image: this.oneLocation.image,
                    description: this.oneLocation.description,
                    likes: this.oneLocation.likes
                }
            }).then(
                function(response){
                    controller.getLocations()

                    // document.getElementById("editform").reset();
                    // controller.url = null;
                },
                function error() {
                    console.log("error");
                }
            )
        }
        else {
            console.log("need to be logged in");
        }
    }

    //new location
    this.createLocation = function(){
        $http({
            method:'POST',
            url: '/locations',
            data: {
                name: this.name,
                image: this.image,
                description: this.description,
                likes: this.likes,
                user1: controller.loggedInUsername
            }
        }).then(function(response){
            controller.getLocations();
            controller.name = ""
            controller.image = ""
            controller.description = ""
            controller.likes = ""
            // document.getElementById("createForm").reset();
        }, function(){
            console.log('error');
        });
    }

    //new user
    this.createUser = function(){
        $http({
            method: "POST",
            url: "/users",
            data: {
                username: this.username,
                password: this.password
            }
        }).then(response => {
            console.log(response);
            $('#Modal').modal('hide');
            controller.displayApp()
            controller.changeInclude('display')
            controller.username = null;
            controller.password = null;
        }, function(){
            console.log("error");
        })
    }

    //log in to user
    this.logIn = function(){
        $http({
            method:'POST',
            url: '/sessions',
            data: {
                username: this.username,
                password: this.password
            }
        }).then(function(response){
            $('#myModal').modal('hide');
            console.log(response);
            controller.displayApp();
            controller.changeInclude('display')
            controller.username = null;
            controller.password = null;
        }, function(){
            console.log('error');
        });
    }

    //display user
    this.displayApp = function(){
        $http({
            method:'GET',
            url: '/sessionUser'
        }).then(function(response){
            controller.loggedInUsername = response.data.username;
            console.log(response);
        }, function(){
            console.log('error');
        });
    }

    //log out
    this.logOut = function(){
        $http({
            method: "DELETE",
            url:"/sessions"
        }).then(function(response){
            controller.toTop()
            controller.loggedInUsername = null;
        }, function(error){
            console.log(error);
        })
    }

    //Stay logged in on refresh.
    $http({
        method:'GET',
        url:'/sessions'
    }).then(function(response){
        if (response.data.currentUser) {
            controller.loggedInUsername = response.data.currentUser.username
            // console.log(controller.loggedInUsername);
        }

    })

    //like and favorite buttons
    this.likeAndLove = function(item, button){

        let userFound = false
        let liked = false
        let loved = false

        //if user clicks without logging in nothing will happen. This way we can keep the icon there to indicate these are the likes.
        if (this.loggedInUsername === null ) {

            return
        }
        if (item.likedAndLoved.length > 0) {
            const user = this.loggedInUsername;
            const likeLoveArray = item.likedAndLoved
            for(let i = 0; i < likeLoveArray.length; i++){
                // if user is found do the following
                if(item.likedAndLoved[i].username === user){
                    const userLikeInfo = item.likedAndLoved[i]
                    userFound = true;
                    liked = userLikeInfo.liked
                    loved = userLikeInfo.loved

                    if (button === 'like') {
                        //if user has already liked this then clicking again subtracts their like.
                        if(liked === true){
                            item.likes = item.likes - 1
                            userLikeInfo.liked = false
                        }else{
                            //if user has not liked the location then this will add a like .
                            item.likes = item.likes + 1
                            userLikeInfo.liked = true
                        }
                    }else if (button === 'love') {
                        //this is for the favorite button abilities
                        if(loved === true){
                            userLikeInfo.loved = false
                        }else{
                            userLikeInfo.loved = true
                        }
                    }

                    //stop the loop to prevent it from continuing through the loop now that we found the user.
                    break
                }
            }
        }


        //if user is not found then push the new user information to the location object.
        if (userFound === false) {
            if (button === 'like') {
                item.likes = item.likes + 1
                item.likedAndLoved.push({
                    username:this.loggedInUsername,
                    liked:true,
                    loved: false
                })
            }else if (button === 'love') {
                item.likedAndLoved.push({
                    username:this.loggedInUsername,
                    liked:false,
                    loved: true
                })
            }

        }
        //update with new like information
        $http({
            method:'PUT',
            url:'/locations/' + item._id,
            data: item
        }).then(function(response){
            controller.getLocations()
        })
    }

    //change thumbsup icon based on if you like or haven't liked a location
    this.getLikeValue = function(location){
        if(this.loggedInUsername !== null){
            let array = location.likedAndLoved
            let user = this.loggedInUsername
            for(let i = 0; i < array.length; i++){
                if (array[i].username === user) {
                    return array[i].liked
                }
            }
        }else{
            return false
        }

    }

    //change heart icon based on if you love or haven't loved a location
    this.getLoveValue = function(location){
        if(this.loggedInUsername !== null){
            let array = location.likedAndLoved
            let user = this.loggedInUsername
            for(let i = 0; i < array.length; i++){
                if (array[i].username === user) {
                    return array[i].loved
                }
            }
        }else{
            return false
        }

    }

    this.sortLoggedIn = [
        {
            value:'-createdAt',
            label:'Most Recent',
            filter: ''
        },
        {
            value:'name',
            label:'A-Z',
            filter: ''
        },
        {
            value:'-likes',
            label:'Most Popular',
            filter: ''
        },
        {
            value:'-createdAt',
            label:'My Submissions',
            filter: 'user'
        },
        {
            value:'-createdAt',
            label:'My Favorites',
            filter: 'favorites'
        }
    ]

    this.sort = this.sortLoggedIn[0]


}]);
