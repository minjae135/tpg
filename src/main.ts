import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene';
import { PingPongScene } from './scenes/PingPongScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#2d2d2d',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }, // 핑퐁은 중력이 필요 없습니다.
            debug: false
        }
    },
    scene: [MenuScene, PingPongScene]
};

new Phaser.Game(config);
