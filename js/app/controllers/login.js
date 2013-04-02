
/**
* fire login object on load
*/
$(window).load(function(){
	new Login();
});

function Login(){
	Application.controllers['Login'] = this;
	this.set();
	this.init();
}

Login.prototype.set = function() {
	this.webroot = '/service';
	this.request = false;
	this.htmltasks = null;
};

Login.prototype.init = function() {
	this.addEventListeners();
	$.ajax({url:this.webroot+'/users/isLogged/json', dataType:"json", success:this.testSessionLogin, context:this});	
};

/**
* maybe the server have session for this client
*/
Login.prototype.testSessionLogin = function(json) {
	if(json.response.isLogged){
		this.htmltasks = json.html;
		$('.panelLogin').transition({scale:0.0, complete:function(){
			Application.trigger('userDidLogin');
		}});
		return;
	}

	$('.panelLogin .loading').addClass('invisible');
	$('.testLoading').addClass('hide');
	$('.wpForm').removeClass('hide');
};

Login.prototype.addEventListeners = function() {
	Application.event('sessionDidExpire', $.proxy(this.sessionDidExpire, this));
	$('.loginForm').submit($.proxy(this.submit,this));

};

/**
* the session in the server has expired
*/
Login.prototype.sessionDidExpire = function() {
	$('.panelLogin').transition({scale:1.0});
	$('.general-error').html('You do not have access or the session has expired').removeClass('invisible').animate({opacity:1});
	$('.panelLogin .loading').addClass('invisible');
	$('.testLoading').addClass('hide');
	$('.wpForm').removeClass('hide');

};

/**
 * send data to the login service
 * @param  {[type]} e  [description]
 * @return {[type]}    [description]
 * @author Alejo    JM <alejo.jm@gmail.com>
 */
Login.prototype.submit = function(e) {

	e.preventDefault();
	if(this.request) 
		return;
	this.request = true;
	$('.panelLogin .loading').removeClass('invisible');
	$('.general-error').addClass('invisible').css({opacity:0}).html('Check your email and password');
	$.ajax({url:this.webroot+'/users/login/json', type:"POST", data:$('.loginForm').serialize(), dataType:"json", success:this.responseLogin, context:this});	
};


/**
 * process de response form the server
 * @param  {object} json 
 * @return {void} 
 * @author Alejo JM <alejo.jm@gmail.com>
 */
Login.prototype.responseLogin = function(json) {
	if(json.response.validationErrors){
		for(var error in json.response.validationErrors){
			$('#'+error+'User').addClass('invalid');
		}
	}

	if(!json.response.success){
		if(!$('.loginForm').is(':animated'))
			$('.loginForm').transition({x: -5, duration:200}).transition({ x: 5, duration:200}).transition({ x: 0 , duration:200});

		$('.general-error').removeClass('invisible').animate({opacity:1});
	}

	this.request = false;
	$('.panelLogin .loading').addClass('invisible');
	
	if(json.response.success){
		this.htmltasks = json.html;
		$('.panelLogin').transition({scale:0.0, complete:function(){
			Application.trigger('userDidLogin');
		}});
	}
};