this.functionList = new Array("cat");
this.name = null;

var object;
var sh_module;
var file_xml = null;

this.init = function(obj)
{
	object = obj;
	file_xml = loadXML(netSH_prefix + "modules/file/config/file.xml");
	addStyle(netSH_prefix + "modules/file/styles/file.css");

	if(file_xml.documentElement.getAttribute("sh") == "true")
		sh_module = eval(object + '.getModuleByName("sh");');
	else
		sh_module = null;
}

this.cat = function(argc, argv)
{
	var file = "";
	var src = "";
	var fs_module;

	if(argc < 2)
	{
		write("Usage: " + argv[0] + " &lt;file&gt;<br>");
		return;
	}

	fs_module = eval(object + '.getModuleByName("fs");');

	if((src = fs_module.getFileSrc(argv[1])) == null)
		write("cat: " + argv[1] + ": File not found<br>");
	else
	{
		file = loadFILE(netSH_prefix + src);

		if(file == null)
		{
			write("cat: " + argv[1] + ": Can't load file<br>");
			return;
		}

		file = file.replace(/</g, "&lt;");
		file = file.replace(/>/g, "&gt;");

		if(sh_module != null)
			file = sh_module.highlight(file, getExtension(src));

		writeFile(file);
	}
}

function loadFILE(file)
{
	return eval(object + '.loadFILE_pub("' + file + '");');
}

function loadXML(file)
{
	return eval(object + '.loadXML_pub("' + file + '");');
}

function write(text)
{
	eval(object + '.write(text);');
}

function writeFile(file)
{
	eval(object + '.writeFile(file);');
}

function addStyle(file)
{
	eval(object + '.addStyle_pub(file);');
}

function getExtension(file)
{
	try
	{
		return file.match(/\.(.*)?$/)[1];
	}
	catch(e)
	{
		return null;
	}
}
