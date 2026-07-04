import { FC } from 'react';
import Image from 'next/image';
import styles from './HeroProduct.module.scss';

interface Props {
  src: string;
}

/** Hero product — the clean Figma treatment: a soft ambient gold glow
 *  behind a product cutout that fades + scales in, then floats gently
 *  for life. No cursor tilt / sheen plane: those rotated a full-box
 *  translucent rectangle in 3D and revealed the image's rectangular
 *  bounds during motion. Pure CSS, transform/opacity only (60fps),
 *  reduced-motion safe, direction-agnostic (works in RTL unchanged). */
const HeroProduct: FC<Props> = ({ src }) => (
  <div className={styles.stage} aria-hidden="true">
    <span className={styles.glow} />
    <Image
      src={src}
      alt=""
      width={640}
      height={760}
      priority
      className={styles.img}
    />
  </div>
);

export default HeroProduct;
