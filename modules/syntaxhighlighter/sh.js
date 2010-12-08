this.functionList = new Array();
this.name = null;

var object;
var style = "modules/syntaxhighlighter/styles/sh_typical.css";

var languages = {
	"c":"modules/syntaxhighlighter/languages/sh_c.js",
	"perl":"modules/syntaxhighlighter/languages/sh_perl.js"
}

this.init = function(obj)
{
	object = obj;
	addScript(netSH_prefix + "modules/syntaxhighlighter/sh_main.js");
	addStyle(netSH_prefix + style);
}

this.highlight = function(lang)
{
	var current_module = null;

	if(languages[lang] == undefined)
		return null;

	if(addScript(netSH_prefix + languages[lang]) == 1)
	{
		setTimeout("sh_highlightDocument();", 500);
	}

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
