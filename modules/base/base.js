this.functionList = new Array("clear", "help", "date", "cowsay");
this.name = null;

var help_xml;
var base_xml;
var object;
var user = null;
var input = null;
var history = new Array();
var history_pos = 0;

this.init = function(obj)
{
	object = obj;
	help_xml = loadXML(netSH_prefix + "modules/base/config/help.xml");
	base_xml = loadXML(netSH_prefix + "modules/base/config/base.xml");
	addStyle(netSH_prefix + "modules/base/styles/base.css");

	user = base_xml.documentElement.getElementsByTagName('User')[0].getAttribute('name');
	input = eval(object + '.getInput();');
	updateInput("handler", "event.keyCode");
}

this.clear = function(argc, argv)
{
	eval(object + '.clear();');
}

this.help = function(argc, argv)
{
	var description = "";
	var parameters = "";
	var name = "";

	if(argc < 2)
	{
		helpList();
		return;
	}

	for(var i = 0; i < help_xml.getElementsByTagName('Cmd').length; i++)
		if((name = help_xml.getElementsByTagName('Cmd')[i].getAttribute('name')) == argv[1])
		{
			try
			{
				description = help_xml.getElementsByTagName('Cmd')[i].getElementsByTagName('Description')[0].childNodes[0].nodeValue;
			}
			catch(e)
			{
				description = "";
			}

			try
			{
				parameters = help_xml.getElementsByTagName('Cmd')[i].getElementsByTagName('Parameters')[0].childNodes[0].nodeValue;
			}
			catch(e)
			{
				parameters = "";
			}

			write("<dt><b>NAME</b></dt><dd>" + name + " - " + description + "</dd>");
			write("<dt><b>SYNOPSIS</b></dt><dd>" + name + " " + parameters + "</dd>");
			return;
		}

	write("help: " + argv[1] + ": command not found<br>");
}

this.date = function(argc, argv)
{
	var days = new Array("sun", "mon", "tue", "wed", "thu", "fri", "sat");
	var months = new Array("jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec");
	var today = new Date();
	var string = "";

	string += days[today.getDay()];
	string += " " + today.getDate();
	string += " " + months[today.getMonth()];
	string += " " + today.getFullYear();
	string += ", ";
	string += (today.getHours().toString().length == 1) ? "0" + today.getHours() : today.getHours();
	string += ":";

	string += (today.getMinutes().toString().length == 1) ? "0" + today.getMinutes() : today.getMinutes();
	string += ":";

	string += (today.getSeconds().toString().length == 1) ? "0" + today.getSeconds() : today.getSeconds();

	string += "<br>";

	write(string);
}

this.cowsay = function(argc, argv)
{
	var default_cow = "default.cow";
	var file = "";

	if(argc < 2)
	{
		write("Usage: " + argv[0] + " [-f cowfile] &lt;message&gt;<br>");
		return;
	}

	for(var i = 1; i < argc; i++)
	{
		if(argv[i] == "-f")
		{
			i++;

			if(argv[i].match(/.cow/) == null)
				argv[i] += ".cow";

			if((file = loadFILE(netSH_prefix + "modules/base/cows/" + argv[i])) != null)
			{
				file = file.replace("\$", argv[++i]);
				write("<pre>" + file + "</pre>");
				return;
			}
			else
			{
				write("cowsay: Could not find " + argv[i].replace(/.cow$/, "") + " cowfile!<br>");
				return;
			}
		}
		else
		{
			if((file = loadFILE(netSH_prefix + "modules/base/cows/" + default_cow)) != null)
			{
				file = file.replace("\$", argv[i]);
				write("<pre>" + file + "</pre>");
				return;
			}
			else
			{
				write("cowsay: Could not find " + default_cow.replace(/.cow$/, "") + " cowfile!<br>");
				return;
			}
		}
	}
}

function helpList()
{
	var description = "";
	var parameters = "";
	var name = "";
	var table = "<table class=help>";

	for(var i = 0; i < help_xml.getElementsByTagName('Cmd').length; i++)
	{
		name = help_xml.getElementsByTagName('Cmd')[i].getAttribute('name');

		try
		{
			description = help_xml.getElementsByTagName('Cmd')[i].getElementsByTagName('Description')[0].childNodes[0].nodeValue;
		}
		catch(e)
		{
			description = "";
		}

		try
		{
			parameters = help_xml.getElementsByTagName('Cmd')[i].getElementsByTagName('Parameters')[0].childNodes[0].nodeValue;
		}
		catch(e)
		{
			parameters = "";
		}

		table += "<tr><td id=help_name>" + name + "</td><td id=help_parameters>" + parameters + "</td><td id=help_description>" + description + "</td></tr>";
	}

	table += "</table>";
	write(table);

	return;
}

this.handler = function(e)
{
	if((e == 13) && (input.value != ""))
	{
		history.push(input.value);
		history_pos = 0;
	}

	if((e == 38) && (history.length != 0))
	{
		if((history[history.length - (++history_pos)]) != undefined)
			input.value = history[history.length - (history_pos)];
		else
			--history_pos;
	}

	if((e == 40) && (history.length != 0))
	{
		if((history[history.length - (--history_pos)]) != undefined)
			input.value = history[history.length - (history_pos)];
		else
			++history_pos;
	}

}

this.getUser = function()
{
	return user;
}

this.getPrivilege = function()
{
	return (base_xml.documentElement.getElementsByTagName('User')[0].getAttribute('root') == "true") ? "#" : "$";
}

function write(text)
{
	eval(object + '.write(text);');
}

function loadXML(file)
{
	return eval(object + '.loadXML_pub("' + file + '");');
}

function loadFILE(file)
{
	return eval(object + '.loadFILE_pub("' + file + '");');
}

function updateInput(func, params)
{
	var old = input.getAttribute("onkeydown");
	input.setAttribute("onkeydown", object + ".getModuleByName(\"base\")." + func + "(" + params + "); " + old);
}

function addStyle(file)
{
	eval(object + '.addStyle_pub(file);');
}
