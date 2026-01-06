import { Footer } from '@/layouts/Footer';
import { HomeBody } from '@features/Home/components/home/components/HomeBody';
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
