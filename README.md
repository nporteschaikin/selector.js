<h1>selector.js</h1>
<p>Quickly and easily create beautiful custom <code>&#60;select&#62;</code> elements.  jQuery required.</p>
<h1>Options (can be set in jQuery or with "data" attributes):</h1>
<p><code>url: boolean (false)</code> Set the selector to navigate to the URL specified in the option value selected.</p>
<p><code>placeholder: string (null)</code> Set a placeholder for when no option is selected.</p>
<p><code>pfx: string ('selector')</code> Set the CSS prefix.</p>
<p><code>z: number (99)</code> Set the z-index of the list.</p>
<p><code>fade: bool (true)</code> Whether the list fades in and out when toggled.</p>
<p><code>fadeSpeed: number (100)</code> How fast the fade occurs.</p>
<h1>Usage</h1>
<p>jQuery:<br />
<code>$('select').select( options );</code></p>
<p>HTML:<br />
<code>	&#60;select name="key"&#62;	
		&#60;option value="1"&#62;Option 1&#60;/option&#62;
		&#60;option value="2"&#62;Option 2&#60;/option&#62;
	&#60;/select&#62;</code></p>
<p>See "selector.css" for how to structure a pertinent cascading stylesheet.</p>
