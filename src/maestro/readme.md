# Maestro VDOM engine
This engine is designed to accomplish a balance between being fast and compact,
by trying to execute as few DOM operations as it can.

## Limitations
One limitation of this engine is that it expects to have exclusive hold over the
element considered as it's root, eg
```html
<script>
// this is intended to be called by lucia internally
Maestro.setRenderRoot(document.getElementById("app-root"));
</script>

<div id="app-root">
</div>
```
Now maestro expects no one else to touch the `app-root` div or it will raise an error.
