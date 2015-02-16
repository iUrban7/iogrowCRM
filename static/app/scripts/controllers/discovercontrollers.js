app.controller('DiscoverListCtrl', ['$scope','Auth','Discover','Tag','Lead',
    function($scope,Auth,Discover,Tag,Lead){

     $("ul.page-sidebar-menu li").removeClass("active");
        $("#id_Discovery").addClass("active");
        document.title = "Discovery: Home";
        $scope.selectedTab=2;
        $scope.selectedOption = 'all';
        $scope.isSignedIn = false;
        $scope.immediateFailed = false;
        $scope.nextPageToken = undefined;
        $scope.prevPageToken = undefined;
        $scope.isLoading = false;
        $scope.isMoreItemLoading = false;
        $scope.pagination = {};
        $scope.currentPage = 01;
        $scope.pages = [];
        $scope.accounts = [];
        $scope.account = {};
        $scope.selected_tags = [];
        $scope.account.access = 'public';
        $scope.order = '-updated_at';
        $scope.account.account_type = 'Customer';
        $scope.draggedTag = null;
        $scope.tag = {};
        $scope.tweets = [];
        $scope.influencers=[];
        $scope.testtitle = "Customer Support Customer Support";
        $scope.showNewTag = false;
        $scope.showUntag = false;
        $scope.edgekeytoDelete = undefined;
        $scope.more=true;
        $scope.actual_tag=[];
        $scope.tags=[];
        //Manage Color
        $scope.color_pallet = [
            {'name': 'red', 'color': '#F7846A'},
            {'name': 'orange', 'color': '#FFBB22'},
            {'name': 'yellow', 'color': '#EEEE22'},
            {'name': 'green', 'color': '#BBE535'},
            {'name': 'blue', 'color': '#66CCDD'},
            {'name': 'gray', 'color': '#B5C5C5'},
            {'name': 'teal', 'color': '#77DDBB'},
            {'name': 'purple', 'color': '#E874D6'},
        ];
        $scope.tag.color = {'name': 'green', 'color': '#BBE535'};
        $scope.selectedAccount=null;
         $scope.currentAccount=null;
         $scope.showTagsFilter=false;
         $scope.showNewTag=false;
        $scope.keywords=[];
        $scope.tweetsFromApi={};
        var keyw=[];
        var list_of_tags={};
      $scope.isLoadingtweets=false;
      $scope.tweet_details={};
      $scope.mapshow=false;
      $scope.tweetsshow=true;
      $scope.influencersshow=false;
      $scope.props = {
        target: '_blank',
        otherProp: 'otherProperty'
    };
    $('#popup_keywords').modal('hide');
    $scope.influencers=[];
     // What to do after authentication
     $scope.runTheProcess = function(){
      console.log("tweetrrrr");
      console.log($scope.selectedOption );
      //$scope.selectedOption = 'all';
        $scope.mapshow=false;
        $scope.tweetsshow=true;
        $scope.influencersshow=false;
        $scope.tweets=[];
        
        var params = {
                      'limit':20
                      };
        // Discover.get_recent_tweets($scope,params);
        var p={
          "page":1,
          "limit":20
        }
        Discover.get_tweetsV2($scope,p);

        //var kind = 'topics';
        var paramsTag = {'about_kind':'topics'};
        Tag.list($scope,paramsTag);

        ga('send', 'pageview', '/discovery');
        
     };
     $scope.apply=function(){
         
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
               $scope.$apply();
              }
              return false;
    }
    $scope.inProcess=function(varBool,message){
          if (varBool) {  
            console.log("inProcess starts");      
            if (message) {
              console.log("starts of :"+message);
             
            };
            $scope.nbLoads=$scope.nbLoads+1;
             var d = new Date();
             console.log(d.getTime());
            if ($scope.nbLoads==1) {
              $scope.isLoading=true;
            };
          }else{
            if (message) {
              console.log("ends of :"+message);
            };
            console.log("inProcess ends");
            var d = new Date();
            console.log(d.getTime());
            $scope.nbLoads=$scope.nbLoads-1;
            if ($scope.nbLoads==0) {
               $scope.isLoading=false;
 
            };

          };
        } 
     // We need to call this to refresh token when user credentials are invalid
     $scope.refreshToken = function() {
            Auth.refreshToken();
     };
      $scope.inProcess=function(varBool,message){
          if (varBool) {   
            if (message) {
              console.log("starts of :"+message);
             
            };
            $scope.nbLoads=$scope.nbLoads+1;
            if ($scope.nbLoads==1) {
              $scope.isLoading=true;
            };
          }else{
            if (message) {
              console.log("ends of :"+message);
            };
            $scope.nbLoads=$scope.nbLoads-1;
            if ($scope.nbLoads==0) {
               $scope.isLoading=false;
            };
          };
        }
     $scope.fromNow = function(fromDate){
          var converted_date ={};
          if (typeof(fromDate)=="string"){
            converted_date= new Date(fromDate);
          }
          else {converted_date= new Date(fromDate["$date"]);}
          return moment(converted_date).fromNow();
      }
     $scope.listMoreItems = function(){
        if ($scope.isFiltering && $scope.pageToken){
            var tags = [];
            angular.forEach($scope.selected_tags, function(tag){
                  tags.push(tag.name);
            });
            var params = {
                      'keywords':tags,
                      'limit':20,
                      'page': $scope.page
                      };
            console.log('==================list more items with filtering =============');
            console.log(params);
            Discover.get_tweetsV2($scope,params);
        }else{
            if($scope.pageToken){
                $scope.isLoadingtweets = true;
                $scope.$apply();
                var params = {
                          'limit':20,
                          'page': $scope.page
                          };
                console.log('==================list more items=============');
                console.log(params);
                Discover.get_tweetsV2($scope,params);
            }
        }
     }

     $scope.listNewItems = function(){
        var params = {
                      'limit':20,
                      'page': $scope.page
                      };
        Discover.get_tweetsV2($scope,params);
     }
    $scope.popitup =  function(url) {
        newwindow=window.open(url,'name','height=400,width=300');
        if (window.focus) {newwindow.focus()}
        return false;
    }
     $scope.markAsLead = function(tweet){
          var firstName = tweet.user.name.split(' ').slice(0, -1).join(' ') || " ";
          var lastName = tweet.user.name.split(' ').slice(-1).join(' ') || " ";
          var infonodes = [];
          // twitter url
          var infonode = {
                            'kind':'sociallinks',
                            'fields':[
                                    {
                                    'field':"url",
                                    'value':'https://twitter.com/'+tweet.user.screen_name
                                    }
                            ]
                          }
          infonodes.push(infonode);
          // location
          infonode = {
                            'kind':'addresses',
                            'fields':[
                                    {
                                    'field':"city",
                                    'value': tweet.user.author_location
                                    }
                            ]
                          }
          infonodes.push(infonode);
          var image_profile = '';
          if (tweet.profile_image){
            image_profile = tweet.profile_image;
          }
          else if (tweet.profile_image_url) {
            image_profile = tweet.profile_image_url;
          }
          var params ={
                        'firstname':firstName,
                        'lastname':lastName,
                        'tagline':tweet.description,
                        'source':'Twitter',
                        'access': 'public',
                        'infonodes':infonodes,
                        'profile_img_url':image_profile
                      };
          Lead.insert($scope,params);
     }
     $scope.leadInserted = function(){
        $scope.markedAsLead=true;
        $scope.$apply();
        setTimeout(function(){
            $scope.markedAsLead=false;
            $scope.$apply();
        }, 2000);
     }
     $scope.showNewTagForm=function(){
            $scope.showNewTag=true;
            $( window ).trigger( 'resize' );  
          }
          $scope.hideNewTagForm=function(){
            $scope.showNewTag=false;
            $( window ).trigger( 'resize' ); 
          }
          $scope.hideTagFilterCard=function(){
            $scope.showTagsFilter=false;
            $( window ).trigger( 'resize' ); 
          }

     $scope.listTags=function(){
      var paramsTag = {'about_kind':'topics'}
      Tag.list($scope,paramsTag);
      $scope.listNewItems();
     };
     $scope.hide_maximum_keywords_popup=function(){
      $('#popup_keywords').modal('hide');
     };
     $scope.addNewtag = function(tag){
      
      list=[]
      
      
      if(typeof $scope.tags === 'undefined'){
          list=[]
      }else{
        list=$scope.tags;
      }
      console.log(list.length);
      console.log($scope.tags);
      console.log("lll");
      if (list.length>2){
        $("#popup_keywords").modal('show');
      }else{
      $scope.isLoading = true;
      console.log(keyw);
      console.log("keywww");
      keyw.push(tag.name);
      for (var id in $scope.tags){
          keyw.push($scope.tags[id].name);
        }

       list_of_tags={"value":keyw};

       var params = {
                          'name': tag.name,
                          'about_kind':'topics',
                          'color':tag.color.color,
                          'order':'recent'
                      };
        Tag.insert($scope,params);
        $scope.tag.name='';
        $scope.tag.color= {'name':'green','color':'#BBE535'};
     }

   }
     $scope.updateTag = function(tag){
            params ={ 'id':tag.id,
                      'title': tag.name,
                      'status':tag.color
            };
      Tag.patch($scope,params);
  };
  $scope.deleteTag=function(tag){
          params = {
            'entityKey': tag.entityKey
          }
          console.log("iiiiiddddddddddddddd");
          Tag.delete($scope,params);
          console.log(tag.name);
          //Discover.delete_tweets(tag.name);
          Discover.delete_topic(tag.name);
          var paramsTag = {'about_kind':'topics'};
          console.log("lissssssssssss");
          Tag.list($scope,paramsTag);
          $scope.listTags();
          $scope.runTheProcess();

      };

  $scope.popular_tweets=function(){

          $scope.mapshow=false;
      $scope.tweetsshow=true;
         $scope.tweets={};
         Discover.get_recent_tweets($scope,"popular");

          var paramsTag = {'about_kind':'topics'};
        Tag.list($scope,paramsTag);   
        };

$scope.selectTag= function(tag,index,$event){

          
          if(!$scope.manage_tags){
         var element=$($event.target);
         if(element.prop("tagName")!='LI'){
              element=element.parent();
              element=element.parent();
         }
         var text=element.find(".with-color");
         if($scope.selected_tags.indexOf(tag) == -1){
            $scope.selected_tags.push(tag);
            ($scope.actual_tag).push(tag.name);
            /*element.css('background-color', tag.color+'!important');
            text.css('color',$scope.idealTextColor(tag.color));*/

         }else{
          /*  element.css('background-color','#ffffff !important');*/
          
          ($scope.actual_tag).splice(($scope.actual_tag).indexOf(tag.name),1);
          

            $scope.selected_tags.splice($scope.selected_tags.indexOf(tag),1);
             /*text.css('color','#000000');*/
         }
         if ($scope.influencersshow){
          Discover.get_influencers_v2($scope);
         }else{
         $scope.filterByTags($scope.selected_tags);
       }

      }
      

    };
  $scope.filterByTags = function(selected_tags){
      $scope.isFiltering = true;
      var tags = [];
      angular.forEach(selected_tags, function(tag){
            tags.push(tag.name);
      });
      $scope.page=1;
      var params = {
                      'limit':20,
                      'keywords':tags,
                      'page':$scope.page
                      };
      Discover.get_tweetsV2($scope,params);
  };

$scope.unselectAllTags= function(){
        $('.tags-list li').each(function(){
            var element=$(this);
            var text=element.find(".with-color");
             element.css('background-color','#ffffff !important');
             text.css('color','#000000');
        });
     };
//HKA 19.02.2014 When delete tag render account list
 $scope.tagDeleted = function(){
    $scope.listNewItems();
    $scope.listTags();
     };
 $scope.manage=function(){
        $scope.unselectAllTags();
      };
$scope.tag_save = function(tag){
          if (tag.name) {
             Tag.insert($scope,tag);

           };
      };
// $scope.turnOff= function(){
//     $scope.hideCheckBox= true;
//   }

$scope.editTag=function(tag){
        $scope.edited_tag=tag;
     }
$scope.doneEditTag=function(tag){
   
        $scope.edited_tag=null;
        $scope.updateTag(tag);
     }
$scope.addTags=function(){
      var tags=[];
      var items = [];
      tags=$('#select2_sample2').select2("val");

      angular.forEach($scope.selected_tasks, function(selected_task){
          angular.forEach(tags, function(tag){
            var edge = {
              'start_node': selected_task.entityKey,
              'end_node': tag,
              'kind':'tags',
              'inverse_edge': 'tagged_on'
            };
            items.push(edge);
          });
      });

      params = {
        'items': items
      }

      Edge.insert($scope,params);
      $('#assigneeTagsToTask').modal('hide');

     };

     var handleColorPicker = function () {
          if (!jQuery().colorpicker) {
              return;

          }
          $('.colorpicker-default').colorpicker({
              format: 'hex'
          });
      }
      handleColorPicker();

      $('#addMemberToTask > *').on('click', null, function(e) {
            e.stopPropagation();
        });
      $scope.idealTextColor=function(bgColor){
        var nThreshold = 105;
         var components = getRGBComponents(bgColor);
         var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

         return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
      }
      function getRGBComponents(color) {

          var r = color.substring(1, 3);
          var g = color.substring(3, 5);
          var b = color.substring(5, 7);

          return {
             R: parseInt(r, 16),
             G: parseInt(g, 16),
             B: parseInt(b, 16)
          };
      }
      $scope.dragTag=function(tag){
        $scope.draggedTag=tag;
         //$scope.$apply();
      };
      $scope.dropTag=function(contact,index){
        var items = [];

        var params = {
              'parent': contact.entityKey,
              'tag_key': $scope.draggedTag.entityKey
        };
        $scope.draggedTag=null;
        Tag.attach($scope,params,index);

      };
      $scope.tagattached=function(tag,index){
          if ($scope.contacts[index].tags == undefined){
            $scope.contacts[index].tags = [];
          }
           var ind = $filter('exists')(tag, $scope.contacts[index].tags);
           if (ind == -1) {
                $scope.contacts[index].tags.push(tag);
                var card_index = '#card_'+index;
                $(card_index).removeClass('over');
            }else{
                 var card_index = '#card_'+index;
                $(card_index).removeClass('over');
            }

              $scope.$apply();
      };

  // HKA 12.03.2014 Pallet color on Tags
      $scope.checkColor=function(color){
        $scope.tag.color=color;
      }
 //HKA 19.06.2014 Detache tag on contact list
     $scope.dropOutTag=function(){


        var params={'entityKey':$scope.edgekeytoDelete}
        Edge.delete($scope,params);

        $scope.edgekeytoDelete=undefined;
        $scope.showUntag=false;
      };
      $scope.dragTagItem=function(edgekey){
        $scope.showUntag=true;
        $scope.edgekeytoDelete=edgekey;
      };

     $scope.listNextPageItems = function(){
        
        
        var nextPage = $scope.currentPage + 1;
        var params = {};
          if ($scope.pages[nextPage]){
            params = {'limit':7,
                      'pageToken':$scope.pages[nextPage]
                     }
          }else{
            params = {'limit':7}
          }
          console.log('in listNextPageItems');
          $scope.currentPage = $scope.currentPage + 1 ; 
          User.list($scope,params);
     }
     $scope.listPrevPageItems = function(){
       
       var prevPage = $scope.currentPage - 1;
       var params = {};
          if ($scope.pages[prevPage]){
            params = {'limit':7,
                      'pageToken':$scope.pages[prevPage]
                     }
          }else{
            params = {'limit':7}
          }
          $scope.currentPage = $scope.currentPage - 1 ;
          User.list($scope,params);
     }
    

     
     $scope.showModal = function(){
        console.log('button clicked');
        $('#addAccountModal').modal('show');

      };
      
    $scope.addNewUser = function(user){
      console.log('add a new user');
      console.log(user);
      $('#addAccountModal').modal('hide');
      User.insert($scope,user);
    };
    

    $scope.getPosition= function(index){
        if(index<4){
         
          return index+1;
        }else{
          return (index%4)+1;
        }
     };
$scope.influencers= function(){
  
  
  $scope.selectedOption = 'my';
  $scope.mapshow=false;
        $scope.tweetsshow=false;
        $scope.influencersshow=true;
  $scope.influencers_list={};
     
          
          values=$scope.tweets;
          //var list_tweets={values[0]:values[0]["author_location"],values[1]:values[0]["author_location"]};
          //console.log(list_tweets);
          var list_tweets={};
          for (var i in values){
            list_tweets[i]=values[i]["author_followers_count"]
          }
          //console.log(list_tweets);
          var list = {"you": 100, "me": 75, "foo": 116, "bar": 15};
          list["new"]=88;
          //console.log(list);
          keysSorted = Object.keys(list_tweets).sort(function(a,b){return list_tweets[b]-list_tweets[a]})
          //console.log(keysSorted);
          $scope.influencers_list={};
          var list=[];
          for (var i in keysSorted){
            list.push(values[keysSorted[i]]);
            
            //console.log(values[keysSorted[i]])
          }
          //$scope.tweets.push(list);
          console.log(list.length);
          if (list.length<10){
            $scope.influencers_list=list;
          }else{
            var list2=[];
            for (i=0; i<10;i++){
              list2.push(list[i]);
            }
            $scope.influencers_list=list2;
          }
          
          console.log($scope.influencers_list);

};

$scope.influencers_V2= function(){
  $scope.selectedOption = 'my';
  $scope.mapshow=false;
        $scope.tweetsshow=false;
        $scope.influencersshow=true;
  $scope.influencers_list={};
  
  
  Discover.get_influencers_v2($scope);
};     
   


     $scope.showMaps= function(){
      console.log("mapp");
      console.log($scope.selectedOption );
      $scope.selectedOption = 'map';
             
           $scope.tweetsshow=false;
      $scope.mapshow=true;
      $scope.influencersshow=false;
      
      //Discover.get_location($scope);
      $scope.initialize();
        
            };
$scope.initialize= function(){
          values=$scope.tweets;
          var counts_objects = [];
          
          var objects=[];
           var mapOptions = {
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            center: new google.maps.LatLng(15.363882, 11.044922)
          };
          var lat=[];
          var lon=[];
          if (values ) {
            for (var i = 0; i < values.length; i++) {
              if (values[i]['latitude'] ){
               
              objects.push({"location":values[i]["author_location"],"number":1 ,"latitude":values[i]['latitude'],"longitude":values[i]['longitude'],"topic":values[i]['topic']});
             lat.push(values[i]['latitude']);
            lon.push(values[i]['longitude']);  
            }       
          }
          var item=[];
          
          var list_location=[];
          for (var ele in objects){
            var iz=String(objects[ele]["location"]);
            var boo=$.inArray(iz,list_location);
            if (boo!=-1){
              for (var e in item){
                if(item[e]["location"]==objects[ele]["location"]){
                  item[e]["number"]=item[e]["number"]+1
                }
              }
            }else{
              list_location.push(objects[ele]['location'])
              item.push(objects[ele]);
            }
          }
          console.log(item);
        }
          
          var map = new google.maps.Map(document.getElementById('map-canvas'),
              mapOptions);
 
         

          for (var i = 0; i < item.length ; i++) {
            
             var marker = new google.maps.Marker({
              position: new google.maps.LatLng(item[i]["latitude"] , item[i]["longitude"]),
              map: map
            });


            marker.setTitle(item[i]['location']);
            $scope.adddialgo(marker,item[i]["number"],item[i]["location"],item[i]["topic"])

            //var message = [values[i][0]];
          
          }

       

};
 
// It should go something like this: 
$scope.adddialgo= function (marker,val,location,topic){
          var topics="";
          for (id in $scope.tweets){
            if(location==$scope.tweets[id].author_location){
              if (topics!=""){
                if (topics.indexOf($scope.tweets[id].topic) == -1) {
                  topics=topics+" and " + $scope.tweets[id].topic;
                }
            }else{
              topics=$scope.tweets[id].topic;
            }
          }

            }
          
          var infowindow = new google.maps.InfoWindow({

            //content: val+' tweets from '+location+ " related to " + topic
          content:val + ' tweet from '+location+ " related to " + topic
          });
          


          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(marker.get('map'), marker);
          });
};




   $scope.page=1
  // Google+ Authentication 
    Auth.init($scope);
    $(window).scroll(function() {
            if (!$scope.isLoadingtweets  && $scope.more && ($(window).scrollTop() > $(document).height() - $(window).height() - 100)) {
              var keywords = [];
              angular.forEach($scope.selected_tags, function(tag){
                  keywords.push(tag.name);
              });
              var p={
                "keywords":keywords,
                "page":$scope.page,
                "limit":20
              }

                Discover.get_tweetsV2($scope,p);
            }
        });
    
}]);


