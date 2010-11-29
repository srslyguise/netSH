this.functionList = new Array("func1", "func2");
var object;

this.init = function(obj)
{
	object = obj;
}

this.func1 = function(argc, argv)
{
	for(i = 0; i < argc; i++)
		write(argv[i]);
}

this.func2 = function(argc, argv)
{
	alert("func2 called with argc = " + argc);
}

function write(text)
{
	eval(object + '.write("' + text + '<br>");');
}
