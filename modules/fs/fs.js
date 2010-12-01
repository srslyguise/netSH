this.functionList = new Array("cd", "ls");
var object;
var fs = null;
var path = "/";
var base_path = null;

this.init = function(obj)
{
	object = obj;
	setPrompt("root:/ #_ ");
	fs = loadXML("modules/fs/config/fs.xml");
	fs = fs.documentElement;

	base_path = createTree("/", fs);
}

this.cd = function(argc, argv)
{

}

this.ls = function(argc, argv)
{

}

function setPrompt(str)
{
	eval(object + '.setPrompt("' + str + '");');
}

function loadXML(file)
{
	return eval(object + '.loadXML_pub("' + file + '");');
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
