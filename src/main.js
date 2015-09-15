const dependencies = ["https://raw.githubusercontent.com/calclavia/ICBM-Classic/ltm/icbm.zip"];

import Explosion from "explode";

function preInit() {
  const textureExplosiveBottom = new nova.render.texture.BlockTexture("icbm", "explosive_bottom_1");
  const textureExplosiveSide = new nova.render.texture.BlockTexture("icbm", "explosive_condensed_side");
  const textureExplosiveTop = new nova.render.texture.BlockTexture("icbm", "explosive_condensed_top");

  renderManager.registerTexture(textureExplosiveBottom);
  renderManager.registerTexture(textureExplosiveSide);
  renderManager.registerTexture(textureExplosiveTop);

  blockManager.register(
    "Condensed Explosive",
    function() {
      const block = new nova.block.Block();

      block.components.add(new nova.component.Category("ICBM"));

      block.components
        .add(new nova.component.renderer.StaticRenderer())
        .onRender(
          new nova.render.pipeline.BlockRenderPipeline(block)
          .withTexture(function(side) {
            if (side == nova.util.Direction.UP)
              return Optional.of(textureExplosiveTop)
            if (side == nova.util.Direction.DOWN)
              return Optional.of(textureExplosiveBottom);
            return Optional.of(textureExplosiveSide)
          })
          .build()
        );

      block.components.add(new nova.component.renderer.ItemRenderer(block));

      block.events
        .on(nova.block.Block.RightClickEvent.class)
        .bind(function(evt) {
          if (networkManager.isServer()) {
            evt.entity.world()
              .addEntity(entityManager.get("Condensed Explosive").get())
              .setPosition(block.position().add(new Vector3D(0.5, 0.5, 0.5)));

            evt.entity.world().removeBlock(block.position());
          }
        });

      return block;
    });

  entityManager.register(
    "Condensed Explosive",
    function() {
      var EntityExplosive = Java.extend(nova.entity.Entity, {
        time: 0,
        update: function(deltaTime) {
          this.time += deltaTime;
          if (this.time >= 5) {
            if (networkManager.isServer()) {
              new Explosion(entity.world(), entity.position(), 3).doExplosion();
            }
            entity.world().removeEntity(entity);
          }
        }
      }
    );

      const entity = new EntityExplosive();

      entity.components
        .add(new nova.component.renderer.DynamicRenderer())
        .onRender(function(model) {
          blockManager
            .get("Condensed Explosive")
            .get()
            .build()
            .components
            .get(nova.component.renderer.StaticRenderer.class)
            .onRender
            .accept(model);
        });

      entity.components
        .add(new nova.component.misc.Collider(entity))
        .setBoundingBox(new nova.util.shape.Cuboid(-0.5, -0.5, -0.5, 0.5, 0.5, 0.5));
      entity.components.add(nova.entity.component.RigidBody.class);
      return entity;
    }
  );

  const codensedExplosive = itemManager.get("Condensed Explosive").get().build();
  recipeManager.addRecipe(new nova.recipes.crafting.ShapelessCraftingRecipe(
    codensedExplosive, [
      nova.recipes.crafting.ItemIngredient.forItem("minecraft:redstone"),
      nova.recipes.crafting.ItemIngredient.forItem("minecraft:tnt")
    ]
  ));
}
