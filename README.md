<h1>selector.js</h1>
<p>The most functional custom &#60;select&#62;</code> plugin on Earth.  It might as well be the default &#60;select&#62; element &#8212; except it's entirely customizable with CSS. jQuery 1.6+ required.</p>
<ul>
	<li>Simply apply the function to a &#60;select&#62; element; selector.js will take care of the rest.</li>
	<li>Tab indexing</li>
	<li>Keyboard navigation &#8212; including search options by first letter.</li>
</ul>
<h1>Options</h1>
<ul>
	<li><strong>url</strong> <em>bool</em> (false) Set the selector to navigate to the URL specified in the option value selected.</li>
	<li><strong>pfx</strong> <em>string</em> ('selector') Set the CSS prefix (see selector.css)</li>
	<li><strong>z</strong> <em>number</em> (99) Set the z-index of the list.</li>
	<li><strong>fade</strong> <em>bool</em> (true) Whether the list fades in and out when toggled.</li>
	<li><strong>sp</strong> <em>number</em> (false) How fast the fade occurs.</li>
	<li><strong>caret</strong> <em>bool</em> (false) Whether a caret element exists.</li>
</ul>
<h1>Usage</h1>
<p><code>$('select').select( options );</code><br />
<code>	&#60;select name="key"&#62;	
		&#60;option value="1"&#62;Option 1&#60;/option&#62;
		&#60;option value="2"&#62;Option 2&#60;/option&#62;
	&#60;/select&#62;</code></p>
