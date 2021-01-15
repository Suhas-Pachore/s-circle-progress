import { Polymer,html } from '@polymer/polymer/polymer-legacy.js';

/**
`s-circle-progress`
Polymer-based web component displaying a circular progress bar.

@demo demo/index.html
**/

const template = html`
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
  stroke: var(--s-circle-progress-bg-stroke-color, var(--paper-grey-100));
}

.Circle-foreground {
  transition: stroke-dashoffset 150ms;

  stroke: var(--s-circle-progress-stroke-color, var(--accent-color));
  stroke-linecap: var(--s-circle-progress-stroke-linecap, round);
}

slot::slotted(*) {
  text-align: center;
}

</style>

<svg id="circle" width="100%" height="100%">
  <circle class="Circle-background"
      r$="[[_radius]]"
      cx$="[[_cx]]"
      cy$="[[_cy]]"
      fill="transparent"
      stroke-width$="[[strokeWidth]]" />
  <circle class="Circle-foreground"
      r$="[[_radius]]"
      cx$="[[_cx]]"
      cy$="[[_cy]]"
      fill="transparent"
      stroke-width$="[[strokeWidth]]"
      stroke-dasharray$="[[_dasharray]]"
      stroke-dashoffset$="[[_dashoffset]]"
      transform$="[[_transform]]" />
</svg>

<slot></slot>
`;

var SCircleProgress = Polymer({
  is: 's-circle-progress',

  _template: template,

  properties: {
    /**
     * Value of circular progress bar.
     */
    value: {
      type: Number,
      value: 0
    },

    /**
     * Maximum of value.
     */
    max: {
      type: Number,
      value: 100
    },

    /**
     * Stroke width of circle.
     */
    strokeWidth: {
      type: Number,
      value: 4
    },

    /**
     * Starting angle of the progress.
     */
    angle: {
      type: Number,
      value: -90
    },

    _cx: {
      type: Number,
      value: null
    },

    _cy: {
      type: Number,
      value: null
    },

    _radius: {
      type: Number,
      computed: '_computeRadius(_cx, _cy, strokeWidth)'
    },

    _transform: {
      type: String,
      computed: '_computeTransform(angle, _cx, _cy)'
    },

    _dasharray: {
      type: Number,
      computed: '_computeDashArray(_radius)'
    },

    _dashoffset: {
      type: Number,
      computed: '_computeDashOffset(value, max, _dasharray)'
    }
  },

  attached() {
    this.async(this._computeSizeOnAttached, 1);
  },

  _computeDashArray: function(radius) {
    return 2 * Math.PI * radius;
  },

  _computeDashOffset: function(value, max, dasharray) {
    return (1 - value / max) * dasharray;
  },

  _computeRadius: function(cx, cy, strokeWidth) {
    return cx && cy ? Math.max(0, Math.min(cx, cy) - strokeWidth / 2) : 0;
  },

  _computeTransform: function(angle, cx, cy) {
    return cx && cy ? 'rotate(' + angle + ', ' + cx + ', ' + cy + ')' : '';
  },

  _computeSizeOnAttached: function() {
    if (this.offsetWidth && this.offsetHeight) {
      this._cx = this.offsetWidth / 2;
      this._cy = this.offsetHeight / 2;
      this.$.circle.style.display = 'block';
    }
  }
});

