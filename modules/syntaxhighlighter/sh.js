this.functionList = new Array();
this.name = null;

var object;

this.init = function(obj)
{
	object = obj;
	addStyle(netSH_prefix + "modules/syntaxhighlighter/styles/sh.css");
}

this.highlight = function(file, lang)
{
	write("<pre class=sh>" + loadFILE(netSH_prefix + 'modules/syntaxhighlighter/sh.php?file=' + file + '&lang=' + lang) + "</pre>");
	return;
}

function loadFILE(file)
{
	return eval(object + '.loadFILE_pub("' + file + '");');
}

function write(text)
{
	eval(object + '.write(text);');
}

function addStyle(src)
{
	eval(object + '.addStyle_pub(src);');
}