app.controller('DiscoverNewCtrl', ['$scope','Auth','Discover','Tag',
    function($scope,Auth,Discover,Tag){

     $("ul.page-sidebar-menu li").removeClass("active");
        $("#id_Discover").addClass("active");
        document.title = "Discovery: Home";
        $scope.selectedTab=2;
        $scope.selectedOption = 'all';
        $scope.isSignedIn = false;
        $scope.immediateFailed = false;
        $scope.nextPageToken = undefined;
        $scope.prevPageToken = undefined;
        $scope.isLoading = false;
        $scope.isMoreItemLoading = false;
        $scope.pagination = {};
        $scope.currentPage = 01;
        $scope.pages = [];
        $scope.accounts = [];
        $scope.account = {};
        $scope.selected_tags = [];
        $scope.account.access = 'public';
        $scope.order = '-updated_at';
        $scope.account.account_type = 'Customer';
        $scope.draggedTag = null;
        $scope.tag = {};
        $scope.tweets = {};
        $scope.testtitle = "Customer Support Customer Support";
        $scope.showNewTag = false;
        $scope.showUntag = false;
        $scope.edgekeytoDelete = undefined;
        //Manage Color
        $scope.color_pallet = [
            {'name': 'red', 'color': '#F7846A'},
            {'name': 'orange', 'color': '#FFBB22'},
            {'name': 'yellow', 'color': '#EEEE22'},
            {'name': 'green', 'color': '#BBE535'},
            {'name': 'blue', 'color': '#66CCDD'},
            {'name': 'gray', 'color': '#B5C5C5'},
            {'name': 'teal', 'color': '#77DDBB'},
            {'name': 'purple', 'color': '#E874D6'},
        ];
        $scope.tag.color = {'name': 'green', 'color': '#BBE535'};
        $scope.selectedAccount=null;
         $scope.currentAccount=null;
         $scope.showTagsFilter=false;
         $scope.showNewTag=false;
         $scope.topic="";
      $scope.inProcess=function(varBool,message){
          if (varBool) {   
            if (message) {
              console.log("starts of :"+message);
             
            };
            $scope.nbLoads=$scope.nbLoads+1;
            if ($scope.nbLoads==1) {
              $scope.isLoading=true;
            };
          }else{
            if (message) {
              console.log("ends of :"+message);
            };
            $scope.nbLoads=$scope.nbLoads-1;
            if ($scope.nbLoads==0) {
               $scope.isLoading=false;
            };
          };
        }       
        $scope.apply=function(){
         
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
               $scope.$apply();
              }
              return false;
        }
     // What to do after authentication
     $scope.runTheProcess = function(){
          ga('send', 'pageview', '/discovery/new');
     };
     $scope.addNewTopic=function(){
      console.log($scope.topic);
      var params = {
                          'name': $scope.topic,
                          'about_kind':'topics',
                          'color':$scope.tag.color.color
                      };
      console.log(params);
      $scope.fromnewtab=true;
       Tag.insert($scope,params);
       console.log("inserts");
      var paramsTag = {'about_kind':'topics'};
        Tag.list($scope,paramsTag);
        
        
      //window.location.reload('#/discovers/');

     }


  // Google+ Authentication 
    Auth.init($scope);
    
}]);


