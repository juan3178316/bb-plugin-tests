var newAction, bugScreen;
Plugin.register('bug_folder', {
	title: 'Show bugs | folders',
	author: 'Juan3178',
	description: 'Show bugs of https://blockbench.net',
	icon: 'description',
	variant: 'both',
	about: "# Show bugs | folders\n\nbug found when you make a `Dialog screen` and show on *webapp* \n\ncontact: https://github.com/juan3178316",
	min_version: '5.0.0',
	max_version: Blockbench.version, // no modifier this.
	tags: ["Bugs"],
	version: '1.0.0',
	creation_date: '2025-11-01',
	website: 'https://github.com/juan3178316',
	onload() {
		newAction = new Action({
			id: "loading action",
			name: "Load Action",
			icon: 'description',
			category: "file",
			click: function(e) {
				bugScreen.show();
			}
		});
		MenuBar.addAction(newAction,'file');
	},
	onunload() {
		newAction.delete();
	},
});

bugScreen = new Dialog({
	title: "Show bugs",
	id: "show_bugs",
	lines: ["## here you find the bug folder generated in the WebApp\n\n\n"],
	form: {
		spacer0: '_',
		// folder_bug no works in the WebApp
		folder_bug: {label:"Bug folder",type:'folder'},
		// file_bug: {label:"Bug folder",type:'file'},
		// there's ok
		spacer1: '_'
	},
});
