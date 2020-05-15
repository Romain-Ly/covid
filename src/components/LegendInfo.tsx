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
  title?: string,
  id: string | undefined;
  department: string;
  key: string;
  value: number;
}

type Props = {
  title?: string,
  information: LegendInfoProps
  renderCb: (props: LegendInfoProps) => string
} & MapControlProps

class LegendInfo extends MapControl<Props> {
  title: string;
  information: LegendInfoProps
  renderHtml: (props: LegendInfoProps) => string;
  panelDiv: any;

  constructor(props: Props) {
    super(props);
    this.renderHtml = props.renderCb;
    this.information = props.information;
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
