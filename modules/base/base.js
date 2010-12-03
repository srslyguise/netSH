this.functionList = new Array("clear", "help");
this.name = null;

var help_xml;
var base_xml;
var object;
var user = null;

this.init = function(obj)
{
	object = obj;
	help_xml = loadXML(netSH_prefix + "modules/base/config/help.xml");
	base_xml = loadXML(netSH_prefix + "modules/base/config/base.xml");

	user = base_xml.documentElement.getElementsByTagName('User')[0].getAttribute('name');
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
		write("usage: " + argv[0] + " &lt;cmd&gt;<br>");
		return;
	}

	for(i = 0; i < help_xml.getElementsByTagName('Cmd').length; i++)
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
	eval(object + '.write("' + text + '");');
}

function loadXML(file)
{
	return eval(object + '.loadXML_pub("' + file + '");');
}
