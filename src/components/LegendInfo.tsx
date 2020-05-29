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
import { scaleColor } from './Choropleth';

export type LegendInfoProps = {
  title?: string,
  id?: string | undefined;
  department?: string;
  key?: string;
  value?: number;
  scaleColors?: scaleColor[];
}

type Props = {
  position: L.ControlPosition,
  renderCb: (props: LegendInfoProps) => string,
  title?: string,
  id?: string,   /* id of legend division */
  information?: LegendInfoProps,
} & MapControlProps

class LegendInfo extends MapControl<Props> {
  title: string;
  information: LegendInfoProps
  renderHtml: (props: LegendInfoProps) => string;
  position: L.ControlPosition;
  id?: string;
  panelDiv: any;

  constructor(props: Props) {
    super(props);
    this.renderHtml = props.renderCb;
    this.information = props.information;
    this.position = props.position;
    this.id = props.id ?? 'info';
  }

  updateLeafletElement(fromProps: Props, toProps: Props) {
    this.panelDiv.innerHTML = this.renderHtml(toProps.information);
  }

  createLeafletElement(): LeafletElement {
    const MapInfo = L.Control.extend({
      onAdd: () => {
        this.panelDiv = L.DomUtil.create('div', this.id);
        this.panelDiv.innerHTML = this.renderHtml(this.information);
        return this.panelDiv;
      }
    });
    return new MapInfo({ position: this.props.position});
  }

  componentDidMount() {
    const { map } = this.props.leaflet;
    this.leafletElement.addTo(map);
  }
}

export default withLeaflet<Props>(LegendInfo);
