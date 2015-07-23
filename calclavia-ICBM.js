
function preInit() {
  blockManager.register(function(){
    var block = new nova.block.JSBlock("Condensed Explosive");

    block.add(new nova.component.Category("ICBM"));

    var texture = new nova.render.texture.BlockTexture("minecraft", "tnt_side");

    block
      .add(new nova.block.component.StaticBlockRenderer(block))
      .setTexture(texture);

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
  for(var x = -strength; x < strength; x++) {
    for(var y = -strength; y < strength; y++) {
      for(var z = -strength; z < strength; z++){
        var checkPos = position.add(new Vector3D(x, y, z));

        if(checkPos.distance(position) <= strength){
          world.removeBlock(Vector3DUtil.floor(checkPos));
        }
      }
    }
  }
}
