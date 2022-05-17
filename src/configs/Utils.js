export const NumberFormat = value => {
    if (!value || (value && value == "")) {
      value = "0";
    }
    value = parseInt(value)
    let money = value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    return money.toString();
  };