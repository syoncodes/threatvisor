// sections
import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Threatvisor: The AI powered Cybersecurity Platform',
};

export default function HomePage() {
  document.body.style.zoom = "80%";
  return <HomeView />;
}
