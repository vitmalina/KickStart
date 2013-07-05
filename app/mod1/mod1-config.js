/*********************************************
*  -- Configuration for Module 1
*/

configs = {
	grid1: { 
		name 	: 'grid1',
		header	: 'Grid 1',
		//url		: 'server/users.php',
		show: {
			header: false,
			toolbar: true,
			footer: true,
			emptyRecords: true,
			tbSearchBtn: true
		},
		style: 'border-top: 1px solid #DBDFE5;',
		columns: [
			{ field: 'id', caption: 'Id', size: '90px', sortable: true },
			{ field: 'firstName', caption: 'Last Name', size: '30%', sortable: true, resizable: true },
			{ field: 'lastName', caption: 'First Name', size: '30%', sortable: true, resizable: true },
			{ field: 'email', caption: 'Email', size: '40%', sortable: true, resizable: true }
		],
		searches: [
			{ type: 'int', caption: 'Id', field: 'id' },
			{ type: 'text', caption: 'Last Name', field: 'lastName' },
			{ type: 'text', caption: 'First Name', field: 'firstName' }
		],
		records: [
			{ recid: 1, id: 1, firstName: 'David', lastName: 'Jeremiah', email: 'djeremiah@gmail.com' },
			{ recid: 2, id: 2, firstName: 'Tom', lastName: 'Soyer', email: 'djeremiah@gmail.com' },
			{ recid: 3, id: 3, firstName: 'Frank', lastName: 'Shmidt', email: 'djeremiah@gmail.com' },
			{ recid: 4, id: 4, firstName: 'Bruce', lastName: 'Wilkerson', email: 'djeremiah@gmail.com' },
			{ recid: 5, id: 5, firstName: 'Susan', lastName: 'Heinz', email: 'djeremiah@gmail.com' },
		]
	}
}