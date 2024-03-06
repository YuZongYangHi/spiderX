declare namespace AnalysisResponse {
  type MachineInfo = {
    all: number;
    init: number;
    maintain: number;
    online: number;
  }

  type TicketInfo = {
    datetime: string;
    count: number;
  }

  type IdcInfo = {
   az: number;
   idc: number;
   room: number;
   rack: number;
}

  type NetDeviceInfo = {
    cidr: number;
    ip: number;
    switch: number;
    router: number;
  }
}
