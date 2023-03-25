import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import map from './map.json';

@customElement('s-browser')
export class SBrowser extends LitElement {
  render() {
    const projects = Object.keys(map).filter((p) => p !== 'temp_renames');
    return html` ${projects.map((pname) => {
      return html`
        <style>
          .project {
            display: flex;
            align-items: center;
            padding: 9px;
            margin: 3px;
            cursor: pointer;
            text-decoration: none;
          }
          .project:hover {
            background-color: #eee;
          }
        </style>
        <a class="project" href="?p=${pname}">
          <mwc-icon style="margin-right:6px">folder</mwc-icon>
          <span>${pname} (${map[pname].length})</span>
        </a>
      `;
    })}`;
  }
}
