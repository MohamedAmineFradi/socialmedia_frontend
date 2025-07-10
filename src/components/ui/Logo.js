import Image from 'next/image';

export default function Logo() {
  return (
    <Image
      src="/logo_with_transperent_bg.png"
      alt="Social Media Logo"
      width={100}
      height={100}
      priority
    />
  );
} 