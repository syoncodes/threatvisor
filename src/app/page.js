import { HomeView } from 'src/sections/home/view';

export const metadata = {
  title: 'Threatvisor: The AI powered Cybersecurity Platform',
};

export default function HomePage() {
  return (
    <div style={{ transform: 'scale(0.8)' }}>
      <HomeView />
    </div>
  );
}
