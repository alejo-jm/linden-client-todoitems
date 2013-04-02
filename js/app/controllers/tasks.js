
/**
* fire Tasks object on load
*/
$(window).load(function(){
	new Tasks();
});

function Tasks(){
	Application.controllers['Tasks'] = this;
	this.set();
	this.init();
}

Tasks.prototype.set = function() {
	this.webroot = '/service';
	this.request = false;
	this.currentPanel = '.panelTasks';
	this.deleteTarget = null;
	
	$.ajaxSettings.context = this;
	$.ajaxSettings.dataType = 'json';

};

Tasks.prototype.init = function() {
	this.addEventListeners();
};

Tasks.prototype.addEventListeners = function() {
	Application.event('userDidLogin', $.proxy(this.userDidLogin, this));
	$('.panel .task .link a').live('mousedown', $.proxy(this.click, this));
	$('.panel #goback').live('mousedown', $.proxy(this.goback, this));
	$('.createTask form').live('submit', $.proxy(this.createTaskSubmit,this));

};

/**
* the user just login, show tasks for the current user
*/
Tasks.prototype.userDidLogin = function(e) {
	$('.wrapper').append(Application.controllers.Login.htmltasks);
	this.currentPanel = '.panelTasks';
	$(this.currentPanel).css({scale: 0.0, opacity:0}).transition({scale: 1.0, opacity:1});	
};

/**
* test if the server dont send notlogged in the json
*/
Tasks.prototype.haveSession = function(json) {
	if(json.notlogged){
		$(this.currentPanel+' .loading').addClass('invisible');
		this.request = false;
		$(this.currentPanel).transition({rotateX: '90deg', complete:function(){
			$('.panelTasks').remove();
			$(this).remove();
			Application.trigger('sessionDidExpire');	
		}});
		return false;
	}
	return true;
};

/**
* click on link
*/
Tasks.prototype.click = function(e) {

	var target = $(e.target);

	if(target.hasClass('edit')){
		this.edit(e);
	}

	if(target.hasClass('create')){
		this.create();
	}

	if(target.hasClass('delete')){
		this.deletetask(e);
	}
};

/**
* edit some Task
*/
Tasks.prototype.edit = function(e) {
	
	if(this.request)
		return;
	var id = e.target.id.split('_')[1];
	this.request = true;
	$(this.currentPanel+' .loading').removeClass('invisible');
	$.ajax({url:this.webroot+"/users/task/"+id+"/json", success:this.responseEditView});
	
};

/**
* clean the form on every response
*/
Tasks.prototype.responseEditView = function(json) {
	if(!this.haveSession(json))
		return;

	$('.createTask').remove();
	this.responseCreateView(json);
};

Tasks.prototype.create = function(e) {
	if(!$('.createTask').length){
		if(this.request)
			return;
		this.request = true;
		$(this.currentPanel+' .loading').removeClass('invisible');
		return $.ajax({url:this.webroot+"/users/task/json", success:this.responseCreateView});
	}
	
	$('.createTask form').find('input:text, input:hidden').val('');
	$(this.currentPanel).transition({rotateX: '90deg', complete:$.proxy(this.createAnimComplete,this)});	
};

/**
* swipe the form
*/
Tasks.prototype.createAnimComplete = function() {
	this.currentPanel = '.createTask';
	$(this.currentPanel).css({rotateX: '90deg'}).transition({rotateX: '0deg'});
};

/**
* we get the form for create tasks
*/
Tasks.prototype.responseCreateView = function(json) {
	if(!this.haveSession(json))
		return;

	$(this.currentPanel+' .loading').addClass('invisible');
	$(this.currentPanel).transition({rotateX: '90deg', complete:$.proxy(this.createAnimComplete,this)});	
	$('.wrapper').append(json.html);
	$('.createTask').css({rotateX: '90deg'});
	this.request = false;
};

Tasks.prototype.deletetask = function(e) {
	if(this.request)
		return;
	var id = e.target.id.split('_')[1];
	this.deleteTarget = e.target;
	this.request = true;
	$(this.currentPanel+' .loading').removeClass('invisible');
	$.ajax({url:this.webroot+"/users/deletetask/"+id+"/json", success:this.responseDelete});
};

Tasks.prototype.responseDelete = function(json) {
	if(!this.haveSession(json))
		return;

	this.request = false;
	$(this.currentPanel+' .loading').addClass('invisible');	
	$(this.deleteTarget).parents().filter('.task').animate({height: 0},{complete:function(){
		$(this).remove();
	}});
};


Tasks.prototype.goback = function(e) {
	$(this.currentPanel).transition({rotateX: '90deg', complete:$.proxy(this.gobackComplete,this)});
};

Tasks.prototype.gobackComplete = function(e) {
	this.currentPanel = '.panelTasks';
	$(this.currentPanel).css({rotateX: '90deg'}).transition({rotateX: '0deg'});	
}

Tasks.prototype.createTaskSubmit = function(e) {
	e.preventDefault();
	if(this.request) return;
	this.request = true;
	$(this.currentPanel+' .loading').removeClass('invisible');
	$.ajax({url:this.webroot+"/users/task/json", type:'POST', data:$(e.target).serialize(), success:this.createTaskResponse});
};

Tasks.prototype.createTaskResponse = function(json) {
	if(!this.haveSession(json))
		return;

	$('.panelTasks').remove();
	$('.wrapper').append(json.html);
	$('.panelTasks').css({rotateX: '90deg'});
	$(this.currentPanel+' .loading').addClass('invisible');
	this.request = false;
	$(this.currentPanel).transition({rotateX: '90deg', complete:$.proxy(this.gobackComplete,this)});
};