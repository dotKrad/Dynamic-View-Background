import { LitElement, html, customElement, property, CSSResult, TemplateResult, css, PropertyValues } from 'lit-element';
import { HomeAssistant, LovelaceCardEditor, getLovelace } from 'custom-card-helpers';

import './editor';

import { DynamicViewBackgroundCardConfig } from './types';
import { CARD_VERSION } from './const';

import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  DYNAMIC-VIEW-BACKGROUND-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'dynamic-view-background-card',
  name: 'Dynamic View Background Card',
  description: 'A template custom card for you to create something awesome',
});

// TODO Name your custom element
@customElement('dynamic-view-background-card')
export class DynamicViewBackgroundCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('dynamic-view-background-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): object {
    return {};
  }

  // TODO Add any properities that should cause your element to re-render here
  @property() public hass!: HomeAssistant;
  @property() private config!: DynamicViewBackgroundCardConfig;

  public setConfig(config): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config || config.show_error) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      name: 'Dynamic View Background',
      ...config,
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    //update on config changed
    if (changedProps.has('config')) {
      return true;
    }

    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    const newHass = this.hass;
    const entity = this.config.entity;

    //Update only on state change
    if (oldHass && entity && oldHass.states[entity].state !== newHass.states[entity].state) return true;

    return false;
  }

  protected render(): TemplateResult | void {
    const root = document
      .querySelector('home-assistant')
      ?.shadowRoot?.querySelector('home-assistant-main')
      ?.shadowRoot?.querySelector('ha-drawer partial-panel-resolver ha-panel-lovelace')
      ?.shadowRoot?.querySelector('hui-root');

    const obj = root?.shadowRoot?.querySelector('hui-view') as HTMLElement;
    //let obj = root?.shadowRoot?.querySelector('hui-view-background') as HTMLElement

    /**/
    if (obj !== null && obj !== undefined && this.config.entity !== undefined && this.config.entity !== null) {
      //const url = `${this.hass.states[this._config.entity].state}&fit=crop${w}${h}`;
      const url = `${this.hass.states[this.config.entity].state}`
        .replace('{{w}}', obj.clientWidth.toString())
        .replace('{{h}}', obj.clientHeight.toString());

      obj.style.backgroundImage = `url('${url}')`;

      obj.style.backgroundRepeat = 'no-repeat';
      obj.style.backgroundSize = '100%';

      //obj.style.setProperty('--view-background', `center / cover repeat url('${url}')`);
    }
    if (this.config.debug) {
      return html`
        <hui-warning>Width: ${obj.clientWidth.toString()}</hui-warning>
        <hui-warning>Height: ${obj.clientHeight.toString()}</hui-warning>
      `;
    }
  }

  static get styles(): CSSResult {
    return css``;
  }
}
