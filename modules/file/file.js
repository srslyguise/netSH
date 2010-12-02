this.functionList = new Array("cat");
this.name = null;

var object;

this.init = function(obj)
{
	object = obj;
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
		file = loadFILE(src);
		file = file.replace(/</g, "&lt;");
		file = file.replace(/>/g, "&gt;");

		write("<pre>" + file + "</pre>");
	}
}

function loadFILE(file)
{
	return eval(object + '.loadFILE_pub("' + file + '");');
}

function write(text)
{
	eval(object + '.write(text);');
}
