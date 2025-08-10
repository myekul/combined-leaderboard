function physics() {
    let HTMLContent = ''
    players.slice(0, 50).forEach(player => {
        if (player.score >= 90 && player?.links?.img) {
            HTMLContent += `<div class='ball'>${getPlayerIcon(player, 100)}</div>`
        }
    })
    document.getElementById('physics').innerHTML = HTMLContent
    const elements = document.querySelectorAll(".ball");
    elements.forEach(el => {
        el.ondragstart = e => {
            e.preventDefault();
            return false;
        };
    });
    physicsEngine()
}
function physicsEngine() {
    // Matter.js aliases
    const { Engine, Render, Runner, Bodies, World, Events, Mouse, MouseConstraint } = Matter;

    // Create engine & world
    const engine = Engine.create();
    const world = engine.world;
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Get window size
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create invisible walls
    const walls = [
        Bodies.rectangle(width / 2, height - 40, width, 50, { isStatic: true }), // floor
        Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true }),         // ceiling
        Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true }),       // left wall
        Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true }) // right wall
    ];
    World.add(world, walls);

    // Create bodies for each DOM element
    const elements = document.querySelectorAll(".ball");
    const bodies = [];

    const radius = 50;
    const spawnX = width / 2;
    const spawnY = height / 2;
    const jitter = 5; // max random offset in pixels

    elements.forEach(el => {
        const offsetX = (Math.random() * 2 - 1) * jitter; // random between -jitter and +jitter
        const offsetY = (Math.random() * 2 - 1) * jitter;

        let body = Bodies.circle(spawnX + offsetX, spawnY + offsetY, radius, { restitution: 0.7 });
        World.add(world, body);
        bodies.push({ el, body });
    });

    // Add mouse constraint
    const mouse = Mouse.create(document.body);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });
    World.add(world, mouseConstraint);

    // Sync DOM elements with physics positions
    // Events.on(engine, "afterUpdate", () => {
    //     bodies.forEach(({ el, body }) => {
    //         el.style.left = body.position.x - 25 + "px";
    //         el.style.top = body.position.y - 25 + "px";
    //         el.style.transform = `rotate(${body.angle}rad)`;  // rotate in radians
    //     });
    // });
    const radius2 = 50;
    const boundsPadding = radius2 + 10;
    Events.on(engine, "afterUpdate", () => {
        for (let i = bodies.length - 1; i >= 0; i--) {
            const { el, body } = bodies[i];
            const { x, y } = body.position;

            if (
                x < -boundsPadding ||
                x > width + boundsPadding ||
                y < -boundsPadding ||
                y > height + boundsPadding
            ) {
                // Remove physics body
                World.remove(world, body);

                // Remove DOM element
                el.remove();

                // Remove from bodies array
                bodies.splice(i, 1);
            } else {
                // Update position normally
                el.style.left = x - radius + "px";
                el.style.top = y - radius + "px";
                el.style.transform = `rotate(${body.angle}rad)`;
            }
        }
    });
}