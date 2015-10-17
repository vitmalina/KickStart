/****************************************************
*  --- Profile Module
*/

app.register('profile', function (files) {
    // private 
    var config;
    var layout  = w2ui.app_layout;
    var toolbar = w2ui.app_toolbar;

    init();
    return {
        open        : open,
        action      : action,
        editProfile : editProfile,
        changePhoto : changePhoto,
        changePass  : changePass
    };

    function init () {
        eval(files['app/main/profile/config.js']);
        $().w2layout(config.profile_layout);
        $().w2sidebar(config.profile_sidebar);
        $().w2form(config.profile_edit);
    }

    function open (name) {
        if (typeof name == 'undefined') name = 'profile';
        if (['profile', 'my-groups', 'my-roles', 'my-prefs'].indexOf(name) == -1) {
            console.log('ERROR: Wrong argument (name='+ arguments[0] +'). The method prefs.open(name) takes one argument name = profile|my-groups|my-roles|my-prefs.');
            name = 'users';
        }
        w2popup.open({
            title   : 'Preferences',
            width   : 950,
            height  : 700,
            showMax : true,
            body      : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
            onOpen  : function (event) {
                event.onComplete = function () {
                    $('#w2ui-popup #main').w2render('profile_layout');
                    w2ui.profile_layout.content('left', w2ui.profile_sidebar);
                    setTimeout(function () { w2ui.profile_sidebar.click(name); }, 1);
                }
            },
            onToggle: function (event) { 
                event.onComplete = function () {
                }
            }        
        });
    }

    function action (event) {
        var $pro;
        switch (event.target) {
            case 'profile':
                w2ui.profile_layout.content('main', '<style>' + files['app/main/profile/profile.css'] + '</style>' + files['app/main/profile/profile.html']);
                var user = app.main.getSession(true);
                $pro = $(w2ui.profile_layout.el('main'));
                $pro.find('#name').html(user.fname + ' ' + user.lname);
                $pro.find('#email').html('<a href="mailto:'+ user.email +'">'+ user.email +'</a>');
                $pro.find('#userid').val(user.userid);
                $pro.find('#login').val(user.login);
                if (user.photo) $pro.find('#photo').attr('src', user.photo);
                if (user.manager_userid) addDetail('Reports To', user.manager.name);
                if (user.email_alt) addDetail('Email (other)', '<a href="mailto:'+ user.email_alt +'">'+ user.email_alt +'</a>');
                if (user.phone)     addDetail('Phone (primary)', user.phone);
                if (user.phone_alt) addDetail('Phone (mobile)', user.phone_alt);
                if (user.im)        addDetail('IM', user.im);
                if (user.im_alt)    addDetail('IM (other)', user.im_alt);
                if (user.address)   addDetail('Address', user.address.replace(/\n/g, '<br>'));
                var groups = '';
                for (var g in user.groups) groups += user.groups[g] + '<br>';
                if (groups) addDetail('User Groups', groups);
                var roles = '';
                for (var g in user.roles) roles += user.roles[g] + '<br>';
                if (roles) addDetail('Assigned Roles', roles);
                // buttons
                $pro.find('#edit-profile').on('click', editProfile);
                $pro.find('#change-photo').on('click', changePhoto);
                $pro.find('#change-pass').on('click', changePass);
                break;
        }

        function addDetail (caption, body) {
            if (body == null || body == '') body = '&nbsp;';
            var html = '<div class="w2ui-field w2ui-span9">'+
                       '     <label>'+ caption +'</label>'+
                       '    <div id="groups" class="prof-details">'+ body +'</div>'+
                       '</div>';
            $pro.find('#details').append(html);
        }
    }

    function editProfile () {
        w2popup.message({
            width   : 500,
            height  : 365,
            html    : '<div id="edit-profile" style="position: absolute; top: 0; left: 0; right: 0; bottom: 56px; margin: 7px;"></div>'+
                      '<div style="position: absolute; left: 0; right: 0; bottom: 0; height: 55px; padding-top: 12px; text-align: center">'+
                      '     <button class="w2ui-btn btn-blue" id="btn-save">Save</button>'+
                      '     <button class="w2ui-btn" id="btn-close" onclick="w2popup.message()">Cancel</button>'+
                      '</div>',
            onOpen  : function () {
                var user = app.main.getSession();
                var form = w2ui.profile_edit;
                form.recid   = user.userid;
                form.record  = user;
                $('#w2ui-popup #edit-profile').w2render('profile_edit');
                $('#w2ui-popup #edit-profile').find('.w2ui-page').css('overflow', 'hidden');
                $('#w2ui-popup #btn-save').on('click', function () {
                    form.save(function (data) {
                        w2popup.message();
                        action({ target: 'profile' });
                    });
                });
            }
        });
    }

    function changePass () {
        w2popup.message({
            width   : 450,
            height  : 180,
            html    : '<div id="change-password" style="position: absolute; top: 10px; left: 0; right: 0; bottom: 56px; margin: 7px;">'+
                      '     <div class="w2ui-field w2ui-span7">'+
                      '         <label>Old Password</label>'+
                      '         <div><input id="pass_old" type="password" style="width: 210px"></div>'+
                      '     </div>'+
                      '     <div class="w2ui-field w2ui-span7">'+
                      '         <label>New Password</label>'+
                      '         <div><input id="pass_new" type="password" style="width: 210px"></div>'+
                      '     </div>'+
                      '     <div class="w2ui-field w2ui-span7">'+
                      '         <label>Retype Password</label>'+
                      '         <div><input id="pass_new2" type="password" style="width: 210px"></div>'+
                      '     </div>'+
                      '</div>'+
                      '<div style="position: absolute; left: 0; right: 0; bottom: 0; height: 55px; padding-top: 12px; text-align: center">'+
                      '     <button class="w2ui-btn w2ui-btn-blue" id="btn-save">Save</button>'+
                      '     <button class="w2ui-btn" id="btn-close" onclick="w2popup.message()">Cancel</button>'+
                      '</div>',
            onOpen  : function () {
                $('#w2ui-popup #btn-save').on('click', function () {
                    var pass_old  = $('#change-password #pass_old').val();
                    var pass_new  = $('#change-password #pass_new').val();
                    var pass_new2 = $('#change-password #pass_new2').val();
                    if (pass_new != pass_new2) {
                        $('#change-password #pass_new2').w2tag('Passwords do not match');
                        return;
                    }
                    $.ajax({ 
                            url: app.context + '/api/user/password', 
                            method: app.apiMethod('POST'),
                            data: {
                                pass_old : pass_old,
                                pass_new : pass_new
                            }
                        })
                        .done(function (data, status, xhr) {
                            if (!data || data.status != 'success') {
                                w2alert('ERROR: '+ (data.message || ''))
                            } else {
                                w2popup.message();
                                w2alert('Password was chagned successfully.');
                            }
                        })
                        .fail(function () {
                            w2alert('ERROR: Unknown ajax error.');
                        });
                });
                setTimeout(function () {
                    $('#change-password #pass_old').focus();
                }, 100);
            }
        });
    }

    function changePhoto () {
        var video, canvas, mStream, imageData;
        w2popup.message({
            width   : 610,
            height  : 340,
            html    : '<div id="change-photo" style="position: absolute; top: 20px; left: 30px; width: 560px; height: 245px;">'+
                      '     <div style="width: 322px; height: 242px; position: relative; float: left; background-color: white; border: 1px solid silver">'+
                      '         <div style="position: absolute; top: 90px; left: 0px; right: 0px; text-align: center; font-size: 16px; color: #999;">Your Camera</div>'+
                      '         <video id="video" style="position: absolute; width: 320px; height: 240px" autoplay="true"></video>'+
                      '         <div style="position: absolute; left: 0px; top: 0px; bottom: 0px; width: 53px; background-color: white; opacity: 0.6;"></div>'+
                      '         <div style="position: absolute; right: 0px; top: 0px; bottom: 0px; width: 53px; background-color: white; opacity: 0.6;"></div>'+
                      '     </div>'+
                      '     <div style="margin-left: 340px">'+
                      '         <div style="width: 213px; height: 240px; background-color: white; border: 0px solid silver; border-radius: 3px;">'+
                      '             <img id="mImage" style="width: 213px; height: 240px; border: 0px;">'+
                      '         </div>'+
                      '     </div>'+
                      '     <canvas id="canvas" style="display: none"></canvas>'+
                      '</div>'+
                      '<div style="position: absolute; left: 0; right: 0; bottom: 0; height: 65px; padding-top: 12px; text-align: center">'+
                      '     <button class="w2ui-btn" id="btn-snap">Take Snapshot</button>'+
                      '     <button class="w2ui-btn w2ui-btn-blue" id="btn-save" disabled>Save</button>'+
                      '     <button class="w2ui-btn" id="btn-cancel">Cancel</button>'+
                      '</div>',
            onOpen  : function () {
                video   = $('#change-photo #video')[0];
                canvas  = $('#change-photo #canvas')[0];
                var ctx     = canvas.getContext("2d");
                var mImage  = $('#change-photo #mImage')[0]; 
                // prepare camera
                navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia 
                    || navigator.mozGetUserMedia || navigator.msGetUserMedia);
                if (!navigator.getMedia) {
                    w2alert('Your browser does not support video stream.');
                    return;
                } 
                navigator.getMedia({
                    video : true,
                    audio : false
                }, function (stream) {
                    if (navigator.mozGetUserMedia) { // Firefox
                        video.mozSrcObject = stream;
                    } else { // Chrome
                        var vendorURL = window.webkitURL || window.URL;
                        video.src = vendorURL.createObjectURL(stream);
                    }
                    video.play();       // Start the video in webcam
                    mStream = stream;   // Store the video stream
                }, function (e) {
                    w2popup.message();
                    w2alert("An error occured! " + (e.name || e));
                });    
                $('#w2ui-popup #btn-snap').on('click', function () {            
                    if (!mStream) return;
                    var r  = 1.125; // ratio
                    var sw = video.videoWidth;
                    var sh = video.videoHeight;
                    var dw = sh / r;
                    var dh = sh;
                    var f
                    // Draw on canvas
                    canvas.width  = dw;
                    canvas.height = dh;
                    // Draw on image
                    ctx.drawImage(video, (sw-dw)/2, 0, dw, dh, 0, 0, dw, dh);
                    imageData = canvas.toDataURL("image/jpeg"); 
                    mImage.src = imageData;
                    $('#w2ui-popup #btn-save').prop('disabled', false);
                });
                $('#w2ui-popup #btn-cancel').on('click', function () {
                    if (mStream) mStream.stop();
                    w2popup.message();
                });
                $('#w2ui-popup #btn-save').on('click', function () {
                    if (!imageData) return;
                    // save photo
                    $.ajax({ 
                            url: app.context + '/api/user/save-photo', 
                            method: app.apiMethod('POST'),
                            data: { photo : imageData }
                        })
                        .done(function (data, status, xhr) {
                            if (!data || data.status != 'success') {
                                w2alert('ERROR: '+ (data.message || ''))
                            } else {
                                w2popup.message();
                                mStream.stop();
                                action({ target: 'profile' });
                            }
                        })
                        .fail(function () {
                            w2alert('ERROR: Unknown ajax error.');
                        });
                });
            }
        });
     }
});