this.functionList = new Array();
this.name = null;

var object;
var keywords = new Array(
		"#445588:void char int enum float double short long signed unsigned const auto extern register static struct typedef union volatile",
		"#FFFF00:break case continue default do else for goto if return sizeof switch while"
);

this.init = function(obj)
{
	object = obj;
}

this.highlight = function(text)
{
	var color = "";
	var words = "";

	text = hlMacros(text);

	for(var i = 0; i < keywords.length; i++)
	{
		color = keywords[i].split(":")[0];
		words = keywords[i].split(":")[1];

		text = hlWords(color, words.split(" "), text);
	}

	text = hlMultiLineComments(text);
	text = hlSingleLineComments(text);

	return text;
}

function loadFILE(file)
{
	return eval(object + '.loadFILE_pub("' + file + '");');
}

function hlMultiLineComments(text)
{
	var pos1 = 0;
	var pos2 = 0;
	var substr = "";
	var to_replace = new Array();

	while((pos1 != -1) && (pos2 < text.length))
	{
		pos1 = text.indexOf("/*", pos2 + 2);
		pos2 = text.indexOf("*/", pos1);
		substr = text.substr(pos1, pos2 - pos1 + 2);

		if(substr.match(/[\w]+/))
			to_replace.push(substr);
	}

	for(var i = 0; i < to_replace.length; i++)
	{
		text = text.replace(to_replace[i], "<a style=\"color: cyan\">" + to_replace[i] + "</a>");
	}

	return text;
}

function hlSingleLineComments(text)
{
	var reg = new RegExp('//.*', "g");
	var sub = "";
	var to_replace = new Array();

	while((sub = reg.exec(text)) != null)
	{
		to_replace.push(sub);
	}

	for(var i = 0; i < to_replace.length; i++)
	{
		text = text.replace(to_replace[i], "<a style=\"color: cyan\">" + to_replace[i] + "</a>");
	}

	return text;
}

function hlMacros(text)
{
	var reg = new RegExp('#.*', "g");
	var sub = "";
	var to_replace = new Array();

	while((sub = reg.exec(text)) != null)
	{
		to_replace.push(sub);
	}

	for(var i = 0; i < to_replace.length; i++)
	{
		text = text.replace(to_replace[i], "<a style=\"color: blue\">" + to_replace[i] + "</a>");
	}

	return text;
}

function hlWords(color, words, text)
{
	var sub = "";

	for(var i = 0; i < words.length; i++)
	{
		var reg = new RegExp("\\b" + words[i] + "\\b", "g");

		text = text.replace(reg, "<a style=\"color :" + color + "\">" + words[i] + "</a>");
	}

	return text;
}
