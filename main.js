// === Yardımcı Efektler ===
class FloatingText {
  constructor(scene, text, x, y, color = "#FFD700") {
    this.scene = scene;
    this.text = scene.add.text(x, y, text, { 
      fontFamily: '"Orbitron", sans-serif',
      fontSize: "24px", 
      fill: color 
    }).setOrigin(0.5);
    scene.tweens.add({
      targets: this.text,
      y: y - 40,
      alpha: 0,
      duration: 1000,
      onComplete: () => this.text.destroy()
    });
  }
}

class ParticleBurst {
  constructor(scene, x, y, color = 0xFFD700) {
    let particles = scene.add.particles(0, 0, "spark", {
      x: x,
      y: y,
      speed: { min: -200, max: 200 },
      angle: { min: 0, max: 360 },
      lifespan: 600,
      scale: { start: 0.5, end: 0 },
      tint: color,
      quantity: 15
    });
    scene.time.delayedCall(500, () => particles.destroy());
  }
}

// === Menü Sahnesi ===
class MenuScene extends Phaser.Scene {
  constructor() { super("MenuScene"); }

  preload() {
    this.load.image('menu_bg', 'assets/menu_bg.png');
    this.load.image('spark', 'assets/spark.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.audio('bgMusic', 'assets/background.mp3');
    this.load.image('muteIcon', 'assets/mute.png');     // ses kapalı ikonu
    this.load.image('unmuteIcon', 'assets/unmute.png'); // ses açık ikonu

  }

  create() {
    this.add.image(0, 0, 'menu_bg')
      .setOrigin(0, 0)
      .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

    this.add.particles(0, 0, 'spark', {
      x: { min: 0, max: this.sys.game.config.width },
      y: this.sys.game.config.height,
      lifespan: 4000,
      speedY: { min: -50, max: -100 },
      scale: { start: 0.3, end: 0 },
      quantity: 2,
      blendMode: 'ADD'
    });

    let title = this.add.text(this.sys.game.config.width / 2, 150, "Billions Network", {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: "64px",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 6
    }).setOrigin(0.5);

    let logo = this.add.image(this.sys.game.config.width / 2, 275, 'logo')
      .setOrigin(0.5)
      .setScale(0.5);

    this.tweens.add({
      targets: title,
      alpha: { from: 0.7, to: 1 },
      scale: { from: 1, to: 1.05 },
      yoyo: true,
      repeat: -1,
      duration: 1000
    });

    this.tweens.add({
      targets: logo,
      scale: { from: 0.55, to: 0.70 },
      yoyo: true,
      repeat: -1,
      duration: 1500
    });

    this.add.text(this.sys.game.config.width / 2, 750, "One Mask, Endless Adventure.", {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: "25px",
      fill: "#1c00a9ff"
    }).setOrigin(0.5);

    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter your nickname...";
    input.style.position = "absolute";
    input.style.top = "400px";
    input.style.left = "50%";
    input.style.transform = "translateX(-50%)";
    input.style.padding = "12px";
    input.style.fontSize = "18px";
    input.style.fontFamily = '"Orbitron", sans-serif';
    input.style.textAlign = "center";
    input.style.border = "2px solid gold";
    input.style.borderRadius = "8px";
    input.maxLength = 20;
    document.body.appendChild(input);

    const makeButton = (x, y, label, callback) => {
      let btn = this.add.rectangle(x, y, 300, 80, 0x111133, 0.7)
        .setStrokeStyle(3, 0xffd700)
        .setInteractive();

      let text = this.add.text(x, y, label, {
        fontFamily: '"Orbitron", sans-serif',
        fontSize: "22px",
        fill: "#ffffff"
      }).setOrigin(0.5);

      btn.on('pointerover', () => {
        btn.setFillStyle(0x333355);
        text.setStyle({ fill: "#FFD700" });
      });

      btn.on('pointerout', () => {
        btn.setFillStyle(0x111133);
        text.setStyle({ fill: "#ffffff" });
      });

      btn.on('pointerdown', callback);
    };

// Start
makeButton(this.sys.game.config.width / 2, 500, "▶ START GAME", () => {
  let nick = input.value.trim() || "Guest";
  localStorage.setItem("currentPlayer", nick);
  input.remove();

  // Fade-out başlat
  this.cameras.main.fadeOut(800, 0, 0, 0);

  // Fade-out bitince CharacterScene başlasın
  this.cameras.main.once('camerafadeoutcomplete', () => {
    this.scene.start("CharacterScene");
  });
});



    makeButton(this.sys.game.config.width / 2, 600, "✖ EXIT", () => {
      alert("Exit sadece masaüstü oyunlarda çalışır!");
    });

    this.add.text(20, this.sys.game.config.height - 40, "v1.0 Beta", {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: "16px",
      fill: "#ffffff"
    });

    this.add.text(20, this.sys.game.config.height - 20, "Developed by Cryptovorlaxis", {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: "16px",
      fill: "#ffffff"
    });

    // === Arka Plan Müziği ===
if (!this.sound.get('bgMusic')) { // sadece bir kez başlat
  this.bgMusic = this.sound.add('bgMusic', { loop: true, volume: 0.5 });
  this.bgMusic.play();
} else {
  this.bgMusic = this.sound.get('bgMusic');
}
// === Mute/Unmute Butonu ===
this.isMuted = false;
this.muteButton = this.add.image(this.sys.game.config.width - 50, 50, 'unmuteIcon')
  .setInteractive()
  .setScale(0.5)
  .setScrollFactor(0);

this.muteButton.on('pointerdown', () => {
  this.isMuted = !this.isMuted;
  this.sound.mute = this.isMuted;
  this.muteButton.setTexture(this.isMuted ? 'muteIcon' : 'unmuteIcon');
});
  }
}

// === Karakter Seçim Sahnesi ===
class CharacterScene extends Phaser.Scene {
  constructor() { super("CharacterScene"); }

