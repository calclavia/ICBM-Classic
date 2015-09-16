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
      var _this = this;

      for (var x = -this.strength; x < this.strength; x++) {
        for (var y = -this.strength; y < this.strength; y++) {
          for (var z = -this.strength; z < this.strength; z++) {
            var checkPos = this.position.add(new Vector3D(x, y, z));

            if (checkPos.distance(this.position) <= this.strength) {
              this.world.removeBlock(Vector3DUtil.floor(checkPos));
              this.world.addClientEntity(entityManager.get("minecraft:smoke").get()).setPosition(checkPos);
              this.world.addClientEntity(entityManager.get("minecraft:explode").get()).setPosition(checkPos);
            }
          }
        }
      }

      if (networkManager.isServer()) {
        //Damage entities
        this.world.getEntities(nova.util.shape.Cuboid.ONE.expand(this.strength).add(this.position)).forEach(function (entity) {
          print("Found entity: " + entity);
          if (entity.components.has(nova.component.misc.Damageable["class"])) {
            entity.components.get(nova.component.misc.Damageable["class"]).damage(_this.strength);
          }
        });
      }

      //Play sound effect
      this.world.playSoundAtPosition(this.position, new nova.sound.Sound("icbm", "explode-small").withVolume(2));

      //Spawn particles
      this.world.addClientEntity(entityManager.get("minecraft:largeexplode").get()).setPosition(this.position);
    }
  }]);

  return Explosion;
})();
"use strict";

var dependencies = ["https://raw.githubusercontent.com/calclavia/ICBM-Classic/ltm/icbm.zip"];

function main() {
  var textureExplosiveBottom = new nova.render.texture.BlockTexture("icbm", "explosive_bottom_1");
  var textureExplosiveSide = new nova.render.texture.BlockTexture("icbm", "explosive_condensed_side");
  var textureExplosiveTop = new nova.render.texture.BlockTexture("icbm", "explosive_condensed_top");

  var textureGrenadeCondensed = new nova.render.texture.ItemTexture("icbm", "grenade_condensed");

  events.on(RenderManager.Init["class"]).bind(function (evt) {
    renderManager.registerTexture(textureExplosiveBottom);
    renderManager.registerTexture(textureExplosiveSide);
    renderManager.registerTexture(textureExplosiveTop);
    renderManager.registerTexture(textureGrenadeCondensed);
  });

  events.on(BlockManager.Init["class"]).bind(function (evt) {
    return blockManager.register("Condensed Explosive", function () {
      var block = new nova.block.Block();

      block.components.add(new nova.component.Category("ICBM"));

      block.components.add(new nova.component.renderer.StaticRenderer()).onRender(new nova.render.pipeline.BlockRenderPipeline(block).withTexture(function (side) {
        if (side == nova.util.Direction.UP) return Optional.of(textureExplosiveTop);
        if (side == nova.util.Direction.DOWN) return Optional.of(textureExplosiveBottom);
        return Optional.of(textureExplosiveSide);
      }).build());

      block.components.add(new nova.component.renderer.ItemRenderer(block));

      block.events.on(nova.block.Block.RightClickEvent["class"]).bind(function (evt) {
        if (networkManager.isServer()) {
          evt.entity.world().addEntity(entityManager.get("Condensed Explosive").get()).setPosition(block.position().add(new Vector3D(0.5, 0.5, 0.5)));

          evt.entity.world().removeBlock(block.position());
        }
      });

      return block;
    });
  });

  events.on(EntityManager.Init["class"]).bind(function (evt) {
    return entityManager.register("Condensed Explosive", function () {
      var EntityExplosive = Java.extend(nova.entity.Entity, {
        time: 0,
        update: function update(deltaTime) {
          this.time += deltaTime;
          if (this.time >= 5) {
            if (networkManager.isServer()) {
              new Explosion(entity.world(), entity.position(), 3).doExplosion();
            }
            entity.world().removeEntity(entity);
          }
        }
      });

      var entity = new EntityExplosive();

      entity.components.add(new nova.component.renderer.DynamicRenderer()).onRender(function (model) {
        blockManager.get("Condensed Explosive").get().build().components.get(nova.component.renderer.StaticRenderer["class"]).onRender.accept(model);
      });

      entity.components.add(new nova.component.misc.Collider(entity)).setBoundingBox(new nova.util.shape.Cuboid(-0.5, -0.5, -0.5, 0.5, 0.5, 0.5));
      entity.components.add(nova.entity.component.RigidBody["class"]);
      return entity;
    });
  });

  events.on(ItemManager.Init["class"]).bind(function (evt) {
    itemManager.register("Condensed Grenade", function () {
      var item = new Item();
      item.components.add(new nova.component.Category("ICBM"));

      item.components.add(new ItemRenderer()).setTexture(textureGrenadeCondensed);

      item.events.on(Item.RightClickEvent["class"]).bind(function (evt) {
        return new Explosion(evt.entity.world(), evt.entity.position(), 3).doExplosion();
      });

      return item;
    });
  });

  events.on(RecipeManager.Init["class"]).bind(function (evt) {
    var codensedExplosive = itemManager.get("Condensed Explosive").get().build();
    recipeManager.addRecipe(new nova.recipes.crafting.ShapelessCraftingRecipe(codensedExplosive, [nova.recipes.crafting.ItemIngredient.forItem("minecraft:redstone"), nova.recipes.crafting.ItemIngredient.forItem("minecraft:tnt")]));
  });
}
