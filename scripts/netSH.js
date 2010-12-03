var netSH_prefix = "/";

function netSH(obj_name, base_element)
{
	var prompt_;
	var input;
	var modules;

	this.init = function()
	{
		prompt_ = document.createElement("a");
		input = document.createElement("input");
		modules = new Array();

		prompt_.setAttribute("class", "prompt");
		prompt_.innerHTML = "netSH ";
		input.setAttribute("class", "shell");
		input.type = "text";
		input.setAttribute("onkeydown", obj_name + ".handler(event.keyCode)");

		base_element.appendChild(prompt_);
		base_element.appendChild(input);

		initStyles();
		initModules();

		input.focus();
	}
	
	this.handler = function(kc)
	{
		var cmd;

		if((kc == 13) && (input.value != ""))
		{
			base_element.removeChild(input);
			base_element.innerHTML += "<a class=\"text\">" + input.value + "</a><br>";
			parse(input.value);

			base_element.appendChild(prompt_);
			input.value = "";
			base_element.appendChild(input);
			input.focus();
		}


	}

	function parse(text)
	{
		if(text.match(/^[\w\.\u00A1-\uFFFF]+[\t]*/))
		{
			var cmd = text.match(/[(\x00-\x19)(\x21-\xFF)]+/);
			var argv = text.split(" ");

			for(var i = 0; i < modules.length; i++)
				for(var y = 0; y < modules[i].functionList.length; y++)
					if(modules[i].functionList[y] == cmd)
					{
						eval('modules[i].' + cmd + '(argv.length, argv)');
						return;
					}
		}
		
		Write("netSH: " + text + ": command not found<br>");
	}

	this.setPrompt = function(p)
	{
		prompt_.innerHTML = p;
	}

	this.clear = function()
	{
		base_element.innerHTML = "";
		base_element.appendChild(prompt_);
		input.value = "";
		base_element.appendChild(input);
		input.focus();
	}

	function Write(text)
	{
		base_element.innerHTML += "<a class=text>" + text + "</a>";
	}

	this.write = function(text)
	{
		Write(text);
	}

	this.writeFile = function(file)
	{
		base_element.innerHTML += "<pre class=text>" + file + "</pre>";
	}

	function loadXML(file)
	{
		var request = new XMLHttpRequest();

		request.open("GET", file += (file.match(/\?/) == null ? "?" : "&") + (new Date()).getTime(), false);
		request.send(null);

		return request.responseXML;
	}

	this.loadXML_pub = function(file)
	{
		return loadXML(file);
	}

	function loadFILE(file)
	{
		var request = new XMLHttpRequest();

		request.open("GET", file += (file.match(/\?/) == null ? "?" : "&") + (new Date()).getTime(), false);
		request.send(null);

		return request.responseText;
	}

	this.loadFILE_pub = function(file)
	{
		return loadFILE(file);
	}

	function addStyle(src)
	{
		var style = document.createElement('link');

		style.rel = "stylesheet";
		style.type = "text/css";
		style.href = src;

		document.getElementsByTagName('head')[0].appendChild(style);

	}

	this.addStyle_pub = function(src)
	{
		addStyle(src);
	}

	function addModule(name, file)
	{
		var script = null;

		script = new Function(file);
		modules.push(new script());
		modules[modules.length - 1].init(obj_name);
		modules[modules.length - 1].name = name;
	}

	this.addModule_pub = function(name, file)
	{
		addModule(name, file);
	}

	function initModules()
	{
		var modules_xml = loadXML(netSH_prefix + "config/modules.xml");

		for(i = 0; i < modules_xml.getElementsByTagName('Module').length; i++)
		{
			var file = "";

			file = loadFILE(netSH_prefix + modules_xml.getElementsByTagName('Module')[i].getAttribute('src'));
			addModule(modules_xml.getElementsByTagName('Module')[i].getAttribute('name'), file);
		}
	}

	function initStyles()
	{
		var styles_xml = loadXML(netSH_prefix + "config/styles.xml");

		for(i = 0; i < styles_xml.getElementsByTagName('Style').length; i++)
			addStyle(styles_xml.getElementsByTagName('Style')[i].getAttribute('src'));
	}

	this.getModuleByName = function(name)
	{
		for(var i = 0; i < modules.length; i++)
			if(modules[i].name == name)
				return modules[i];

		return null;
	}
}