  preload() {
    this.load.image('character_bg', 'assets/character_select_background.png');
    this.load.image('bitcoin_char', 'assets/bitcoin_char.png');
    this.load.image('ethereum_char', 'assets/ethereum_char.png');
    this.load.image('doge_char', 'assets/doge_char.png');
  }

  create() {
    this.add.image(600, 384, 'character_bg').setDisplaySize(1200, 768);

    let title = this.add.text(this.sys.game.config.width / 2, 120, "PICK YOUR MASK", {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: "40px",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 6
    }).setOrigin(0.5);

    // Karakter kartı fonksiyonu
    const makeCharacterCard = (x, y, key, label) => {
      let card = this.add.rectangle(x, y, 180, 220, 0x222244, 0.8)
        .setStrokeStyle(3, 0xffffff)
        .setInteractive();

      let char = this.add.image(x, y, key).setScale(0.6);

      let text = this.add.text(x, char.y + char.displayHeight / 2 + 20, label, {
        fontFamily: '"Orbitron", sans-serif',
        fontSize: "16px",
        fill: "#ffffff"
      }).setOrigin(0.5);

      // Hover efektleri
      card.on('pointerover', () => card.setStrokeStyle(3, 0xffd700));
      card.on('pointerout', () => card.setStrokeStyle(3, 0xffffff));

      // Tıklayınca fade + sahne geçişi
      card.on('pointerdown', () => {
        this.cameras.main.fadeOut(800, 0, 0, 0);

        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start("MainScene", { char: key });
        });
      });
    };

    // Kartları çağır
    makeCharacterCard(400, 400, 'bitcoin_char', "Ghostie");
    makeCharacterCard(600, 400, 'ethereum_char', "HaloPop");
    makeCharacterCard(800, 400, 'doge_char', "CrownLove");
  }
}

// === Oyun Sahnesi ===
class MainScene extends Phaser.Scene {
  constructor() { super("MainScene"); }
  init(data) { this.charKey = data.char || 'bitcoin_char'; }

