import Machine from './MachineOperate';
import NetDevice from './NetDevice'
import Idc from './Idc'
import Ticket from './Ticket'

export default () => {

  return (
    <div>
      <NetDevice/>
      <Idc/>
      <Machine/>
      <Ticket/>
    </div>
  );
};
