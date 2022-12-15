class SupplyCrate {
    constructor (x, y, width, height) {
        this.width = width;
        this.height = height;

        this.body = Bodies.rectangle (x, y, this.width, this.height);
        World.add (world, this.body);

        this.imgArray = [
            supplyCrateClosed,
            supplyCrateOpened,
        ];

        this.sPosition = [];
        this.isDelivered = false;
    }

    display () {
        var posX = this.body.position.x;
        var posY = this.body.position.y;

        image (this.imgArray[0], posX, posY, this.width, this.height);
    }

    groundCollision (index) {
        var collision =  Matter.SAT.collides (supplyCrates[index].body, ground);

        if (collision.collided) {
            World.remove (world, supplyCrates[index].body);
            supplyCrates[index].body = null; 
            
            numberLost += 1;
            
            var w = "Supply crate";
            if (numberLost > 1) {
                w = "Supply crates";
            }

            lostMessage.html (`${numberLost} ${w} lost! Be careful`);
        }
    }
}