  preload() {
    this.load.image('coin', 'assets/coin.png');
    this.load.image('obstacle', 'assets/obstacle.png');
    this.load.image('bg', 'assets/game_bg.png');
    this.load.image('bitcoin_char', 'assets/bitcoin_char.png');
    this.load.image('ethereum_char', 'assets/ethereum_char.png');
    this.load.image('doge_char', 'assets/doge_char.png');
    this.load.image('big_reward1', 'assets/big_reward.png');
    this.load.image('big_reward2', 'assets/big_reward2.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.image('spark', 'assets/spark.png');
    this.load.image('magnet', 'assets/magnet.png');
    this.load.image('shield', 'assets/shield.png');
  }

  create() {
    this.add.image(0, 0, 'bg')
      .setOrigin(0, 0)
      .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

    this.player = this.physics.add.sprite(600, 700, this.charKey);
    this.player.setCollideWorldBounds(true);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.coins = this.physics.add.group();
    this.obstacles = this.physics.add.group();
    this.bigRewards = this.physics.add.group();
    this.hearts = this.physics.add.group();
    this.magnets = this.physics.add.group();
    this.shields = this.physics.add.group();

    this.hasMagnet = false;
    this.hasShield = false;

    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.nextLevelScore = 3000;

    this.uiPanel = this.add.rectangle(160, 80, 300, 120, 0x000000, 0.6)
      .setStrokeStyle(2, 0xffd700)
      .setOrigin(0.5);

    this.scoreText = this.add.text(30, 30, "SCORE: 0", {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: "22px",
      fill: "#FFD700",
      stroke: "#000000",
      strokeThickness: 3
    });

    this.levelText = this.add.text(30, 60, "LEVEL: 1", {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: "22px",
      fill: "#FFD700",
      stroke: "#000000",
      strokeThickness: 3
    });

    this.heartsUI = [];
    this.updateHeartsUI();

    this.levelUpText = this.add.text(600, 200, "", {
      fontFamily: '"Orbitron", sans-serif',
      fontSize: "64px",
      fill: "#FFD700",
      stroke: "#000000",
      strokeThickness: 6
    }).setOrigin(0.5).setAlpha(0);

// === Çarpışmalar ===

// Coin
this.physics.add.overlap(this.player, this.coins, (p, c) => {
  c.destroy();
  this.addScore(100);
  new FloatingText(this, "+100", c.x, c.y, "#2b00ffff");
  new ParticleBurst(this, c.x, c.y, 0xFFD700);
});

// Obstacle
this.physics.add.overlap(this.player, this.obstacles, (p, o) => {
  if (!this.hasShield) {
    o.destroy();
    this.lives -= 1;
    this.updateHeartsUI();
    new FloatingText(this, "-1 LIFE", o.x, o.y, "#ff4444");
    new ParticleBurst(this, o.x, o.y, 0xFF0000);

    if (this.lives <= 0) this.gameOver();
  } else {
    o.destroy(); // Shield varsa sadece yok et
  }
});

// Big Reward
this.physics.add.overlap(this.player, this.bigRewards, (p, b) => {
  b.destroy();
  this.addScore(500);
  new FloatingText(this, "+500", b.x, b.y, "#001affff");
  new ParticleBurst(this, b.x, b.y, 0x00FFAA);
});

// Heart
this.physics.add.overlap(this.player, this.hearts, (p, h) => {
  h.destroy();
  this.lives += 1;
  this.updateHeartsUI();
  new FloatingText(this, "+1 LIFE", h.x, h.y, "#ff0000ff");
  new ParticleBurst(this, h.x, h.y, 0x00FF00);
});

// Magnet
this.physics.add.overlap(this.player, this.magnets, (p, m) => {
  m.destroy();
  this.activateMagnet(); // Magnet power-up
});

this.physics.add.overlap(this.player, this.shields, (p, s) => {
  s.destroy();
  this.activateShield();

  // Mavi efekt + yazı
  new FloatingText(this, "SHIELD ON!", s.x, s.y, "#00aaff");
  new ParticleBurst(this, s.x, s.y, 0x00aaff);
});

// === Spawn ===
this.time.addEvent({
  delay: 1300, loop: true,
  callback: () => {
    let x = Phaser.Math.Between(50, 1150);
    let coin = this.coins.create(x, -50, 'coin');
    coin.setVelocityY(200 + this.level * 25);

    // Kalp %5 şansla düşsün
    if (Phaser.Math.Between(1, 100) <= 5) {
      let heart = this.hearts.create(x, -80, 'heart').setScale(0.5);
      heart.setVelocityY(180 + this.level * 15);
    }
  }
});

this.time.addEvent({
  delay: 2200, loop: true,
  callback: () => {
    let x = Phaser.Math.Between(50, 1150);
    let obs = this.obstacles.create(x, -50, 'obstacle');
    obs.setVelocityY(250 + this.level * 70);
  }
});

this.time.addEvent({
  delay: 2600, loop: true,
  callback: () => {
    if (Phaser.Math.Between(1, 100) <= 30) {
      let x = Phaser.Math.Between(50, 1150);
      let key = Phaser.Math.Between(0, 1) ? 'big_reward1' : 'big_reward2';
      let reward = this.bigRewards.create(x, -50, key);
      reward.setVelocityY(200 + this.level * 50);
    }
  }
});

this.time.addEvent({
  delay: 20000, loop: true,
  callback: () => {
    let x = Phaser.Math.Between(50, 1150);
    let magnet = this.magnets.create(x, -50, 'magnet');
    magnet.setVelocityY(250); // biraz daha hızlı gelsin
  }
});

this.time.addEvent({
  delay: 25000, loop: true,
  callback: () => {
    let x = Phaser.Math.Between(50, 1150);
    let shield = this.shields.create(x, -50, 'shield');
    shield.setVelocityY(250); // biraz daha hızlı gelsin
  }
});


    this.isGameOver = false;
    this.input.keyboard.on('keydown-R', () => { if (this.isGameOver) this.scene.restart({ char: this.charKey }); });
    this.input.keyboard.on('keydown-ESC', () => { if (this.isGameOver) this.scene.start("MenuScene"); });
  }

update() {
  if (this.isGameOver) return;

  // === PC Klavye Kontrolleri ===
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-300);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(300);
  } else {
    this.player.setVelocityX(0);
  }

