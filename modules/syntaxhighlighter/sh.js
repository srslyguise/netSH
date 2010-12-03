this.functionList = new Array();
this.name = null;

var object;

var languages = {
	"c":"modules/syntaxhighlighter/languages/sh_c.js"
}

this.init = function(obj)
{
	object = obj;
}

this.highlight = function(text, lang)
{
	var current_module = null;

	if(languages[lang] == undefined)
		return;

	current_module = getModuleByName("sh_" + lang);

	if(current_module == null)
	{
		var module = loadFILE(netSH_prefix + languages[lang]);

		if(module == null)
			return;

		loadModule("sh_" + lang, module);
	}

	current_module = getModuleByName("sh_" + lang);

	if(current_module == null)
		return;

	text = current_module.highlight(text);

	return text;
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
