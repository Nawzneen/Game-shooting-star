const canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext("2d");
const scoreEl = document.querySelector(".score");
const popUp = document.querySelector("#popup");
const restartBtn = document.querySelector(".restartBtn");
const finalResult = document.querySelector("#final-result");
// console.log("c");

// Building classes
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}
class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    // c.beginPath();
    // c.translate(x, y);
    // c.moveTo(0, 0 - r);
    // for (var i = 0; i < n; i++) {
    //   c.rotate(Math.PI / n);
    //   c.lineTo(0, 0 - r * inset);
    //   c.rotate(Math.PI / n);
    //   c.lineTo(0, 0 - r);
    // }
    // c.closePath();
    // c.fillStyle = this.color;
    // c.fill();
    // // c.restore();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
const friction = 0.99;

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }
  update() {
    this.draw();
    this.velocity.y *= friction;
    this.velocity.x *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}

const x = canvas.width / 2;
const y = canvas.height / 2;
let player = new Player(x, y, 20, "white");
// Array of projectiles
let projectiles = [];
let enemies = [];
let particles = [];
function init() {
  player = new Player(x, y, 20, "white");
  // Array of projectiles
  projectiles = [];
  enemies = [];
  particles = [];
  result = 0;
  scoreEl.innerHTML = result;
  finalResult.innerHTML = result;
}
// Functiont to spawn enemy
function spawnEnemies() {
  setInterval(() => {
    radius = Math.random() * (30 - 5) + 5;
    let x;
    let y;
    console.log("text");
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    // random();
    // color
    var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    //
    color = randomColor;
    const angel = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    const r = Math.random() * 4;
    const velocity = {
      x: Math.cos(angel) * r,
      y: Math.sin(angel) * r,
    };
    enemies.push(new Enemy(x, y, 40, color, velocity));
  }, 1000);
}
// Function for animation
let animationID;
let result = 0;
function animate() {
  animationID = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();

  // to draw the particles when explodes
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });

  projectiles.forEach((projectile, index) => {
    projectile.update();
    // remove from the edges
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    }
  });
  enemies.forEach((enemy, index) => {
    enemy.update();
    // console.log(hi);
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    // end game
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationID);
      popUp.style.display = "flex";
      finalResult.innerHTML = result;
    }
    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // enemy and projectile hits
      if (dist - enemy.radius - projectile.radius < 1) {
        // To create particles when enemy and particiles hit
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * 6,
                y: (Math.random() - 0.5) * 6,
              }
            )
          );
        }

        if (enemy.radius - 15 > 15) {
          result += 70;
          scoreEl.innerHTML = result;
          gsap.to(enemy, { radius: enemy.radius - 15 });
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1);
          }, 0);
        } else {
          result += 90;
          scoreEl.innerHTML = result;
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      }
    });
  });
}

addEventListener("click", (event) => {
  // You push a object to the array everytime you click
  const angel = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(angel) * 5,
    y: Math.sin(angel) * 5,
  };
  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "red", velocity)
  );
});

restartBtn.addEventListener("click", () => {
  init();
  animate();
  spawnEnemies();
  popUp.style.display = "none ";
});
