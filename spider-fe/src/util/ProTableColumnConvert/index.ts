import AssetsMachineColumnConvert from './machine';
import AssetsIpColumnConvert from './ip';
import AssetsNetDeviceColumnConvert from './netDevice'
import TicketColumnConvert from './ticket'

export default {
  ...AssetsMachineColumnConvert,
  ...AssetsIpColumnConvert,
  ...AssetsNetDeviceColumnConvert,
  ...TicketColumnConvert
}
