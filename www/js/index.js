var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        document.addEventListener("backbutton", function(e){
            if($.mobile.activePage.is('#home')){
                e.preventDefault();
            }
            else{
                history.back();
            }
        }, false);

        var platformName = routing.getPlatform();

        document.body.getElementsByClassName("system-os")[0].className += (" " + platformName); 

        storage.setItem("platform", platformName);

        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        var pushNotification = window.plugins.pushNotification;

        if(device.platform == 'android' || device.platform == 'Android'){

            pushNotification.register(app.successHandler, app.errorHandler, {"senderID":"208073722705","ecb":"app.onNotificationGCM"});
        } 
        else {
            pushNotification.register(app.tokenHandler, app.errorHandler, {"badge":"true", "sound":"true", "alert":"true", "ecb":"app.onNotificationAPN"});
        }
    },
    successHandler: function(result) {
        //alert('Callback Success! Result = ' + result);
    },
    tokenHandler: function(result) {
        //alert('device token = ' + result);
        storage.setItem("token", result);
    },
    errorHandler:function(error) {
        alert(error);
    },
    onNotificationAPN: function(event) {
        if(event.alert){
            navigator.notification.alert(event.alert);
        }

        if(event.sound){
            var snd = new Media(event.sound);
            snd.play();
        }

        if(event.badge){
            pushNotification.setApplicationIconBadgeNumber(app.successHandler, app.errorHandler, event.badge);
        }
        
        //alert(event.payload.msg_id);
        routing.notification(event.payload.msg_id);
    },
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                    //alert('registration id = '+ e.regid);
                    storage.setItem("token", e.regid);
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              alert('message = '+e.message+' msgcnt = '+e.msgcnt);
              routing.notification(e.msg_id);
              pushNotification.setApplicationIconBadgeNumber(app.successHandler, app.errorHandler, 3 );
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
    }
};
