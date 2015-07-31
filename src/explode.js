export default class Explosion {
  constructor(world, position, strength) {
    this.world = world;
    this.position = position;
    this.strength = strength;
  }

  doExplosion() {
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

      this.world.playSoundAtPosition(this.position, new nova.sound.Sound("icbm", "explode-small").withVolume(2));
    }
  }
