import gameControl from 'gamecontroller.js/src/gamecontrol.js';
gameControl.on('connect', (gamepad) => {
  gamepad.before('right1', () => {});
});
