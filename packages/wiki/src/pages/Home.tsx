import { Footer } from '@layouts/Footer';
import { HomeBody } from '@features/home/components/HomeBody';
import { HomeHeader } from '@layouts/HomeHeader';

export function Home() {
  return (
    <>
      <HomeHeader />
      <HomeBody />
      <Footer />
    </>
  );
}