  // === Mobil Kontroller (Parmak Sürükleme) ===
  let pointer = this.input.activePointer;
  if (pointer.isDown || pointer.wasTouch) {
    // hedef X = parmağın konumu
    let targetX = pointer.worldX;

    // yumuşatma (lerp)
    this.player.x = Phaser.Math.Linear(this.player.x, targetX, 0.12);

    // sınır kontrolü
    if (this.player.x < 50) this.player.x = 50;
    if (this.player.x > this.sys.game.config.width - 50) {
      this.player.x = this.sys.game.config.width - 50;
    }
  }

  // === Magnet Efekti ===
  if (this.hasMagnet) {
    this.coins.getChildren().forEach(coin => {
      let dx = this.player.x - coin.x;
      let dy = this.player.y - coin.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 600) {
        let speed = 25;
        coin.x += dx / dist * speed;
        coin.y += dy / dist * speed;
      }
    });
  }

  // --- Magnet Efekti ---
  if (this.hasMagnet) {
    this.coins.getChildren().forEach(coin => {
      let dx = this.player.x - coin.x;
      let dy = this.player.y - coin.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 600) {
        let speed = 25;
        coin.x += dx / dist * speed;
        coin.y += dy / dist * speed;
      }
    });
  }
}


  updateHeartsUI() {
    this.heartsUI.forEach(h => h.destroy());
    this.heartsUI = [];
    for (let i = 0; i < this.lives; i++) {
      let heart = this.add.image(30 + i * 30, 100, "heart")
        .setScale(0.4)
        .setOrigin(0, 0);
      this.heartsUI.push(heart);
    }
  }

  addScore(value) {
    this.score += value;
    this.scoreText.setText("SCORE: " + this.score);

    if (this.score >= this.nextLevelScore) {
      this.level += 1;
      this.levelText.setText("LEVEL: " + this.level);
      this.nextLevelScore = Math.floor(this.nextLevelScore * 1.5);

      this.levelUpText.setText("LEVEL " + this.level + "!").setAlpha(1);
      this.tweens.add({ targets: this.levelUpText, alpha: 0, duration: 1500 });

      let flash = this.add.rectangle(600, 384, 1200, 768, 0xffffff).setAlpha(0.8);
      this.tweens.add({ targets: flash, alpha: 0, duration: 500, onComplete: () => flash.destroy() });
    }
  }

  // === Shield Power-Up ===
