/*********************************************
*  -- Model for Module 1
*/

model = {
	data: {},
	original: {},
	
	reset: function () {
		model.data	 = {
		};
		model.original = {
		}
	},
	
	fetch: function (callBack) {
		app.ajax({
			type: 'POST',
			url: 'action',
			data: {
			},
			dataType: 'text',
			complete: function (respObj, status) {
			}
		});
	},
	
	save: function() {
		app.ajax({
			type: 'POST',
			url: 'action',
			data: {
			},
			dataType: 'text',
			complete: function (respObj, status) {
			}
		});
	}	
}