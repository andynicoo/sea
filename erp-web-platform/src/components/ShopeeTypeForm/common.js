export const pattern = {
  FLOAT_TYPE: /^\D*(\d*(?:\.\d{0,2})?).*$/g,
  INT_TYPE: /^\D*(\d*).*$/g
}
export function initFormItem(list = [], isCnscDisabled) {
  const formItem =
    list &&
    list
      .map((item) => {
        // obj[item.attributeId] = item.value ? JSON.parse(item.value) : {}
        const unitList =
          (item?.attributeUnit && JSON.parse(item.attributeUnit)) || []
        const translateValue =
          (item?.translateValue && JSON.parse(item.translateValue)) || []
        let optionsList = translateValue
        return {
          ...item,
          key: String(item.attributeId),
          label: item.cnName || item.displayAttributeName,
          attributeType: item.inputValidationType,
          attributeUnit: unitList,
          disabled: isCnscDisabled,
          optionsList: optionsList.map((item) => ({
            originalValueName: item.original_value_name,
            displayValueName: item.display_value_name,
            valueId: item.value_id,
            valueUnit: item.value_unit,
            key: `${item.value_id}${item.original_value_name}`
          }))
        }
      })
      .sort((a, b) => b.isMandatory - a.isMandatory)
  return formItem || []
}
export function initSetFormModel(list, formModel = {}) {
  list?.forEach((item) => {
    let value = item.attributeValueList
    try {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== null && typeof item === 'object') {
            item.displayValueName = item.displayValueName
              ? item.displayValueName
              : `${item.originalValueName}${
                  item.valueUnit ? item.valueUnit : ''
                }`
            item.key = `${item.valueId}${item.originalValueName}`
          }
        })
        formModel[item.attributeId] = value
      }
    } catch (error) {
      console.error(error)
    }
  })
  return {
    ...formModel
  }
}
