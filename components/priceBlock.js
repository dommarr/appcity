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

  // function to determin if there are going to be 2 prices showing.
  // if yes, format one large, other small. if no, format large.

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
          {/* if starting price, large text. if not starting price && starting price is not present, large text. else, base text. */}
          <dt
            className={`text-gray-900 ${starting ? "text-lg" : ""} ${
              !starting &&
              !(
                tier[`starting_price_pay_${cadence}`] ||
                tier[`starting_price_other_pay_${cadence}`]
              )
                ? "text-lg"
                : "text-base"
            } font-medium`}
          >
            {price_other}
          </dt>
          <dd
            className={`text-gray-600 ${starting ? "text-base" : ""} ${
              !starting &&
              !(
                tier[`starting_price_pay_${cadence}`] ||
                tier[`starting_price_other_pay_${cadence}`]
              )
                ? "text-base"
                : "text-sm"
            }`}
          >
            {price_unit}
          </dd>
        </div>
      );
    } else {
      // return other w/o the price unit
      // for example...
      // Upon request
      return (
        <dl className={`flex-grow flex flex-col items-center justify-between`}>
          <dt
            className={`text-gray-900  
            ${starting ? "text-lg" : ""} ${
              !starting &&
              !(
                tier[`starting_price_pay_${cadence}`] ||
                tier[`starting_price_other_pay_${cadence}`]
              )
                ? "text-lg"
                : "text-base"
            }
            font-medium`}
          >
            {price_other}
          </dt>
        </dl>
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
          <dt
            className={`text-gray-900 
            ${starting ? "text-lg" : ""} ${
              !starting &&
              (tier[`starting_price_pay_${cadence}`] ||
                tier[`starting_price_other_pay_${cadence}`])
                ? "text-lg"
                : "text-base"
            } font-medium`}
          >
            {price}
          </dt>
          <dd
            className={`text-gray-600 ${starting ? "text-base" : ""} ${
              !starting &&
              (tier[`starting_price_pay_${cadence}`] ||
                tier[`starting_price_other_pay_${cadence}`])
                ? "text-base"
                : "text-sm"
            }`}
          >
            {price_unit}
          </dd>
          <dd
            className={`text-gray-400 ${starting ? "text-sm" : ""} ${
              !starting &&
              (tier[`starting_price_pay_${cadence}`] ||
                tier[`starting_price_other_pay_${cadence}`])
                ? "text-sm"
                : "text-xs"
            }`}
          >
            paid {cadence}
          </dd>
        </dl>
      );
    } else {
      return "";
    }
  }
};

export default PriceBlock;
