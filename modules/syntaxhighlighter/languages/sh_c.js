this.functionList = new Array();
this.name = null;

var object;
var keywords = new Array(
		"color: #445588-|-void char int enum float double short long signed unsigned const auto extern register static struct typedef union volatile",
		"color: #FFFF00-|-break case continue default do else for goto if return sizeof switch while"
);
var others = {
	"comments":"color: cyan",
	"macros":"color: blue",
	"strings":"color: red"
}

this.init = function(obj)
{
	object = obj;
}

this.highlight = function(text)
{
	var rows = text.split("\n");
	var buf = "";

	var ml_comment1 = new RegExp("(\\/\\*)(.*)(\\*\\/)", "g");
	var ml_comment2 = new RegExp("(\\/\\*)(.*)", "g");
	var ml_comment3 = new RegExp("(.*)(\\*\\/)", "g");
	var ml_comment4 = new RegExp("(.*\\*\\/)(.*)(\\/\\*.*)", "g");
	var sl_comment = new RegExp("\\/\\/.*", "");
	var macros = new RegExp("(.*)(#.*)", "");
	var strings = new RegExp("(\\\")(.*)(\\\")", "");

	var sub = new Array();

	for(var i = 0; i < rows.length; i++)
	{
		if((sub = macros.exec(rows[i])) != null)
		{
			if(sub[1].match(/[\w]+/) == null);
				rows[i] = rows[i].replace(sub[0], "<a style=\"" + others["macros"] + "\">" + sub[0] + "</a>");
			continue;
		}

		if((sub = strings.exec(rows[i])) != null)
		{
			rows[i] = rows[i].replace(sub[0], "<a style=\"" + others["strings"] + "\">" + sub[0] + "</a>");
		}

		rows[i] = hl_keyword(rows[i]);

		if((sub = ml_comment4.exec(rows[i])) != null)
		{
			rows[i] = rows[i].replace(sub[0], sub[1] + "</a>" + sub[2] + "<a style=\"" + others["comments"] + "\">" + sub[3]);
			continue;
		}

		if((sub = ml_comment1.exec(rows[i])) != null)
		{
			rows[i] = rows[i].replace(sub[0], "<a style=\"" + others["comments"] + "\">" + sub[0] + "</a>");
			continue;
		}

		if((sub = ml_comment2.exec(rows[i])) != null)
		{
			rows[i] = rows[i].replace(sub[0], "<a style=\"" + others["comments"] + "\">" + sub[0]);
			continue;
		}

		if((sub = ml_comment3.exec(rows[i])) != null)
		{
			rows[i] = rows[i].replace(sub[0], sub[0] + "</a>");
			continue;
		}

		if((sub = sl_comment.exec(rows[i])) != null)
		{
			rows[i] = rows[i].replace(sub[0], "<a style=\"" + others["comments"] + "\">" + sub[0] + "</a>");
		}
	}

	for(var i = 0; i < rows.length; i++)
		buf += rows[i] + "\n";

	text = buf;

	return text;
}

function loadFILE(file)
{
	return eval(object + '.loadFILE_pub("' + file + '");');
}

function hl_keyword(row)
{
	var substr = "";

	for(var i = 0; i < keywords.length; i++)
	{
		var style = keywords[i].split("-|-")[0];
		var kws = keywords[i].split("-|-")[1].split(" ");

		for(var i2 = 0; i2 < kws.length; i2++)
		{
			var reg_w = new RegExp("\\b" + kws[i2] + "\\b", "g");

			if((substr = reg_w.exec(row)) != null)
			{
				row = row.replace(reg_w, "<a style=\"" + style + "\">" + kws[i2] + "</a>");
			}
		}
	}

	return row;
}
