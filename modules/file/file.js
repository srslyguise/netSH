this.functionList = new Array("cat");
this.name = null;

var object;
var file_xml = null;

this.init = function(obj)
{
	object = obj;
	file_xml = loadXML(netSH_prefix + "modules/file/config/file.xml");
	addStyle(netSH_prefix + "modules/file/styles/file.css");
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

	if((src = fs_module.getFile(argv[1])) == null)
		write("cat: " + argv[1] + ": File not found<br>");
	else
	{
		file = loadFILE(netSH_prefix + src.Src);

		if(file == null)
		{
			write("cat: " + argv[1] + ": Can't load file<br>");
			return;
		}

		file = file.replace(/</g, "&lt;");
		file = file.replace(/>/g, "&gt;");

		writeFile(file, src.Lang);
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

function writeFile(file, lang)
{
	eval(object + '.writeFile(file, lang);');
}

function addStyle(file)
{
	eval(object + '.addStyle_pub(file);');
}
