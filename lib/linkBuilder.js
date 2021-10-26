const handleVendorLink = (refType, product, links) => {
  if (refType === "direct-link") {
    links.vendor_link = product.vendors.ref_link;
    links.app_link = product.vendors.ref_link;
    links.price_link = product.vendors.ref_link;
  } else if (refType === "ref-code") {
    links.vendor_link = product.vendors.website + product.vendors.ref_link;
    links.app_link = product.product_link + product.vendors.ref_link;
    links.price_link = product.price_link + product.vendors.ref_link;
  } else if (refType === "subdomain") {
    links.vendor_link = `${product.vendors.ref_link}?sub=`;
    links.app_link = `${product.vendors.ref_link}?sub=${product?.product_subdomain}`;
    links.price_link = `${product.vendors.ref_link}?sub=${product?.price_subdomain}`;
  } else {
    links.vendor_link = product.vendors.website;
    links.app_link = product.product_link;
    links.price_link = product.price_link;
  }
  return links;
};

const handleProductLink = (refType, product, links) => {
  if (refType === "direct-link") {
    links.vendor_link = product.vendors.website;
    links.app_link = product.ref_link;
    links.price_link = product.ref_link;
  } else if (refType === "ref-code") {
    links.vendor_link = product.vendors.website + product.ref_link;
    links.app_link = product.product_link + product.ref_link;
    links.price_link = product.price_link + product.ref_link;
  } else if (refType === "subdomain") {
    links.vendor_link = `${product.vendors.website}`;
    links.app_link = `${product.ref_link}?sub=${product?.product_subdomain}`;
    links.price_link = `${product.ref_link}?sub=${product?.price_subdomain}`;
  } else {
    links.vendor_link = product.vendors.website;
    links.app_link = product.product_link;
    links.price_link = product.price_link;
  }
  return links;
};

const handleNoLink = (product, links) => {
  links.vendor_link = product.vendors.website;
  links.app_link = product.product_link;
  links.price_link = product.price_link;
  return links;
};

export function buildLinks(product) {
  let refType = "";
  if (product.vendors.ref_link) {
    refType = product.vendors.ref_type;
  } else if (product.ref_link) {
    refType = product.ref_type;
  } else {
    refType = "";
  }
  let links = {
    vendor_link: "",
    app_link: "",
    price_link: "",
  };
  if (product.vendors.ref_link) {
    links = handleVendorLink(refType, product, links);
  } else if (product.ref_link) {
    links = handleProductLink(refType, product, links);
  } else {
    links = handleNoLink(product, links);
  }
  return links;
}
