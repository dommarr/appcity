export default function Logo({ size }) {
  return (
    // <svg width={size} height={size} viewBox="0 0 82 94" fill="none" xmlns="http://www.w3.org/2000/svg">
    //   <path d="M67.8789 5.03373L69.9922 3.95951C70.1446 3.88139 70.336 3.94389 70.4102 4.09623L72.5547 8.32279C72.6329 8.47514 72.5704 8.66654 72.418 8.74467L46.1368 22.0962C45.9844 22.1744 45.7891 22.1119 45.7149 21.9595L43.5704 17.733C43.4922 17.5806 43.5547 17.3931 43.7071 17.315" fill="#FFFF00" />
    //   <path d="M71.0313 11.2603L73.1446 10.1861C73.2969 10.1118 73.4883 10.1704 73.5664 10.3228L75.711 14.5493C75.7852 14.7017 75.7227 14.8931 75.5704 14.9712L49.2774 28.3267C49.125 28.4048 48.9336 28.3423 48.8594 28.1861L46.7149 23.9634C46.6368 23.8111 46.6993 23.6197 46.8516 23.5415" fill="#FFFF00" />
    //   <path d="M70.0586 19.4165L72.168 18.3462C72.3243 18.2681 72.5157 18.3306 72.5899 18.483L74.7344 22.7095C74.8125 22.8619 74.75 23.0533 74.5977 23.1314L56.5157 32.315C56.3633 32.3892 56.1719 32.3306 56.0977 32.1744L53.9532 27.9517C53.875 27.7955 53.9375 27.608 54.0899 27.5298" fill="#FFFF00" />
    //   <path d="M75.3203 47.3775L77.9102 46.0337C78.1524 45.9087 78.4453 46.0025 78.5703 46.2407L81.2617 51.4243C81.3867 51.6626 81.293 51.9556 81.0547 52.0806C75.9414 54.7407 70.8242 57.4048 65.711 60.0689C60.5938 62.729 55.4766 65.3931 50.3633 68.0532C50.125 68.1782 49.8281 68.0845 49.7071 67.8462L47.0117 62.6626C46.8867 62.4243 46.9805 62.1275 47.2188 62.0064" fill="#A683F7" />
    //   <path d="M75.3203 59.8306L77.9102 58.4829C78.1524 58.3579 78.4453 58.4517 78.5703 58.69L81.2617 63.8736C81.3867 64.1118 81.293 64.4048 81.0547 64.5298C75.9414 67.19 70.8242 69.854 65.711 72.5181C60.5938 75.1782 55.4766 77.8423 50.3633 80.5025C50.125 80.6275 49.8281 80.5337 49.7071 80.2954L47.0117 75.1118C46.8867 74.8736 46.9805 74.5806 47.2188 74.4556" fill="#A683F7" />
    //   <path d="M75.3203 72.9439L77.9102 71.5962C78.1524 71.4712 78.4453 71.565 78.5703 71.8032L81.2617 76.9868C81.3867 77.2251 81.293 77.5181 81.0547 77.6431C75.9414 80.3032 70.8242 82.9673 65.711 85.6314C60.5938 88.2915 55.4766 90.9556 50.3633 93.6157C50.125 93.7407 49.8281 93.647 49.7071 93.4087L47.0117 88.2251C46.8867 87.9868 46.9805 87.6939 47.2188 87.5689" fill="#A683F7" />
    //   <path d="M41.6406 64.9126L44.2305 63.565C44.4688 63.44 44.7656 63.5337 44.8867 63.772L47.5821 68.9556C47.7031 69.1939 47.6133 69.4868 47.375 69.6118L29.3125 79.0103C29.0742 79.1353 28.7813 79.0415 28.6563 78.8032L25.961 73.6197C25.836 73.3814 25.9297 73.0845 26.168 72.9634L41.6406 64.9126ZM41.6406 77.3618L44.2305 76.0142C44.4688 75.8892 44.7656 75.9829 44.8867 76.2212L47.5821 81.4048C47.7031 81.647 47.6133 81.94 47.375 82.0611L29.3125 91.4595C29.0742 91.5845 28.7813 91.4947 28.6563 91.2525L25.961 86.0689C25.836 85.8306 25.9297 85.5376 26.168 85.4126L41.6406 77.3618ZM41.6797 51.7212L44.2735 50.3736C44.5117 50.2486 44.8047 50.3423 44.9297 50.5806L47.625 55.7642C47.7461 56.0025 47.6563 56.2954 47.418 56.4204L29.3125 65.9986C29.0742 66.1236 28.7774 66.0298 28.6563 65.7915L25.961 60.6079C25.836 60.3697 25.9297 60.0728 26.168 59.9517" fill="#CAB5F8" />
    //   <path d="M29.0078 6.44387L31.6016 5.09621C31.8399 4.97121 32.1328 5.06496 32.2578 5.30324L34.9492 10.4868C35.0742 10.7251 34.9844 11.022 34.7422 11.1431C29.625 13.8032 24.5117 16.4673 19.3985 19.1314C14.2813 21.7954 9.16799 24.4556 4.0508 27.1157C3.81252 27.2407 3.51955 27.147 3.39455 26.9087L0.699241 21.7251C0.574241 21.4868 0.667991 21.1939 0.906272 21.0689" fill="white" />
    //   <path d="M29.0078 32.6273L31.6016 31.2797C31.8399 31.1586 32.1328 31.2523 32.2578 31.4906L34.9492 36.6742C35.0742 36.9125 34.9844 37.2055 34.7422 37.3305C29.625 39.9906 24.5117 42.6547 19.3985 45.3148C14.2813 47.9789 9.16799 50.643 4.0508 53.3031C3.81252 53.4281 3.51955 53.3344 3.39455 53.0961L0.699241 47.9125C0.574241 47.6742 0.667991 47.3773 0.906272 47.2563" fill="white" />
    //   <path d="M29.0078 19.6978L31.6016 18.3501C31.8399 18.2251 32.1328 18.3189 32.2578 18.5572L34.9492 23.7407C35.0742 23.979 34.9844 24.272 34.7422 24.397C29.625 27.0572 24.5117 29.7212 19.3985 32.3853C14.2813 35.0454 9.16799 37.7095 4.0508 40.3697C3.81252 40.4947 3.51955 40.4009 3.39455 40.1626L0.699241 34.979C0.574241 34.7407 0.667991 34.4478 0.906272 34.3228" fill="white" />
    //   <path d="M20.586 62.8579L23.1797 61.5103C23.418 61.3853 23.711 61.479 23.836 61.7173L26.5313 66.9009C26.6563 67.1392 26.5625 67.4322 26.3242 67.5572L4.0508 79.147C3.81252 79.272 3.51955 79.1782 3.39455 78.94L0.699241 73.7564C0.574241 73.5181 0.667991 73.2251 0.906272 73.1001" fill="white" />
    //   <path d="M20.586 75.8697L23.1797 74.522C23.418 74.397 23.711 74.4907 23.836 74.729L26.5313 79.9126C26.6563 80.1509 26.5625 80.4478 26.3242 80.5689L4.0508 92.1587C3.81252 92.2837 3.51955 92.19 3.39455 91.9517L0.699241 86.7681C0.574241 86.5298 0.667991 86.2368 0.906272 86.1118" fill="white" />
    //   <path d="M75.3203 34.1001L77.9102 32.7525C78.1524 32.6275 78.4453 32.7212 78.5703 32.9595L81.2617 38.1431C81.3867 38.3814 81.293 38.6743 81.0547 38.7993C75.9414 41.4595 70.8242 44.1236 65.711 46.7876C60.5938 49.4478 55.4766 52.1118 50.3633 54.772C50.125 54.897 49.8281 54.8032 49.7071 54.565L47.0117 49.3814C46.8867 49.1431 46.9805 48.8501 47.2188 48.7251" fill="#A683F7" />
    //   <path d="M29.0078 45.5689L31.6016 44.2212C31.8399 44.0962 32.1328 44.19 32.2578 44.4282L34.9492 49.6118C35.0742 49.8501 34.9844 50.1431 34.7422 50.2681C29.625 52.9282 24.5117 55.5923 19.3985 58.2525C14.2813 60.9165 9.16799 63.5806 4.0508 66.2407C3.81252 66.3657 3.51955 66.272 3.39455 66.0337L0.699241 60.8501C0.574241 60.6118 0.667991 60.3189 0.906272 60.1939" fill="white" />
    //   <path d="M60.2891 1.10404L62.4024 0.0337318C62.5586 -0.0443932 62.7461 0.0181065 62.8243 0.17045L64.9688 4.39701C65.0469 4.54936 64.9844 4.73686 64.8321 4.81498L46.75 13.9986C46.5977 14.0767 46.4063 14.0142 46.3282 13.8619L44.1875 9.63529C44.1094 9.48295 44.1719 9.29154 44.3243 9.21342" fill="#FFFF00" />
    // </svg>
    <svg width={size} height={size} viewBox="0 0 84 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow">
      <path
        d="M68.3501 5.51958L70.4236 4.37056C70.6212 4.26589 70.7236 4.36351 70.8259 4.46113L73.024 8.61066C73.1286 8.80826 73.031 8.91057 72.9334 9.0129L46.9553 23.0269C46.7577 23.1316 46.6554 23.034 46.5531 22.9363L44.355 18.7868C44.2504 18.5892 44.348 18.4869 44.4456 18.3846L68.3501 5.51958Z"
        fill="#FFFF00"
      />
      <path
        d="M71.5949 11.6451L73.6685 10.4961C73.8661 10.3914 73.9684 10.489 74.0708 10.5866L76.2688 14.7361C76.3735 14.9337 76.2759 15.0361 76.1782 15.1384L50.2002 29.1524C50.0026 29.2571 49.9003 29.1595 49.798 29.0618L47.5999 24.9123C47.4952 24.7147 47.5929 24.6124 47.6905 24.5101L71.5949 11.6451Z"
        fill="#FFFF00"
      />
      <path
        d="M70.8853 19.7639L72.9589 18.6149C73.1565 18.5103 73.2588 18.6079 73.3611 18.7055L75.5592 22.855C75.6639 23.0526 75.5663 23.1549 75.4686 23.2573L57.5897 32.8798C57.3921 32.9845 57.2898 32.8869 57.1875 32.7892L54.9894 28.6397C54.8848 28.4421 54.9824 28.3398 55.08 28.2375L70.8853 19.7639Z"
        fill="#FFFF00"
      />
      <path
        d="M76.7415 47.6341L79.3103 46.2734C79.5079 46.1687 79.8101 46.2616 80.0148 46.4569L82.8362 51.592C82.9409 51.7896 82.8479 52.0919 82.6527 52.2965C77.6175 55.1156 72.58 57.8347 67.5448 60.6537C62.5096 63.4727 57.4721 66.1918 52.4369 69.0108C52.2393 69.1155 51.9371 69.0226 51.7324 68.8273L48.911 63.6922C48.8063 63.4946 48.8993 63.1923 49.0945 62.9877L76.7415 47.6341Z"
        fill="#6927FF"
      />
      <path
        d="M77.0352 60.1307L79.604 58.77C79.8016 58.6653 80.1038 58.7582 80.3085 58.9535L83.1299 64.0886C83.2346 64.2862 83.1416 64.5885 82.9464 64.7931C77.9112 67.6122 72.8737 70.3312 67.8385 73.1503C62.8033 75.9693 57.7658 78.6884 52.7306 81.5074C52.533 81.6121 52.2308 81.5192 52.0261 81.3239L49.2047 76.1888C49.1 75.9912 49.193 75.6889 49.3882 75.4843L77.0352 60.1307Z"
        fill="#6927FF"
      />
      <path
        d="M77.3429 73.2273L79.9116 71.8666C80.1092 71.762 80.4115 71.8549 80.6161 72.0502L83.4375 77.1853C83.5422 77.3829 83.4492 77.6852 83.254 77.8898C78.2188 80.7088 73.1813 83.4279 68.1461 86.247C63.1109 89.066 58.0734 91.7851 53.0383 94.6041C52.8407 94.7088 52.5384 94.6158 52.3337 94.4206L49.5123 89.2855C49.4077 89.0879 49.5006 88.7856 49.6959 88.5809L77.3429 73.2273Z"
        fill="#6927FF"
      />
      <path
        d="M43.2519 52.7222L45.8207 51.3615C46.0183 51.2568 46.3206 51.3497 46.5252 51.545L49.3466 56.6802C49.4512 56.8777 49.3583 57.18 49.1631 57.3846L31.2936 67.4071C31.096 67.5118 30.7937 67.4189 30.589 67.2236L27.7677 62.0885C27.663 61.8909 27.7559 61.5886 27.9511 61.384L43.2519 52.7222ZM43.7556 78.4175L46.3243 77.0567C46.5219 76.9521 46.8242 77.045 47.0288 77.2403L49.8502 82.3754C49.9549 82.573 49.862 82.8753 49.6667 83.0799L31.7925 92.9024C31.5949 93.0071 31.2926 92.9142 31.088 92.7189L28.2666 87.5838C28.1619 87.3862 28.2549 87.0839 28.4501 86.8793L43.7556 78.4175ZM43.462 65.9209L46.0307 64.5602C46.2283 64.4555 46.5306 64.5485 46.7353 64.7437L49.5566 69.8788C49.6613 70.0764 49.5684 70.3787 49.3731 70.5834L31.4989 80.4059C31.3013 80.5106 30.999 80.4176 30.7944 80.2224L27.973 75.0872C27.8684 74.8896 27.9613 74.5874 28.1565 74.3827L43.462 65.9209Z"
        fill="#895AF5"
      />
      <path
        d="M29.4937 7.83282L32.0625 6.47211C32.2601 6.36744 32.5623 6.46036 32.767 6.65561L35.5884 11.7908C35.6931 11.9884 35.6001 12.2906 35.4049 12.4953C30.3697 15.3143 25.3322 18.0334 20.297 20.8524C15.2618 23.6715 10.2243 26.3905 5.1891 29.2096C4.99151 29.3142 4.68926 29.2213 4.48462 29.0261L1.66321 23.8909C1.55854 23.6933 1.65148 23.3911 1.84673 23.1864L29.4937 7.83282Z"
        fill="#9E75FF"
      />
      <path
        d="M30.1092 34.0257L32.6779 32.665C32.8755 32.5603 33.1778 32.6532 33.3825 32.8485L36.2039 37.9836C36.3085 38.1812 36.2156 38.4835 36.0203 38.6881C30.9852 41.5072 25.9477 44.2262 20.9125 47.0453C15.8773 49.8643 10.8398 52.5834 5.80458 55.4024C5.60699 55.5071 5.30474 55.4142 5.1001 55.2189L2.27869 50.0838C2.17402 49.8862 2.26696 49.5839 2.46221 49.3793L30.1092 34.0257Z"
        fill="#9E75FF"
      />
      <path
        d="M29.8038 21.0291L32.3725 19.6684C32.5701 19.5637 32.8724 19.6567 33.077 19.8519L35.8984 24.9871C36.0031 25.1847 35.9102 25.4869 35.7149 25.6916C30.6797 28.5106 25.6422 31.2297 20.6071 34.0487C15.5719 36.8678 10.5343 39.5868 5.49916 42.4059C5.30157 42.5105 4.99932 42.4176 4.79468 42.2224L1.97327 37.0872C1.8686 36.8896 1.96154 36.5873 2.15679 36.3827L29.8038 21.0291Z"
        fill="#9E75FF"
      />
      <path
        d="M22.4207 64.4146L24.9895 63.0539C25.1871 62.9492 25.4894 63.0421 25.694 63.2374L28.5154 68.3725C28.6201 68.5701 28.5272 68.8724 28.3319 69.077L6.2082 81.1C6.0106 81.2046 5.70832 81.1117 5.50368 80.9165L2.68228 75.7813C2.57761 75.5837 2.67055 75.2815 2.86579 75.0768L22.4207 64.4146Z"
        fill="#9E75FF"
      />
      <path
        d="M22.726 77.4112L25.2948 76.0504C25.4924 75.9458 25.7947 76.0387 25.9993 76.234L28.8207 81.3691C28.9254 81.5667 28.8325 81.869 28.6372 82.0736L6.51349 94.0966C6.3159 94.2012 6.01362 94.1083 5.80898 93.913L2.98757 88.7779C2.88291 88.5803 2.97584 88.278 3.17109 88.0734L22.726 77.4112Z"
        fill="#9E75FF"
      />
      <path
        d="M76.4292 34.3377L78.9979 32.977C79.1955 32.8723 79.4978 32.9652 79.7024 33.1605L82.5238 38.2956C82.6285 38.4932 82.5355 38.7955 82.3403 39.0001C77.3051 41.8192 72.2676 44.5383 67.2324 47.3573C62.1972 50.1764 57.1597 52.8954 52.1246 55.7145C51.927 55.8191 51.6247 55.7262 51.42 55.5309L48.5986 50.3958C48.494 50.1982 48.5869 49.8959 48.7822 49.6913L76.4292 34.3377Z"
        fill="#6927FF"
      />
      <path
        d="M30.4122 46.9217L32.9809 45.561C33.1785 45.4563 33.4808 45.5492 33.6854 45.7445L36.5068 50.8796C36.6115 51.0772 36.5186 51.3795 36.3233 51.5841C31.2881 54.4032 26.2506 57.1223 21.2155 59.9413C16.1803 62.7603 11.1427 65.4794 6.10756 68.2984C5.90996 68.4031 5.60772 68.3102 5.40307 68.1149L2.58167 62.9798C2.477 62.7822 2.56994 62.4799 2.76519 62.2753L30.4122 46.9217Z"
        fill="#9E75FF"
      />
      <path
        d="M60.6583 1.69948L62.7319 0.550467C62.9295 0.445797 63.0318 0.543411 63.1341 0.641035L65.3322 4.79057C65.4369 4.98816 65.3392 5.09048 65.2416 5.1928L47.3627 14.8154C47.1651 14.92 47.0628 14.8224 46.9604 14.7248L44.7624 10.5753C44.6577 10.3777 44.7553 10.2754 44.853 10.173L60.6583 1.69948Z"
        fill="#FFFF00"
      />
    </svg>
  );
}
