import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Text from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import Slide from './Slide';

const ReactTypingEffect = dynamic(
  () => import('react-typing-effect'),
  { ssr: false },
);

const hellos = [
  'Pershendetje shoku im!',
  'Բարեւ իմ ընկեր!',
  'Salam dostum!',
  'Kaixo lagun!',
  'Вітаю мой сябар!',
  'Zdravo prijatelju!',
  'Здравей приятелю!',
  'Hola amic meu!',
  'Kumusta akong higala!',
  'Moni mnzanga!',
  '朋友你好！',
  'Salutu o amicu!',
  'Zdravo prijatelju!',
  'Ahoj příteli!',
  'Hej min ven!',
  'Hallo mijn vriend!',
  'Hello my friend!',
  'Tere mu sõber!',
  'Kumusta Kaibigan ko!',
  'Hei ystäväni!',
  'Bonjour, mon ami!',
  'Hallo myn freon!',
  'Hola meu amigo!',
  'Hallo, mein Freund!',
  'Γεια σου φίλε μου!',
  'Bonjou zanmi mwen!',
  'Sannu abokina!',
  'Aloha e kuʻu hoaaloha!',
  'Szia barátom!',
  'Halló, vinur minn!',
  'Ndewo, enyi m!',
  'Ndewo, enyi m!',
  'Dia duit a chara!',
  'Ciao amico!',
  'こんにちは、友よ！',
  'Halo kancaku!',
  'Сәлеметсіз бе менің досым!',
  'Mwaramutse nshuti yanjye!',
  'Silav hevalê min!',
  'Salve amice!',
  'Sveiks mans draugs!',
  'Labas mano drauge!',
  'Hallo mäi Frënd!',
  'Здраво пријателе!',
];

export default function FallbackSlide({ onComplete }) {
  useEffect(() => {
    const interval = setInterval(onComplete, 5000);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <Slide>
      <Box position="absolute" top="calc(50% - 6em)" left={0} right={0} textAlign="center">
        <Text fontSize="6xl" bold>CodeDay</Text>
        <Text as="div" fontSize="xl">
          <ReactTypingEffect
            speed={50}
            eraseSpeed={50}
            typingDelay={100}
            text={hellos.sort(() => Math.random() > 0.5 ? 1 : -1)}
          />
        </Text>
      </Box>
    </Slide>
  )
}
