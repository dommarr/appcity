export default function LogoLight({ size }) {
  return (
    // <svg width={size} height={size} viewBox="0 0 84 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    //   <path d="M68.3501 5.51958L70.4236 4.37056C70.6212 4.26589 70.7236 4.36351 70.8259 4.46113L73.024 8.61066C73.1286 8.80826 73.031 8.91057 72.9334 9.0129L46.9553 23.0269C46.7577 23.1316 46.6554 23.034 46.5531 22.9363L44.355 18.7868C44.2504 18.5892 44.348 18.4869 44.4456 18.3846L68.3501 5.51958Z" fill="white" />
    //   <path d="M71.5949 11.6451L73.6685 10.4961C73.8661 10.3914 73.9684 10.489 74.0708 10.5866L76.2688 14.7361C76.3735 14.9337 76.2759 15.0361 76.1782 15.1384L50.2002 29.1524C50.0026 29.2571 49.9003 29.1595 49.798 29.0618L47.5999 24.9123C47.4952 24.7147 47.5929 24.6124 47.6905 24.5101L71.5949 11.6451Z" fill="white" />
    //   <path d="M70.8854 19.7639L72.959 18.6149C73.1566 18.5103 73.2589 18.6079 73.3613 18.7055L75.5593 22.855C75.664 23.0526 75.5664 23.1549 75.4688 23.2573L57.5899 32.8798C57.3923 32.9845 57.2899 32.8869 57.1876 32.7892L54.9895 28.6397C54.8849 28.4421 54.9825 28.3398 55.0801 28.2375L70.8854 19.7639Z" fill="white" />
    //   <path d="M76.7417 47.6341L79.3104 46.2734C79.508 46.1687 79.8103 46.2616 80.0149 46.4569L82.8363 51.592C82.941 51.7896 82.848 52.0919 82.6528 52.2965C77.6176 55.1156 72.5801 57.8347 67.5449 60.6537C62.5097 63.4727 57.4722 66.1918 52.4371 69.0108C52.2395 69.1155 51.9372 69.0226 51.7325 68.8273L48.9111 63.6922C48.8065 63.4946 48.8994 63.1923 49.0947 62.9877L76.7417 47.6341Z" fill="white" />
    //   <path d="M77.0351 60.1307L79.6039 58.77C79.8015 58.6653 80.1037 58.7582 80.3084 58.9535L83.1298 64.0886C83.2344 64.2862 83.1415 64.5885 82.9462 64.7931C77.9111 67.6122 72.8736 70.3312 67.8384 73.1503C62.8032 75.9693 57.7657 78.6884 52.7305 81.5074C52.5329 81.6121 52.2306 81.5192 52.026 81.3239L49.2046 76.1888C49.0999 75.9912 49.1929 75.6889 49.3881 75.4843L77.0351 60.1307Z" fill="white" />
    //   <path d="M77.343 73.2273L79.9117 71.8666C80.1093 71.762 80.4116 71.8549 80.6162 72.0502L83.4376 77.1853C83.5423 77.3829 83.4494 77.6852 83.2541 77.8898C78.2189 80.7088 73.1814 83.4279 68.1462 86.247C63.1111 89.066 58.0736 91.7851 53.0384 94.6041C52.8408 94.7088 52.5385 94.6158 52.3339 94.4206L49.5125 89.2855C49.4078 89.0879 49.5007 88.7856 49.696 88.5809L77.343 73.2273Z" fill="white" />
    //   <path d="M43.2518 52.7222L45.8206 51.3615C46.0182 51.2568 46.3204 51.3497 46.5251 51.545L49.3464 56.6802C49.4511 56.8777 49.3582 57.18 49.163 57.3846L31.2934 67.4071C31.0958 67.5118 30.7936 67.4189 30.5889 67.2236L27.7675 62.0885C27.6629 61.8909 27.7558 61.5886 27.951 61.384L43.2518 52.7222ZM43.7555 78.4175L46.3242 77.0567C46.5218 76.9521 46.8241 77.045 47.0287 77.2403L49.8501 82.3754C49.9548 82.573 49.8619 82.8753 49.6666 83.0799L31.7924 92.9024C31.5948 93.0071 31.2925 92.9142 31.0879 92.7189L28.2665 87.5838C28.1618 87.3862 28.2547 87.0839 28.45 86.8793L43.7555 78.4175ZM43.4619 65.9209L46.0306 64.5602C46.2282 64.4555 46.5305 64.5485 46.7351 64.7437L49.5565 69.8788C49.6612 70.0764 49.5683 70.3787 49.373 70.5834L31.4988 80.4059C31.3012 80.5106 30.9989 80.4176 30.7943 80.2224L27.9729 75.0872C27.8682 74.8896 27.9611 74.5874 28.1564 74.3827L43.4619 65.9209Z" fill="white" />
    //   <path d="M29.4939 7.83282L32.0626 6.47211C32.2602 6.36744 32.5625 6.46036 32.7671 6.65561L35.5885 11.7908C35.6932 11.9884 35.6002 12.2906 35.405 12.4953C30.3698 15.3143 25.3323 18.0334 20.2971 20.8524C15.2619 23.6715 10.2244 26.3905 5.18923 29.2096C4.99163 29.3142 4.68938 29.2213 4.48474 29.0261L1.66334 23.8909C1.55867 23.6933 1.65161 23.3911 1.84685 23.1864L29.4939 7.83282Z" fill="white" />
    //   <path d="M30.1091 34.0257L32.6778 32.665C32.8754 32.5603 33.1777 32.6532 33.3823 32.8485L36.2037 37.9836C36.3084 38.1812 36.2155 38.4835 36.0202 38.6881C30.985 41.5072 25.9475 44.2262 20.9124 47.0453C15.8772 49.8643 10.8396 52.5834 5.80446 55.4024C5.60686 55.5071 5.30462 55.4142 5.09997 55.2189L2.27857 50.0838C2.1739 49.8862 2.26684 49.5839 2.46209 49.3793L30.1091 34.0257Z" fill="white" />
    //   <path d="M29.8039 21.0291L32.3726 19.6684C32.5702 19.5637 32.8725 19.6567 33.0772 19.8519L35.8986 24.9871C36.0032 25.1847 35.9103 25.4869 35.715 25.6916C30.6799 28.5106 25.6424 31.2297 20.6072 34.0487C15.572 36.8678 10.5345 39.5868 5.49928 42.4059C5.30169 42.5105 4.99944 42.4176 4.7948 42.2224L1.9734 37.0872C1.86873 36.8896 1.96166 36.5873 2.15691 36.3827L29.8039 21.0291Z" fill="white" />
    //   <path d="M22.4206 64.4146L24.9894 63.0539C25.187 62.9492 25.4893 63.0421 25.6939 63.2374L28.5153 68.3725C28.6199 68.5701 28.527 68.8724 28.3318 69.077L6.20807 81.1C6.01048 81.2046 5.7082 81.1117 5.50356 80.9165L2.68216 75.7813C2.57749 75.5837 2.67042 75.2815 2.86567 75.0768L22.4206 64.4146Z" fill="white" />
    //   <path d="M22.726 77.4112L25.2948 76.0504C25.4924 75.9458 25.7947 76.0387 25.9993 76.234L28.8207 81.3691C28.9254 81.5667 28.8325 81.869 28.6372 82.0736L6.51349 94.0966C6.3159 94.2012 6.01362 94.1083 5.80898 93.913L2.98757 88.7779C2.88291 88.5803 2.97584 88.278 3.17109 88.0734L22.726 77.4112Z" fill="white" />
    //   <path d="M76.4292 34.3377L78.9979 32.977C79.1955 32.8723 79.4978 32.9652 79.7024 33.1605L82.5238 38.2956C82.6285 38.4932 82.5355 38.7955 82.3403 39.0001C77.3051 41.8192 72.2676 44.5383 67.2324 47.3573C62.1972 50.1764 57.1597 52.8954 52.1246 55.7145C51.927 55.8191 51.6247 55.7262 51.42 55.5309L48.5986 50.3958C48.494 50.1982 48.5869 49.8959 48.7822 49.6913L76.4292 34.3377Z" fill="white" />
    //   <path d="M30.4121 46.9217L32.9808 45.561C33.1784 45.4563 33.4807 45.5492 33.6853 45.7445L36.5067 50.8796C36.6114 51.0772 36.5184 51.3795 36.3232 51.5841C31.288 54.4032 26.2505 57.1223 21.2153 59.9413C16.1802 62.7603 11.1426 65.4794 6.10744 68.2984C5.90984 68.4031 5.60759 68.3102 5.40295 68.1149L2.58155 62.9798C2.47688 62.7822 2.56982 62.4799 2.76507 62.2753L30.4121 46.9217Z" fill="white" />
    //   <path d="M60.6584 1.69948L62.732 0.550467C62.9296 0.445797 63.0319 0.543411 63.1342 0.641035L65.3323 4.79057C65.437 4.98816 65.3393 5.09048 65.2417 5.1928L47.3628 14.8154C47.1652 14.92 47.0629 14.8224 46.9606 14.7248L44.7625 10.5753C44.6578 10.3777 44.7554 10.2754 44.8531 10.173L60.6584 1.69948Z" fill="white" />
    // </svg>
    <svg width={size} height={size} viewBox="0 0 83 95" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M67.3501 5.51958L69.4236 4.37056C69.6212 4.26589 69.7236 4.36351 69.8259 4.46113L72.024 8.61066C72.1286 8.80826 72.031 8.91057 71.9334 9.0129L45.9553 23.0269C45.7577 23.1316 45.6554 23.034 45.5531 22.9363L43.355 18.7868C43.2504 18.5892 43.348 18.4869 43.4456 18.3846L67.3501 5.51958Z" fill="#FFFF00" />
      <path d="M70.5949 11.6451L72.6685 10.4961C72.8661 10.3914 72.9684 10.489 73.0708 10.5866L75.2688 14.7361C75.3735 14.9337 75.2759 15.0361 75.1782 15.1384L49.2002 29.1524C49.0026 29.2571 48.9003 29.1595 48.798 29.0618L46.5999 24.9123C46.4952 24.7147 46.5929 24.6124 46.6905 24.5101L70.5949 11.6451Z" fill="#FFFF00" />
      <path d="M69.8854 19.7639L71.959 18.6149C72.1566 18.5103 72.2589 18.6079 72.3613 18.7055L74.5593 22.855C74.664 23.0526 74.5664 23.1549 74.4688 23.2573L56.5899 32.8798C56.3923 32.9845 56.2899 32.8869 56.1876 32.7892L53.9895 28.6397C53.8849 28.4421 53.9825 28.3398 54.0801 28.2375L69.8854 19.7639Z" fill="#FFFF00" />
      <path d="M75.7417 47.6341L78.3104 46.2734C78.508 46.1687 78.8103 46.2616 79.0149 46.4569L81.8363 51.592C81.941 51.7896 81.848 52.0919 81.6528 52.2965C76.6176 55.1156 71.5801 57.8347 66.5449 60.6537C61.5097 63.4727 56.4722 66.1918 51.4371 69.0108C51.2395 69.1155 50.9372 69.0226 50.7325 68.8273L47.9111 63.6922C47.8065 63.4946 47.8994 63.1923 48.0947 62.9877L75.7417 47.6341Z" fill="white" />
      <path d="M76.0351 60.1307L78.6039 58.77C78.8015 58.6653 79.1037 58.7582 79.3084 58.9535L82.1298 64.0886C82.2344 64.2862 82.1415 64.5885 81.9462 64.7931C76.9111 67.6122 71.8736 70.3312 66.8384 73.1503C61.8032 75.9693 56.7657 78.6884 51.7305 81.5074C51.5329 81.6121 51.2306 81.5192 51.026 81.3239L48.2046 76.1888C48.0999 75.9912 48.1929 75.6889 48.3881 75.4843L76.0351 60.1307Z" fill="white" />
      <path d="M76.343 73.2273L78.9117 71.8666C79.1093 71.762 79.4116 71.8549 79.6162 72.0502L82.4376 77.1853C82.5423 77.3829 82.4494 77.6852 82.2541 77.8898C77.2189 80.7088 72.1814 83.4279 67.1462 86.247C62.1111 89.066 57.0736 91.7851 52.0384 94.6041C51.8408 94.7088 51.5385 94.6158 51.3339 94.4206L48.5125 89.2855C48.4078 89.0879 48.5007 88.7856 48.696 88.5809L76.343 73.2273Z" fill="white" />
      <path d="M42.2518 52.7222L44.8206 51.3615C45.0182 51.2568 45.3204 51.3497 45.5251 51.545L48.3464 56.6802C48.4511 56.8777 48.3582 57.18 48.163 57.3846L30.2934 67.4071C30.0958 67.5118 29.7936 67.4189 29.5889 67.2236L26.7675 62.0885C26.6629 61.8909 26.7558 61.5886 26.951 61.384L42.2518 52.7222ZM42.7555 78.4175L45.3242 77.0567C45.5218 76.9521 45.8241 77.045 46.0287 77.2403L48.8501 82.3754C48.9548 82.573 48.8619 82.8753 48.6666 83.0799L30.7924 92.9024C30.5948 93.0071 30.2925 92.9142 30.0879 92.7189L27.2665 87.5838C27.1618 87.3862 27.2547 87.0839 27.45 86.8793L42.7555 78.4175ZM42.4619 65.9209L45.0306 64.5602C45.2282 64.4555 45.5305 64.5485 45.7351 64.7437L48.5565 69.8788C48.6612 70.0764 48.5683 70.3787 48.373 70.5834L30.4988 80.4059C30.3012 80.5106 29.9989 80.4176 29.7943 80.2224L26.9729 75.0872C26.8682 74.8896 26.9611 74.5874 27.1564 74.3827L42.4619 65.9209Z" fill="white" />
      <path d="M28.4939 7.83282L31.0626 6.47211C31.2602 6.36744 31.5625 6.46036 31.7671 6.65561L34.5885 11.7908C34.6932 11.9884 34.6002 12.2906 34.405 12.4953C29.3698 15.3143 24.3323 18.0334 19.2971 20.8524C14.2619 23.6715 9.2244 26.3905 4.18923 29.2096C3.99163 29.3142 3.68938 29.2213 3.48474 29.0261L0.663337 23.8909C0.558667 23.6933 0.651605 23.3911 0.846852 23.1864L28.4939 7.83282Z" fill="white" />
      <path d="M29.1091 34.0257L31.6778 32.665C31.8754 32.5603 32.1777 32.6532 32.3823 32.8485L35.2037 37.9836C35.3084 38.1812 35.2155 38.4835 35.0202 38.6881C29.985 41.5072 24.9475 44.2262 19.9124 47.0453C14.8772 49.8643 9.83964 52.5834 4.80446 55.4024C4.60686 55.5071 4.30462 55.4142 4.09997 55.2189L1.27857 50.0838C1.1739 49.8862 1.26684 49.5839 1.46209 49.3793L29.1091 34.0257Z" fill="white" />
      <path d="M28.8039 21.0291L31.3726 19.6684C31.5702 19.5637 31.8725 19.6567 32.0772 19.8519L34.8986 24.9871C35.0032 25.1847 34.9103 25.4869 34.715 25.6916C29.6799 28.5106 24.6424 31.2297 19.6072 34.0487C14.572 36.8678 9.53446 39.5868 4.49928 42.4059C4.30169 42.5105 3.99944 42.4176 3.7948 42.2224L0.973395 37.0872C0.868725 36.8896 0.961664 36.5873 1.15691 36.3827L28.8039 21.0291Z" fill="white" />
      <path d="M21.4206 64.4146L23.9894 63.0539C24.187 62.9492 24.4893 63.0421 24.6939 63.2374L27.5153 68.3725C27.6199 68.5701 27.527 68.8724 27.3318 69.077L5.20807 81.1C5.01048 81.2046 4.7082 81.1117 4.50356 80.9165L1.68216 75.7813C1.57749 75.5837 1.67042 75.2815 1.86567 75.0768L21.4206 64.4146Z" fill="white" />
      <path d="M21.726 77.4112L24.2948 76.0504C24.4924 75.9458 24.7947 76.0387 24.9993 76.234L27.8207 81.3691C27.9254 81.5667 27.8325 81.869 27.6372 82.0736L5.51349 94.0966C5.3159 94.2012 5.01362 94.1083 4.80898 93.913L1.98757 88.7779C1.88291 88.5803 1.97584 88.278 2.17109 88.0734L21.726 77.4112Z" fill="white" />
      <path d="M75.4292 34.3377L77.9979 32.977C78.1955 32.8723 78.4978 32.9652 78.7024 33.1605L81.5238 38.2956C81.6285 38.4932 81.5355 38.7955 81.3403 39.0001C76.3051 41.8192 71.2676 44.5383 66.2324 47.3573C61.1972 50.1764 56.1597 52.8954 51.1246 55.7145C50.927 55.8191 50.6247 55.7262 50.42 55.5309L47.5986 50.3958C47.494 50.1982 47.5869 49.8959 47.7822 49.6913L75.4292 34.3377Z" fill="white" />
      <path d="M29.4121 46.9217L31.9808 45.561C32.1784 45.4563 32.4807 45.5492 32.6853 45.7445L35.5067 50.8796C35.6114 51.0772 35.5184 51.3795 35.3232 51.5841C30.288 54.4032 25.2505 57.1223 20.2153 59.9413C15.1802 62.7603 10.1426 65.4794 5.10744 68.2984C4.90984 68.4031 4.60759 68.3102 4.40295 68.1149L1.58155 62.9798C1.47688 62.7822 1.56982 62.4799 1.76507 62.2753L29.4121 46.9217Z" fill="white" />
      <path d="M59.6584 1.69948L61.732 0.550467C61.9296 0.445797 62.0319 0.543411 62.1342 0.641035L64.3323 4.79057C64.437 4.98816 64.3393 5.09048 64.2417 5.1928L46.3628 14.8154C46.1652 14.92 46.0629 14.8224 45.9606 14.7248L43.7625 10.5753C43.6578 10.3777 43.7554 10.2754 43.8531 10.173L59.6584 1.69948Z" fill="#FFFF00" />
    </svg>
  );
}
