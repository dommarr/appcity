const PriceBlock = ({ tier, cadence, starting }) => {
  const formatPrice = (price) => {
    if (price % 1 != 0) {
      let num = Number(Math.round(price + "e2") + "e-2");
      num = num.toFixed(2);
      return "$".concat(num);
    } else {
      let num = price.toLocaleString("en");
      return "$".concat(num);
    }
  };

  let price = "";
  let price_other = "";
  let price_unit = "";

  if (starting) {
    price = tier[`starting_price_pay_${cadence}`]
      ? formatPrice(tier[`starting_price_pay_${cadence}`])
      : null;
    price_other = tier[`starting_price_other_pay_${cadence}`]
      ? tier[`starting_price_other_pay_${cadence}`]
      : null;
    price_unit = tier.starting_price_unit;
  } else {
    price = tier[`price_pay_${cadence}`]
      ? formatPrice(tier[`price_pay_${cadence}`])
      : null;
    price_other = tier[`price_other_pay_${cadence}`]
      ? tier[`price_other_pay_${cadence}`]
      : null;
    price_unit = tier.price_unit;
  }

  // if other is populated
  if (price_other) {
    // if other starts with n/a
    if (price_other.startsWith("n/a")) {
      // return other w/ the price unit present for context
      return (
        <div>
          <h3>{price_other}</h3>
          <h5>{price_unit}</h5>
        </div>
      );
    } else {
      // return other w/o the price unit
      return (
        <div>
          <h3>{price_other}</h3>
        </div>
      );
    }
  } else {
    // if other is not populated, return price
    return (
      <div>
        <h3>{price}</h3>
        <h5>{price_unit}</h5>
      </div>
    );
  }
};

export default PriceBlock;
