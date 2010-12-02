this.functionList = new Array("cd", "ls");
var object;
var fs = null;
var path = "/";
var base_path = null;
var current;

this.init = function(obj)
{
	object = obj;
	fs = loadXML("modules/fs/config/fs.xml");
	fs = fs.documentElement;

	current = base_path = createTree("/", fs);
	setPrompt("root:" + base_path.Name + " $_");
}

this.cd = function(argc, argv)
{
	if(argc < 2)
	{
		write("Usage: " + argv[0] + " &lt;path&gt;<br>");
		return;
	}

	Cd(argv[1]);
}

function Cd(path)
{
	var tmp = "";
	var found = false;

	if(path[0] != "/")
		tmp = "/";

	tmp += path;

	//alert(tmp);

	while(tmp != null)
	{
		//alert(tmp.match(/[^\/]?[\w\.]+[^\/]?/));
		//alert("length --> " + current.subdirs.length);

		if(tmp.match(/[^\/]?[\w\n\.]+[^\/]?/) == "..")
		{
			if(current.prev != null)
				current = current.prev;
			
			found = true;
		}

		for(var i = 0; (i < current.subdirs.length) && (found != true); i++)
			if(tmp.match(/[^\/]?[\w\n]+[^\/]?/) == current.subdirs[i].Name)
			{
				found = true;
				current = current.subdirs[i];
			}

		if(found == false)
			return;

		try
		{
			tmp = tmp.match(/[^\/]+([\/]+[\w\n\.]+[\/]?.*)/)[1];
			Cd(tmp);
			return;
		}
		catch(e)
		{
			tmp = null;
		}
	}

	setPrompt("root:" + current.Name + " $_");

	return;
}

this.ls = function(argc, argv)
{
	var tmp_path = current;

	if(argc < 2)
		Ls(tmp_path, "");
	else
		Ls(tmp_path, argv[1]);
}

function Ls(tmp_path, path)
{
	var tmp = "";
	var found = false;

	if(path[0] != "/")
		tmp = "/";

	tmp += path;

	//alert(tmp);

	if(tmp == "/")
		showPath(tmp_path);

	while(tmp != null)
	{
		//alert(tmp.match(/[^\/]?[\w\.]+[^\/]?/));
		//alert("length --> " + tmp_path.subdirs.length);

		if(tmp.match(/[^\/]?[\w\n\.]+[^\/]?/) == "..")
		{
			if(tmp_path.prev != null)
				tmp_path = tmp_path.prev;
			
			found = true;
		}

		for(var i = 0; (i < tmp_path.subdirs.length) && (found != true); i++)
			if(tmp.match(/[^\/]?[\w\n]+[^\/]?/) == tmp_path.subdirs[i].Name)
			{
				found = true;
				tmp_path = tmp_path.subdirs[i];
			}

		if(found == false)
			return;

		try
		{
			tmp = tmp.match(/[^\/]+([\/]+[\w\n\.]+[\/]?.*)/)[1];
			Ls(tmp_path, tmp);
			return;
		}
		catch(e)
		{
			tmp = null;
			showPath(tmp_path);
		}
	}

	return;
}

function showPath(path)
{
	for(var i = 0; i < path.subdirs.length; i++)
		write(path.subdirs[i].Name + "<br>");

	for(var i = 0; i < path.files.length; i++)
		write(path.files[i].Name + "<br>");

	for(var i = 0; i < path.links.length; i++)
		write(path.links[i].Name + "<br>");
}

function setPrompt(str)
{
	eval(object + '.setPrompt("' + str + '");');
}

function loadXML(file)
{
	return eval(object + '.loadXML_pub("' + file + '");');
}

function write(text)
{
	eval(object + '.write("' + text + '");');
}

function File(name, src)
{
	this.Name = name;
	this.Src = src;
}

function Link(name, href)
{
	this.Name = name;
	this.Href = href;
}

function Directory(name)
{
	this.Name = name;
	this.subdirs = new Array();
	this.files = new Array();
	this.links = new Array();
	this.prev = null;
}

function createTree(name, fs_)
{
	var node = new Directory(name);

	for(var i = 0; i < fs_.childNodes.length; i++)
	{
		if(fs_.childNodes[i].tagName == "Directory")
		{
			node.subdirs.push(createTree(fs_.childNodes[i].getAttribute("name"), fs_.childNodes[i]));
			node.subdirs[node.subdirs.length - 1].prev = node;
		}

		if(fs_.childNodes[i].tagName == "File")
			node.files.push(new File(fs_.childNodes[i].getAttribute("name"), fs_.childNodes[i].getAttribute("src")));

		if(fs_.childNodes[i].tagName == "Link")
			node.links.push(new Link(fs_.childNodes[i].getAttribute("name"), fs_.childNodes[i].getAttribute("href")));

	}
	
	return node;
}
