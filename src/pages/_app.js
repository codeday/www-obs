import Theme from '@codeday/topo/Theme';

export default ({ Component, pageProps }) => (
  <Theme  brandColor="red">
    <style type="text/css">{`
      html { font-size: 3vh; background-color: #ff686b; color: #fff; }
      .slide {
        -webkit-transition: opacity 0.1s ease-in-out;
        -moz-transition: opacity 0.1s ease-in-out;
        -ms-transition: opacity 0.1s ease-in-out;
        -o-transition: opacity 0.1s ease-in-out;
        transition: opacity 0.1s ease-in-out;
      }
    `}</style>
    <Component {...pageProps} />
  </Theme>
);
