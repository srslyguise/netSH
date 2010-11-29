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
		prompt_.innerHTML = "root:/ #_ ";
		input.setAttribute("class", "shell");
		input.type = "text";
		input.setAttribute("onkeydown", obj_name + ".handler(event.keyCode)");

		base_element.appendChild(prompt_);
		base_element.appendChild(input);

		initModules();
		initStyles();

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

			for(i_123 = 0; i_123 < modules.length; i_123++)
				for(y_123 = 0; y_123 < modules[i_123].functionList.length; y_123++)
					if(modules[i_123].functionList[y_123] == cmd)
					{
						eval('modules[i_123].' + cmd + '(argv.length, argv)');
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
		base_element.innerHTML += "<a class=\"text\">" + text;
	}

	this.write = function(text)
	{
		Write(text);
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

	function initModules()
	{
		var modules_xml = loadXML("config/modules.xml");

		for(i = 0; i < modules_xml.getElementsByTagName('Module').length; i++)
		{
			var file = "";
			var script = null;

			file = loadFILE(modules_xml.getElementsByTagName('Module')[i].getAttribute('src'));
			script = new Function(file);
			modules[i] = new script();

			modules[i].init(obj_name);
		}
	}

	function initStyles()
	{
		var styles_xml = loadXML("config/styles.xml");

		for(i = 0; i < styles_xml.getElementsByTagName('Style').length; i++)
			addStyle(styles_xml.getElementsByTagName('Style')[i].getAttribute('src'));
	}
}
