import { LitElement, html, customElement, property, TemplateResult, CSSResult, css } from 'lit-element';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { DynamicViewBackgroundCardConfig } from './types';

const options = {
  required: {
    icon: 'tune',
    name: 'Required',
    secondary: 'Required options for this card to function',
    show: true,
  },
  appearance: {
    icon: 'palette',
    name: 'Appearance',
    secondary: 'Customize the name, icon, etc',
    show: false,
  },
};

@customElement('dynamic-view-background-card-editor')
export class DynamicViewBackgroundCardEditor extends LitElement implements LovelaceCardEditor {
  @property() public hass?: HomeAssistant;
  @property() private _config?: DynamicViewBackgroundCardConfig;
  @property() private _toggle?: boolean;

  public setConfig(config): void {
    this._config = config;
  }

  get _entity(): string {
    debugger;
    if (this._config) {
      return this._config.entity || '';
    }

    return '';
  }

  get _debug(): boolean {
    if (this._config) {
      return this._config.debug || false;
    }

    return false;
  }

  get _show_error(): boolean {
    if (this._config) {
      return this._config.show_error || false;
    }

    return false;
  }

  protected render(): TemplateResult | void {
    if (!this.hass) {
      return html``;
    }

    // You can restrict on domain type
    const entities = Object.keys(this.hass.states).filter(eid => eid.substr(0, eid.indexOf('.')) === 'input_text');

    return html`
      <div class="card-config">
        <ha-switch
          aria-label=${`Toggle debug ${this._debug ? 'off' : 'on'}`}
          .checked=${this._debug !== false}
          .configValue=${'debug'}
          @change=${this._valueChanged}
          >Debug?</ha-switch
        >
        <div class="option" @click=${this._toggleOption} .option=${'required'}>
          <div class="row">
            <ha-icon .icon=${`mdi:${options.required.icon}`}></ha-icon>
            <div class="title">${options.required.name}</div>
          </div>
          <div class="secondary">${options.required.secondary}</div>
        </div>
        ${options.required.show
        ? html`
              <div class="values">
                <paper-dropdown-menu
                  label="Entity (Required)"
                  @value-changed=${this._valueChanged}
                  .configValue=${'entity'}
                >
                  <paper-listbox slot="dropdown-content" .selected=${entities.indexOf(this._entity)}>
                  ${entities.map(entity => {
          return html`
                        <paper-item>${entity}</paper-item>
                      `;
        })}
                  </paper-listbox>
                </paper-dropdown-menu>
              </div>
            `
        : ''
      }

        <div class="option" @click=${this._toggleOption} .option = ${'appearance'}>
  <div class="row" >
    <ha-icon.icon=${`mdi:${options.appearance.icon}`}> </ha-icon>
      < div class="title" > ${options.appearance.name} </div>
        </div>
        < div class="secondary" > ${options.appearance.secondary} </div>
          </div>
        ${options.appearance.show
        ? html`
              <div class="values">                
                <ha-switch
                  aria-label=${`Toggle error ${this._show_error ? 'off' : 'on'}`}
                  .checked=${this._show_error !== false}
                  .configValue=${'show_error'}
                  @change=${this._valueChanged}
                  >Show Error?</ha-switch
                >
              </div>
            `
        : ''
      }
</div>
  `;
  }

  private _toggleOption(ev): void {
    this._toggleThing(ev, options);
  }

  private _toggleThing(ev, optionList): void {
    const show = !optionList[ev.target.option].show;
    for (const [key] of Object.entries(optionList)) {
      optionList[key].show = false;
    }
    optionList[ev.target.option].show = show;
    this._toggle = !this._toggle;
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue} `] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        delete this._config[target.configValue];
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  static get styles(): CSSResult {
    return css`
  .option {
  padding: 4px 0px;
  cursor: pointer;
}
      .row {
  display: flex;
  margin - bottom: -14px;
  pointer - events: none;
}
      .title {
  padding - left: 16px;
  margin - top: -6px;
  pointer - events: none;
}
      .secondary {
  padding - left: 40px;
  color: var(--secondary - text - color);
  pointer - events: none;
}
      .values {
  padding - left: 16px;
  background: var(--secondary - background - color);
}
ha -switch {
  padding- bottom: 8px;
      }
`;
  }
}
