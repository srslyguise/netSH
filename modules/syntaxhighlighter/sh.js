this.functionList = new Array();
this.name = null;

var object;
var style = "modules/syntaxhighlighter/styles/shEdx.css";

var languages = {
	"c":"modules/syntaxhighlighter/languages/shBrushCpp.js",
	"perl":"modules/syntaxhighlighter/languages/shBrushPerl.js",
	"cpp":"modules/syntaxhighlighter/languages/shBrushCpp.js"
}

this.init = function(obj)
{
	object = obj;
	addScript(netSH_prefix + "modules/syntaxhighlighter/shCore.js");
	addStyle(netSH_prefix + "modules/syntaxhighlighter/styles/shCore.css");
	addStyle(netSH_prefix + style);
}

this.highlight = function(lang)
{
	var current_module = null;
	var ready = false; 

	if(languages[lang] == undefined)
		return null;

	if(addScript(netSH_prefix + languages[lang]) == 1)
		setTimeout("var elem = document.getElementById(\"toHighlight\"); SyntaxHighlighter.highlight(elem); elem = document.getElementById(\"toHighlight\"); elem.setAttribute(\"id\", \"\");", 700);

	return;
}

function loadFILE(file)
{
	return eval(object + '.loadFILE_pub("' + file + '");');
}

function loadModule(name, module)
{
	eval(object + '.addModule_pub(name, module);');
}

function getModuleByName(name)
{
	return eval(object + '.getModuleByName("' + name + '");');
}

function addStyle(src)
{
	return eval(object + '.addStyle_pub(src);');
}

function addScript(src)
{
	return eval(object + '.addScript_pub(src);');
}
