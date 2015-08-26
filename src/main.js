const dependencies = ["https://raw.githubusercontent.com/calclavia/ICBM-Classic/ltm/icbm.zip"];

import Explosion from "explode";

function preInit() {
  const textureExplosiveBottom = new nova.render.texture.BlockTexture("icbm", "explosive_bottom_1");
  const textureExplosiveSide = new nova.render.texture.BlockTexture("icbm", "explosive_condensed_side");
  const textureExplosiveTop = new nova.render.texture.BlockTexture("icbm", "explosive_condensed_top");

  renderManager.registerTexture(textureExplosiveBottom);
  renderManager.registerTexture(textureExplosiveSide);
  renderManager.registerTexture(textureExplosiveTop);

  blockManager.register(function() {
    const block = new nova.block.JSBlock("Condensed Explosive");

    block.add(new nova.component.Category("ICBM"));

    block
      .add(new nova.component.renderer.StaticRenderer())
      .onRender(
        new nova.render.pipeline.BlockRenderStream(block)
        .withTexture(function(side) {
          if (side == nova.util.Direction.UP)
            return Optional.of(textureExplosiveTop)
          if (side == nova.util.Direction.DOWN)
            return Optional.of(textureExplosiveBottom);
          return Optional.of(textureExplosiveSide)
        })
        .build()
      );

    block.add(new nova.component.renderer.ItemRenderer(block));

    block.events
      .on(nova.block.Block.RightClickEvent.class)
      .bind(function(evt) {
        evt.entity.world()
          .addEntity(entityManager.getFactory("Condensed Explosive").get())
          .setPosition(block.position().add(new Vector3D(0.5, 0.5, 0.5)));

        evt.entity.world().removeBlock(block.position());
        //new Explosion(evt.entity.world(), block.position().add(new Vector3D(0.5, 0.5, 0.5)), 3).doExplosion();
      });

    return block;
  });

  entityManager.register(function(){
    const entity = new nova.entity.JSEntity("Condensed Explosive")
    {
      this.update= function(deltaTime){
        print(deltaTime);
      }
    }

    entity
      .add(new nova.component.renderer.DynamicRenderer())
      .onRender(function(model){
        blockManager
          .get("Condensed Explosive")
          .get()
          .get(nova.component.renderer.StaticRenderer.class)
          .onRender
          .accept(model);
      });

    return entity;
  })

  const codensedExplosive = itemManager.getItem("Condensed Explosive").get().makeItem();
  recipeManager.addRecipe(new nova.recipes.crafting.ShapelessCraftingRecipe(
    codensedExplosive,
    [
        nova.recipes.crafting.ItemIngredient.forItem("minecraft:redstone"),
        nova.recipes.crafting.ItemIngredient.forItem("minecraft:tnt")
    ]
  ));
}
