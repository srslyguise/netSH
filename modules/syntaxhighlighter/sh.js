this.functionList = new Array();
this.name = null;

var object;
var style = "modules/syntaxhighlighter/styles/shEdx.css";

var languages = new Array(
		new Array("bash", "modules/syntaxhighlighter/languages/shBrushBash.js"),
		new Array("c", "modules/syntaxhighlighter/languages/shBrushCpp.js"),
		new Array("cpp", "modules/syntaxhighlighter/languages/shBrushCpp.js"),
		new Array("perl", "modules/syntaxhighlighter/languages/shBrushPerl.js")
);

this.init = function(obj)
{
	object = obj;
	addScript(netSH_prefix + "modules/syntaxhighlighter/shCore.js");
	addStyle(netSH_prefix + "modules/syntaxhighlighter/styles/shCore.css");
	addStyle(netSH_prefix + style);

	for(var i = 0; i < languages.length; i++)
		addScript(netSH_prefix + languages[i][1]);
}

this.highlight = function(lang)
{
	var current_module = null;
	var ready = false; 

	for(var i = 0; i < languages.length; i++)
		if(languages[i][0] == lang)
		{
			var elem = document.getElementById("toHighlight");
			SyntaxHighlighter.highlight(elem);
			elem = document.getElementById("toHighlight");
			elem.setAttribute("id", "");
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
