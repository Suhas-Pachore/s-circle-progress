
/**
`s-circle-progress`
Native web component displaying a circular progress bar.
Built using vanillaJS, HTML and CSS with no dependencies.

@demo demo/index.html
**/
let template = document.createElement('template');
template.innerHTML = `
  <style>
  :host {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -ms-flex-direction: column;
    -webkit-flex-direction: column;
    flex-direction: column;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;

    position: relative;

    width: 64px;
    height: 64px;
    margin: 24px;

    border-radius: 50%;
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;

    display: none;
  }

  .Circle-background {
    stroke: var(--s-circle-progress-bg-stroke-color, var(--paper-grey-100, #EFEFEF));
  }

  .Circle-foreground {
    transition: stroke-dashoffset 150ms;

    stroke: var(--s-circle-progress-stroke-color, var(--accent-color, #FF3755));
    stroke-linecap: var(--s-circle-progress-stroke-linecap, round);
  }

  slot::slotted(*) {
    text-align: center;
  }

  </style>

  <svg id="circle" width="100%" height="100%">
    
  </svg>
  <slot></slot>
`;

class SCircleProgress extends HTMLElement {
  constructor() {
    super();

    this._computeSizeOnAttached = this._computeSizeOnAttached.bind(this);
    this._upgradeProperty = this._upgradeProperty.bind(this);

    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  //gathering data from element attributes
  get value() {
    return this.getAttribute('value') || 0;
  }
  get max() {
    return this.getAttribute('max') || 100;
  }
  get strokeWidth() {
    return this.getAttribute('stroke-width') || 4;
  }
  get angle() {
    return this.getAttribute('angle') || -90;
  }

  // fires after the element has been attached to the DOM
  connectedCallback() {

    this._upgradeProperty('value');
    this._upgradeProperty('max');
    this._upgradeProperty('stroke-width');
    this._upgradeProperty('angle');

    this._computeSizeOnAttached();

    let circle = this.shadowRoot.getElementById('circle');
    circle.style.display = 'block'; 
    circle.innerHTML = `
      <circle class="Circle-background"
        r="${this._radius}"
        cx="${this._cx}"
        cy="${this._cy}"
        fill="transparent"
        stroke-width="${this.strokeWidth}" />
      <circle class="Circle-foreground"
        r="${this._radius}"
        cx="${this._cx}"
        cy="${this._cy}"
        fill="transparent"
        stroke-width="${this.strokeWidth}"
        stroke-dasharray="${this._dasharray}"
        stroke-dashoffset="${this._dashoffset}"
        transform="${this._transform}" />
      `;
  }

  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  _computeSizeOnAttached() {
    if (this.offsetWidth && this.offsetHeight) {
      this._cx = this.offsetWidth / 2;
      this._cy = this.offsetHeight / 2;
      this._radius = Math.max(0, Math.min(this._cx, this._cy) - this.strokeWidth / 2);
      this._transform = 'rotate(' + this.angle + ', ' + this._cx + ', ' + this._cy + ')';
      this._dasharray = 2 * Math.PI * this._radius;
      this._dashoffset = (1 - this.value / this.max) * this._dasharray;
    }
  }
}

window.customElements.define('s-circle-progress', SCircleProgress);

