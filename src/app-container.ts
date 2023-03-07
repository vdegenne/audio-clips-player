import {html, LitElement, PropertyValueMap} from 'lit'
import {customElement} from 'lit/decorators.js'
import data from './map.json'

@customElement('app-container')
export class AppContainer extends LitElement {
  render() {
    return html`test`
  }
  
  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    console.log(data)
  }
}