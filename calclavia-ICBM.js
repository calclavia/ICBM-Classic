"use strict";function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function preInit(){var e=new nova.render.texture.BlockTexture("icbm","explosive_bottom_1"),n=new nova.render.texture.BlockTexture("icbm","explosive_condensed_side"),t=new nova.render.texture.BlockTexture("icbm","explosive_condensed_top");renderManager.registerTexture(e),renderManager.registerTexture(n),renderManager.registerTexture(t),blockManager.register(function(){var o=new nova.block.JSBlock("Condensed Explosive");return o.add(new nova.component.Category("ICBM")),o.add(new nova.block.component.StaticBlockRenderer(o)).setTexture(function(o){return o==nova.util.Direction.UP?Optional.of(t):o==nova.util.Direction.DOWN?Optional.of(e):Optional.of(n)}),o.add(new nova.component.renderer.ItemRenderer(o)),o.events.on(nova.block.Block.RightClickEvent["class"]).bind(function(e){new Explosion(e.entity.world(),o.position().add(new Vector3D(.5,.5,.5)),3).doExplosion()}),o})}var _createClass=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),Explosion=function(){function e(n,t,o){_classCallCheck(this,e),this.world=n,this.position=t,this.strength=o}return _createClass(e,[{key:"doExplosion",value:function(){for(var e=-this.strength;e<this.strength;e++)for(var n=-this.strength;n<this.strength;n++)for(var t=-this.strength;t<this.strength;t++){var o=this.position.add(new Vector3D(e,n,t));o.distance(this.position)<=this.strength&&this.world.removeBlock(Vector3DUtil.floor(o))}}}]),e}(),dependencies=["https://raw.githubusercontent.com/calclavia/ICBM-Classic/ltm/icbm.zip"];