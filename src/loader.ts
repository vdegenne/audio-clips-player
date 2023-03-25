import { SBrowser } from './s-browser.js';
import { SPlayer } from './s-player.js';
import map from './map.json';
import './controller.js'
import '@material/mwc-icon';
import '@material/mwc-icon-button'
import '@material/mwc-formfield'
import '@material/mwc-checkbox'

export function boot() {
  const params = new URLSearchParams(window.location.search);
  let element;
  if (params.has('p')) {
    const projectname = params.get('p');
    if (projectname in map) {
      element = new SPlayer(projectname);
    } else {
      params.delete('p');
      window.location.search = params.toString();
    }
  } else {
    element = new SBrowser();
  }

  document.body.append(element);
}
