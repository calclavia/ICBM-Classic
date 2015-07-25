var dependencies = ["https://raw.githubusercontent.com/calclavia/ICBM-Classic/ltm/icbm.zip"];

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
        explode(evt.entity.world(), block.position().add(new Vector3D(0.5, 0.5, 0.5)), 3);
      });

    return block;
  });
}

function explode(world, position, strength) {
  for (var x = -strength; x < strength; x++) {
    for (var y = -strength; y < strength; y++) {
      for (var z = -strength; z < strength; z++) {
        var checkPos = position.add(new Vector3D(x, y, z));

        if (checkPos.distance(position) <= strength) {
          world.removeBlock(Vector3DUtil.floor(checkPos));
        }
      }
    }
  }
}
