// for a good minute and a half, i was reading
// http://tburette.github.io/blog/2014/05/25/so-you-want-to-write-your-own-CSV-code/
// and was convinced that they were referring to CSS

scope = document.getElementById("island-of-misfit-toys")

function get_style(name, prop){
	return reset_rules[prop]
	// return get_style_default(name, prop)
	// var a = get_style_default(name, prop),
	// 	b = get_style_default('span', prop);
	// return a == b ? a : 'inherit';
}

var elements = [];
rules.forEach(function(rule, ruleindex){
	var selectors = rule[0];
	selectors.forEach(function(selector){
		var matches = scope.querySelectorAll(selector)
		for(var i = 0; i < matches.length; i++){
			
			var exists = false;
			for(var j = 0; j < elements.length; j++){
				if(elements[j].el === matches[i]){
					exists = true;
					elements[j].m.push(ruleindex)
					break;
				}
			}
			if(!exists){
				var depth = 0, k = matches[i];
				while(k != scope){
					k = k.parentNode;
					depth++;
				}
				elements.push({
					el: matches[i],
					m: [ruleindex],
					d: depth
				})
			}
		}
	})
})


elements.sort(function(a, b){
	return a.d - b.d
}).forEach(function(obj){
	var el = obj.el;
	var style = getComputedStyle(el);
	var applied = [];

	// console.log(style)

	for(var j = 0; j < style.length; j++){
		var name = style[j]
		var defval = get_style(el.tagName, name),
			curval = style.getPropertyValue(name);
		// console.log(name, curval)
		if(curval != defval){
			// if(defval) applied[name] = defval;
			if(defval) applied.push(name + ":" + defval + " !important");
		}
	}

	obj.m.forEach(function(ruleindex){
		// console.log(ruleindex, rules[ruleindex])
		var declarations = rules[ruleindex][1];
		declarations.forEach(function(prop){
			if(prop[1]) 
				applied.push(prop[0]+":" +prop[1]+" !important");
			// applied[prop[0]] = prop[1]
		})
	})
	
	// TODO: support rules which have ; inside a string or something
	;(el.getAttribute('style') || '').split(';').forEach(function(prop){
		var colon = prop.indexOf(':');
		var name = prop.slice(0, colon), 
			val = prop.slice(colon + 1).replace('!important', '').replace(/\s+/g, ' ').trim();
		// applied[name] = val;
		if(name && val)
			applied.push(name + ":" + val + " !important");
	})

	el.setAttribute('style', applied.join(';'))
	// console.log(rule, matches)
})
console.log(scope)