activateShield() {
  // Eğer zaten shield varsa tekrar başlatma
  if (this.hasShield) return;

  this.hasShield = true;

  // Aura efekti (mavi parlayan daire)
  let aura = this.add.circle(this.player.x, this.player.y, 60, 0x00aaff, 0.3);
  aura.setDepth(-1); // arkada kalsın

  // Aura animasyonu
  let auraTween = this.tweens.add({
    targets: aura,
    scale: { from: 1, to: 1.3 },
    alpha: { from: 0.3, to: 0 },
    repeat: -1,
    duration: 600
  });

  // Aura oyuncuyu takip etsin
  let auraFollow = this.time.addEvent({
    delay: 30, loop: true,
    callback: () => {
      aura.setPosition(this.player.x, this.player.y);
      if (!this.hasShield) {
        aura.destroy();
        auraTween.remove();
        auraFollow.remove();
      }
    }
  });

  // 5 saniye sonra kalkanı kapat
  this.time.delayedCall(5000, () => {
    this.hasShield = false;
  });

  // Görsel + yazı
  new FloatingText(this, "SHIELD!", this.player.x, this.player.y - 80, "#0710bdff");
  new ParticleBurst(this, this.player.x, this.player.y, 0x00aaff);
}

gameOver() {
  if (this.isGameOver) return;
  this.isGameOver = true;

  this.player.setVelocity(0, 0);
  this.physics.pause();

  this.add.rectangle(600, 384, 1200, 768, 0x000000, 0.7);

  this.add.text(600, 150, "GAME OVER", { 
    fontFamily: '"Orbitron", sans-serif',
    fontSize: "72px",
    fill: "#FFD700",
    stroke: "#000000",
    strokeThickness: 6
  }).setOrigin(0.5);

  // --- Restart Button ---
  let restartBtn = this.add.rectangle(600, 250, 300, 80, 0x111133, 0.7)
    .setStrokeStyle(3, 0xffd700)
    .setInteractive();
  let restartText = this.add.text(600, 250, "⟳ RESTART", {
    fontFamily: '"Orbitron", sans-serif',
    fontSize: "28px",
    fill: "#ffffff"
  }).setOrigin(0.5);

  restartBtn.on('pointerover', () => {
    restartBtn.setFillStyle(0x333355);
    restartText.setStyle({ fill: "#FFD700" });
  });
  restartBtn.on('pointerout', () => {
    restartBtn.setFillStyle(0x111133);
    restartText.setStyle({ fill: "#ffffff" });
  });
  restartBtn.on('pointerdown', () => {
    this.scene.restart({ char: this.charKey });
  });

  // --- Menu Button ---
  let menuBtn = this.add.rectangle(600, 350, 300, 80, 0x111133, 0.7)
    .setStrokeStyle(3, 0xffd700)
    .setInteractive();
  let menuText = this.add.text(600, 350, "⌂ MENU", {
    fontFamily: '"Orbitron", sans-serif',
    fontSize: "28px",
    fill: "#ffffff"
  }).setOrigin(0.5);

  menuBtn.on('pointerover', () => {
    menuBtn.setFillStyle(0x333355);
    menuText.setStyle({ fill: "#FFD700" });
  });
  menuBtn.on('pointerout', () => {
    menuBtn.setFillStyle(0x111133);
    menuText.setStyle({ fill: "#ffffff" });
  });
  menuBtn.on('pointerdown', () => {
    this.scene.start("MenuScene");
  });

  // Skorları kaydet + göster
  this.saveScore(this.score);
  this.showHighScores();
}

