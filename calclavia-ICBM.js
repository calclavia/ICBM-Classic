"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Explosion = (function () {
  function Explosion(world, position, strength) {
    _classCallCheck(this, Explosion);

    this.world = world;
    this.position = position;
    this.strength = strength;
  }

  _createClass(Explosion, [{
    key: "doExplosion",
    value: function doExplosion() {
      for (var x = -this.strength; x < this.strength; x++) {
        for (var y = -this.strength; y < this.strength; y++) {
          for (var z = -this.strength; z < this.strength; z++) {
            var checkPos = this.position.add(new Vector3D(x, y, z));

            if (checkPos.distance(this.position) <= this.strength) {
              this.world.removeBlock(Vector3DUtil.floor(checkPos));
            }
          }
        }
      }
    }
  }]);

  return Explosion;
})();
"use strict";

var dependencies = ["https://raw.githubusercontent.com/calclavia/ICBM-Classic/ltm/icbm.zip"];

function preInit() {
  var textureExplosiveBottom = new nova.render.texture.BlockTexture("icbm", "explosive_bottom_1");
  var textureExplosiveSide = new nova.render.texture.BlockTexture("icbm", "explosive_condensed_side");
  var textureExplosiveTop = new nova.render.texture.BlockTexture("icbm", "explosive_condensed_top");

  renderManager.registerTexture(textureExplosiveBottom);
  renderManager.registerTexture(textureExplosiveSide);
  renderManager.registerTexture(textureExplosiveTop);

  blockManager.register(function () {
    var block = new nova.block.JSBlock("Condensed Explosive");

    block.add(new nova.component.Category("ICBM"));

    block.add(new nova.block.component.StaticBlockRenderer(block)).setTexture(function (side) {
      if (side == nova.util.Direction.UP) return Optional.of(textureExplosiveTop);
      if (side == nova.util.Direction.DOWN) return Optional.of(textureExplosiveBottom);
      return Optional.of(textureExplosiveSide);
    });

    block.add(new nova.component.renderer.ItemRenderer(block));

    block.events.on(nova.block.Block.RightClickEvent["class"]).bind(function (evt) {
      new Explosion(evt.entity.world(), block.position().add(new Vector3D(0.5, 0.5, 0.5)), 3).doExplosion();
    });

    return block;
  });
}
