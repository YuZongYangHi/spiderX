import React from "react";

export type PopconfirmType = {
  title: string;
  description: string;
  onConfirm: () => null;
  element: React.ReactNode;
  record: any;
}