app.controller('DiscoverShowCtrl', ['$scope','Auth','Discover','Tag',
    function($scope,Auth,Discover,Tag){

     $("ul.page-sidebar-menu li").removeClass("active");
        $("#id_Discover").addClass("active");
        document.title = "Discovery: Home";
        $scope.selectedTab=2;
        $scope.selectedOption = 'all';
        $scope.isSignedIn = false;
        $scope.immediateFailed = false;
        $scope.nextPageToken = undefined;
        $scope.prevPageToken = undefined;
        $scope.isLoading = false;
        $scope.isMoreItemLoading = false;
        $scope.pagination = {};
        $scope.currentPage = 01;
        $scope.pages = [];
        $scope.accounts = [];
        $scope.account = {};
        $scope.selected_tags = [];
        $scope.account.access = 'public';
        $scope.order = '-updated_at';
        $scope.account.account_type = 'Customer';
        $scope.draggedTag = null;
        $scope.tag = {};
        $scope.tweets = {};
        $scope.testtitle = "Customer Support Customer Support";
        $scope.showNewTag = false;
        $scope.showUntag = false;
        $scope.edgekeytoDelete = undefined;
        //Manage Color
        $scope.color_pallet = [
            {'name': 'red', 'color': '#F7846A'},
            {'name': 'orange', 'color': '#FFBB22'},
            {'name': 'yellow', 'color': '#EEEE22'},
            {'name': 'green', 'color': '#BBE535'},
            {'name': 'blue', 'color': '#66CCDD'},
            {'name': 'gray', 'color': '#B5C5C5'},
            {'name': 'teal', 'color': '#77DDBB'},
            {'name': 'purple', 'color': '#E874D6'},
        ];
        $scope.tag.color = {'name': 'green', 'color': '#BBE535'};
        $scope.selectedAccount=null;
         $scope.currentAccount=null;
         $scope.showTagsFilter=false;
         $scope.showNewTag=false;
         $scope.topic="";
         $scope.tweet_details={};
         $scope.tweet_id="";
         $scope.inProcess=function(varBool,message){
          if (varBool) {   
            if (message) {
              console.log("starts of :"+message);
             
            };
            $scope.nbLoads=$scope.nbLoads+1;
            if ($scope.nbLoads==1) {
              $scope.isLoading=true;
            };
          }else{
            if (message) {
              console.log("ends of :"+message);
            };
            $scope.nbLoads=$scope.nbLoads-1;
            if ($scope.nbLoads==0) {
               $scope.isLoading=false;
            };
          };
        }       
        $scope.apply=function(){
         
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
               $scope.$apply();
              }
              return false;
        }

     // What to do after authentication
     $scope.runTheProcess = function(){
      var url=document.URL;
      if (url.indexOf("*")>-1){
        url=url.replace("*","");
        $scope.selectedTab=1;
      }else{
        $scope.selectedTab=2;
      }
      var tweet_id=url.substring(url.indexOf("show")+5);
      console.log(tweet_id);
      
      $scope.tweet_id=tweet_id;
      Discover.get_tweets_details($scope);


      ga('send', 'pageview', '/discovery/show');

     };



  // Google+ Authentication 
    Auth.init($scope);
    
}]);
