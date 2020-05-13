import {
  withLeaflet,
  MapControl,
  MapControlProps
} from 'react-leaflet';

import L from 'leaflet';
type LeafletElement = L.Control

/* Styles */
import 'css/legend.scss';

/* Types */
import {
  GeojsonInfoProps
} from './Geojson';

type Props = {
  title?: string,
  properties: GeojsonInfoProps
} & MapControlProps

class LegendInfo extends MapControl<Props> {
  title: string;
  properties: GeojsonInfoProps;
  panelDiv: any;

  constructor(props: Props) {
    super(props);
    this.title = props.title;
    this.properties = props.properties;
  }

  renderHtml(props: GeojsonInfoProps) {
    return `
      <h4>${this.title}</h4>
      <p>
       id : ${props.id}<br />
       department: ${props.department}<br />
      </p>
    `;
  }

  updateLeafletElement(fromProps: Props, toProps: Props) {
    this.panelDiv.innerHTML = this.renderHtml(toProps.properties);
  }

  createLeafletElement(): LeafletElement {
    const MapInfo = L.Control.extend({
      onAdd: () => {
        this.panelDiv = L.DomUtil.create('div', 'info');
        this.panelDiv.innerHTML = this.renderHtml(this.properties);
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
