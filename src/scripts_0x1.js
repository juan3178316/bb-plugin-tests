console.log("working sucessful");

function generateConsole(consoleURL) {
	(function () {
		var script = document.createElement('script');
		script.src = consoleURL;
		document.body.appendChild(script);
		script.onload = function () {
			eruda.init({
				tool: ['console', 'elements', 'network', 'resources', 'info']
			})
			eruda.get().config.set('displaySize', 60);
			eruda.util.evalCss.setTheme('Dark');
		}
	})();
}

// Generate an URL from your Blockbench plugin test
function generateBBURL() {
	let bbplugin = document.getElementById('bb-plugin-test');
	let bbURL = document.getElementById('url-generated');

	if (bbplugin.value == 'null') {
		return bbURL.innerHTML = '<h4>Please, choose a blockbench plugin :(</h4>';
	}
	else {
		return bbURL.innerHTML = `<textarea readonly="true" rows="3">https://raw.githubusercontent.com/juan3178316/bb-plugin-tests/refs/heads/main/plugins/${bbplugin.value}/${bbplugin.value}.ts</textarea>`;
	};
}