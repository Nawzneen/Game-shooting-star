const canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext("2d");
const scoreEl = document.querySelector(".score");
const popUp = document.querySelector("#popup");
const restartBtn = document.querySelector(".restartBtn");
const okBtn = document.querySelector("#ok");
const one = document.querySelector("#one");
const two = document.querySelector("#two");
const three = document.querySelector("#three");

const finalResult = document.querySelector("#final-result");
const openGuide = document.querySelector(".openGuide");
const guide = document.querySelector("#guide");

// Building classes
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.moving = false;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.up();
  }
  up() {
    if (
      (keys["w"] && this.y - this.radius > 0) ||
      (keys["W"] && this.y - this.radius > 0)
    ) {
      this.y--;
      // this.draw();
    }
    if (
      (keys["s"] && this.y + this.radius < canvas.height) ||
      (keys["S"] && this.y + this.radius < canvas.height)
    ) {
      this.y++;
      // this.draw();
    }

    if (
      (keys["a"] && this.x - this.radius > 0) ||
      (keys["A"] && this.x - this.radius > 0)
    ) {
      this.x--;
      // this.draw();
    }
    if (
      (keys["d"] && this.x + this.radius < canvas.width) ||
      (keys["D"] && this.x + this.radius < canvas.width)
    ) {
      this.x++;
      // this.draw();
    }
  }
}
class Projectile {
  constructor(x, y, X0, Y0, radius, color) {
    this.x = x;
    this.y = y;
    this.x0 = x;
    this.y0 = y;
    this.radius = radius;
    this.color = color;
    this.clientX = X0;
    this.clientY = Y0;

    // this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.angel = Math.atan2(this.clientY - this.y0, this.clientX - this.x0);
    this.velocity = {
      x: Math.cos(this.angel) * 5,
      y: Math.sin(this.angel) * 5,
    };
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Enemy {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    // this.velocity = velocity;
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
    // ENEMY CHASING PLAYER
    this.angel = Math.atan2(player.y - this.y, player.x - this.x);
    this.r = Math.random() * 2;
    this.velocity = {
      x: Math.cos(this.angel) * this.r,
      y: Math.sin(this.angel) * this.r,
    };
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

class Wave {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    // this.alpha = 1;
  }
  draw() {
    // c.save();
    // c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // c.fillStyle = this.color;
    c.lineWidth = 10;
    c.strokeStyle = "white";
    c.stroke();
    // c.fill();
    // c.stroke();
    // c.fill();
    // c.restore();
  }
  update() {
    this.draw();
    // this.velocity.y *= friction;
    // this.velocity.x *= friction;
    this.radius += 30;

    // this.x = this.x + 10;
    // this.y = this.y + 10;
    // this.alpha -= 0.01;
  }
}

// let player = new Player(x, y, 20, "white");
// // Array of projectiles
let projectiles = [];
let enemies = [];
let particles = [];
let waves = [];
let waveNum = 3;
let player;

function init() {
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  player = new Player(x, y, 20, "white");
  // Array of projectiles
  projectiles = [];
  enemies = [];
  particles = [];
  waves = [];
  waveNum = 3;
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
    // enemies first moving to the initial position of the player
    // const angel = Math.atan2(player.y - y, player.x - x);
    // const r = Math.random() * 2;
    // const velocity = {
    //   x: Math.cos(angel) * r,
    //   y: Math.sin(angel) * r,
    // };
    enemies.push(new Enemy(x, y, 40, color));
  }, 3000);
}
// Function for animation
let animationID;
let result = 0;
function animate() {
  animationID = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  // wave.update();

  waves.forEach((wave, index) => {
    wave.update();
    // if(wave.x + wave.radius - (enemy.x + enemy.radius)){

    // }
    // waves.splice(index, 1);
  });
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
    // enemy and wave hits
    // waves.forEach((wave, index) => {
    //   const distEnemyWave = Math.hypot(wave.x - enemy.x, wave.y - enemy.y);
    //   console.log(distEnemyWave);
    //   if (distEnemyWave - wave.radius - enemy.radius < 0) {
    //     wave.splice(index, 1);
    //     enemies.splice(index, 1);
    //   }
    // });
  });
}

addEventListener("click", (event) => {
  // You push a object to the array everytime you click
  // const angel = Math.atan2(event.clientY - player.y, event.clientX - player.x);
  // const velocity = {
  //   x: Math.cos(angel) * 5,
  //   y: Math.sin(angel) * 5,
  // };
  const X0 = event.clientX;
  const Y0 = event.clientY;

  projectiles.push(new Projectile(player.x, player.y, X0, Y0, 5, "red"));
});

addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    // let wave = ;
    // waves.push(wave);
    // wave.update();
    if (waveNum > 0) {
      if (waveNum === 3) {
        three.remove();
      }
      if (waveNum === 2) {
        two.remove();
      }
      if (waveNum === 1) {
        one.remove();
      }
      waveNum--;
      waves.push(new Wave(player.x, player.y, 50, "white", 20));
      enemies.splice(0, enemies.length);
      console.log(waveNum);
    }
  }
});

// Player MOVEMENTS

let keys = [];
addEventListener("keydown", function (e) {
  // keys.push(e.key);
  keys[e.key] = true;
  // if (keys["w"]) {
  // }
  // player.moving = true;
});
addEventListener("keyup", function (e) {
  delete keys[e.key];
  // keys.splice(e.key);
  // player.moving = false;
});

// function playerMovement() {
//   if (keys[87]) {
//     player.y--;
//   }
// }

restartBtn.addEventListener("click", () => {
  // refreshPage();
  // window.location.reload();

  init();
  animate();
  spawnEnemies();
  popUp.style.display = "none ";
});
function refreshPage() {
  window.location.reload();
}
openGuide.addEventListener("click", () => {
  guide.style.display = "flex";
});
okBtn.addEventListener("click", () => {
  guide.style.display = "none";
});
