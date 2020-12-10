const isDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const EXTENSION_ICONS = Object.freeze({
  on: {
    '16': `images/icon${isDarkTheme ? '_white' : '_dark'}.png`,
    '48': `images/icon${isDarkTheme ? '_white' : '_dark'}.png`,
    '128': `images/icon${isDarkTheme ? '_white' : '_dark'}.png`,
  },
  off: {
    '16': `images/icon_inactive${isDarkTheme ? '_white' : '_dark'}.png`,
    '48': `images/icon_inactive${isDarkTheme ? '_white' : '_dark'}.png`,
    '128': `images/icon_inactive${isDarkTheme ? '_white' : '_dark'}.png`,
  },
});
const ON_ICONS = EXTENSION_ICONS.on;
const OFF_ICONS = EXTENSION_ICONS.off;

var  CHECK_TIMEOUT = 5 * 1000;
var isActive = true;

(()=> {
   document.addEventListener('DOMContentLoaded', (dom) => {
		document.querySelector('.options').addEventListener('click', function () {
		  chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
		});
				
		chrome.storage.sync.get("active", (obj)=> {
			var domElement = document.getElementById('btnActivate');
			var active = obj.hasOwnProperty("active")? obj["active"] : true;
			domElement.checked = active;
			if(domElement != null) {
				domElement.addEventListener("click", (event) => switchExtension(event.target.checked));
			}
		});
	});
})();

function switchExtension(active, cb) {
	chrome.storage.sync.set({
		active: active
	}, cb);
}

function start(state) {
	console.log("Starting Meet Auto Accept");
	switchExtension(state, ()=> {
		isActive = state;
		setInterval(() => {
			if(!isActive)
				return;
			var labels = ['Permitir', 'Admit', 'Ver tudo', 'Show all', 'Permitir tudo', 'Admit all'];
			var acceptBtn = Array.from(document.querySelectorAll('[role="button"]')).find(o => labels.includes(o.innerText))
			if(acceptBtn != null) {
				acceptBtn.click();
				buttons = null;
				acceptBtn = null;
			}
		}, CHECK_TIMEOUT);
	});
}

// Update icon based on active
function setIcon(active) {
  let path = active ? ON_ICONS : OFF_ICONS;
  chrome.browserAction.setIcon({ path });
}

window.onload = function() {
	
	chrome.storage.sync.get("active", (obj)=> {
		var active = obj.hasOwnProperty("active")? obj["active"] : true;
		start(active);
		setIcon(active);
	})
	chrome.storage.onChanged.addListener(function(changes, namespace) {
		if(!changes.hasOwnProperty('active'))
			return;
		
		isActive = changes['active'].newValue;
		setIcon(isActive);
	});
};



