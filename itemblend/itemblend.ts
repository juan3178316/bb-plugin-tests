var newFile, loadScreen, selectManifest, createManifest, exportManifest;
var zipC = new JSZip();
const manifestTitle = "Create manifest";
const manifestLines = ["with this section, you can create manifest.json files quickly."];
const manifestName = "Pack name";
const manifestDescription = "Pack description";
const manifestVersion = "Pack version";
const minEngineVersion = "Min engine version";
const manifestAuthors = "your_name, Juan3178";

try {

Plugin.register('itemblend', {
	title: "Itemblend - Add-on creator",
	author: 'Juan3178',
	description: 'Create custom addons in blockbench',
	icon: 'file_json',
	variant: 'both',
	about: "# Itemblend\nItemblend is a plugin where you can create your own add-on here in [Blockbench](https://web.blockbench.net).\n\nCreated by: [Juan3178](https://github.com/juan3178316)\n![icon](https://avatars.githubusercontent.com/u/236281480?v=1)\n\ncontact: [itemblend Mail](mailto:examplecraftlatam@gmail.com)",
	min_version: '5.0.0',
	max_version: Blockbench.version, // why i using this parameter?
	await_loading: true,
	new_repository_format: true,
	has_changelog: false,
	tags: [
		"Minecraft: Bedrock Edition",
		"Add-on creator"
	],
	version: '0.0.1-index',
	creation_date: '2025-10-24',
	website: 'https://juan3178316.github.io/blockbench-plugins/itemblend',
	repository: 'https://github.com/juan3178316/blockbench-plugins',
	bug_tracker: 'https://github.com/juan3178316/blockbench-plugins/issues/new?title=[Itemblend - Add-on creator]',
	onload() {
		Blockbench.showQuickMessage("Executing Itemblend...", 5000);
		newFile = new Action({
			id: "load_itemblend",
			name: "Load Itemblend",
			icon: 'description',
			category: "file",
			click: function(e) {
				loadScreen.show();
			}
		});
		MenuBar.addAction(newFile,'file');
	},
	onunload() {
		Blockbench.showQuickMessage("Stopping Itemblend...", 3000);
		newFile.delete();
	}
});

/** Dialog **/

loadScreen = new Dialog({
	title: "Create your addon",
	id: "create_addon",
	form: {
		spacer0: '_',
		select_content: {
			label: "Select content",
			description: "Select you new content",
			type: 'select',
			options: {/*addon:"Add-on",rp:"Resource pack",bp:"Behavior pack",*/cmf:"Create manifest file"}
		},
		spacer1: '_'
	},
	confirmEnabled: true,
	cancelEnabled: true,
	onConfirm: function(fE) {
		switch(fE.select_content) {
			case 'cmf':
				selectManifest.show();
				loadScreen.hide();
			break;
		};
	},
	onCancel: function() {}
});

selectManifest = new Dialog({
	title: manifestTitle,
	id: "select_manifest",
	lines: manifestLines,
	form: {
		spacer0: '_',
		select_type: {
			label: "Select manifest type",
			type: 'select',
			options: {rp:"Resource pack",bp:"Behavior pack",addon:"Add-on",skin:"Skin pack",wt:"World template"}
		},
		spacer1: '_'
	},
	confirmEnabled: true,
	cancelEnabled: true,
	onConfirm: function(fE) {
		selectManifest.hide();
		creatingManifest(fE.select_type);
	},
	onCancel: function() {}
});

function creatingManifest(typeM,fvm=2) {
	let manifest_0 = {};
	createManifest = new Dialog({
		title: manifestTitle,
		id: "create_manifest",
		lines: manifestLines,
		form: {
			space0: '_',
			name: {
				label: manifestName,
				type: 'text',
				share_text: true,
				placeholder: manifestName
			},
			description: {
				label: manifestDescription,
				type: 'textarea',
				placeholder: manifestDescription
			},
			version: {
				label: manifestVersion,
				type: 'vector',
				value: [1, 0, 0],
				step: 1.0
			},
			min_engine_version: {
				label: minEngineVersion,
				type: 'vector',
				value: [1, 21, 120]
			},
			pack_visibility: {
				label: "Pack visibility",
				type: 'checkbox',
				value: false,
				condition: ['rp','addon'].includes(typeM)
			},
			pack_scope: {
				label: "Pack Scope",
				type: 'select',
				options: {world:"World",global:"Global"},
				condition: (fE)=>fE.pack_visibility
			},
			space1: '_',
			metadata: {
				label: "Metadata",
				type: 'info',
				text: "Metadata for your **`manifest.json`** File\n\nIf you want add others creators to your pack, in the `authors` option, write a array text. https://github.com/juan3178316"
			},
			metadata_authors: {
				label: "Authors",
				type: 'text',
				value: manifestAuthors
			},
			metadata_url: {
				label: "URL download",
				type: 'text',
				placeholder: "blockbench.net"
			},
			metadata_license: {
				label: "License",
				type: 'select',
				options: {none:"None",MIT:"MIT",Right_reserved:"Right reserved"}
			}
		},
		confirmEnabled: true,
		cancelEnabled: true,
		onConfirm: function(fE) {
			createManifest.hide();
			let uuid0 = UUIDGenerator();
			let uuid1 = UUIDGenerator();

manifest_0.format_version = fvm;

manifest_0.header = {
	name: /^\s{0,}$/g.test(fE.name) ? manifestName : fE.name,
	description: /^\s{0,}$/g.test(fE.description) ? manifestDescription : fE.description,
	uuid: uuid0,
	version: fE.version,
	min_engine_version: fE.min_engine_version,
	pack_scope: (fE.pack_visibility ? fE.pack_scope : undefined)
};

manifest_0.modules = [
	{
		type: selectingType(typeM),
		uuid: uuid1,
		version: fE.version
	}
];

// manifest_0.dependencies = undefined;

manifest_0.metadata = {
	authors: /^\s{0,}$/g.test(fE.metadata_authors) ? manifestAuthors.split(', ') : fE.metadata_authors.split(', '),
	url: 'https://' + (/^\s{0,}$/g.test(fE.metadata_url) ? "blockbench.net" : fE.metadata_url),
	license: fE.metadata_license,
	generated_with: {
		itemblend: ['0.0.1-index'],
		blockbench: [Blockbench.version]
	}
};

			expManifest(manifest_0,typeM);
		},
		onCancel: function() {}
	});
	createManifest.show();
}

function expManifest(contentFile,types) {
	let rpFolder = zipC.folder('resources_pack');
	rpFolder.file('manifest.json', JSON.stringify(contentFile,null,'\t'));
	zipC.generateAsync({type: 'blob'}).then(content => {
		Blockbench.export({
			type: 'Itemblend (Zip) Archive',
			extensions: ['zip'],
			name: `${contentFile.header.name} - ${selectingType(types)}`,
			content: content,
			savetype: 'zip'
		});
	});
}

function selectingType(type) {
	let types = 'resources';
	switch(type) {
		case 'skin':
			types = 'skin'
		break;
		case 'wt':
			types = 'template'
		break;
	};
	return types;
}

// UUIDGenerator found in: https://github.com/JannisX11/blockbench-plugins/blob/master/plugins%2Farcaniax_block_exporter.js#L321

function UUIDGenerator() { // Public Domain/MIT
	var d = new Date().getTime();//Timestamp
	var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
	return 'xxxxxxxx-3178-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16;//random number between 0 and 16
		if(d > 0){//Use timestamp until depleted
			r = (d + r)%16 | 0;
			d = Math.floor(d/16);
		}
		else {//Use microseconds since page-load if supported
			r = (d2 + r)%16 | 0;
			d2 = Math.floor(d2/16);
		}
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
}



}
// Search an Error of this plugin. Please take a screenshot if you see a Error.
catch(error) {
	
	Blockbench.showMessageBox({
		confirm: 0,
		cancel: 1,
		buttons: ["Accept"],
		title: "itemblend | error",
		icon: "icon-blockbench",
		message: String(error),
		width: 100
	});
};
