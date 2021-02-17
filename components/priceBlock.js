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

  // if starting price is requested
  if (starting) {
    // set price if present
    price =
      tier[`starting_price_pay_${cadence}`] != null
        ? formatPrice(tier[`starting_price_pay_${cadence}`])
        : null;
    // set other if present
    price_other =
      tier[`starting_price_other_pay_${cadence}`] != null
        ? tier[`starting_price_other_pay_${cadence}`]
        : null;
    // set price unit
    price_unit = tier.starting_price_unit;
  } else {
    // if not starting price, set compare price if present
    price =
      tier[`price_pay_${cadence}`] != null
        ? formatPrice(tier[`price_pay_${cadence}`])
        : null;
    // set other if present
    price_other =
      tier[`price_other_pay_${cadence}`] != null
        ? tier[`price_other_pay_${cadence}`]
        : null;
    // set price unit
    price_unit = tier.price_unit;
  }

  // if other is populated
  if (price_other) {
    // if other starts with n/a
    if (price_other.startsWith("n/a")) {
      // return other w/ the price unit present for context
      // for example...
      // n/a - 250 contact limit
      // per 500 contacts per month
      return (
        <div>
          <h3>{price_other}</h3>
          <h5>{price_unit}</h5>
        </div>
      );
    } else {
      // return other w/o the price unit
      // for example...
      // Upon request
      return (
        <div>
          <h3>{price_other}</h3>
        </div>
      );
    }
  } else {
    // if price is empty, skip
    if (price != null) {
      // if price is present and other is not populated, return price
      // for example...
      // $25
      // per user per month
      return (
        <dl className="flex-grow flex flex-col items-center justify-between">
          <dt className="text-gray-900 text-md font-medium">{price}</dt>
          <dd className="text-gray-600 text-sm">{price_unit}</dd>
          <dd className="text-gray-400 text-xs">paid {cadence}</dd>
        </dl>
      );
    } else {
      return "";
    }
  }
};

export default PriceBlock;
