this.functionList = new Array("blog");
this.name = null;

var object;
var blog_xml = null;

this.init = function(obj)
{
	object = obj;
	blog_xml = loadXML(netSH_prefix + "modules/blog/config/blog.xml");
	blog_xml = blog_xml.documentElement;
	addStyle(netSH_prefix + "modules/blog/styles/blog.css");
}

this.blog = function(argc, argv)
{
	var div = "<table class=blog_list><tr><td>num.</td><td>author</td><td>title</td><td>date</td></tr>";
	var title = "";
	var author = "";
	var date = "";

	if(argc >= 2)
	{
		writePost(argv[1]);
		return;
	}
	
	for(var i = 0; i < blog_xml.getElementsByTagName('Post').length; i++)
	{
		title = blog_xml.getElementsByTagName('Post')[i].getAttribute("title");
		author = blog_xml.getElementsByTagName('Post')[i].getAttribute("author");
		date = blog_xml.getElementsByTagName('Post')[i].getAttribute("date");

		div += "<tr><td>" + (i + 1) + "</td>";
		div += "<td>" + author + "</td>";
		div += "<td>" + title + "</td>";
		div += "<td>" + date + "</td></tr>";
	}

	div += "</table>";

	write(div);
}

function writePost(num)
{
	var div = "<div class=blog_div>";
	var title = "";
	var author = "";
	var date = "";
	var content = "";

	if((num > blog_xml.getElementsByTagName('Post').length) || (num <= 0))
		return;

	--num;

	title = blog_xml.getElementsByTagName('Post')[num].getAttribute("title");
	author = blog_xml.getElementsByTagName('Post')[num].getAttribute("author");
	date = blog_xml.getElementsByTagName('Post')[num].getAttribute("date");
	content = blog_xml.getElementsByTagName('Post')[num].childNodes[0].nodeValue;

	div += "<div class=blog_title>" + title + "</div>";
	div += "<div class=blog_content><pre class=text>" + content + "</pre></div>";
	div += "<div class=blog_info>" + "Posted by " + author + " on " + date + "</div>";

	div += "</div>";

	write(div);
}

function loadXML(file)
{
	return eval(object + '.loadXML_pub("' + file + '");');
}

function write(text)
{
	eval(object + '.write(text);');
}

function addStyle(file)
{
	eval(object + '.addStyle_pub(file);');
}
