parse     = require('css-parse')
stringify = require('css-stringify')
fs        = require('fs')

any = (x) -> return true in (!!n for n in x)

# process.stdin.resume()
# process.stdin.setEncoding('utf8')
# process.stdin.on 'data', (chunk) -> css += chunk
# process.stdin.on 'end', ->
css = fs.readFileSync('demo.css', 'utf8')
out = parse(css)
{stylesheet: {rules}} = out

js_rules = []
remaining_rules = []
for rule in rules
  continue if rule.type isnt 'rule'
  if any(sel.match(/\:\:(before|after|first\-letter|first\-line)/) for sel in rule.selectors)
    # these aren't injectable by solitude
    console.log rule
    remaining_rules.push rule
    

  else
    # for sel in rule.selectors
    #   js_rules.push sel

    js_rules.push [
      rule.selectors,
      [decl.property, decl.value] for decl in rule.declarations when decl.type is 'declaration'
    ]
      
    console.log rule.selectors, rule.declarations

console.log JSON.stringify(js_rules)

fs.writeFileSync('rules.js', 'rules = ' + JSON.stringify(js_rules, null, '\t'))

fs.writeFileSync('remainder.css', stringify({stylesheet: rules: remaining_rules}))