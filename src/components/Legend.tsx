import {
  withLeaflet,
  MapControl,
  MapControlProps
} from 'react-leaflet';

import L from 'leaflet';
type LeafletElement = L.Control

/* Styles */
import 'css/legend.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

/* Types */
export type LegendInfoProps = {
  id: string | undefined;
  department: string;
  key: string;
  value: number;
}

type Props = {
  title?: string,
  information: LegendInfoProps
} & MapControlProps

class LegendInfo extends MapControl<Props> {
  title: string;
  information: LegendInfoProps;
  panelDiv: any;

  constructor(props: Props) {
    super(props);
    this.title = props.title;
    this.information = props.information;
  }

  renderRow(key: string, value: string | number): string {
    return (`
      <div class="row">
        <div class="col-sm-4">
          ${key}
        </div>
        <div class="col-sm">
          ${value}
        </div>
      </div>
    `);
  }

  renderHtml(props: LegendInfoProps) {
    return (`
      <div>
        <h6 class="title">${this.title}</h6>
        <div class="container">
          ${this.renderRow('dept', props.department)}
          ${this.renderRow(props.key, props.value)}
        </div>
      </div>
    `);
  }

  updateLeafletElement(fromProps: Props, toProps: Props) {
    this.panelDiv.innerHTML = this.renderHtml(toProps.information);
  }

  createLeafletElement(): LeafletElement {
    const MapInfo = L.Control.extend({
      onAdd: () => {
        this.panelDiv = L.DomUtil.create('div', 'info');
        this.panelDiv.innerHTML = this.renderHtml(this.information);
        return this.panelDiv;
      }
    });
    return new MapInfo({ position: 'topright' });
  }

  componentDidMount() {
    const { map } = this.props.leaflet;
    this.leafletElement.addTo(map);
  }
}

export default withLeaflet<Props>(LegendInfo);
