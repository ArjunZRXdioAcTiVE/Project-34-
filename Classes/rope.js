class Rope {
  constructor (helicopterX, helicopterY, length) {
    this.pointA = {x: helicopterX, y: helicopterY};
    
    this.length = length/2;

    this.body2 = Bodies.rectangle(0, 0, 10, 10);
    World.add (world, this.body2);
    
    this.body = Constraint.create ({
      pointA: this.pointA,
      bodyB: this.body2,
      length: this.length,
      stiffness: 0.5
    });
    World.add (world, this.body);
  }

  display () {
    var helicopterX = helicopter.position.x;
    var helicopterY = helicopter.position.y;

    var bodyPoint = this.body.pointA;
    bodyPoint.x = helicopterX;
    bodyPoint.y = helicopterY;
    
    var pos = this.body.bodyB.position;

    line (bodyPoint.x, bodyPoint.y, pos.x, pos.y);
  }

  attachCrate (index) {
    var collision = Matter.SAT.collides (supplyCrates[index].body, this.body2);

    if (collision.collided) {
      World.remove(world, this.body2);
      this.body2 = null;

      this.body.bodyB = supplyCrates[index].body;

      isAttached = true;
    }
  }

  deliver (index, pos) {
    this.body.bodyB = null;

    World.remove (world, supplyCrates[index].body);
    supplyCrates[index].body = null;
   
    supplyCrates[index].isDelivered = true;

    var posX = pos[0];
    var posY = pos[1];

    this.body2 = Bodies.rectangle(posX, posY, 10, 10);
    World.add (world, this.body2);
    
    this.body.bodyB = this.body2;

    isAttached = false;
    totalDelivered += 1;
  }
}