/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const {ipcRenderer} = require('electron');
const $ = require('../js/jquery.js');

let home = {};

// preserving as vanilla javascript for reference
let exitApp = document.querySelector('#app-exit');

exitApp.addEventListener('click', () => {
    ipcRenderer.send('app-exit');
});

/** @namespace home.nav **/
(function(home, $, ipcRenderer){
    let $cache = {};
    
    ipcRenderer.on('login-success', () => {
        $cache.connect.removeClass('border-red');
        $cache.connect.addClass('border-green');
        $cache.connectWindow.find('.connection-error').removeClass('active');
        $cache.connect.click();
    });
    
    ipcRenderer.on('login-failure', () => {
        $cache.connect.removeClass('border-green');
        $cache.connect.addClass('border-red');
        $cache.connectWindow.find('.connection-error').addClass('active');
    });
    
    let events = {
        connectClick : function(e){
            var $this = $(this);
            
            $this.toggleClass('active');
            $cache.connectWindow.toggleClass('active');
        },
        
        sandboxConnect : function(e){
            let data = {
                hostname : $cache.connectWindow.find('.input-hostname').val(),
                username : $cache.connectWindow.find('.input-username').val(),
                password : $cache.connectWindow.find('.input-password').val(),
                staging : $cache.connectWindow.find('.input-staging').val()
            };
            
            console.log(data);
            
            ipcRenderer.send('app-sandbox-login', data);
        }
    };
    
    function initCache(){
        $cache.connect = $('#app-sandbox-connect');
        $cache.connectWindow = $('#screen-sandbox-connect');
        $cache.sandboxSubmit = $cache.connectWindow.find('#sandbox-login-submit');
    }
    
    function initEvents(){
        $cache.connect.on('click', events.connectClick);
        $cache.sandboxSubmit.on('click', events.sandboxConnect);
    }
    
    home.nav = {
        init : function(){
            initCache();
            initEvents();
        }
    };
}(home = home || {}, $, ipcRenderer));

$(document).ready(() => {
    home.nav.init();
});
