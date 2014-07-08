var eventservices = angular.module('crmEngine.eventservices',[]);

eventservices.factory('Event', function($http) {

  var Event = function(data) {
    angular.extend(this, data);
  }

  Event.get = function($scope,id) {
          gapi.client.crmengine.events.get(id).execute(function(resp) {
            if(!resp.code){
               $scope.event = resp;
               /*var url = Event.getUrl($scope.eventt.about.kind,$scope.eventt.about.id);
               $scope.uri =url;*/
              /* $scope.listContributors();*/
               //$scope.ListComments();
               console.log($scope.event);
               $scope.isContentLoaded=true;
               $scope.renderMaps();
               // Call the method $apply to make the update on the scope
                $scope.$apply();
                console.log($scope.event.where);
                

            }else {
               if(resp.code==401){
                $scope.refreshToken();
                $scope.isLoading = false;
                $scope.$apply();
               };
            }
            console.log('gapi #end_execute');
          });
  };
  Event.patch = function($scope,params){
      $scope.isLoading = true;
      gapi.client.crmengine.events.patch(params).execute(function(resp) {

          if(!resp.code){
            /*
            for (var k in params){
                 if (k!='id'&&k!='entityKey'){
                   $scope.event[k] = resp[k];
                 }
            }
            */
            $scope.runTheProcess();
            //$scope.renderMaps();

            //console.log("working");
            /*$scope.ListComments();
            $scope.listContributors();*/
            $scope.isLoading = false;
           /* $scope.listTags();
            $scope.listTasks();*/
            $scope.$apply();


         }else{
            console.log("not working");
            console.log(resp.message);
             if(resp.message=="Invalid grant"){
              console.log("Invalid grant");
                $scope.refreshToken();
                $scope.isLoading = false;
                $scope.listTags();
                $scope.listTasks();
                $scope.$apply();
             };
         }
      });
  };
  Event.list = function($scope,params){


      $scope.isLoading = true;

      gapi.client.crmengine.events.list(params).execute(function(resp) {

              if(!resp.code){



                 $scope.events = resp.items;
                 var calendarEventList = new Array();
                 angular.forEach(resp.items, function(item){
                    var eventSchema = {
                                        'title':item.title,
                                        'url':'/#/events/show/'+item.id.toString(),
                                        'start':item.starts_at,
                                        'end':item.ends_at
                                      };
                    calendarEventList.push(eventSchema);
                 });
                 //$scope.renderCalendar(calendarEventList);
                 /*if ($scope.currentPage>1){
                      console.log('Should show PREV');
                      $scope.pagination.prev = true;
                   }else{
                       $scope.pagination.prev = false;
                   }
                 if (resp.nextPageToken){
                   var nextPage = $scope.currentPage + 1;
                   // Store the nextPageToken
                   $scope.pages[nextPage] = resp.nextPageToken;
                   $scope.pagination.next = true;

                 }else{
                  $scope.pagination.next = false;
                 }
                 */
                 // Loaded succefully
                 $scope.isLoading = false;

                 // Call the method $apply to make the update on the scope
                 $scope.$apply();
                
              }else {
                 if(resp.code==401){
                $scope.refreshToken();
                $scope.isLoading = false;
                $scope.$apply();
               };
              }
      });
  };
   Event.insert = function($scope,params){

      $scope.isLoading = true;

      gapi.client.crmengine.events.insertv2(params).execute(function(resp) {
          if(!resp.code){
            $('#calendar').fullCalendar( 'refetchEvents' );
            if ($scope.events == undefined){
            $scope.events = [];
          }
            $scope.events.push(resp);
            console.log(resp);
            $scope.isLoading = false;
             $scope.permet_clicking=true ;
            $scope.$apply();

         }else{

             $('#newEventModal').modal('hide');
             $('#errorModal').modal('show');
             if(resp.message=="Invalid grant"){
                $scope.refreshToken();
                $scope.isLoading = false;
                $scope.$apply();
             };
         }
      });
  };
Event.getUrl = function(type,id){
  var base_url = undefined;
    switch (type)
        {
        case 'Account':
          base_url = '/#/accounts/show/';
          break;
        case 'Contact':
          base_url = '/#/contacts/show/';
          break;
        case 'Lead':
          base_url = '/#/leads/show/';
          break;
        case 'Opportunity':
          base_url = '/#/opportunities/show/';
          break;
        case 'Case':
          base_url = '/#/cases/show/';
          break;
        case 'Show':
          base_url = '/#/live/shows/show/';
          break;
          case 'Feedback':
          base_url='/#/live/feedbacks/feedback/';
          break;
        }

    return base_url+id;

 };

 Event.delete = function($scope,params){
    
    $scope.isLoading=true;
    gapi.client.crmengine.events.delete(params).execute(function(resp){
      $scope.eventDeleted();
      $scope.isLoading=true;
      $scope.$apply();
    });
    

  };



return Event;
});
