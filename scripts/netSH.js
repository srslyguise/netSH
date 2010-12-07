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

		initStyles();
		initModules();

		base_element.appendChild(prompt_);
		base_element.appendChild(input);
		input.focus();
		input.select();
	}
	
	this.handler = function(kc)
	{
		if((kc == 13) && (input.value != ""))
		{
			base_element.removeChild(input);
			base_element.innerHTML += "<a class=\"text\">" + input.value + "</a><br>";
			parse(input.value);

			if(navigator.appName == "Microsoft Internet Explorer")
			{
				var user = "";
				var privilege = "";
				var path = "";

				if(GetModuleByName("base") != null)
				{
					user = GetModuleByName("base").getUser();
					privilege = GetModuleByName("base").getPrivilege();
				}

				if(GetModuleByName("fs") != null)
					path = GetModuleByName("fs").getCurrentPath();

				prompt_.innerHTML = (user != "") ? user : "netSH";
				prompt_.innerHTML += ":";
				prompt_.innerHTML += path;
				prompt_.innerHTML += " ";
				prompt_.innerHTML += (privilege != "") ? privilege : "";
				prompt_.innerHTML += "_";
			}

			base_element.appendChild(prompt_);
			input.value = "";
			base_element.appendChild(input);
			input.focus();
			input.select();
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

	this.getInput = function()
	{
		return input;
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

	this.writeFile = function(file, lang)
	{
		var sh_module = null;

		if((sh_module = GetModuleByName("sh")) != null)
		{
			if(lang != null)
				base_element.innerHTML += "<pre class=sh_" + lang + ">" + file + "</pre>";
			else
				base_element.innerHTML += "<pre class=file_content>" + file + "</pre>";

			sh_module.highlight(lang);
		}
		else
			base_element.innerHTML += "<pre class=text>" + file + "</pre>";
	}

	function loadXML(file)
	{
		var request = new XMLHttpRequest();

		request.open("GET", file += (file.match(/\?/) == null ? "?" : "&") + (new Date()).getTime(), false);
		request.send(null);

		if(request.status == 404)
			return null;

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

		if(request.status == 404)
			return null;

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

		for(var i = 0; i < document.getElementsByTagName('head').length; i++)
			if(document.getElementsByTagName('head')[i].tagName == "link")
				if(document.getElementsByTagName('head')[i].getAttribute("href") == src)
					return null;

		document.getElementsByTagName('head')[0].appendChild(style);
		return 1;
	}

	this.addStyle_pub = function(src)
	{
		return addStyle(src);
	}

	function addScript(src)
	{
		var script = document.createElement('script');

		script.type = "text/javascript";
		script.src = src;

		for(var i = 0; i < document.getElementsByTagName('head').length; i++)
			if(document.getElementsByTagName('head')[i].tagName == "script")
				if(document.getElementsByTagName('head')[i].getAttribute("src") == src)
					return null;

		document.getElementsByTagName('head')[0].appendChild(script);
		return 1;
	}

	this.addScript_pub = function(src)
	{
		return addScript(src);
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
			var name = modules_xml.getElementsByTagName('Module')[i].getAttribute('name');

			base_element.innerHTML = "<a class=text>Loading module \'" + name + "\'...</a>";

			file = loadFILE(netSH_prefix + modules_xml.getElementsByTagName('Module')[i].getAttribute('src'));
			addModule(name, file);
		}

		base_element.innerHTML = "";
	}

	function initStyles()
	{
		var styles_xml = loadXML(netSH_prefix + "config/styles.xml");

		for(i = 0; i < styles_xml.getElementsByTagName('Style').length; i++)
			addStyle(styles_xml.getElementsByTagName('Style')[i].getAttribute('src'));
	}

	this.getModuleByName = function(name)
	{
		return GetModuleByName(name);
	}

	function GetModuleByName(name)
	{
		for(var i = 0; i < modules.length; i++)
			if(modules[i].name == name)
				return modules[i];

		return null;
	}
}
