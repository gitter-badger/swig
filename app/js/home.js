/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const {ipcRenderer} = require('electron');

let home = {};



/**
    @namespace home.logs
**/
(function(home, $, ipcRenderer){
    let $cache = {};
    
    ipcRenderer.on('get-logs-response', (event, data) => {
        var $html = $('<div class="list-of-logs"></div>');
        
        data.forEach((val, index, array) => {
            $html.append(`<div class="log-name" data-href="${val.href}">${val.name}</div>`);
        });
        
        $cache.logScreen.find('.sandbox-logs-list').html($html);
        $cache.logScreen.find('.log-name').on('click', events.getLog);
        $cache.logScreen.addClass('active');
        initPage();
        home.utils.loader.hide();
    });
    
    ipcRenderer.on('get-log-file', (event, data) => {
        let $html = $('<div class="log-view"></div>');
        data = data.replace(/\[20/g, '{!BREAK}[20');
        
        let tailGroups = data.split(/\{\!TAIL\}/);
        
        tailGroups.forEach((val, index, array) => {
            let $tail = $('<div class="tail-group"></div>');
            
            let logEntries = val.split(/\{\!BREAK\}/);
    
            logEntries.forEach((val, index, array) => {
                $tail.append(`<pre style="word-wrap: break-word; white-space: pre-wrap;">${val}</pre>`);
            });
            
            $html.append($tail);
        });

        if(!$cache.logControls.hasClass('active')){
            $cache.logControls.addClass('active');
        }
        
        $cache.logScreen.find('.sandbox-logs-viewer').html($html);
        home.utils.loader.hide();
    });
    
    ipcRenderer.on('reset-log-file', (event, data) => {
        $cache.logScreen.find('.sandbox-logs-viewer').html('Log Cleared');
        home.utils.loader.hide();
    });
    
    let events = {
        openLogsScreen : () => {
            if($cache.logScreen.hasClass('active')){
                $cache.logScreen.removeClass('active');
                $('#app-sandbox-logs').removeClass('active-nav');
            } else {
                $('#app-sandbox-logs').addClass('active-nav');
                
                let creds = getCredentials();
                
                home.utils.loader.show();
                ipcRenderer.send('logs-get-logs', creds);
            }
        },
        
        getLog : (e) => {
            home.utils.loader.show();
            
            let $this = $(e.currentTarget);
            
            let args = {
                log : {
                    href : $this.data('href'),
                    name : $this.html()
                }
            };
            
            // set the active log indicator in the log controls
            $('#active-log .log-name').html(args.log.name);
            
            $cache.activeLog.data('href', args.log.href);
            $cache.activeLog.html(args.log.name);
            
            args.creds = getCredentials();
            
            ipcRenderer.send('logs-get-log', args);
        },
        
        refreshLogList : (e) => {
            let creds = getCredentials();
            
            home.utils.loader.show();
            ipcRenderer.send('logs-get-logs', creds);
        },
        
        refreshLogFile : (e) => {
            home.utils.loader.show();
            
            let args = {
                log : {
                    href : $cache.activeLog.data('href'),
                    name : $cache.activeLog.html()
                }
            };
            
            args.creds = getCredentials();
            
            ipcRenderer.send('logs-get-log', args);
        },
        
        clearLogDialog : (e) => {
            $cache.logsDialog.toggleClass('active');
        },
        
        clearLogFile : (e) => {
            home.utils.loader.show();
            
            $cache.logsDialog.removeClass('active');
            
            let args = {
                log : {
                    href : $cache.activeLog.data('href'),
                    name : $cache.activeLog.html()
                }
            };
            
            args.creds = getCredentials();
            
            ipcRenderer.send('logs-clear-log-file', args);
        }
    };
    
    function getCredentials(){
        let creds = {
            hostname : $cache.connectWindow.find('.input-hostname').val(),
            username : $cache.connectWindow.find('.input-username').val(),
            password : $cache.connectWindow.find('.input-password').val(),
            staging : $cache.connectWindow.find('.input-staging').val()
        };
        
        return creds;
    }
    
    function initCache(){
        $cache.logs = $('#app-sandbox-logs');
        $cache.logScreen = $('#screen-sandbox-logs');
        $cache.connectWindow = $('#screen-sandbox-connect');
        $cache.refreshList = $('#refresh-log-list');
        $cache.refreshFile = $('#refresh-log-view');
        $cache.clearLogFile = $('#clear-log-file');
        $cache.activeLog = $('#active-log-file');
        $cache.logsDialog = $('#logs-dialog');
        $cache.clearLogDeny = $('#clear-log-denied');
        $cache.clearLogApprove = $('#clear-log-approved');
        $cache.logControls = $('.log-view-controls');
    }
    
    function initEvents(){
        $cache.logs.on('click', events.openLogsScreen);
        $cache.refreshList.on('click', events.refreshLogList);
        $cache.refreshFile.on('click', events.refreshLogFile);
        $cache.clearLogFile.on('click', events.clearLogDialog);
        $cache.clearLogApprove.on('click', events.clearLogFile);
        $cache.clearLogDeny.on('click', events.clearLogDialog);
        $(window).on('resize', initPage);
    }
    
    var initPage = function(){
        $('#screen-sandbox-logs').css({
            'max-height' : `${window.innerHeight - $('#header').height()}px`
        });
    }
    
    home.logs = {
        init : function(){
            initCache();
            initEvents();
        }
    };
}(home = home || {}, $, ipcRenderer));


/**
    @namespace home.login
**/
(function(home, $, ipcRenderer){
    let $cache = {};
    
    ipcRenderer.on('login-success', () => {
        $cache.connect.removeClass('border-red');
        $cache.connect.addClass('border-green');
        $cache.header.find('#app-sandbox-logs').addClass('active');
        $cache.connectWindow.find('.connection-error').removeClass('active');
        $cache.connect.click();
        home.utils.loader.hide();
    });
    
    ipcRenderer.on('login-failure', () => {
        $cache.connect.removeClass('border-green');
        $cache.connect.addClass('border-red');
        $cache.connectWindow.find('.connection-error').addClass('active');
        home.utils.loader.hide();
    });
    
    let events = {
        sandboxConnect : function(e){
            e.preventDefault();
            
            let data = {
                hostname : $cache.connectWindow.find('.input-hostname').val(),
                username : $cache.connectWindow.find('.input-username').val(),
                password : $cache.connectWindow.find('.input-password').val(),
                staging : $cache.connectWindow.find('.input-staging').val()
            };
            
            home.utils.loader.show();
            ipcRenderer.send('app-sandbox-login', data);
        }
    };
    
    function initEvents(){
        $cache.sandboxSubmit.on('click', events.sandboxConnect);
    }
    
    function initCache(){
        $cache.connectWindow = $('#screen-sandbox-connect');
        $cache.connect = $('#app-sandbox-connect');
        $cache.header = $('#header');
        $cache.sandboxSubmit = $cache.connectWindow.find('.sandbox-login-submit');
    }
    
    home.login = {
        init : () => {
            initCache();
            initEvents();
        }
    };
}(home = home || {}, $, ipcRenderer));

/**
    @namespace home.nav 
**/
(function(home, $, ipcRenderer){
    let $cache = {};

    let events = {
        appExit : function(e){
            ipcRenderer.send('app-exit');
        },
        
        connectClick : function(e){
            var $this = $(this);
            
            $this.toggleClass('active');
            $cache.connectWindow.toggleClass('active');
        }
    };
    
    function initCache(){
        $cache.appExit = $('#app-exit');
        $cache.header = $('#header');
        $cache.connect = $('#app-sandbox-connect');
        $cache.connectWindow = $('#screen-sandbox-connect');
    }
    
    function initEvents(){
        $cache.appExit.on('click', events.appExit);
        $cache.connect.on('click', events.connectClick);
    }
    
    home.nav = {
        init : function(){
            initCache();
            initEvents();
        }
    };
}(home = home || {}, $, ipcRenderer));



/** @namespace home.utils **/
(function(home, $){
    let $cache = {};
    
    function initCache(){
        $cache.loader = $('#page-loader');
    }
    
    home.utils = {
        /**
        @desc displays a full page loader overlay
        **/
        loader : {
            show : function(){
                $('#page-loader').addClass('active');
            },
            
            hide : function(){
                $cache.loader.removeClass('active');
            }
        },
        
        init : function(){
            initCache();
        }
    };
}(home = home || {}, $));



$(document).ready(() => {
    home.nav.init();
    home.login.init();
    home.utils.init();
    home.logs.init();
});
