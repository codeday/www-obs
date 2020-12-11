import Theme from '@codeday/topo/Theme';

export default ({ Component, pageProps }) => (
  <Theme  brandColor="red">
    <style type="text/css">{`
      html { font-size: 3vh; background-color: #ff686b; color: #fff; }
    `}</style>
    <Component {...pageProps} />
  </Theme>
);
