
/**
 * Static object
 * @type   {Object}
 * @author Alejo    JM <alejo.jm@gmail.com>
 */
var Application = {

	/**
	* html to wrap all events will trigger 
	*/
	context:'body',

	/**
	* controller stack
	*/
	controllers: {
		
	},

	/**
	* Events registered used for all App
	*/
	events: {
		userDidLogin:'userDidLogin',
		sessionDidExpire:'sessionDidExpire',
	},

	/**
	* Attach events
	*/
	event:function(eventType, handler) {
		if (this.events[eventType]) {
			$(this.context).bind(this.events[eventType], handler);
		}
	},

	/**
	* trigger events
	*/
	trigger:function(eventType) {
		if (this.events[eventType]) {
			$(this.context).trigger(this.events[eventType]);
		}
	}
	
}