async saveScore(score) {
  let nick = localStorage.getItem("currentPlayer") || "Guest";
  let scores = JSON.parse(localStorage.getItem("highscores") || "[]");

  let existing = scores.find(s => s.name === nick);
  if (existing) {
    if (score > existing.score) {
      existing.score = score;
    }
  } else {
    scores.push({ name: nick, score });
  }

  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 10);

  localStorage.setItem("highscores", JSON.stringify(scores));
}

showHighScores() {
  let scores = JSON.parse(localStorage.getItem("highscores") || "[]");

  // Arka plan kutusu (daha aşağıya indirildi: y=600)
  this.add.rectangle(600, 600, 500, 400, 0x000000, 0.7)
    .setStrokeStyle(3, 0xffd700)
    .setOrigin(0.5);

  // Başlık (y=430)
  this.add.text(600, 430, "HIGH SCORES", {
    fontSize: "40px",
    fill: "#FFD700",
    stroke: "#000000",
    strokeThickness: 6,
    fontFamily: '"Orbitron", sans-serif'
  }).setOrigin(0.5);

  // Skor listesi (470’den başlasın)
  scores.forEach((s, i) => {
    let color = "#ffffff";
    if (i === 0) color = "#FFD700";   // Altın
    else if (i === 1) color = "#C0C0C0"; // Gümüş
    else if (i === 2) color = "#cd7f32"; // Bronz

    // sıra
    this.add.text(420, 470 + i * 40, `${i + 1}.`, {
      fontSize: "24px",
      fill: "#FFD700",
      fontFamily: '"Orbitron", sans-serif'
    }).setOrigin(0, 0.5);

    // nick
    this.add.text(470, 470 + i * 40, `${s.name}`, {
      fontSize: "24px",
      fill: "#FFFFFF",
      fontFamily: '"Orbitron", sans-serif'
    }).setOrigin(0, 0.5);

    // skor
    this.add.text(820, 470 + i * 40, `${s.score}`, {
      fontSize: "24px",
      fill: color,
      fontFamily: '"Orbitron", sans-serif'
    }).setOrigin(1, 0.5);
  });
}


activateMagnet() {
  this.hasMagnet = true;

  // Aura efekti (mavi parlayan daire)
  let aura = this.add.circle(this.player.x, this.player.y, 60, 0x00ffff, 0.3);
  aura.setDepth(-1); // arkada dursun

  this.tweens.add({
    targets: aura,
    scale: { from: 1, to: 1.3 },
    alpha: { from: 0.3, to: 0 },
    repeat: -1,
    duration: 600
  });

  // Aura oyuncuyu takip etsin
  this.time.addEvent({
    delay: 30, loop: true,
    callback: () => {
      aura.setPosition(this.player.x, this.player.y);
      if (!this.hasMagnet) {
        aura.destroy();
      }
    }
  });

  // 10 sn sonra kapanır
  this.time.delayedCall(10000, () => {
    this.hasMagnet = false;
  });
}


activateMagnet() {
  this.hasMagnet = true;

  // Aura efekti (mavi parlayan daire)
  let aura = this.add.circle(this.player.x, this.player.y, 60, 0x00ffff, 0.3);
  aura.setDepth(-1); // arkada dursun

  this.tweens.add({
    targets: aura,
    scale: { from: 1, to: 1.3 },
    alpha: { from: 0.3, to: 0 },
    repeat: -1,
    duration: 600
  });

  // Aura oyuncuyu takip etsin
  this.time.addEvent({
    delay: 30, loop: true,
    callback: () => {
      aura.setPosition(this.player.x, this.player.y);
      if (!this.hasMagnet) {
        aura.destroy();
      }
    }
  });

  // 5 sn sonra kapanır
  this.time.delayedCall(10000, () => {
    this.hasMagnet = false;
  });
}
}

// === Oyun Ayarları ===
const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 768,
  physics: { default: 'arcade' },
  scene: [MenuScene, CharacterScene, MainScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};
new Phaser.Game(config);
