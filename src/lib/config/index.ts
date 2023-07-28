import receiverImg from '../images/aivision.png';
import senderImg from '../images/sender.png';

export function createConfig() {
  return {
    nickName: 'Mr. Aivision',
    fullName: 'Bring AI values to your life!',
    receiverImgSrc: receiverImg,
    senderImgSrc: senderImg,
    promptPrefix: '' // e.g. 'Answer this as if you were Elon Musk: \n\n'
  };
}

export const config = createConfig();
