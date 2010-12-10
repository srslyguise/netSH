this.functionList = new Array("cd", "ls");
this.name = null;

var object;
var fs = null;
var path = "/";
var base_path = null;
var current;

this.init = function(obj)
{
	object = obj;
	fs = loadXML(netSH_prefix + "modules/fs/config/fs.xml");
	fs = fs.documentElement;
	addStyle(netSH_prefix + "modules/fs/styles/fs.css");

	current = base_path = createTree("/", fs);
	setPrompt(getUser() + ":" + base_path.Name + " " + getPrivilege() + "_");
}

this.getCurrentPath = function()
{
	return current.Name;
}

this.cd = function(argc, argv)
{
	if(argc < 2)
	{
		write("Usage: " + argv[0] + " &lt;path&gt;<br>");
		return;
	}

	if(Cd(argv[1]) == 2)
	{
		write("cd: " + argv[1] + ": Path not found<br>");
	}
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
			if(tmp.match(/[^\/]?[\w\n\.]+[^\/]?/) == current.subdirs[i].Name)
			{
				found = true;
				current = current.subdirs[i];
			}

		if(found == false)
			return 2;

		try
		{
			tmp = tmp.match(/[^\/]+([\/]+[\w\n\.]+[\/]?.*)/)[1];

			if(Cd(tmp) == 2)
			{
				write("cd: " + path + ": Path not found<br>");
				setPrompt(getUser() + ":" + current.Name + " " + getPrivilege() + "_");
			}

			return;
		}
		catch(e)
		{
			tmp = null;
		}
	}

	setPrompt(getUser() + ":" + current.Name + " " + getPrivilege() + "_");

	return;
}

this.ls = function(argc, argv)
{
	var tmp_path = current;

	if(argc < 2)
		Ls(tmp_path, "");
	else
	{
		if(Ls(tmp_path, argv[1]) == 2)
			write("ls: " + argv[1] + ": Path not found<br>");
	}
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
			if(tmp.match(/[^\/]?[\w\n\.]+[^\/]?/) == tmp_path.subdirs[i].Name)
			{
				found = true;
				tmp_path = tmp_path.subdirs[i];
			}

		if(found == false)
		{
			//write("ls: " + path + ": Path not found<br>")
			return 2;
		}

		try
		{
			tmp = tmp.match(/[^\/]+([\/]+[\w\n\.]+[\/]?.*)/)[1];

			if(Ls(tmp_path, tmp) == 2)
				write("ls: " + path + ": Path not found<br>");

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

this.getFile = function(file)
{
	return GetFile(current, file);
}

function GetFile(tmp_path, path)
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
		//alert("length --> " + tmp_path.subdirs.length);

		if(tmp.match(/[^\/]?[\w\n\.]+[^\/]?/) == "..")
		{
			if(tmp_path.prev != null)
				tmp_path = tmp_path.prev;
			
			found = true;
		}

		for(var i = 0; i < tmp_path.files.length; i++)
			if(tmp.match(/[^\/]?[\w\n\.]+[^\/]?/) == tmp_path.files[i].Name)
				return tmp_path.files[i];

		for(var i = 0; (i < tmp_path.subdirs.length) && (found != true); i++)
			if(tmp.match(/[^\/]?[\w\n\.]+[^\/]?/) == tmp_path.subdirs[i].Name)
			{
				found = true;
				tmp_path = tmp_path.subdirs[i];
			}

		if(found == false)
		{
			return 2;
		}
		try
		{
			tmp = tmp.match(/[^\/]+([\/]+[\w\n\.]+[\/]?.*)/)[1];

			var ret = GetFile(tmp_path, tmp);
			//alert(ret);

			if(ret == 2)
				return null;
			else
				return ret;

			return;
		}
		catch(e)
		{
			tmp = null;
			return null;
		}
	}

	return;
}

function showPath(path)
{
	for(var i = 0; i < path.subdirs.length; i++)
		write('<a class=dir>' + path.subdirs[i].Name + '</a><br>');

	for(var i = 0; i < path.files.length; i++)
		write("<a class=file>" + path.files[i].Name + "</a><br>");

	for(var i = 0; i < path.links.length; i++)
		write("<a class=link>" + path.links[i].Name + "</a><a class=text> -&gt; <a href=\"" + path.links[i].Href + "\">" + path.links[i].Href + "</a></a><br>");
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
	eval(object + '.write(text);');
}

function File(name, src, lang)
{
	this.Name = name;
	this.Src = src;
	this.Lang = lang;
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
			node.files.push(new File(fs_.childNodes[i].getAttribute("name"), fs_.childNodes[i].getAttribute("src"), fs_.childNodes[i].getAttribute("lang")));

		if(fs_.childNodes[i].tagName == "Link")
			node.links.push(new Link(fs_.childNodes[i].getAttribute("name"), fs_.childNodes[i].getAttribute("href")));

	}
	
	return node;
}

function getUser()
{
	var base_module = eval(object + '.getModuleByName("base");');

	return base_module.getUser();
}

function getPrivilege()
{
	var base_module = eval(object + '.getModuleByName("base");');

	return base_module.getPrivilege();
}

function addStyle(file)
{
	eval(object + '.addStyle_pub(file);');
}
