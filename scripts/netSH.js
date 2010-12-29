var netSH_prefix = "/";

function netSH(obj_name, base_element)
{
	var prompt_;
	var input;
	var modules;

	this.init = function()
	{
		if((navigator.appName == "Microsoft Internet Explorer") && !(navigator.appVersion.match(/MSIE 9/)))
		{
			alert("Current version of IE is not supported, upgrade to IE9");
			return;
		}

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

			base_element.appendChild(prompt_);
			input.value = "";
			base_element.appendChild(input);
			input.focus();
			input.select();
		}
	}

	function parse(text)
	{
		var cmd = text.match(/[(\x00-\x19)(\x21-\xFF)]+/);

		if(text.match(/^[\w\.\u00A1-\uFFFF]+[\t]*/))
		{
			var argv = text.split(" ");

			for(var i = 0; i < modules.length; i++)
				for(var y = 0; y < modules[i].functionList.length; y++)
					if(modules[i].functionList[y] == cmd)
					{
						eval('modules[i].' + cmd + '(argv.length, argv)');
						return;
					}
		}
		
		Write("netSH: " + cmd + ": command not found<br>");
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
		base_element.innerHTML += "<span class=text>" + text + "</span>";
	}

	this.write = function(text)
	{
		Write(text);
	}

	this.writeFile = function(file, lang)
	{
		var sh_module = null;
		var pre_ = document.createElement('pre');

		pre_.setAttribute('id', "toHighlight");

		if((sh_module = GetModuleByName("sh")) != null)
		{
			pre_.innerHTML = file;

			if(lang != null)
				pre_.setAttribute('class', "brush: " + lang);
			else
				pre_.setAttribute('class', "file_content");

			pre_.style.backgroundColor = "transparent";
			base_element.appendChild(pre_);

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
		var href = "";

		style.rel = "stylesheet";
		style.type = "text/css";
		style.href = src;

		for(var i = 0; i < document.getElementsByTagName('head')[0].childNodes.length; i++)
		{
			try
			{
				href = document.getElementsByTagName('head')[0].childNodes[i].getAttribute("href");
			}
			catch(e)
			{
				href = "";
			}

			if(href == src)
				return null;
		}

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
		var att_src = "";

		script.type = "text/javascript";
		script.src = src;

		for(var i = 0; i < document.getElementsByTagName('head')[0].childNodes.length; i++)
		{
			try
			{
				att_src = document.getElementsByTagName('head')[0].childNodes[i].getAttribute("src");
			}
			catch(e)
			{
				att_src = "";
			}

			if(att_src == src)
				return null;
		}

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
		var msg = document.createElement("a");

		msg.setAttribute("class", "text");
		base_element.appendChild(msg);

		for(i = 0; i < modules_xml.getElementsByTagName('Module').length; i++)
		{
			var file = "";
			var name = modules_xml.getElementsByTagName('Module')[i].getAttribute('name');

			msg.innerHTML = "Loading module \'" + name + "\'...";

			file = loadFILE(netSH_prefix + modules_xml.getElementsByTagName('Module')[i].getAttribute('src'));
			addModule(name, file);
		}

		base_element.removeChild(msg);
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
