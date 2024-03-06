import {useState} from "react";

export default () => {
  const [productId, setProductId] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(0)
  const [currentStep, setCurrentStep] = useState(<number>(0))

  return {
    productId, setProductId,
    categoryId, setCategoryId,
    currentStep, setCurrentStep
  }
}
