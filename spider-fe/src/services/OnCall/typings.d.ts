declare namespace OnCallRequest {
  type Exchange = {
    currentUser: string;
    historyUser: string;
    datetime: string;
  }

  type CreateDrawLots = {
    userIds: string;
    dutyType: string;
    effectiveTime: string;
  }

  type UpdateDrawLots = {
    userIds: string;
    dutyType: string;
  }
}

declare namespace OnCallResponse {
  type OnCallInfo = {
    schedulingType: string;
    currentUser: string;
    historyUser: string;
    datetime: string;
  }

  type ExchangeInfo = {
    id: number;
    currentUser: string;
    historyUser: string;
    datetime: string;
    createTime: string;
    updateTime: string;
  }

  type DrawLotsInfo = {
    id: number;
    users: string[];
    userIds: string;
    drawLotsType: string;
    effectiveTime: string;
    createTime: string;
    updateTime: string;
  }
}
