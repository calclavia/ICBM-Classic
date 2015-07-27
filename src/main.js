var dependencies = ["https://raw.githubusercontent.com/calclavia/ICBM-Classic/ltm/icbm.zip"];

import Explosion from "explode";

function preInit() {
  var textureExplosiveBottom = new nova.render.texture.BlockTexture("icbm", "explosive_bottom_1");
  var textureExplosiveSide = new nova.render.texture.BlockTexture("icbm", "explosive_condensed_side");
  var textureExplosiveTop = new nova.render.texture.BlockTexture("icbm", "explosive_condensed_top");

  renderManager.registerTexture(textureExplosiveBottom);
  renderManager.registerTexture(textureExplosiveSide);
  renderManager.registerTexture(textureExplosiveTop);

  blockManager.register(function() {
    var block = new nova.block.JSBlock("Condensed Explosive");

    block.add(new nova.component.Category("ICBM"));

    block
      .add(new nova.block.component.StaticBlockRenderer(block))
      .setTexture(function(side) {
        if (side == nova.util.Direction.UP)
          return Optional.of(textureExplosiveTop)
        if (side == nova.util.Direction.DOWN)
          return Optional.of(textureExplosiveBottom);
        return Optional.of(textureExplosiveSide)
      });

    block.add(new nova.component.renderer.ItemRenderer(block));

    block.events
      .on(nova.block.Block.RightClickEvent.class)
      .bind(function(evt) {
        new Explosion(evt.entity.world(), block.position().add(new Vector3D(0.5, 0.5, 0.5)), 3).doExplosion();
      });

    return block;
  });
}
