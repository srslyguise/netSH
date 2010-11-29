this.functionList = new Array("cd", "ls");
var object;
var fs = null;
var path = "/";
var directory = {
	up: null,
	directory: null,
	files: null,
	links: null
};

this.init = function(obj)
{
	object = obj;
	setPrompt("root:/ #_ ");
	fs = loadXML("modules/fs/config/fs.xml");
	fs = fs.documentElement;
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

}

function Link(name, href)
{

}
